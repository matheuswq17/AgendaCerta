import { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Save, Moon, Sun, Bell, User, Lock, Globe, CreditCard } from 'lucide-react';
import { BRAND_NAME } from '../lib/brand';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const tabs = [
    { id: 'profile', label: 'Perfil', icon: <User className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notificações', icon: <Bell className="w-5 h-5" /> },
    { id: 'appearance', label: 'Aparência', icon: <Moon className="w-5 h-5" /> },
    { id: 'security', label: 'Segurança', icon: <Lock className="w-5 h-5" /> },
    { id: 'language', label: 'Idioma', icon: <Globe className="w-5 h-5" /> },
    { id: 'billing', label: 'Pagamento', icon: <CreditCard className="w-5 h-5" /> }
  ];
  
  return (
    <DashboardLayout>
      <Head>
        <title>{`Configurações | ${BRAND_NAME}`}</title>
      </Head>
      
      <div className="p-6">
        <h1 className="text-h1 font-bold dark:text-dark-text text-light-text mb-6">Configurações</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tabs de navegação */}
          <div className="w-full md:w-64 dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden">
            <nav className="p-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center p-3 rounded-md mb-1 text-left ${
                    activeTab === tab.id
                      ? 'dark:bg-primary/20 bg-primary/20 dark:text-primary text-primary'
                      : 'dark:text-dark-text text-light-text hover:dark:bg-dark-bg hover:bg-light-bg'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Conteúdo da tab ativa */}
          <div className="flex-1 dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden">
            {activeTab === 'profile' && (
              <div className="p-6">
                <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Perfil</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium dark:text-dark-text text-light-text mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        defaultValue="João"
                        className="w-full p-2 rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium dark:text-dark-text text-light-text mb-1">
                        Sobrenome
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        defaultValue="Silva"
                        className="w-full p-2 rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium dark:text-dark-text text-light-text mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      defaultValue="joao.silva@exemplo.com"
                      className="w-full p-2 rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium dark:text-dark-text text-light-text mb-1">
                      Biografia
                    </label>
                    <textarea
                      id="bio"
                      rows="4"
                      defaultValue="Psicólogo clínico com especialização em terapia cognitivo-comportamental."
                      className="w-full p-2 rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>
                  
                  <div>
                    <Button className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div className="p-6">
                <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Aparência</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-h3 font-medium dark:text-dark-text text-light-text mb-2">Tema</h3>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setDarkMode(false)}
                        className={`p-4 rounded-lg border ${
                          !darkMode 
                            ? 'border-primary dark:bg-primary/20 bg-primary/20' 
                            : 'dark:border-dark-border border-light-border'
                        } flex flex-col items-center`}
                      >
                        <Sun className={`w-6 h-6 mb-2 ${!darkMode ? 'text-primary' : 'dark:text-dark-text text-light-text'}`} />
                        <span className={`text-sm ${!darkMode ? 'text-primary' : 'dark:text-dark-text text-light-text'}`}>Claro</span>
                      </button>
                      
                      <button
                        onClick={() => setDarkMode(true)}
                        className={`p-4 rounded-lg border ${
                          darkMode 
                            ? 'border-primary dark:bg-primary/20 bg-primary/20' 
                            : 'dark:border-dark-border border-light-border'
                        } flex flex-col items-center`}
                      >
                        <Moon className={`w-6 h-6 mb-2 ${darkMode ? 'text-primary' : 'dark:text-dark-text text-light-text'}`} />
                        <span className={`text-sm ${darkMode ? 'text-primary' : 'dark:text-dark-text text-light-text'}`}>Escuro</span>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Button className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Preferências
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Notificações</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-h3 font-medium dark:text-dark-text text-light-text">Notificações por Email</h3>
                      <p className="text-sm dark:text-dark-text/70 text-light-text/70 mt-1">
                        Receba notificações por email sobre consultas e mensagens
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationsEnabled} 
                        onChange={() => setNotificationsEnabled(!notificationsEnabled)} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-h3 font-medium dark:text-dark-text text-light-text">Notificações no Navegador</h3>
                      <p className="text-sm dark:text-dark-text/70 text-light-text/70 mt-1">
                        Receba notificações no navegador quando estiver usando o sistema
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-h3 font-medium dark:text-dark-text text-light-text">Lembretes de Consulta</h3>
                      <p className="text-sm dark:text-dark-text/70 text-light-text/70 mt-1">
                        Receba lembretes sobre consultas agendadas
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div>
                    <Button className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Preferências
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Segurança</h2>
                
                <form className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium dark:text-dark-text text-light-text mb-1">
                      Senha Atual
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="w-full p-2 rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium dark:text-dark-text text-light-text mb-1">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="w-full p-2 rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium dark:text-dark-text text-light-text mb-1">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="w-full p-2 rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <Button className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Atualizar Senha
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === 'language' && (
              <div className="p-6">
                <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Idioma</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium dark:text-dark-text text-light-text mb-1">
                      Selecione o Idioma
                    </label>
                    <select
                      id="language"
                      defaultValue="pt-BR"
                      className="w-full p-2 rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (United States)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  
                  <div>
                    <Button className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Preferências
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'billing' && (
              <div className="p-6">
                <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Pagamento</h2>
                
                <div className="space-y-6">
                  <div className="dark:bg-dark-bg bg-light-bg p-4 rounded-lg border dark:border-dark-border border-light-border">
                    <h3 className="text-h3 font-medium dark:text-dark-text text-light-text">Plano Atual</h3>
                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold dark:text-primary text-primary">Profissional</p>
                        <p className="text-sm dark:text-dark-text/70 text-light-text/70">
                          R$ 99,90/mês
                        </p>
                      </div>
                      <Button variant="outline">
                        Alterar Plano
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-h3 font-medium dark:text-dark-text text-light-text mb-2">Método de Pagamento</h3>
                    <div className="dark:bg-dark-bg bg-light-bg p-4 rounded-lg border dark:border-dark-border border-light-border flex justify-between items-center">
                      <div className="flex items-center">
                        <CreditCard className="w-6 h-6 mr-3 dark:text-dark-text/70 text-light-text/70" />
                        <div>
                          <p className="font-medium dark:text-dark-text text-light-text">Visa terminando em 4242</p>
                          <p className="text-sm dark:text-dark-text/70 text-light-text/70">
                            Expira em 12/2025
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                    <Button className="mt-4">
                      Adicionar Novo Método
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="text-h3 font-medium dark:text-dark-text text-light-text mb-2">Histórico de Faturas</h3>
                    <div className="dark:bg-dark-bg bg-light-bg rounded-lg border dark:border-dark-border border-light-border overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b dark:border-dark-border border-light-border">
                            <th className="p-3 text-left text-sm font-medium dark:text-dark-text/70 text-light-text/70">Data</th>
                            <th className="p-3 text-left text-sm font-medium dark:text-dark-text/70 text-light-text/70">Valor</th>
                            <th className="p-3 text-left text-sm font-medium dark:text-dark-text/70 text-light-text/70">Status</th>
                            <th className="p-3 text-left text-sm font-medium dark:text-dark-text/70 text-light-text/70">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b dark:border-dark-border border-light-border">
                            <td className="p-3 text-sm dark:text-dark-text text-light-text">01/06/2023</td>
                            <td className="p-3 text-sm dark:text-dark-text text-light-text">R$ 99,90</td>
                            <td className="p-3">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Pago</span>
                            </td>
                            <td className="p-3 text-sm dark:text-dark-text text-light-text">
                              <button className="text-primary hover:underline">Ver Fatura</button>
                            </td>
                          </tr>
                          <tr className="border-b dark:border-dark-border border-light-border">
                            <td className="p-3 text-sm dark:text-dark-text text-light-text">01/05/2023</td>
                            <td className="p-3 text-sm dark:text-dark-text text-light-text">R$ 99,90</td>
                            <td className="p-3">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Pago</span>
                            </td>
                            <td className="p-3 text-sm dark:text-dark-text text-light-text">
                              <button className="text-primary hover:underline">Ver Fatura</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 text-sm dark:text-dark-text text-light-text">01/04/2023</td>
                            <td className="p-3 text-sm dark:text-dark-text text-light-text">R$ 99,90</td>
                            <td className="p-3">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Pago</span>
                            </td>
                            <td className="p-3 text-sm dark:text-dark-text text-light-text">
                              <button className="text-primary hover:underline">Ver Fatura</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}