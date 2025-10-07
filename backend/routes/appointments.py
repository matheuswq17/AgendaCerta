from flask import Blueprint, request, jsonify
from models import Appointment, Patient, db
from routes.auth import token_required
from datetime import datetime, timedelta
import pytz

appointments_bp = Blueprint('appointments', __name__)

@appointments_bp.route('', methods=['GET'])
@token_required
def get_appointments(current_user):
    # Parâmetros de filtro
    from_date = request.args.get('from')
    to_date = request.args.get('to')
    
    query = Appointment.query.filter_by(user_id=current_user.id)
    
    # Aplicar filtros de data se fornecidos
    if from_date:
        try:
            from_datetime = datetime.strptime(from_date, '%Y-%m-%d')
            query = query.filter(Appointment.start_datetime >= from_datetime)
        except ValueError:
            return jsonify({'error': 'Formato de data inválido para from (YYYY-MM-DD)'}), 400
    
    if to_date:
        try:
            to_datetime = datetime.strptime(to_date, '%Y-%m-%d')
            to_datetime = datetime.combine(to_datetime.date(), datetime.max.time())
            query = query.filter(Appointment.start_datetime <= to_datetime)
        except ValueError:
            return jsonify({'error': 'Formato de data inválido para to (YYYY-MM-DD)'}), 400
    
    # Executar a consulta
    appointments = query.order_by(Appointment.start_datetime).all()
    
    # Obter o timezone do usuário
    user_timezone = pytz.timezone(current_user.timezone)
    
    result = []
    for appt in appointments:
        # Converter horários para o timezone do usuário
        start_local = pytz.utc.localize(appt.start_datetime).astimezone(user_timezone)
        end_local = pytz.utc.localize(appt.end_datetime).astimezone(user_timezone)
        
        # Obter informações do paciente
        patient = Patient.query.get(appt.patient_id)
        patient_name = patient.name if patient else "Paciente não encontrado"
        
        result.append({
            'id': appt.id,
            'patient_id': appt.patient_id,
            'patient_name': patient_name,
            'start_datetime': start_local.isoformat(),
            'end_datetime': end_local.isoformat(),
            'mode': appt.mode,
            'status': appt.status,
            'source': appt.source,
            'created_at': appt.created_at.isoformat()
        })
    
    return jsonify(result), 200

