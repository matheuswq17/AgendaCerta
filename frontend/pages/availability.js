import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { BRAND_NAME } from '../lib/brand';
import { Button } from '../components/ui/Button';
import { Calendar, Clock, Save, Plus, Edit, Trash } from 'lucide-react';

export default function Availability() {
  const [availabilityData, setAvailabilityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Dados de exemplo
  const mockAvailability = [
    { id: 1, day: 'Segunda', startTime: '08:00', endTime: '12:00', isActive: true },
    { id: 2, day: 'Segunda', startTime: '14:00', endTime: '18:00', isActive: true },
    { id: 3, day: 'Terça', startTime: '08:00', endTime: '12:00', isActive: true },
    { id: 4, day: 'Terça', startTime: '14:00', endTime: '18:00', isActive: true },
    { id: 5, day: 'Quarta', startTime: '08:00', endTime: '12:00', isActive: true },
    { id: 6, day: 'Quarta', startTime: '14:00', endTime: '18:00', isActive: true },
    { id: 7, day: 'Quinta', startTime: '08:00', endTime: '12:00', isActive: true },
    { id: 8, day: 'Quinta', startTime: '14:00', endTime: '18:00', isActive: true },
    { id: 9, day: 'Sexta', startTime: '08:00', endTime: '12:00', isActive: true },
    { id: 10, day: 'Sexta', startTime: '14:00', endTime: '18:00', isActive: false },
  ];
  
  useEffect(() => {
    // Simulando carregamento de dados
    setTimeout(() => {
      setAvailabilityData(mockAvailability);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddAvailability = () => {
    setShowAddModal(true);
  };

  const handleEditAvailability = (id) => {
    // Implementação futura
    console.log(`Editar disponibilidade ${id}`);
  };

  const handleDeleteAvailability = (id) => {
    // Implementação futura
    console.log(`Excluir disponibilidade ${id}`);
  };

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  
  return (
    <DashboardLayout>
      <Head>
        <title>{`Disponibilidade | ${BRAND_NAME}`}</title>
      </Head>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-h1 font-bold dark:text-dark-text text-light-text">Disponibilidade</h1>
          <Button 
            onClick={handleAddAvailability}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Horário
          </Button>
        </div>
        
        <div className="dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b dark:border-dark-border border-light-border">
            <h2 className="text-h3 font-medium dark:text-dark-text text-light-text">Horários de Atendimento</h2>
            <p className="text-sm dark:text-dark-text/70 text-light-text/70 mt-1">
              Configure seus horários disponíveis para atendimento
            </p>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 text-primary mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="mt-2 text-body dark:text-dark-text text-light-text">Carregando disponibilidade...</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weekDays.map((day) => (
                  <div key={day} className="dark:bg-dark-bg bg-light-bg p-4 rounded-lg border dark:border-dark-border border-light-border">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-h4 font-medium dark:text-dark-text text-light-text flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {day}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {availabilityData
                        .filter(slot => slot.day === day)
                        .map(slot => (
                          <div 
                            key={slot.id} 
                            className={`flex justify-between items-center p-3 rounded-md border ${
                              slot.isActive 
                                ? 'dark:border-primary/30 border-primary/30 dark:bg-primary/10 bg-primary/5' 
                                : 'dark:border-dark-border border-light-border dark:bg-dark-bg/50 bg-light-bg/50'
                            }`}
                          >
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 dark:text-dark-text/70 text-light-text/70" />
                              <span className="dark:text-dark-text text-light-text">
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditAvailability(slot.id)}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteAvailability(slot.id)}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                      {availabilityData.filter(slot => slot.day === day).length === 0 && (
                        <div className="text-center py-4 dark:text-dark-text/50 text-light-text/50">
                          <p>Nenhum horário configurado</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => {
                              setSelectedDay(day);
                              setShowAddModal(true);
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para adicionar disponibilidade */}
      {showAddModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom dark:bg-dark-card bg-light-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="dark:bg-dark-card bg-light-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium dark:text-dark-text text-light-text" id="modal-title">
                      Adicionar Disponibilidade
                    </h3>
                    <div className="mt-2">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="day" className="block text-sm font-medium dark:text-dark-text text-light-text">Dia da Semana</label>
                          <select 
                            id="day" 
                            name="day" 
                            className="mt-1 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                            defaultValue={selectedDay || ""}
                          >
                            <option value="" disabled>Selecione um dia</option>
                            {weekDays.map(day => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="startTime" className="block text-sm font-medium dark:text-dark-text text-light-text">Horário Inicial</label>
                            <input 
                              type="time" 
                              id="startTime" 
                              name="startTime" 
                              className="mt-1 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label htmlFor="endTime" className="block text-sm font-medium dark:text-dark-text text-light-text">Horário Final</label>
                            <input 
                              type="time" 
                              id="endTime" 
                              name="endTime" 
                              className="mt-1 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            id="isActive" 
                            name="isActive" 
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            defaultChecked={true}
                          />
                          <label htmlFor="isActive" className="ml-2 block text-sm dark:text-dark-text text-light-text">
                            Ativo
                          </label>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dark:bg-dark-bg/50 bg-light-bg/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button className="w-full sm:w-auto sm:ml-3">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddModal(false)} 
                  className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}