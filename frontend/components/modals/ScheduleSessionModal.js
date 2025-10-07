import { useState, useEffect } from 'react';
import { X, User, Calendar, Clock, MapPin, Video, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';

export default function ScheduleSessionModal({ isOpen, onClose, onSchedule, selectedDate, patients }) {
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    startTime: '09:00',
    duration: 50,
    mode: 'online',
    notes: ''
  });

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate
      }));
    }
  }, [selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calcular horário de término com base na duração
    const [hours, minutes] = formData.startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + parseInt(formData.duration));
    
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
    
    // Criar objeto de agendamento
    const appointment = {
      id: Date.now().toString(),
      patientId: formData.patientId,
      patient: patients.find(p => p.id === formData.patientId),
      date: formData.date,
      startTime: formData.startTime,
      endTime: endTime,
      duration: parseInt(formData.duration),
      mode: formData.mode,
      notes: formData.notes,
      status: 'scheduled'
    };
    
    onSchedule(appointment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-dark-border">
          <h2 className="text-xl font-bold dark:text-dark-text">Agendar Sessão</h2>
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
                Paciente*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full rounded-md border dark:border-dark-border dark:bg-dark-input dark:text-dark-text py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Selecione um paciente</option>
                  {patients && patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                Data*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full rounded-md border dark:border-dark-border dark:bg-dark-input dark:text-dark-text py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                  Horário de Início*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full rounded-md border dark:border-dark-border dark:bg-dark-input dark:text-dark-text py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                  Duração (minutos)*
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border dark:border-dark-border dark:bg-dark-input dark:text-dark-text py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="30">30 minutos</option>
                  <option value="50">50 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1 hora e 30 minutos</option>
                  <option value="120">2 horas</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                Modalidade*
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="in-person"
                    checked={formData.mode === 'in-person'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <MapPin className="h-5 w-5 text-gray-400 mr-1" />
                  <span className="dark:text-dark-text">Presencial</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="mode"
                    value="online"
                    checked={formData.mode === 'online'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <Video className="h-5 w-5 text-gray-400 mr-1" />
                  <span className="dark:text-dark-text">Online</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-dark-text">
                Observações
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="pl-10 w-full rounded-md border dark:border-dark-border dark:bg-dark-input dark:text-dark-text py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Notas sobre a sessão..."
                ></textarea>
              </div>
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
              Agendar Sessão
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}