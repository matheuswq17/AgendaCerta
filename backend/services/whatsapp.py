import os
import requests
import json
from datetime import datetime
from models import MessageLog, db

class WhatsAppService:
    """Serviço para integração com a API do WhatsApp"""
    
    def __init__(self):
        self.api_url = os.getenv('WHATSAPP_API_URL')
        self.token = os.getenv('WHATSAPP_TOKEN')
        self.phone_number_id = os.getenv('WHATSAPP_PHONE_NUMBER_ID')
    
    def send_message(self, user_id, patient_id, to_number, message_type, content, buttons=None):
        """
        Envia mensagem via WhatsApp Cloud API
        
        Args:
            user_id: ID do psicólogo
            patient_id: ID do paciente
            to_number: Número de telefone do destinatário
            message_type: Tipo da mensagem (consent, invite, offer, etc)
            content: Conteúdo da mensagem
            buttons: Lista de botões (opcional)
            
        Returns:
            dict: Resposta da API
        """
        if not self.api_url or not self.token or not self.phone_number_id:
            self._log_message(user_id, patient_id, message_type, content, buttons, "failed", "Configuração incompleta")
            return {"error": "Configuração da API do WhatsApp incompleta"}
        
        # Formatar número (remover caracteres não numéricos)
        to_number = ''.join(filter(str.isdigit, to_number))
        
        # Verificar formato internacional
        if not to_number.startswith('55'):
            to_number = f"55{to_number}"
        
        # Preparar payload
        url = f"{self.api_url}/{self.phone_number_id}/messages"
        
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        
        if buttons and len(buttons) > 0:
            # Mensagem interativa com botões
            button_objects = []
            for i, button_text in enumerate(buttons):
                button_objects.append({
                    "type": "reply",
                    "reply": {
                        "id": f"btn_{i}",
                        "title": button_text
                    }
                })
            
            payload = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": to_number,
                "type": "interactive",
                "interactive": {
                    "type": "button",
                    "body": {
                        "text": content
                    },
                    "action": {
                        "buttons": button_objects
                    }
                }
            }
        else:
            # Mensagem de texto simples
            payload = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": to_number,
                "type": "text",
                "text": {
                    "body": content
                }
            }
        
        try:
            response = requests.post(
                url,
                headers=headers,
                data=json.dumps(payload)
            )
            
            response_data = response.json()
            
            # Registrar log da mensagem
            status = "sent" if response.status_code == 200 else "failed"
            error_message = None if response.status_code == 200 else str(response_data)
            
            self._log_message(user_id, patient_id, message_type, content, buttons, status, error_message)
            
            return response_data
            
        except Exception as e:
            self._log_message(user_id, patient_id, message_type, content, buttons, "failed", str(e))
            return {"error": str(e)}
    
    def _log_message(self, user_id, patient_id, message_type, content, buttons, status, error=None):
        """Registra log da mensagem no banco de dados"""
        try:
            message_log = MessageLog(
                user_id=user_id,
                patient_id=patient_id,
                type=message_type,
                payload_json={
                    "content": content,
                    "buttons": buttons if buttons else [],
                    "error": error
                },
                status=status,
                timestamp=datetime.utcnow()
            )
            
            db.session.add(message_log)
            db.session.commit()
            
        except Exception as e:
            print(f"Erro ao registrar log de mensagem: {str(e)}")

# Instância global do serviço
whatsapp_service = WhatsAppService()