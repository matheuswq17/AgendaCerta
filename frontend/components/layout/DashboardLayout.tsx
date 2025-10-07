import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Clock, 
  MessageSquare, 
  Settings, 
  CreditCard, 
  HelpCircle,
  Search,
  PlusCircle,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { BRAND_NAME } from '../../lib/brand';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Agenda', path: '/agenda', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Pacientes', path: '/patients', icon: <Users className="w-5 h-5" /> },
    { name: 'Disponibilidade', path: '/availability', icon: <Clock className="w-5 h-5" /> },
    { name: 'Automação', path: '/automation', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Mensagens', path: '/messages', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Configurações', path: '/settings', icon: <Settings className="w-5 h-5" /> },
    { name: 'Plano', path: '/billing', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Ajuda', path: '/help', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen pt-10 dark:bg-dark-bg bg-light-bg">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 dark:bg-dark-card bg-light-card border-r dark:border-dark-border border-light-border shadow-md z-10">
        <div className="p-6">
          <h1 className="text-h2 font-bold dark:text-dark-text text-light-text">{BRAND_NAME}</h1>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center px-6 py-3 text-body hover:bg-primary/10 ${
                    router.pathname === item.path 
                      ? 'border-l-4 border-primary dark:text-primary text-primary font-medium' 
                      : 'dark:text-dark-text text-light-text'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="ml-64 pt-24">
        {/* Top Bar */}
        <header className="h-16 mt-8 flex items-center justify-between px-6 dark:bg-dark-card bg-light-card">
          <div className="flex items-center w-1/3">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="pl-10 pr-4 py-2 w-full rounded-full dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text border dark:border-dark-border border-light-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/agenda" className="flex items-center px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
              <PlusCircle className="w-4 h-4 mr-2" />
              <span>Nova Sessão</span>
            </Link>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full dark:bg-dark-bg bg-light-bg dark:text-dark-text text-light-text hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium">
              PS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;