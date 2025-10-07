import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { MessageSquare, Plus, Edit, Trash, ToggleLeft, ToggleRight } from 'lucide-react';
import { BRAND_NAME } from '../lib/brand';

export default function Automation() {
  const [automations, setAutomations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Dados de exemplo
  const mockAutomations = [
    { 
      id: 1, 
      name: 'Lembrete de Consulta', 
      description: 'Envia um lembrete 24h antes da consulta',
      trigger: 'appointment_scheduled',
      isActive: true,
      createdAt: '2023-05-10'
    },
    { 
      id: 2, 
      name: 'Confirmação de Agendamento', 
      description: 'Envia uma mensagem de confirmação quando uma consulta é agendada',
      trigger: 'appointment_created',
      isActive: true,
      createdAt: '2023-05-12'
    },
    { 
      id: 3, 
      name: 'Feedback pós-consulta', 
      description: 'Solicita feedback do paciente após a consulta',
      trigger: 'appointment_completed',
      isActive: false,
      createdAt: '2023-05-15'
    },
  ];
  
  useEffect(() => {
    // Simulando carregamento de dados
    setTimeout(() => {
      setAutomations(mockAutomations);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddAutomation = () => {
    setShowAddModal(true);
  };

  const handleToggleAutomation = (id) => {
    setAutomations(automations.map(automation => 
      automation.id === id 
        ? { ...automation, isActive: !automation.isActive } 
        : automation
    ));
  };

  const handleEditAutomation = (id) => {
    // Implementação futura
    console.log(`Editar automação ${id}`);
  };

  const handleDeleteAutomation = (id) => {
    // Implementação futura
    console.log(`Excluir automação ${id}`);
  };
  
  return (
    <DashboardLayout>
      <Head>
        <title>{`Automação | ${BRAND_NAME}`}</title>
      </Head>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-h1 font-bold dark:text-dark-text text-light-text">Automação</h1>
          <Button 
            onClick={handleAddAutomation}
            className="flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Automação
          </Button>
        </div>
        
        <div className="dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b dark:border-dark-border border-light-border">
            <h2 className="text-h3 font-medium dark:text-dark-text text-light-text">Automações de Mensagens</h2>
            <p className="text-sm dark:text-dark-text/70 text-light-text/70 mt-1">
              Configure mensagens automáticas para seus pacientes
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
              <p className="mt-2 text-body dark:text-dark-text text-light-text">Carregando automações...</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {automations.map((automation) => (
                  <div 
                    key={automation.id} 
                    className={`dark:bg-dark-bg bg-light-bg p-4 rounded-lg border ${
                      automation.isActive 
                        ? 'dark:border-primary/30 border-primary/30' 
                        : 'dark:border-dark-border border-light-border'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-h4 font-medium dark:text-dark-text text-light-text">{automation.name}</h3>
                      <button 
                        onClick={() => handleToggleAutomation(automation.id)}
                        className={`p-1 rounded-full ${
                          automation.isActive 
                            ? 'text-primary' 
                            : 'dark:text-dark-text/50 text-light-text/50'
                        }`}
                      >
                        {automation.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>
                    </div>
                    
                    <p className="text-sm dark:text-dark-text/70 text-light-text/70 mt-2">
                      {automation.description}
                    </p>
                    
                    <div className="mt-4 pt-3 border-t dark:border-dark-border border-light-border flex justify-between items-center">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 dark:text-dark-text/50 text-light-text/50" />
                        <span className="text-xs dark:text-dark-text/50 text-light-text/50">
                          Trigger: {automation.trigger}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditAutomation(automation.id)}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAutomation(automation.id)}
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {automations.length === 0 && (
                <div className="text-center py-8 dark:text-dark-text/50 text-light-text/50">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">Nenhuma automação configurada</p>
                  <p className="mt-1">Crie automações para enviar mensagens aos seus pacientes automaticamente</p>
                  <Button 
                    onClick={handleAddAutomation}
                    className="mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Automação
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal para adicionar automação */}
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
                      Nova Automação
                    </h3>
                    <div className="mt-2">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium dark:text-dark-text text-light-text">Nome</label>
                          <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            placeholder="Ex: Lembrete de Consulta"
                            className="mt-1 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium dark:text-dark-text text-light-text">Descrição</label>
                          <textarea 
                            id="description" 
                            name="description" 
                            rows="3"
                            placeholder="Descreva o que esta automação faz"
                            className="mt-1 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                          ></textarea>
                        </div>
                        <div>
                          <label htmlFor="trigger" className="block text-sm font-medium dark:text-dark-text text-light-text">Gatilho</label>
                          <select 
                            id="trigger" 
                            name="trigger" 
                            className="mt-1 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Selecione um gatilho</option>
                            <option value="appointment_created">Quando uma consulta é agendada</option>
                            <option value="appointment_scheduled">24h antes da consulta</option>
                            <option value="appointment_completed">Após a consulta</option>
                            <option value="appointment_cancelled">Quando uma consulta é cancelada</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium dark:text-dark-text text-light-text">Mensagem</label>
                          <textarea 
                            id="message" 
                            name="message" 
                            rows="5"
                            placeholder="Digite a mensagem que será enviada"
                            className="mt-1 block w-full rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                          ></textarea>
                          <p className="mt-1 text-xs dark:text-dark-text/50 text-light-text/50">
                            Você pode usar variáveis como {'{nome}'}, {'{data}'}, {'{hora}'} na sua mensagem.
                          </p>
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
                            Ativar automação imediatamente
                          </label>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dark:bg-dark-bg/50 bg-light-bg/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button className="w-full sm:w-auto sm:ml-3">
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