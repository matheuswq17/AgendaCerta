from flask import Blueprint, request, jsonify
from models import Availability, Blackout, Appointment, db
from routes.auth import token_required
from datetime import datetime, timedelta
import pytz

availability_bp = Blueprint('availability', __name__)

@availability_bp.route('', methods=['GET'])
@token_required
def get_availability(current_user):
    availability = Availability.query.filter_by(user_id=current_user.id).all()
    
    result = []
    for slot in availability:
        result.append({
            'id': slot.id,
            'weekday': slot.weekday,
            'start_time': slot.start_time.strftime('%H:%M'),
            'end_time': slot.end_time.strftime('%H:%M'),
            'duration_min': slot.duration_min,
            'break_min': slot.break_min,
            'active': slot.active
        })
    
    return jsonify(result), 200

@availability_bp.route('', methods=['POST'])
@token_required
def create_availability(current_user):
    data = request.get_json()
    
    if not data or not all(k in data for k in ['weekday', 'start_time', 'end_time', 'duration_min']):
        return jsonify({'error': 'Dados incompletos'}), 400
    
    # Validar dia da semana (0-6, onde 0 é segunda-feira)
    if not 0 <= int(data['weekday']) <= 6:
        return jsonify({'error': 'Dia da semana inválido (0-6)'}), 400
    
    # Converter strings de horário para objetos time
    try:
        start_time = datetime.strptime(data['start_time'], '%H:%M').time()
        end_time = datetime.strptime(data['end_time'], '%H:%M').time()
    except ValueError:
        return jsonify({'error': 'Formato de horário inválido (HH:MM)'}), 400
    
    # Validar duração da sessão
    if not 15 <= int(data['duration_min']) <= 120:
        return jsonify({'error': 'Duração inválida (15-120 min)'}), 400
    
    # Validar intervalo entre sessões
    break_min = data.get('break_min', 0)
    if not 0 <= int(break_min) <= 60:
        return jsonify({'error': 'Intervalo inválido (0-60 min)'}), 400
    
    new_availability = Availability(
        user_id=current_user.id,
        weekday=data['weekday'],
        start_time=start_time,
        end_time=end_time,
        duration_min=data['duration_min'],
        break_min=break_min,
        active=data.get('active', True)
    )
    
    db.session.add(new_availability)
    
    try:
        db.session.commit()
        return jsonify({
            'id': new_availability.id,
            'weekday': new_availability.weekday,
            'start_time': new_availability.start_time.strftime('%H:%M'),
            'end_time': new_availability.end_time.strftime('%H:%M'),
            'duration_min': new_availability.duration_min,
            'break_min': new_availability.break_min,
            'active': new_availability.active
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao criar disponibilidade: {str(e)}'}), 500

@availability_bp.route('/<int:availability_id>', methods=['DELETE'])
@token_required
def delete_availability(current_user, availability_id):
    availability = Availability.query.filter_by(
        id=availability_id, 
        user_id=current_user.id
    ).first()
    
    if not availability:
        return jsonify({'error': 'Disponibilidade não encontrada'}), 404
    
    try:
        db.session.delete(availability)
        db.session.commit()
        return jsonify({'message': 'Disponibilidade removida com sucesso'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao remover disponibilidade: {str(e)}'}), 500

# Rotas para gerenciamento de bloqueios (blackouts)
@availability_bp.route('/blackouts', methods=['GET'])
@token_required
def get_blackouts(current_user):
    blackouts = Blackout.query.filter_by(user_id=current_user.id).all()
    
    result = []
    for blackout in blackouts:
        result.append({
            'id': blackout.id,
            'date': blackout.date.strftime('%Y-%m-%d'),
            'reason': blackout.reason
        })
    
    return jsonify(result), 200

@availability_bp.route('/blackouts', methods=['POST'])
@token_required
def create_blackout(current_user):
    data = request.get_json()
    
    if not data or not data.get('date'):
        return jsonify({'error': 'Data é obrigatória'}), 400
    
    try:
        date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Formato de data inválido (YYYY-MM-DD)'}), 400
    
    new_blackout = Blackout(
        user_id=current_user.id,
        date=date,
        reason=data.get('reason', '')
    )
    
    db.session.add(new_blackout)
    
    try:
        db.session.commit()
        return jsonify({
            'id': new_blackout.id,
            'date': new_blackout.date.strftime('%Y-%m-%d'),
            'reason': new_blackout.reason
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao criar bloqueio: {str(e)}'}), 500

# Rota para gerar slots disponíveis com base na disponibilidade, agendamentos e bloqueios
@availability_bp.route('/slots', methods=['GET'])
@token_required
def get_slots(current_user):
    # Obter a semana solicitada (formato YYYY-WW)
    week_param = request.args.get('week')
    if not week_param:
        return jsonify({'error': 'Parâmetro week é obrigatório (formato YYYY-WW)'}), 400
    
    try:
        year, week = map(int, week_param.split('-'))
        # Calcular a data do primeiro dia da semana (segunda-feira)
        first_day = datetime.strptime(f'{year}-{week}-1', '%Y-%W-%w').date()
    except ValueError:
        return jsonify({'error': 'Formato de semana inválido (YYYY-WW)'}), 400
    
    # Obter o timezone do usuário
    user_timezone = pytz.timezone(current_user.timezone)
    
    # Calcular o último dia da semana (domingo)
    last_day = first_day + timedelta(days=6)
    
    # Obter a disponibilidade do usuário
    availability = Availability.query.filter_by(
        user_id=current_user.id,
        active=True
    ).all()
    
    # Obter os bloqueios do usuário para a semana
    blackouts = Blackout.query.filter_by(
        user_id=current_user.id
    ).filter(
        Blackout.date >= first_day,
        Blackout.date <= last_day
    ).all()
    
    # Obter os agendamentos do usuário para a semana
    appointments = Appointment.query.filter_by(
        user_id=current_user.id
    ).filter(
        Appointment.start_datetime >= datetime.combine(first_day, datetime.min.time()),
        Appointment.start_datetime <= datetime.combine(last_day, datetime.max.time())
    ).filter(
        Appointment.status.in_(['scheduled', 'confirmed'])
    ).all()
    
    # Converter bloqueios para um conjunto de datas para verificação rápida
    blackout_dates = {b.date for b in blackouts}
    
    # Converter agendamentos para um dicionário de slots ocupados
    booked_slots = {}
    for appt in appointments:
        day = appt.start_datetime.date()
        if day not in booked_slots:
            booked_slots[day] = []
        
        booked_slots[day].append({
            'start': appt.start_datetime,
            'end': appt.end_datetime
        })
    
    # Gerar slots disponíveis
    available_slots = []
    
    # Para cada dia da semana
    current_date = first_day
    while current_date <= last_day:
        # Verificar se o dia está bloqueado
        if current_date in blackout_dates:
            current_date += timedelta(days=1)
            continue
        
        # Obter o dia da semana (0-6, onde 0 é segunda-feira)
        weekday = current_date.weekday()
        
        # Encontrar disponibilidade para este dia da semana
        day_availability = [a for a in availability if a.weekday == weekday]
        
        # Para cada período de disponibilidade neste dia
        for avail in day_availability:
            # Calcular slots com base na duração da sessão e intervalo
            slot_duration = timedelta(minutes=avail.duration_min)
            break_duration = timedelta(minutes=avail.break_min)
            
            # Horário de início e fim em datetime
            start_dt = datetime.combine(current_date, avail.start_time)
            end_dt = datetime.combine(current_date, avail.end_time)
            
            # Gerar slots
            current_slot_start = start_dt
            while current_slot_start + slot_duration <= end_dt:
                current_slot_end = current_slot_start + slot_duration
                
                # Verificar se o slot está livre (não conflita com agendamentos)
                is_available = True
                if current_date in booked_slots:
                    for booked in booked_slots[current_date]:
                        # Verificar sobreposição
                        if (current_slot_start < booked['end'] and 
                            current_slot_end > booked['start']):
                            is_available = False
                            break
                
                # Se o slot estiver disponível, adicionar à lista
                if is_available:
                    # Converter para o timezone do usuário para exibição
                    slot_start_local = pytz.utc.localize(current_slot_start).astimezone(user_timezone)
                    slot_end_local = pytz.utc.localize(current_slot_end).astimezone(user_timezone)
                    
                    available_slots.append({
                        'date': current_date.strftime('%Y-%m-%d'),
                        'start': slot_start_local.strftime('%H:%M'),
                        'end': slot_end_local.strftime('%H:%M'),
                        'duration': avail.duration_min
                    })
                
                # Avançar para o próximo slot
                current_slot_start = current_slot_end + break_duration
        
        # Avançar para o próximo dia
        current_date += timedelta(days=1)
    
    return jsonify(available_slots), 200