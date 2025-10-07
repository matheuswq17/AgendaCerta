import { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '../components/layout/DashboardLayout';
import { BRAND_NAME } from '../lib/brand';
import { Button } from '../components/ui/Button';
import { CreditCard, Check, Star, Download, ChevronRight } from 'lucide-react';

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState('professional');
  
  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'R$ 49,90',
      features: [
        'Até 30 pacientes',
        'Agendamento básico',
        'Lembretes por email',
        'Suporte por email'
      ]
    },
    {
      id: 'professional',
      name: 'Profissional',
      price: 'R$ 99,90',
      features: [
        'Pacientes ilimitados',
        'Agendamento avançado',
        'Lembretes por email e SMS',
        'Automações personalizadas',
        'Suporte prioritário',
        'Relatórios básicos'
      ]
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      price: 'R$ 199,90',
      features: [
        'Múltiplos profissionais',
        'Pacientes ilimitados',
        'Agendamento avançado',
        'Lembretes por email, SMS e WhatsApp',
        'Automações avançadas',
        'Suporte VIP',
        'Relatórios avançados',
        'API de integração'
      ]
    }
  ];
  
  const invoices = [
    { id: 1, date: '01/06/2023', amount: 'R$ 99,90', status: 'Pago', downloadUrl: '#' },
    { id: 2, date: '01/05/2023', amount: 'R$ 99,90', status: 'Pago', downloadUrl: '#' },
    { id: 3, date: '01/04/2023', amount: 'R$ 99,90', status: 'Pago', downloadUrl: '#' },
    { id: 4, date: '01/03/2023', amount: 'R$ 99,90', status: 'Pago', downloadUrl: '#' },
    { id: 5, date: '01/02/2023', amount: 'R$ 99,90', status: 'Pago', downloadUrl: '#' }
  ];
  
  return (
    <DashboardLayout>
      <Head>
        <title>{`Plano e Faturamento | ${BRAND_NAME}`}</title>
      </Head>
      
      <div className="p-6">
        <h1 className="text-h1 font-bold dark:text-dark-text text-light-text mb-6">Plano e Faturamento</h1>
        
        <div className="dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Seu Plano Atual</h2>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center">
                  <Star className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-h3 font-bold text-primary">Plano Profissional</h3>
                </div>
                <p className="dark:text-dark-text/70 text-light-text/70 mt-1">
                  Faturado mensalmente: <span className="font-medium">R$ 99,90/mês</span>
                </p>
                <p className="dark:text-dark-text/70 text-light-text/70 mt-1">
                  Próxima cobrança em: <span className="font-medium">01/07/2023</span>
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button variant="outline" className="mr-2">
                  Alterar Plano
                </Button>
                <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Cancelar Assinatura
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Nossos Planos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div 
                key={plan.id} 
                className={`dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden border-2 ${
                  plan.id === currentPlan 
                    ? 'border-primary' 
                    : 'dark:border-dark-border border-light-border'
                }`}
              >
                <div className="p-6">
                  <h3 className="text-h3 font-bold dark:text-dark-text text-light-text">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-2xl font-bold dark:text-dark-text text-light-text">{plan.price}</span>
                    <span className="dark:text-dark-text/70 text-light-text/70">/mês</span>
                  </div>
                  
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="dark:text-dark-text text-light-text">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6">
                    {plan.id === currentPlan ? (
                      <Button disabled className="w-full">
                        Plano Atual
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full">
                        Mudar para este Plano
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dark:bg-dark-card bg-light-card rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Método de Pagamento</h2>
            
            <div className="flex items-center mb-6">
              <div className="w-12 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center text-white font-bold">
                VISA
              </div>
              <div>
                <p className="dark:text-dark-text text-light-text font-medium">Visa terminando em 4242</p>
                <p className="dark:text-dark-text/70 text-light-text/70 text-sm">Expira em 12/2025</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Atualizar
              </Button>
            </div>
            
            <h2 className="text-h2 font-bold dark:text-dark-text text-light-text mb-4">Histórico de Faturas</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-dark-border border-light-border">
                    <th className="py-3 px-4 text-left text-sm font-medium dark:text-dark-text/70 text-light-text/70">Data</th>
                    <th className="py-3 px-4 text-left text-sm font-medium dark:text-dark-text/70 text-light-text/70">Valor</th>
                    <th className="py-3 px-4 text-left text-sm font-medium dark:text-dark-text/70 text-light-text/70">Status</th>
                    <th className="py-3 px-4 text-right text-sm font-medium dark:text-dark-text/70 text-light-text/70">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(invoice => (
                    <tr key={invoice.id} className="border-b dark:border-dark-border border-light-border">
                      <td className="py-3 px-4 text-sm dark:text-dark-text text-light-text">{invoice.date}</td>
                      <td className="py-3 px-4 text-sm dark:text-dark-text text-light-text">{invoice.amount}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a 
                          href={invoice.downloadUrl} 
                          className="inline-flex items-center text-primary hover:underline text-sm"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Baixar
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-right">
              <Button variant="outline" className="inline-flex items-center">
                Ver Todas as Faturas
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}