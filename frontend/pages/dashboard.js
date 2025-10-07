import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Video, Download, Plus, Users, CreditCard, MessageSquare, Settings } from 'lucide-react';

// Componente principal do Dashboard
export default function Dashboard() {
  // Estatísticas para o dashboard
  const stats = [
    { id: 1, title: 'Taxa de Confirmação', value: '85%', description: 'Últimos 7 dias', trend: 5, icon: <Users className="h-5 w-5" /> },
    { id: 2, title: 'Taxa de Comparecimento', value: '92%', description: 'Últimos 7 dias', trend: 3, icon: <Calendar className="h-5 w-5" /> },
    { id: 3, title: 'Faltas Evitadas', value: '12', description: 'Últimos 30 dias', trend: 8, icon: <Clock className="h-5 w-5" /> },
    { id: 4, title: 'Slots Recuperados', value: '8', description: 'Últimos 30 dias', trend: 15, icon: <MessageSquare className="h-5 w-5" /> },
  ];

  const nextSessions = [
    {
      id: 1,
      patient: { name: 'Ana Silva' },
      date: 'Hoje',
      time: '14:00',
      mode: 'Online',
      status: 'confirmed',
    },
    {
      id: 2,
      patient: { name: 'Carlos Oliveira' },
      date: 'Amanhã',
      time: '10:00',
      mode: 'Presencial',
      status: 'scheduled',
    },
    {
      id: 3,
      patient: { name: 'Mariana Costa' },
      date: 'Quarta, 15/10',
      time: '16:30',
      mode: 'Online',
      status: 'scheduled',
    },
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: '3 pacientes pausaram as sessões nos últimos 15 dias',
    },
    {
      id: 2,
      type: 'error',
      message: '2 mensagens não puderam ser entregues via WhatsApp',
    },
  ];

  // Renderiza o ícone do modo de atendimento
  const renderModeIcon = (mode) => {
    if (mode.toLowerCase() === 'online') {
      return <Video className="h-4 w-4 text-blue-500" />;
    }
    return <MapPin className="h-4 w-4 text-green-500" />;
  };

  return (
    <DashboardLayout currentPage="dashboard">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Visão Geral</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                    {stat.trend && (
                      <p className={`text-xs ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.trend > 0 ? '+' : ''}{stat.trend}% em relação ao mês anterior
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layout de duas colunas para próximas sessões e alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Próximas sessões */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Próximas Sessões</h2>
              <Link href="/agenda" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Ver agenda completa
              </Link>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {nextSessions.map((session) => (
                <div key={session.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {renderModeIcon(session.mode)}
                      <span className="ml-2 font-medium">{session.patient.name}</span>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      session.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.status === 'confirmed' ? 'Confirmado' : 'Agendado'}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{session.date}</span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>{session.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">Alertas</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {alert.type === 'warning' ? (
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-red-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900 dark:text-gray-100">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/patients"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Plus className="h-10 w-10 text-blue-500 mb-2" />
              <span className="text-sm font-medium">Adicionar Paciente</span>
            </Link>
            <Link
              href="/agenda"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Calendar className="h-10 w-10 text-green-500 mb-2" />
              <span className="text-sm font-medium">Agendar Sessão</span>
            </Link>
            <Link
              href="/patients"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="h-10 w-10 text-purple-500 mb-2" />
              <span className="text-sm font-medium">Importar Pacientes</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}