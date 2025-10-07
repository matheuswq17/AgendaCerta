import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { X, Calendar, Clock, User, Video, MapPin } from 'lucide-react';

export default function NewSessionModal({ isOpen, onClose, onSave, selectedDate, patients }) {
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    time: '',
    duration: 50,
    mode: 'online',
    notes: ''
  });

  // Preencher data selecionada quando o modal abrir
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      setFormData({
        ...formData,
        date: date.toISOString().split('T')[0],
        time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      });
    }
  }, [selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Criar objeto de sessão
    const [hours, minutes] = formData.time.split(':');
    const startTime = new Date(formData.date);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + parseInt(formData.duration));
    
    const newSession = {
      id: Date.now().toString(),
      patientId: formData.patientId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      mode: formData.mode,
      status: 'scheduled',
      notes: formData.notes
    };
    
    onSave(newSession);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom dark:bg-dark-card bg-light-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="dark:bg-dark-card bg-light-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium dark:text-dark-text text-light-text" id="modal-title">
                  Nova Sessão
                </h3>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="patientId" className="block text-sm font-medium dark:text-dark-text text-light-text">
                      Paciente
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 dark:text-dark-text/50 text-light-text/50" />
                      </div>
                      <select
                        id="patientId"
                        name="patientId"
                        required
                        value={formData.patientId}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
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
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium dark:text-dark-text text-light-text">
                        Data
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 dark:text-dark-text/50 text-light-text/50" />
                        </div>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          className="pl-10 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium dark:text-dark-text text-light-text">
                        Horário
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 dark:text-dark-text/50 text-light-text/50" />
                        </div>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleChange}
                          className="pl-10 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium dark:text-dark-text text-light-text">
                      Duração (minutos)
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="30">30 minutos</option>
                      <option value="50">50 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="90">1 hora e 30 minutos</option>
                      <option value="120">2 horas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium dark:text-dark-text text-light-text mb-2">
                      Modalidade
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="mode"
                          value="online"
                          checked={formData.mode === 'online'}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 flex items-center dark:text-dark-text text-light-text">
                          <Video className="h-4 w-4 mr-1" /> Online
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="mode"
                          value="in_person"
                          checked={formData.mode === 'in_person'}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 flex items-center dark:text-dark-text text-light-text">
                          <MapPin className="h-4 w-4 mr-1" /> Presencial
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium dark:text-dark-text text-light-text">
                      Observações
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Adicione observações sobre a sessão..."
                    ></textarea>
                  </div>
                  
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <Button type="submit" className="w-full sm:w-auto sm:ml-3">
                      Agendar Sessão
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onClose}
                      className="mt-3 w-full sm:mt-0 sm:w-auto"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}