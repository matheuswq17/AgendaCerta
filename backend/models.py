from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    crp = db.Column(db.String(20))
    timezone = db.Column(db.String(50), default='America/Sao_Paulo')
    plan = db.Column(db.String(20), default='start')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    patients = db.relationship('Patient', backref='professional', lazy=True)
    availabilities = db.relationship('Availability', backref='professional', lazy=True)
    appointments = db.relationship('Appointment', backref='professional', lazy=True)
    
    def __repr__(self):
        return f'<User {self.email}>'

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    provider = db.Column(db.String(50), default='mercadopago')
    plan = db.Column(db.String(20), default='start')
    status = db.Column(db.String(20), default='active')
    renew_at = db.Column(db.DateTime)
    limits_json = db.Column(db.Text)
    
    @property
    def limits(self):
        return json.loads(self.limits_json) if self.limits_json else {}
    
    @limits.setter
    def limits(self, value):
        self.limits_json = json.dumps(value)

class Patient(db.Model):
    __tablename__ = 'patients'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    whatsapp = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='active')  # active, paused, optout
    preferences_json = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    consents = db.relationship('Consent', backref='patient', lazy=True)
    appointments = db.relationship('Appointment', backref='patient', lazy=True)
    
    @property
    def preferences(self):
        return json.loads(self.preferences_json) if self.preferences_json else {}
    
    @preferences.setter
    def preferences(self, value):
        self.preferences_json = json.dumps(value)

class Consent(db.Model):
    __tablename__ = 'consents'
    
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    channel = db.Column(db.String(20), default='whatsapp')
    status = db.Column(db.String(20), default='granted')  # granted, denied
    method = db.Column(db.String(50))
    ip = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Availability(db.Model):
    __tablename__ = 'availability'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    weekday = db.Column(db.Integer, nullable=False)  # 0=Segunda, 6=Domingo
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    duration_min = db.Column(db.Integer, default=50)
    break_min = db.Column(db.Integer, default=10)
    active = db.Column(db.Boolean, default=True)

class Blackout(db.Model):
    __tablename__ = 'blackouts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.String(200))

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    start_datetime = db.Column(db.DateTime, nullable=False)
    end_datetime = db.Column(db.DateTime, nullable=False)
    mode = db.Column(db.String(20), default='online')  # online, in_person
    status = db.Column(db.String(20), default='scheduled')  # scheduled, confirmed, cancelled, no_show, completed
    source = db.Column(db.String(20), default='manual')  # auto, manual
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AutomationSetting(db.Model):
    __tablename__ = 'automation_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    mode = db.Column(db.String(1), default='A')  # A, B, C
    weekly_invite_dow = db.Column(db.Integer, default=0)  # 0=Segunda
    weekly_invite_hour = db.Column(db.Integer, default=10)
    cancel_window_hours = db.Column(db.Integer, default=12)
    enable_d1 = db.Column(db.Boolean, default=True)
    enable_h3 = db.Column(db.Boolean, default=True)

class MessageTemplate(db.Model):
    __tablename__ = 'message_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # consent, invite, offer, confirm, reminder, noshow
    content_json = db.Column(db.Text)
    
    @property
    def content(self):
        return json.loads(self.content_json) if self.content_json else {}
    
    @content.setter
    def content(self, value):
        self.content_json = json.dumps(value)

class MessageLog(db.Model):
    __tablename__ = 'message_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)
    payload_json = db.Column(db.Text)
    status = db.Column(db.String(20), default='sent')  # sent, delivered, failed, responded
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    @property
    def payload(self):
        return json.loads(self.payload_json) if self.payload_json else {}
    
    @payload.setter
    def payload(self, value):
        self.payload_json = json.dumps(value)

class UsageCounter(db.Model):
    __tablename__ = 'usage_counters'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    month = db.Column(db.String(7), nullable=False)  # YYYY-MM
    messages_sent = db.Column(db.Integer, default=0)
    patients_active = db.Column(db.Integer, default=0)