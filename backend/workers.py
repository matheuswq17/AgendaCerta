import os
import redis
from rq import Worker, Queue, Connection
from dotenv import load_dotenv
from datetime import datetime, timedelta
import pytz
import requests
import json
from models import db, User, Patient, Appointment, AutomationSetting, MessageTemplate, MessageLog

# Carregar variáveis de ambiente
load_dotenv()

# Configuração do Redis
redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
conn = redis.from_url(redis_url)

# Filas de trabalho
default_queue = Queue('default', connection=conn)
high_queue = Queue('high', connection=conn)

# Funções de jobs

def send_whatsapp_message(user_id, patient_id, message_type, content, buttons=None):
    """Envia mensagem via WhatsApp API"""
    from app import app
    
    with app.app_context():
        user = User.query.get(user_id)
        patient = Patient.query.get(patient_id)
        
        if not user or not patient:
            return False
        
        # Verificar consentimento do paciente
        if patient.status == 'optout':
            return False
        
        # Preparar payload para API do WhatsApp
        whatsapp_api_url = os.getenv('WHATSAPP_API_URL')
        whatsapp_token = os.getenv('WHATSAPP_TOKEN')
        
        if not whatsapp_api_url or not whatsapp_token:
            return False
        
        # Formatar mensagem
        formatted_content = content.replace('{Profissional}', user.name)
        formatted_content = formatted_content.replace('{Paciente}', patient.name)
        
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": patient.whatsapp,
            "type": "interactive" if buttons else "text",
        }
        
        if buttons:
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
            
            payload["interactive"] = {
                "type": "button",
                "body": {
                    "text": formatted_content
                },
                "action": {
                    "buttons": button_objects
                }
            }
        else:
            # Mensagem de texto simples
            payload["text"] = {
                "body": formatted_content
            }
        
        # Enviar mensagem
        headers = {
            "Authorization": f"Bearer {whatsapp_token}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(
                whatsapp_api_url,
                headers=headers,
                data=json.dumps(payload)
            )
            
            # Registrar log da mensagem
            message_log = MessageLog(
                user_id=user_id,
                patient_id=patient_id,
                type=message_type,
                payload_json={
                    "content": formatted_content,
                    "buttons": buttons if buttons else []
                },
                status="sent" if response.status_code == 200 else "failed",
                timestamp=datetime.utcnow()
            )
            
            db.session.add(message_log)
            db.session.commit()
            
            return response.status_code == 200
            
        except Exception as e:
            print(f"Erro ao enviar mensagem: {str(e)}")
            return False

def process_weekly_invites():
    """Processa convites semanais para confirmação de sessões"""
    from app import app
    
    with app.app_context():
        # Obter todos os usuários com automação ativa
        users = User.query.all()
        
        for user in users:
            # Verificar configurações de automação
            settings = AutomationSetting.query.filter_by(user_id=user.id).first()
            
            if not settings or settings.mode == 'C':  # Modo C: apenas lembretes
                continue
            
            # Verificar se é o dia e hora configurados para envio
            user_timezone = pytz.timezone(user.timezone)
            now_user_tz = datetime.now(user_timezone)
            
            if now_user_tz.weekday() != settings.weekly_invite_dow or now_user_tz.hour != settings.weekly_invite_hour:
                continue
            
            # Obter template de convite
            invite_template = MessageTemplate.query.filter_by(
                user_id=user.id,
                type='invite'
            ).first()
            
            if not invite_template:
                continue
            
            # Obter pacientes ativos
            patients = Patient.query.filter_by(
                user_id=user.id,
                status='active'
            ).all()
            
            for patient in patients:
                # Enviar convite
                send_whatsapp_message(
                    user_id=user.id,
                    patient_id=patient.id,
                    message_type='invite',
                    content=invite_template.content_json.get('content', ''),
                    buttons=invite_template.content_json.get('buttons', [])
                )

def process_appointment_reminders():
    """Processa lembretes de consultas (D-1 e H-3)"""
    from app import app
    
    with app.app_context():
        # Obter todos os usuários
        users = User.query.all()
        
        for user in users:
            # Verificar configurações de automação
            settings = AutomationSetting.query.filter_by(user_id=user.id).first()
            
            if not settings:
                continue
            
            # Obter template de lembrete
            reminder_template = MessageTemplate.query.filter_by(
                user_id=user.id,
                type='reminder'
            ).first()
            
            if not reminder_template:
                continue
            
            # Obter timezone do usuário
            user_timezone = pytz.timezone(user.timezone)
            now_utc = datetime.utcnow()
            
            # Processar lembretes D-1 (24h antes)
            if settings.enable_d1:
                # Calcular intervalo para D-1
                d1_start = now_utc + timedelta(hours=23)
                d1_end = now_utc + timedelta(hours=25)
                
                # Buscar agendamentos confirmados neste intervalo
                d1_appointments = Appointment.query.filter_by(
                    user_id=user.id,
                    status='confirmed'
                ).filter(
                    Appointment.start_datetime >= d1_start,
                    Appointment.start_datetime <= d1_end
                ).all()
                
                for appt in d1_appointments:
                    # Formatar mensagem
                    start_local = pytz.utc.localize(appt.start_datetime).astimezone(user_timezone)
                    
                    content = reminder_template.content_json.get('content', '')
                    content = content.replace('{quando}', f"Amanhã às {start_local.strftime('%H:%M')}")
                    
                    # Enviar lembrete
                    send_whatsapp_message(
                        user_id=user.id,
                        patient_id=appt.patient_id,
                        message_type='reminder_d1',
                        content=content,
                        buttons=reminder_template.content_json.get('buttons', [])
                    )
            
            # Processar lembretes H-3 (3h antes)
            if settings.enable_h3:
                # Calcular intervalo para H-3
                h3_start = now_utc + timedelta(hours=2, minutes=45)
                h3_end = now_utc + timedelta(hours=3, minutes=15)
                
                # Buscar agendamentos confirmados neste intervalo
                h3_appointments = Appointment.query.filter_by(
                    user_id=user.id,
                    status='confirmed'
                ).filter(
                    Appointment.start_datetime >= h3_start,
                    Appointment.start_datetime <= h3_end
                ).all()
                
                for appt in h3_appointments:
                    # Formatar mensagem
                    start_local = pytz.utc.localize(appt.start_datetime).astimezone(user_timezone)
                    
                    content = reminder_template.content_json.get('content', '')
                    content = content.replace('{quando}', f"Hoje às {start_local.strftime('%H:%M')}")
                    
                    # Enviar lembrete
                    send_whatsapp_message(
                        user_id=user.id,
                        patient_id=appt.patient_id,
                        message_type='reminder_h3',
                        content=content,
                        buttons=reminder_template.content_json.get('buttons', [])
                    )

# Inicialização do worker
if __name__ == '__main__':
    with Connection(conn):
        worker = Worker(['default', 'high'])
        worker.work()