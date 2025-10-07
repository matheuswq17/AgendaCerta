from flask import Blueprint, request, jsonify
from models import Patient, Appointment, MessageLog, db
from datetime import datetime
import json

webhooks_bp = Blueprint('webhooks', __name__)

@webhooks_bp.route('/whatsapp', methods=['POST'])
def whatsapp_webhook():
    """Webhook para receber mensagens e interações do WhatsApp"""
    data = request.get_json()
    
    # Verificar se é uma mensagem válida
    if not data or 'entry' not in data:
        return jsonify({'status': 'error', 'message': 'Payload inválido'}), 400
    
    try:
        # Processar cada entrada
        for entry in data['entry']:
            for change in entry.get('changes', []):
                value = change.get('value', {})
                
                # Verificar se é uma mensagem
                if 'messages' not in value:
                    continue
                
                for message in value['messages']:
                    # Obter número do remetente
                    sender = message.get('from')
                    if not sender:
                        continue
                    
                    # Encontrar o paciente pelo número de WhatsApp
                    patient = Patient.query.filter_by(whatsapp=sender).first()
                    if not patient:
                        continue
                    
                    # Processar mensagem de texto
                    if message.get('type') == 'text':
                        text = message.get('text', {}).get('body', '').lower()
                        
                        # Verificar se é um opt-out ("parar")
                        if text == 'parar':
                            patient.status = 'optout'
                            db.session.commit()
                            
                            # Registrar log
                            log = MessageLog(
                                user_id=patient.user_id,
                                patient_id=patient.id,
                                type='optout',
                                payload_json={'text': text},
                                status='responded',
                                timestamp=datetime.utcnow()
                            )
                            db.session.add(log)
                            db.session.commit()
                    
                    # Processar interações com botões
                    elif message.get('type') == 'interactive':
                        interactive = message.get('interactive', {})
                        
                        if interactive.get('type') == 'button_reply':
                            button_reply = interactive.get('button_reply', {})
                            button_id = button_reply.get('id')
                            button_text = button_reply.get('title')
                            
                            # Processar resposta com base no botão
                            if button_text == 'Confirmar':
                                # Buscar próximo agendamento do paciente
                                appointment = Appointment.query.filter_by(
                                    patient_id=patient.id,
                                    status='scheduled'
                                ).order_by(Appointment.start_datetime).first()
                                
                                if appointment:
                                    appointment.status = 'confirmed'
                                    db.session.commit()
                                    
                                    # Registrar log
                                    log = MessageLog(
                                        user_id=patient.user_id,
                                        patient_id=patient.id,
                                        type='confirmation',
                                        payload_json={'button': button_text},
                                        status='responded',
                                        timestamp=datetime.utcnow()
                                    )
                                    db.session.add(log)
                                    db.session.commit()
                            
                            elif button_text == 'Remarcar':
                                # Buscar próximo agendamento do paciente
                                appointment = Appointment.query.filter_by(
                                    patient_id=patient.id
                                ).filter(
                                    Appointment.status.in_(['scheduled', 'confirmed'])
                                ).order_by(Appointment.start_datetime).first()
                                
                                if appointment:
                                    # Marcar para reagendamento (será processado pelo worker)
                                    log = MessageLog(
                                        user_id=patient.user_id,
                                        patient_id=patient.id,
                                        type='reschedule_request',
                                        payload_json={
                                            'button': button_text,
                                            'appointment_id': appointment.id
                                        },
                                        status='responded',
                                        timestamp=datetime.utcnow()
                                    )
                                    db.session.add(log)
                                    db.session.commit()
                            
                            elif button_text == 'Pausar':
                                # Pausar notificações para o paciente
                                patient.status = 'paused'
                                db.session.commit()
                                
                                # Registrar log
                                log = MessageLog(
                                    user_id=patient.user_id,
                                    patient_id=patient.id,
                                    type='pause',
                                    payload_json={'button': button_text},
                                    status='responded',
                                    timestamp=datetime.utcnow()
                                )
                                db.session.add(log)
                                db.session.commit()
                            
                            elif button_text == 'Cancelar':
                                # Buscar próximo agendamento do paciente
                                appointment = Appointment.query.filter_by(
                                    patient_id=patient.id
                                ).filter(
                                    Appointment.status.in_(['scheduled', 'confirmed'])
                                ).order_by(Appointment.start_datetime).first()
                                
                                if appointment:
                                    appointment.status = 'cancelled'
                                    db.session.commit()
                                    
                                    # Registrar log
                                    log = MessageLog(
                                        user_id=patient.user_id,
                                        patient_id=patient.id,
                                        type='cancellation',
                                        payload_json={
                                            'button': button_text,
                                            'appointment_id': appointment.id
                                        },
                                        status='responded',
                                        timestamp=datetime.utcnow()
                                    )
                                    db.session.add(log)
                                    db.session.commit()
        
        return jsonify({'status': 'success'}), 200
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@webhooks_bp.route('/billing', methods=['POST'])
def billing_webhook():
    """Webhook para receber notificações de pagamento do Mercado Pago"""
    data = request.get_json()
    
    # Implementação básica para o MVP
    # Registrar a notificação para processamento posterior
    try:
        # Registrar payload para análise
        with open('billing_webhook_logs.json', 'a') as f:
            f.write(json.dumps({
                'timestamp': datetime.utcnow().isoformat(),
                'payload': data
            }) + '\n')
        
        return jsonify({'status': 'success'}), 200
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500