@appointments_bp.route('', methods=['POST'])
@token_required
def create_appointment(current_user):
    data = request.get_json()
    
    if not data or not all(k in data for k in ['patient_id', 'start_datetime', 'mode']):
        return jsonify({'error': 'Dados incompletos'}), 400
    
    # Validar patient_id
    patient = Patient.query.filter_by(id=data['patient_id'], user_id=current_user.id).first()
    if not patient:
        return jsonify({'error': 'Paciente não encontrado'}), 404
    
    # Validar e converter start_datetime
    try:
        # Assumir que o horário está no timezone do usuário
        user_timezone = pytz.timezone(current_user.timezone)
        local_dt = user_timezone.localize(datetime.fromisoformat(data['start_datetime']))
        # Converter para UTC para armazenamento
        start_datetime_utc = local_dt.astimezone(pytz.utc).replace(tzinfo=None)
    except (ValueError, pytz.exceptions.UnknownTimeZoneError):
        return jsonify({'error': 'Formato de data/hora inválido'}), 400
    
    # Validar modo
    if data['mode'] not in ['online', 'in_person']:
        return jsonify({'error': 'Modo inválido (online ou in_person)'}), 400
    
    # Calcular end_datetime (padrão: 50 minutos)
    duration = data.get('duration_min', 50)
    end_datetime_utc = start_datetime_utc + timedelta(minutes=duration)
    
    # Verificar conflitos de horário
    conflicts = Appointment.query.filter_by(user_id=current_user.id).filter(
        Appointment.start_datetime < end_datetime_utc,
        Appointment.end_datetime > start_datetime_utc,
        Appointment.status.in_(['scheduled', 'confirmed'])
    ).all()
    
    if conflicts:
        return jsonify({'error': 'Conflito de horário com outro agendamento'}), 409
    
    new_appointment = Appointment(
        user_id=current_user.id,
        patient_id=data['patient_id'],
        start_datetime=start_datetime_utc,
        end_datetime=end_datetime_utc,
        mode=data['mode'],
        status='scheduled',
        source='manual',
        created_at=datetime.utcnow()
    )
    
    db.session.add(new_appointment)
    
    try:
        db.session.commit()
        
        # Converter de volta para o timezone do usuário para a resposta
        start_local = pytz.utc.localize(new_appointment.start_datetime).astimezone(user_timezone)
        end_local = pytz.utc.localize(new_appointment.end_datetime).astimezone(user_timezone)
        
        return jsonify({
            'id': new_appointment.id,
            'patient_id': new_appointment.patient_id,
            'patient_name': patient.name,
            'start_datetime': start_local.isoformat(),
            'end_datetime': end_local.isoformat(),
            'mode': new_appointment.mode,
            'status': new_appointment.status,
            'source': new_appointment.source,
            'created_at': new_appointment.created_at.isoformat()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao criar agendamento: {str(e)}'}), 500

@appointments_bp.route('/<int:appointment_id>', methods=['PATCH'])
@token_required
def update_appointment(current_user, appointment_id):
    appointment = Appointment.query.filter_by(
        id=appointment_id, 
        user_id=current_user.id
    ).first()
    
    if not appointment:
        return jsonify({'error': 'Agendamento não encontrado'}), 404
    
    data = request.get_json()
    
    # Atualizar status
    if data.get('status') in ['scheduled', 'confirmed', 'cancelled', 'no_show', 'completed']:
        appointment.status = data['status']
    
    # Atualizar horário de início
    if data.get('start_datetime'):
        try:
            # Assumir que o horário está no timezone do usuário
            user_timezone = pytz.timezone(current_user.timezone)
            local_dt = user_timezone.localize(datetime.fromisoformat(data['start_datetime']))
            # Converter para UTC para armazenamento
            new_start_utc = local_dt.astimezone(pytz.utc).replace(tzinfo=None)
            
            # Calcular nova hora de término mantendo a duração
            duration = (appointment.end_datetime - appointment.start_datetime).total_seconds() / 60
            new_end_utc = new_start_utc + timedelta(minutes=duration)
            
            # Verificar conflitos (excluindo o próprio agendamento)
            conflicts = Appointment.query.filter_by(user_id=current_user.id).filter(
                Appointment.id != appointment_id,
                Appointment.start_datetime < new_end_utc,
                Appointment.end_datetime > new_start_utc,
                Appointment.status.in_(['scheduled', 'confirmed'])
            ).all()
            
            if conflicts:
                return jsonify({'error': 'Conflito de horário com outro agendamento'}), 409
            
            appointment.start_datetime = new_start_utc
            appointment.end_datetime = new_end_utc
            
        except (ValueError, pytz.exceptions.UnknownTimeZoneError):
            return jsonify({'error': 'Formato de data/hora inválido'}), 400
    
    # Atualizar modo de atendimento
    if data.get('mode') in ['online', 'in_person']:
        appointment.mode = data['mode']
    
    try:
        db.session.commit()
        
        # Converter para o timezone do usuário para a resposta
        user_timezone = pytz.timezone(current_user.timezone)
        start_local = pytz.utc.localize(appointment.start_datetime).astimezone(user_timezone)
        end_local = pytz.utc.localize(appointment.end_datetime).astimezone(user_timezone)
        
        # Obter informações do paciente
        patient = Patient.query.get(appointment.patient_id)
        
        return jsonify({
            'id': appointment.id,
            'patient_id': appointment.patient_id,
            'patient_name': patient.name if patient else "Paciente não encontrado",
            'start_datetime': start_local.isoformat(),
            'end_datetime': end_local.isoformat(),
            'mode': appointment.mode,
            'status': appointment.status,
            'source': appointment.source,
            'created_at': appointment.created_at.isoformat()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao atualizar agendamento: {str(e)}'}), 500