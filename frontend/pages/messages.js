import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { MessageSquare, Send, Search, Plus, User, Clock } from 'lucide-react';
import { BRAND_NAME } from '../lib/brand';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dados de exemplo
  const mockConversations = [
    {
      id: 1,
      patient: { id: 101, name: 'Ana Silva', avatar: null },
      lastMessage: 'Olá, confirmo minha presença na consulta de amanhã.',
      lastMessageTime: '2023-06-15T14:30:00',
      unread: true
    },
    {
      id: 2,
      patient: { id: 102, name: 'Carlos Oliveira', avatar: null },
      lastMessage: 'Preciso remarcar a consulta da próxima semana.',
      lastMessageTime: '2023-06-14T10:15:00',
      unread: false
    },
    {
      id: 3,
      patient: { id: 103, name: 'Mariana Costa', avatar: null },
      lastMessage: 'Obrigada pelo atendimento de hoje!',
      lastMessageTime: '2023-06-13T18:45:00',
      unread: false
    }
  ];
  
  const mockMessages = {
    1: [
      { id: 1, sender: 'patient', content: 'Olá, doutor(a)!', timestamp: '2023-06-15T14:25:00' },
      { id: 2, sender: 'patient', content: 'Olá, confirmo minha presença na consulta de amanhã.', timestamp: '2023-06-15T14:30:00' }
    ],
    2: [
      { id: 1, sender: 'patient', content: 'Bom dia!', timestamp: '2023-06-14T10:10:00' },
      { id: 2, sender: 'therapist', content: 'Bom dia, Carlos! Como posso ajudar?', timestamp: '2023-06-14T10:12:00' },
      { id: 3, sender: 'patient', content: 'Preciso remarcar a consulta da próxima semana.', timestamp: '2023-06-14T10:15:00' }
    ],
    3: [
      { id: 1, sender: 'patient', content: 'Obrigada pelo atendimento de hoje!', timestamp: '2023-06-13T18:45:00' }
    ]
  };
  
  useEffect(() => {
    // Simulando carregamento de dados
    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
    
    // Marcar como lida
    if (conversation.unread) {
      setConversations(conversations.map(c => 
        c.id === conversation.id ? { ...c, unread: false } : c
      ));
    }
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    
    const newMsg = {
      id: messages.length + 1,
      sender: 'therapist',
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    // Adicionar mensagem à conversa atual
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    
    // Atualizar última mensagem na lista de conversas
    setConversations(conversations.map(c => 
      c.id === selectedConversation.id 
        ? { 
            ...c, 
            lastMessage: newMessage, 
            lastMessageTime: new Date().toISOString(),
            unread: false
          } 
        : c
    ));
    
    setNewMessage('');
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const filteredConversations = conversations.filter(conversation => 
    conversation.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <Head>
        <title>{`Mensagens | ${BRAND_NAME}`}</title>
      </Head>
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Lista de conversas */}
        <div className="w-1/3 border-r dark:border-dark-border border-light-border flex flex-col">
          <div className="p-4 border-b dark:border-dark-border border-light-border">
            <h1 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Mensagens</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar conversa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 rounded-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 dark:text-dark-text/50 text-light-text/50" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 text-primary mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="mt-2 text-body dark:text-dark-text text-light-text">Carregando conversas...</p>
              </div>
            ) : (
              <>
                {filteredConversations.length > 0 ? (
                  filteredConversations.map(conversation => (
                    <div 
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`p-4 border-b dark:border-dark-border border-light-border cursor-pointer hover:dark:bg-dark-bg/50 hover:bg-light-bg/50 ${
                        selectedConversation?.id === conversation.id 
                          ? 'dark:bg-dark-bg bg-light-bg' 
                          : ''
                      } ${
                        conversation.unread 
                          ? 'dark:bg-dark-bg/30 bg-light-bg/30' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full dark:bg-dark-bg/70 bg-light-bg/70 flex items-center justify-center mr-3">
                          <User className="w-5 h-5 dark:text-dark-text/70 text-light-text/70" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className={`text-body font-medium truncate ${
                              conversation.unread 
                                ? 'dark:text-dark-text text-light-text' 
                                : 'dark:text-dark-text/70 text-light-text/70'
                            }`}>
                              {conversation.patient.name}
                            </h3>
                            <span className="text-xs dark:text-dark-text/50 text-light-text/50">
                              {formatDate(conversation.lastMessageTime)}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${
                            conversation.unread 
                              ? 'dark:text-dark-text text-light-text font-medium' 
                              : 'dark:text-dark-text/50 text-light-text/50'
                          }`}>
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unread && (
                          <div className="w-2 h-2 rounded-full bg-primary ml-2"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center dark:text-dark-text/50 text-light-text/50">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">Nenhuma conversa encontrada</p>
                    {searchTerm ? (
                      <p className="mt-1">Tente outro termo de busca</p>
                    ) : (
                      <p className="mt-1">Inicie uma nova conversa com um paciente</p>
                    )}
                    <Button 
                      className="mt-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Mensagem
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Área de mensagens */}
        <div className="w-2/3 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b dark:border-dark-border border-light-border flex items-center">
                <div className="w-10 h-10 rounded-full dark:bg-dark-bg/70 bg-light-bg/70 flex items-center justify-center mr-3">
                  <User className="w-5 h-5 dark:text-dark-text/70 text-light-text/70" />
                </div>
                <div>
                  <h2 className="text-h3 font-medium dark:text-dark-text text-light-text">
                    {selectedConversation.patient.name}
                  </h2>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'therapist' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === 'therapist' 
                          ? 'dark:bg-primary/20 bg-primary/20 dark:text-dark-text text-light-text' 
                          : 'dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text'
                      }`}
                    >
                      <p>{message.content}</p>
                      <div className={`text-xs mt-1 flex items-center ${
                        message.sender === 'therapist' 
                          ? 'dark:text-dark-text/50 text-light-text/50 justify-end' 
                          : 'dark:text-dark-text/50 text-light-text/50'
                      }`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t dark:border-dark-border border-light-border">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-3 rounded-l-md dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="p-3 rounded-r-md bg-primary text-white hover:bg-primary/90 focus:outline-none"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8 dark:text-dark-text/50 text-light-text/50">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-h2 font-medium">Nenhuma conversa selecionada</h2>
                <p className="mt-2">Selecione uma conversa para visualizar as mensagens</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}