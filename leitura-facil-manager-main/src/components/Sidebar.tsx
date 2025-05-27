
import React from 'react';
import { Book, Users, User, BookOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  availablePages: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onPageChange, 
  isCollapsed, 
  onToggle, 
  availablePages 
}) => {
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'books', label: 'Livros', icon: Book },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'loans', label: 'Empréstimos', icon: User },
    { id: 'my-loans', label: 'Meus Empréstimos', icon: FileText }
  ];

  // Filter menu items based on available pages
  const menuItems = allMenuItems.filter(item => availablePages.includes(item.id));

  return (
    <div className={cn(
      "bg-slate-900 text-white transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg">BiblioTech</h1>
              <p className="text-slate-400 text-sm">Sistema de Biblioteca</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {isCollapsed ? '→' : '←'}
          </div>
          {!isCollapsed && <span>Recolher</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
