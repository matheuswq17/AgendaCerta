import { useState } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';

export default function AddPatientModal({ isOpen, onClose, onAddPatient }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    address: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Criar um novo objeto de paciente com ID único
    const newPatient = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    onAddPatient(newPatient);
    onClose();
    
    // Resetar o formulário
    setFormData({
      name: '',
      email: '',
      phone: '',
      birthdate: '',
      address: '',
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-dark-border">
          <h2 className="text-xl font-bold dark:text-dark-text">Adicionar Novo Paciente</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                Nome Completo*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full rounded-md border dark:border-dark-border dark:bg-dark-input dark:text-dark-text py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nome do paciente"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-md border dark:border-dark-border dark:bg-dark-input dark:text-dark-text py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                Telefone*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full rounded-md border dark:border-dark-border dark:bg-dark-input dark:text-dark-text py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                Data de Nascimento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-md border dark:border-dark-border dark:bg-dark-input dark:text-dark-text py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                Endereço
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-md border dark:border-dark-border dark:bg-dark-input dark:text-dark-text py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Endereço completo"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                Observações
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-md border dark:border-dark-border dark:bg-dark-input dark:text-dark-text py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Informações adicionais sobre o paciente"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
            >
              Adicionar Paciente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}