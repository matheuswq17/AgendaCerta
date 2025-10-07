from flask import Blueprint, request, jsonify
from models import Patient, Consent, db
from routes.auth import token_required
import csv
import io
from datetime import datetime

patients_bp = Blueprint('patients', __name__)

@patients_bp.route('', methods=['GET'])
@token_required
def get_patients(current_user):
    patients = Patient.query.filter_by(user_id=current_user.id).all()
    
    result = []
    for patient in patients:
        result.append({
            'id': patient.id,
            'name': patient.name,
            'whatsapp': patient.whatsapp,
            'status': patient.status,
            'created_at': patient.created_at.isoformat(),
            'preferences': patient.preferences_json
        })
    
    return jsonify(result), 200

@patients_bp.route('', methods=['POST'])
@token_required
def create_patient(current_user):
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('whatsapp'):
        return jsonify({'error': 'Nome e WhatsApp são obrigatórios'}), 400
    
    # Formatar número de WhatsApp (remover caracteres não numéricos)
    whatsapp = ''.join(filter(str.isdigit, data['whatsapp']))
    
    # Verificar se o paciente já existe para este usuário
    existing = Patient.query.filter_by(
        user_id=current_user.id, 
        whatsapp=whatsapp
    ).first()
    
    if existing:
        return jsonify({'error': 'Paciente com este WhatsApp já cadastrado'}), 409
    
    new_patient = Patient(
        user_id=current_user.id,
        name=data['name'],
        whatsapp=whatsapp,
        status='active',
        preferences_json=data.get('preferences', {}),
        created_at=datetime.utcnow()
    )
    
    db.session.add(new_patient)
    
    try:
        db.session.commit()
        return jsonify({
            'id': new_patient.id,
            'name': new_patient.name,
            'whatsapp': new_patient.whatsapp,
            'status': new_patient.status,
            'created_at': new_patient.created_at.isoformat(),
            'preferences': new_patient.preferences_json
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao cadastrar paciente: {str(e)}'}), 500

@patients_bp.route('/<int:patient_id>', methods=['PUT'])
@token_required
def update_patient(current_user, patient_id):
    patient = Patient.query.filter_by(id=patient_id, user_id=current_user.id).first()
    
    if not patient:
        return jsonify({'error': 'Paciente não encontrado'}), 404
    
    data = request.get_json()
    
    if data.get('name'):
        patient.name = data['name']
    
    if data.get('whatsapp'):
        patient.whatsapp = ''.join(filter(str.isdigit, data['whatsapp']))
    
    if data.get('status') in ['active', 'paused', 'optout']:
        patient.status = data['status']
    
    if data.get('preferences'):
        patient.preferences_json = data['preferences']
    
    try:
        db.session.commit()
        return jsonify({
            'id': patient.id,
            'name': patient.name,
            'whatsapp': patient.whatsapp,
            'status': patient.status,
            'created_at': patient.created_at.isoformat(),
            'preferences': patient.preferences_json
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao atualizar paciente: {str(e)}'}), 500

@patients_bp.route('/<int:patient_id>', methods=['DELETE'])
@token_required
def delete_patient(current_user, patient_id):
    patient = Patient.query.filter_by(id=patient_id, user_id=current_user.id).first()
    
    if not patient:
        return jsonify({'error': 'Paciente não encontrado'}), 404
    
    try:
        db.session.delete(patient)
        db.session.commit()
        return jsonify({'message': 'Paciente removido com sucesso'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao remover paciente: {str(e)}'}), 500

@patients_bp.route('/import', methods=['POST'])
@token_required
def import_patients(current_user):
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
    
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Formato inválido. Envie um arquivo CSV'}), 400
    
    # Processar o arquivo CSV
    stream = io.StringIO(file.stream.read().decode("utf-8"), newline=None)
    csv_reader = csv.reader(stream, delimiter=';')
    
    imported = 0
    errors = 0
    
    for row in csv_reader:
        if len(row) < 2:
            errors += 1
            continue
        
        name = row[0].strip()
        whatsapp = ''.join(filter(str.isdigit, row[1]))
        
        if not name or not whatsapp:
            errors += 1
            continue
        
        # Verificar se o paciente já existe
        existing = Patient.query.filter_by(
            user_id=current_user.id, 
            whatsapp=whatsapp
        ).first()
        
        if existing:
            errors += 1
            continue
        
        new_patient = Patient(
            user_id=current_user.id,
            name=name,
            whatsapp=whatsapp,
            status='active',
            preferences_json={},
            created_at=datetime.utcnow()
        )
        
        db.session.add(new_patient)
        imported += 1
    
    try:
        db.session.commit()
        return jsonify({
            'message': f'Importação concluída: {imported} pacientes importados, {errors} erros',
            'imported': imported,
            'errors': errors
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro na importação: {str(e)}'}), 500