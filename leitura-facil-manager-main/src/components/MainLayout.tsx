
import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import Books from './Books';
import Users from './Users';
import Loans from './Loans';
import MemberLoans from './MemberLoans';

const MainLayout = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { currentUser, canManageUsers, canManageBooks, canManageAllLoans } = useLibrary();

  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard': return 'Dashboard';
      case 'books': return 'Livros';
      case 'users': return 'Usuários';
      case 'loans': return 'Empréstimos';
      case 'my-loans': return 'Meus Empréstimos';
      default: return 'Dashboard';
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard': 
        return <Dashboard />;
      case 'books': 
        return <Books />;
      case 'users': 
        return canManageUsers() ? <Users /> : <div className="p-6"><p>Acesso negado</p></div>;
      case 'loans': 
        return canManageAllLoans() ? <Loans /> : <div className="p-6"><p>Acesso negado</p></div>;
      case 'my-loans':
        return <MemberLoans />;
      default: 
        return <Dashboard />;
    }
  };

  // Determine available pages based on user type
  const getAvailablePages = () => {
    const pages = ['dashboard'];
    
    if (canManageBooks()) {
      pages.push('books');
    }
    
    if (canManageUsers()) {
      pages.push('users');
    }
    
    if (canManageAllLoans()) {
      pages.push('loans');
    }
    
    if (currentUser?.type === 'member') {
      pages.push('books', 'my-loans');
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        availablePages={getAvailablePages()}
      />
      
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle(currentPage)} />
        <main className="flex-1 overflow-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
