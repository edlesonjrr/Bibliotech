
import React from 'react';
import { Book, Users, User, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

const Dashboard: React.FC = () => {
  const { stats, books, loans, users } = useLibrary();

  const recentLoans = loans
    .filter(loan => loan.status === 'active')
    .slice(0, 5)
    .map(loan => {
      const book = books.find(b => b.id === loan.bookId);
      const user = users.find(u => u.id === loan.userId);
      return { ...loan, book, user };
    });

  const popularBooks = books
    .sort((a, b) => (b.totalCopies - b.availableCopies) - (a.totalCopies - a.availableCopies))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Livros</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% desde último mês</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Usuários Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+5% desde último mês</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Empréstimos Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeLoans}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Calendar className="w-4 h-4 text-orange-500 mr-1" />
            <span className="text-orange-600">{stats.overdueLoans} em atraso</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Taxa de Ocupação</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round((stats.activeLoans / stats.totalBooks) * 100)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-purple-600">Baseado nos empréstimos ativos</span>
          </div>
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Loans */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Empréstimos Recentes</h3>
          <div className="space-y-4">
            {recentLoans.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{loan.book?.title}</p>
                  <p className="text-sm text-gray-600">{loan.user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Vence: {loan.dueDate.toLocaleDateString('pt-BR')}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    new Date() > loan.dueDate 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {new Date() > loan.dueDate ? 'Em atraso' : 'No prazo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Books */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Livros Mais Emprestados</h3>
          <div className="space-y-4">
            {popularBooks.map((book, index) => (
              <div key={book.id} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{book.title}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {book.totalCopies - book.availableCopies} empréstimos
                  </p>
                  <p className="text-xs text-gray-600">
                    {book.availableCopies} disponíveis
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Livros por Categoria</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.booksPerCategory).map(([category, count]) => (
            <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600">{category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
