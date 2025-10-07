from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from models import db

# Importar blueprints
from routes.auth import auth_bp
from routes.patients import patients_bp
from routes.availability import availability_bp
from routes.appointments import appointments_bp
from routes.automation import automation_bp

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///psiagenda.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-flask-key')

# Inicializar o banco de dados
db.init_app(app)

# Registrar blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(patients_bp, url_prefix='/patients')
app.register_blueprint(availability_bp, url_prefix='/availability')
app.register_blueprint(appointments_bp, url_prefix='/appointments')
app.register_blueprint(automation_bp, url_prefix='/automation')

@app.route('/')
def index():
    return jsonify({
        'name': 'Psi-Agenda API',
        'version': '1.0.0',
        'status': 'online'
    })

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'database': 'connected'
    })

# Criar tabelas do banco de dados
# Inicialização do banco de dados
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV') == 'development', host='0.0.0.0')