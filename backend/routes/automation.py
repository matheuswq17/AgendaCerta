from flask import Blueprint, request, jsonify
from models import AutomationSetting, MessageTemplate, db
from routes.auth import token_required

automation_bp = Blueprint('automation', __name__)

@automation_bp.route('/settings', methods=['GET'])
@token_required
def get_automation_settings(current_user):
    settings = AutomationSetting.query.filter_by(user_id=current_user.id).first()
    
    if not settings:
        # Criar configurações padrão se não existirem
        settings = AutomationSetting(
            user_id=current_user.id,
            mode='A',  # Modo padrão: Confirma primeiro
            weekly_invite_dow=1,  # Segunda-feira
            weekly_invite_hour=10,  # 10:00
            cancel_window_hours=12,  # 12 horas
            enable_d1=True,  # Lembrete D-1 ativado
            enable_h3=True   # Lembrete H-3 ativado
        )
        db.session.add(settings)
        db.session.commit()
    
    return jsonify({
        'mode': settings.mode,
        'weekly_invite_dow': settings.weekly_invite_dow,
        'weekly_invite_hour': settings.weekly_invite_hour,
        'cancel_window_hours': settings.cancel_window_hours,
        'enable_d1': settings.enable_d1,
        'enable_h3': settings.enable_h3
    }), 200

@automation_bp.route('/settings', methods=['PUT'])
@token_required
def update_automation_settings(current_user):
    settings = AutomationSetting.query.filter_by(user_id=current_user.id).first()
    
    if not settings:
        # Criar configurações se não existirem
        settings = AutomationSetting(user_id=current_user.id)
        db.session.add(settings)
    
    data = request.get_json()
    
    # Atualizar modo de operação
    if data.get('mode') in ['A', 'B', 'C']:
        settings.mode = data['mode']
    
    # Atualizar dia da semana para convite semanal (0-6, onde 0 é segunda-feira)
    if 'weekly_invite_dow' in data and 0 <= int(data['weekly_invite_dow']) <= 6:
        settings.weekly_invite_dow = int(data['weekly_invite_dow'])
    
    # Atualizar hora do convite semanal (0-23)
    if 'weekly_invite_hour' in data and 0 <= int(data['weekly_invite_hour']) <= 23:
        settings.weekly_invite_hour = int(data['weekly_invite_hour'])
    
    # Atualizar janela de cancelamento (em horas)
    if 'cancel_window_hours' in data and 1 <= int(data['cancel_window_hours']) <= 48:
        settings.cancel_window_hours = int(data['cancel_window_hours'])
    
    # Atualizar lembretes
    if 'enable_d1' in data:
        settings.enable_d1 = bool(data['enable_d1'])
    
    if 'enable_h3' in data:
        settings.enable_h3 = bool(data['enable_h3'])
    
    try:
        db.session.commit()
        return jsonify({
            'mode': settings.mode,
            'weekly_invite_dow': settings.weekly_invite_dow,
            'weekly_invite_hour': settings.weekly_invite_hour,
            'cancel_window_hours': settings.cancel_window_hours,
            'enable_d1': settings.enable_d1,
            'enable_h3': settings.enable_h3
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao atualizar configurações: {str(e)}'}), 500

@automation_bp.route('/message-templates', methods=['GET'])
@token_required
def get_message_templates(current_user):
    templates = MessageTemplate.query.filter_by(user_id=current_user.id).all()
    
    # Criar templates padrão se não existirem
    template_types = ['consent', 'invite', 'offer', 'confirm', 'reminder', 'noshow']
    existing_types = [t.type for t in templates]
    
    # Templates padrão
    default_templates = {
        'consent': {
            'content': 'Oi, sou da agenda da Dra. {Profissional}. Posso enviar confirmações e lembretes por aqui? Você pode parar quando quiser.',
            'buttons': ['Sim, pode', 'Prefiro não']
        },
        'invite': {
            'content': 'Olá, {Paciente}! Confirma sua sessão desta semana com {Profissional}?',
            'buttons': ['Confirmar', 'Remarcar', 'Pausar']
        },
        'offer': {
            'content': 'Estes horários estão livres (50 min): {slots}. Toque em um horário para confirmar.',
            'buttons': []
        },
        'confirm': {
            'content': 'Agendado: {dia} {hora} ({modo}).',
            'buttons': ['Remarcar', 'Cancelar']
        },
        'reminder': {
            'content': '📅 {quando} é sua sessão com {Profissional}.',
            'buttons': ['Ver link/endereço']
        },
        'noshow': {
            'content': 'Sentimos sua ausência. Cancelamentos com menos de {janela} podem ser cobrados. Quer reagendar?',
            'buttons': ['Reagendar', 'Pausar']
        }
    }
    
    # Adicionar templates padrão que não existem
    for template_type in template_types:
        if template_type not in existing_types:
            new_template = MessageTemplate(
                user_id=current_user.id,
                type=template_type,
                content_json=default_templates[template_type]
            )
            db.session.add(new_template)
            templates.append(new_template)
    
    if len(existing_types) < len(template_types):
        db.session.commit()
    
    result = []
    for template in templates:
        result.append({
            'id': template.id,
            'type': template.type,
            'content': template.content_json
        })
    
    return jsonify(result), 200

@automation_bp.route('/message-templates/<template_type>', methods=['PUT'])
@token_required
def update_message_template(current_user, template_type):
    if template_type not in ['consent', 'invite', 'offer', 'confirm', 'reminder', 'noshow']:
        return jsonify({'error': 'Tipo de template inválido'}), 400
    
    template = MessageTemplate.query.filter_by(
        user_id=current_user.id,
        type=template_type
    ).first()
    
    if not template:
        # Criar template se não existir
        template = MessageTemplate(
            user_id=current_user.id,
            type=template_type,
            content_json={}
        )
        db.session.add(template)
    
    data = request.get_json()
    
    if not data or not data.get('content'):
        return jsonify({'error': 'Conteúdo é obrigatório'}), 400
    
    # Atualizar conteúdo do template
    template.content_json = {
        'content': data['content'],
        'buttons': data.get('buttons', [])
    }
    
    try:
        db.session.commit()
        return jsonify({
            'id': template.id,
            'type': template.type,
            'content': template.content_json
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erro ao atualizar template: {str(e)}'}), 500