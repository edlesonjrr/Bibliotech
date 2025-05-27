
import React, { useState } from 'react';
import { Search, BookOpen, Calendar, User, ArrowLeft } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Loans: React.FC = () => {
  const { loans, books, users, createLoan, returnBook } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewLoanForm, setShowNewLoanForm] = useState(false);
  const [newLoan, setNewLoan] = useState({
    bookId: '',
    userId: ''
  });

  const filteredLoans = loans
    .filter(loan => {
      const book = books.find(b => b.id === loan.bookId);
      const user = users.find(u => u.id === loan.userId);
      const matchesSearch = book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime());

  const availableBooks = books.filter(book => book.availableCopies > 0);
  const activeUsers = users.filter(user => user.isActive);

  const handleNewLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLoan.bookId && newLoan.userId) {
      const success = createLoan(newLoan.bookId, newLoan.userId);
      if (success) {
        setNewLoan({ bookId: '', userId: '' });
        setShowNewLoanForm(false);
      } else {
        alert('Não foi possível criar o empréstimo. Verifique se o livro está disponível.');
      }
    }
  };

  const handleReturn = (loanId: string) => {
    if (confirm('Confirmar devolução do livro?')) {
      returnBook(loanId);
    }
  };

  const getStatusColor = (status: string, dueDate: Date) => {
    if (status === 'returned') return 'bg-green-100 text-green-800';
    if (status === 'active' && new Date() > dueDate) return 'bg-red-100 text-red-800';
    if (status === 'active') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string, dueDate: Date) => {
    if (status === 'returned') return 'Devolvido';
    if (status === 'active' && new Date() > dueDate) return 'Em atraso';
    if (status === 'active') return 'Ativo';
    return status;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Empréstimos</h2>
          <p className="text-gray-600">Controle empréstimos e devoluções</p>
        </div>
        <Button onClick={() => setShowNewLoanForm(true)} className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Novo Empréstimo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por livro ou usuário..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="returned">Devolvidos</SelectItem>
            <SelectItem value="overdue">Em atraso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* New Loan Form */}
      {showNewLoanForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewLoanForm(false)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle>Novo Empréstimo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNewLoan} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={newLoan.bookId}
                onValueChange={(value) => setNewLoan({...newLoan, bookId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar livro" />
                </SelectTrigger>
                <SelectContent>
                  {availableBooks.map(book => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title} - {book.author} ({book.availableCopies} disponível)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={newLoan.userId}
                onValueChange={(value) => setNewLoan({...newLoan, userId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar usuário" />
                </SelectTrigger>
                <SelectContent>
                  {activeUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" disabled={!newLoan.bookId || !newLoan.userId}>
                  Criar Empréstimo
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowNewLoanForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Loans List */}
      <div className="space-y-4">
        {filteredLoans.map((loan) => {
          const book = books.find(b => b.id === loan.bookId);
          const user = users.find(u => u.id === loan.userId);
          const isOverdue = loan.status === 'active' && new Date() > loan.dueDate;

          return (
            <Card key={loan.id} className={`hover:shadow-lg transition-shadow ${isOverdue ? 'border-red-200' : ''}`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  {/* Book Info */}
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-900">{book?.title}</h3>
                    <p className="text-sm text-gray-600">{book?.author}</p>
                    <p className="text-xs text-gray-500">ISBN: {book?.isbn}</p>
                  </div>

                  {/* User Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{user?.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>

                  {/* Dates */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {loan.loanDate.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      Vence: {loan.dueDate.toLocaleDateString('pt-BR')}
                    </p>
                    {loan.returnDate && (
                      <p className="text-sm text-green-600">
                        Devolvido: {loan.returnDate.toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex justify-center">
                    <Badge className={getStatusColor(loan.status, loan.dueDate)}>
                      {getStatusLabel(loan.status, loan.dueDate)}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    {loan.status === 'active' && (
                      <Button
                        size="sm"
                        onClick={() => handleReturn(loan.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Devolver
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredLoans.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchQuery || statusFilter !== 'all' 
              ? 'Nenhum empréstimo encontrado para os filtros aplicados.' 
              : 'Nenhum empréstimo registrado.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Loans;
