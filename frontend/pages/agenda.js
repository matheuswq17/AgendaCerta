import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Video, Download, Plus } from 'lucide-react';
import NewSessionModal from '../components/modals/NewSessionModal';
import { BRAND_NAME } from '../lib/brand';
import ScheduleSessionModal from '../components/modals/ScheduleSessionModal';

// Definições de constantes para status e modos
const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
  PAUSED: 'paused'
};

const APPOINTMENT_MODE = {
  ONLINE: 'online',
  IN_PERSON: 'in_person'
};

// Componente principal da Agenda
export default function Agenda() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('week');
  const [filters, setFilters] = useState({
    mode: 'all',
    patient: 'all',
    status: 'all'
  });

  // Horários de trabalho
  const workHours = Array.from({ length: 12 }, (_, i) => i + 8); // 8h às 20h

  // Dias da semana
  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  // Função para formatar data
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
  };

  // Função para obter as datas da semana atual
  const getWeekDays = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para começar na segunda-feira
    const monday = new Date(new Date(date).setDate(diff));
    
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
  };

  // Função para navegar entre semanas
  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeek(newDate);
  };

  // Função para verificar se um horário tem agendamento
  const getAppointmentForSlot = (date, hour) => {
    const slotDate = new Date(date);
    slotDate.setHours(hour, 0, 0, 0);
    
    return appointments.find(app => {
      const appDate = new Date(app.startTime);
      return appDate.getDate() === slotDate.getDate() && 
             appDate.getMonth() === slotDate.getMonth() && 
             appDate.getFullYear() === slotDate.getFullYear() && 
             appDate.getHours() === slotDate.getHours();
    });
  };

  // Função para abrir modal de agendamento
  const handleSlotClick = (date, hour) => {
    const appointment = getAppointmentForSlot(date, hour);
    
    if (appointment) {
      setSelectedAppointment(appointment);
      setShowEditModal(true);
    } else {
      const slotDate = new Date(date);
      slotDate.setHours(hour, 0, 0, 0);
      setSelectedSlot(slotDate);
      setShowAddModal(true);
    }
  };

  // Função para fechar modais
  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedSlot(null);
    setSelectedAppointment(null);
  };
  
  // Dados de exemplo para desenvolvimento
  useEffect(() => {
    // Simular carregamento de dados
    const mockAppointments = [
      {
        id: 1,
        patientName: 'Maria Silva',
        startTime: new Date(2023, 5, 6, 9, 0),
        endTime: new Date(2023, 5, 6, 10, 0),
        status: APPOINTMENT_STATUS.CONFIRMED,
        mode: APPOINTMENT_MODE.ONLINE
      },
      {
        id: 2,
        patientName: 'João Santos',
        startTime: new Date(2023, 5, 6, 14, 0),
        endTime: new Date(2023, 5, 6, 15, 0),
        status: APPOINTMENT_STATUS.SCHEDULED,
        mode: APPOINTMENT_MODE.IN_PERSON
      },
      {
        id: 3,
        patientName: 'Ana Oliveira',
        startTime: new Date(2023, 5, 7, 10, 0),
        endTime: new Date(2023, 5, 7, 11, 0),
        status: APPOINTMENT_STATUS.CANCELLED,
        mode: APPOINTMENT_MODE.ONLINE
      }
    ];
    
    setAppointments(mockAppointments);
    setIsLoading(false);
  }, []);

  // Função para renderizar o status do agendamento
  const renderStatusBadge = (status) => {
    const statusClasses = {
      [APPOINTMENT_STATUS.SCHEDULED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      [APPOINTMENT_STATUS.CONFIRMED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [APPOINTMENT_STATUS.CANCELLED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      [APPOINTMENT_STATUS.NO_SHOW]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      [APPOINTMENT_STATUS.PAUSED]: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
    };
    
    const statusLabels = {
      [APPOINTMENT_STATUS.SCHEDULED]: 'Agendado',
      [APPOINTMENT_STATUS.CONFIRMED]: 'Confirmado',
      [APPOINTMENT_STATUS.CANCELLED]: 'Cancelado',
      [APPOINTMENT_STATUS.NO_SHOW]: 'Não Compareceu',
      [APPOINTMENT_STATUS.PAUSED]: 'Pausado'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  // Função para renderizar o modo do agendamento
  const renderModeIcon = (mode) => {
    return mode === APPOINTMENT_MODE.ONLINE ? (
      <Video className="h-4 w-4 text-blue-500" />
    ) : (
      <MapPin className="h-4 w-4 text-amber-500" />
    );
  };

  // Renderização do componente
  return (
    <DashboardLayout>
      <Head>
        <title>{`Agenda | ${BRAND_NAME}`}</title>
      </Head>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Agenda</h1>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="secondary"
              className="flex items-center"
              onClick={() => {}}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar .ics
            </Button>
            
            <Button 
              variant="primary"
              className="flex items-center"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Sessão
            </Button>
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <button 
              className={`px-4 py-2 rounded-full text-sm ${viewMode === 'week' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
              onClick={() => setViewMode('week')}
            >
              Semana
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm ${viewMode === 'month' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}
              onClick={() => setViewMode('month')}
            >
              Mês
            </button>
          </div>
          
          <button 
            className={`px-4 py-2 rounded-full text-sm ${filters.mode === 'online' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            onClick={() => setFilters({...filters, mode: filters.mode === 'online' ? 'all' : 'online'})}
          >
            <Video className="inline mr-1 h-4 w-4" />
            Online
          </button>
          
          <button 
            className={`px-4 py-2 rounded-full text-sm ${filters.mode === 'in_person' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            onClick={() => setFilters({...filters, mode: filters.mode === 'in_person' ? 'all' : 'in_person'})}
          >
            <MapPin className="inline mr-1 h-4 w-4" />
            Presencial
          </button>
          
          <button 
            className={`px-4 py-2 rounded-full text-sm ${filters.status === 'today' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            onClick={() => setFilters({...filters, status: filters.status === 'today' ? 'all' : 'today'})}
          >
            Hoje
          </button>
        </div>
        
        {/* Navegação da semana */}
        <div className="flex justify-between items-center mb-6">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => navigateWeek(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            <span className="text-lg font-medium">
              {formatDate(getWeekDays(currentWeek)[0])} - {formatDate(getWeekDays(currentWeek)[5])}
            </span>
          </div>
          
          <button 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => navigateWeek(1)}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* Visualização da semana */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calendar className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Sem sessões esta semana</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Configure sua disponibilidade para começar.</p>
            <Button variant="primary" onClick={() => {}}>Configurar disponibilidade</Button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {/* Cabeçalho dos dias da semana */}
            <div className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700">
              {getWeekDays(currentWeek).map((date, index) => (
                <div key={index} className="p-4 text-center font-medium">
                  <div className="text-gray-500 dark:text-gray-400">{weekDays[index]}</div>
                  <div className="text-lg">{formatDate(date)}</div>
                </div>
              ))}
            </div>
            
            {/* Grade de horários */}
            <div className="relative">
              {/* Linhas de horários */}
              {workHours.map((hour) => (
                <div key={hour} className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700">
                  {getWeekDays(currentWeek).map((date, dayIndex) => {
                    const appointment = getAppointmentForSlot(date, hour);
                    
                    return (
                      <div 
                        key={`${dayIndex}-${hour}`} 
                        className={`p-2 min-h-[100px] border-r border-gray-200 dark:border-gray-700 ${
                          appointment ? 'cursor-pointer' : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
                        }`}
                        onClick={() => handleSlotClick(date, hour)}
                      >
                        {!appointment && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {hour}:00
                          </div>
                        )}
                        
                        {appointment && (
                          <div className="h-full p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-500">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">{appointment.patientName}</div>
                              {renderModeIcon(appointment.mode)}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(appointment.startTime).getHours()}:00 - {new Date(appointment.endTime).getHours()}:00
                            </div>
                            <div>
                              {renderStatusBadge(appointment.status)}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Modais seriam implementados aqui */}
    </DashboardLayout>
  );

}