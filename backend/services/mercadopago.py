import os
import requests
import json
from datetime import datetime
from models import User, Subscription, db

class MercadoPagoService:
    """Serviço para integração com o Mercado Pago"""
    
    def __init__(self):
        self.access_token = os.getenv('MERCADO_PAGO_ACCESS_TOKEN')
        self.api_url = "https://api.mercadopago.com/v1"
    
    def create_subscription(self, user_id, plan_id):
        """
        Cria uma assinatura no Mercado Pago
        
        Args:
            user_id: ID do usuário
            plan_id: ID do plano (start ou pro)
            
        Returns:
            dict: Dados da assinatura ou erro
        """
        if not self.access_token:
            return {"error": "Token de acesso do Mercado Pago não configurado"}
        
        # Obter dados do usuário
        user = User.query.get(user_id)
        if not user:
            return {"error": "Usuário não encontrado"}
        
        # Definir preço com base no plano
        amount = 29.00 if plan_id == "start" else 59.00
        
        # Preparar payload
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "preapproval_plan_id": f"psiagenda_{plan_id}",
            "reason": f"Psi-Agenda - Plano {plan_id.capitalize()}",
            "auto_recurring": {
                "frequency": 1,
                "frequency_type": "months",
                "transaction_amount": amount,
                "currency_id": "BRL"
            },
            "payer_email": user.email,
            "back_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/billing/success",
            "status": "authorized"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/preapproval",
                headers=headers,
                data=json.dumps(payload)
            )
            
            response_data = response.json()
            
            if response.status_code == 201:
                # Criar ou atualizar assinatura no banco de dados
                subscription = Subscription.query.filter_by(user_id=user_id).first()
                
                if not subscription:
                    subscription = Subscription(
                        user_id=user_id,
                        provider="mercadopago",
                        plan=plan_id,
                        status="pending",
                        renew_at=datetime.utcnow(),
                        limits_json=self._get_plan_limits(plan_id)
                    )
                    db.session.add(subscription)
                else:
                    subscription.provider = "mercadopago"
                    subscription.plan = plan_id
                    subscription.status = "pending"
                    subscription.limits_json = self._get_plan_limits(plan_id)
                
                # Atualizar plano do usuário
                user.plan = plan_id
                
                db.session.commit()
                
                return {
                    "subscription_id": response_data.get("id"),
                    "init_point": response_data.get("init_point"),
                    "status": "pending"
                }
            else:
                return {"error": response_data.get("message", "Erro ao criar assinatura")}
            
        except Exception as e:
            return {"error": str(e)}
    
    def get_subscription_status(self, subscription_id):
        """
        Verifica o status de uma assinatura
        
        Args:
            subscription_id: ID da assinatura no Mercado Pago
            
        Returns:
            dict: Status da assinatura
        """
        if not self.access_token:
            return {"error": "Token de acesso do Mercado Pago não configurado"}
        
        headers = {
            "Authorization": f"Bearer {self.access_token}"
        }
        
        try:
            response = requests.get(
                f"{self.api_url}/preapproval/{subscription_id}",
                headers=headers
            )
            
            return response.json()
            
        except Exception as e:
            return {"error": str(e)}
    
    def cancel_subscription(self, subscription_id):
        """
        Cancela uma assinatura
        
        Args:
            subscription_id: ID da assinatura no Mercado Pago
            
        Returns:
            dict: Resultado da operação
        """
        if not self.access_token:
            return {"error": "Token de acesso do Mercado Pago não configurado"}
        
        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "status": "cancelled"
        }
        
        try:
            response = requests.put(
                f"{self.api_url}/preapproval/{subscription_id}",
                headers=headers,
                data=json.dumps(payload)
            )
            
            if response.status_code == 200:
                return {"status": "cancelled"}
            else:
                return {"error": response.json().get("message", "Erro ao cancelar assinatura")}
            
        except Exception as e:
            return {"error": str(e)}
    
    def _get_plan_limits(self, plan_id):
        """Retorna os limites do plano"""
        if plan_id == "start":
            return {
                "patients_limit": 50,
                "messages_limit": 200,
                "features": ["basic"]
            }
        elif plan_id == "pro":
            return {
                "patients_limit": 200,
                "messages_limit": 1000,
                "features": ["basic", "advanced"]
            }
        else:
            return {
                "patients_limit": 10,
                "messages_limit": 50,
                "features": ["basic"]
            }

# Instância global do serviço
mercadopago_service = MercadoPagoService()