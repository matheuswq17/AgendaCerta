import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { HelpCircle, Book, Video, MessageCircle, FileText } from 'lucide-react';
import { BRAND_NAME } from '../lib/brand';

export default function Help() {
  return (
    <DashboardLayout>
      <Head>
        <title>{`Ajuda | ${BRAND_NAME}`}</title>
      </Head>
      
      <div className="p-6">
        <h1 className="text-h1 font-bold dark:text-dark-text text-light-text mb-6">Central de Ajuda</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <Book className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-2">Documentação</h2>
              <p className="dark:text-dark-text/70 text-light-text/70 mb-4">
                Acesse nossa documentação completa com guias passo a passo para todas as funcionalidades.
              </p>
              <button className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                Ver Documentação
              </button>
            </div>
          </div>
          
          <div className="dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <Video className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-2">Tutoriais em Vídeo</h2>
              <p className="dark:text-dark-text/70 text-light-text/70 mb-4">
                Assista a tutoriais em vídeo para aprender a usar todas as funcionalidades do sistema.
              </p>
              <button className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                Ver Tutoriais
              </button>
            </div>
          </div>
          
          <div className="dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <MessageCircle className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-2">Suporte</h2>
              <p className="dark:text-dark-text/70 text-light-text/70 mb-4">
                Entre em contato com nossa equipe de suporte para resolver dúvidas ou problemas.
              </p>
              <button className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                Contatar Suporte
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Perguntas Frequentes</h2>
          
          <div className="dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y dark:divide-dark-border divide-light-border">
              <div className="p-4">
                <h3 className="text-h3 font-medium dark:text-dark-text text-light-text mb-2 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                  Como agendar uma nova sessão?
                </h3>
                <p className="dark:text-dark-text/70 text-light-text/70 pl-7">
                  Para agendar uma nova sessão, acesse a página "Agenda" e clique no botão "Nova Sessão" 
                  ou diretamente em um horário disponível no calendário. Preencha as informações do 
                  paciente, data, horário e outras informações relevantes.
                </p>
              </div>
              
              <div className="p-4">
                <h3 className="text-h3 font-medium dark:text-dark-text text-light-text mb-2 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                  Como adicionar um novo paciente?
                </h3>
                <p className="dark:text-dark-text/70 text-light-text/70 pl-7">
                  Para adicionar um novo paciente, acesse a página "Pacientes" e clique no botão 
                  "Adicionar Paciente". Preencha as informações do paciente como nome, contato, 
                  e outras informações relevantes.
                </p>
              </div>
              
              <div className="p-4">
                <h3 className="text-h3 font-medium dark:text-dark-text text-light-text mb-2 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                  Como configurar minha disponibilidade?
                </h3>
                <p className="dark:text-dark-text/70 text-light-text/70 pl-7">
                  Para configurar sua disponibilidade, acesse a página "Disponibilidade" e defina 
                  os horários em que você está disponível para atendimento. Você pode configurar 
                  horários diferentes para cada dia da semana.
                </p>
              </div>
              
              <div className="p-4">
                <h3 className="text-h3 font-medium dark:text-dark-text text-light-text mb-2 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                  Como enviar mensagens para pacientes?
                </h3>
                <p className="dark:text-dark-text/70 text-light-text/70 pl-7">
                  Para enviar mensagens para pacientes, acesse a página "Mensagens" e selecione o 
                  paciente para quem deseja enviar a mensagem. Digite sua mensagem e clique em enviar.
                </p>
              </div>
              
              <div className="p-4">
                <h3 className="text-h3 font-medium dark:text-dark-text text-light-text mb-2 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                  Como configurar automações?
                </h3>
                <p className="dark:text-dark-text/70 text-light-text/70 pl-7">
                  Para configurar automações, acesse a página "Automação" e clique em "Nova Automação". 
                  Defina o gatilho, a mensagem e outras configurações para automatizar o envio de 
                  mensagens para seus pacientes.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden p-6">
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-h2 font-bold dark:text-dark-text text-light-text">Recursos Adicionais</h2>
          </div>
          
          <ul className="space-y-2 pl-11">
            <li className="dark:text-dark-text text-light-text">
              <a href="#" className="text-primary hover:underline">Guia de Início Rápido</a>
            </li>
            <li className="dark:text-dark-text text-light-text">
              <a href="#" className="text-primary hover:underline">Melhores Práticas para Agendamento</a>
            </li>
            <li className="dark:text-dark-text text-light-text">
              <a href="#" className="text-primary hover:underline">Como Otimizar seu Fluxo de Trabalho</a>
            </li>
            <li className="dark:text-dark-text text-light-text">
              <a href="#" className="text-primary hover:underline">Guia de Integração com Outros Sistemas</a>
            </li>
            <li className="dark:text-dark-text text-light-text">
              <a href="#" className="text-primary hover:underline">Políticas de Privacidade e Segurança</a>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}