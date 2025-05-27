
import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, Calendar, RotateCcw, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const MemberLoans: React.FC = () => {
  const { 
    currentUser, 
    loans, 
    books, 
    getUserLoans, 
    returnBook, 
    createLoan, 
    searchBooks 
  } = useLibrary();
  const { toast } = useToast();
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) {
    return <div className="p-6">Usuário não encontrado</div>;
  }

  const userLoans = getUserLoans(currentUser.id);
  const activeLoans = userLoans.filter(loan => loan.status === 'active');
  const loanHistory = userLoans.filter(loan => loan.status === 'returned');

  const handleReturnBook = (loanId: string) => {
    returnBook(loanId);
    toast({
      title: "Livro devolvido com sucesso!",
      description: "O livro foi devolvido e está disponível novamente.",
    });
  };

  const handleNewLoan = (bookId: string) => {
    if (createLoan(bookId, currentUser.id)) {
      toast({
        title: "Empréstimo realizado!",
        description: "O livro foi emprestado com sucesso.",
      });
      setIsNewLoanOpen(false);
      setSearchQuery('');
    } else {
      toast({
        title: "Erro ao emprestar livro",
        description: "Livro não disponível ou sem estoque.",
        variant: "destructive",
      });
    }
  };

  const availableBooks = searchQuery 
    ? searchBooks(searchQuery).filter(book => book.availableCopies > 0)
    : books.filter(book => book.availableCopies > 0);

  const getBookInfo = (bookId: string) => {
    return books.find(book => book.id === bookId);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const isOverdue = (dueDate: Date) => {
    return new Date() > new Date(dueDate);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Empréstimos</h1>
          <p className="text-gray-600">Gerencie seus livros emprestados</p>
        </div>
        
        <Dialog open={isNewLoanOpen} onOpenChange={setIsNewLoanOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Empréstimo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Fazer Novo Empréstimo</DialogTitle>
              <DialogDescription>
                Busque e selecione um livro disponível para empréstimo
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Buscar Livro</Label>
                <Input
                  id="search"
                  placeholder="Digite o título, autor ou ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {availableBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{book.title}</h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <p className="text-xs text-gray-500">
                        Disponíveis: {book.availableCopies} de {book.totalCopies}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleNewLoan(book.id)}
                    >
                      Emprestar
                    </Button>
                  </div>
                ))}
                {availableBooks.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    {searchQuery ? 'Nenhum livro encontrado' : 'Nenhum livro disponível'}
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Loans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Empréstimos Ativos ({activeLoans.length})
          </CardTitle>
          <CardDescription>Livros que você tem emprestados atualmente</CardDescription>
        </CardHeader>
        <CardContent>
          {activeLoans.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Você não tem empréstimos ativos no momento
            </p>
          ) : (
            <div className="space-y-4">
              {activeLoans.map((loan) => {
                const book = getBookInfo(loan.bookId);
                const overdue = isOverdue(loan.dueDate);
                
                return (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{book?.title}</h3>
                      <p className="text-sm text-gray-600">{book?.author}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          Emprestado em: {formatDate(loan.loanDate)}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          <span className={overdue ? 'text-red-600' : 'text-gray-500'}>
                            Vence em: {formatDate(loan.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {overdue && (
                        <Badge variant="destructive">Atrasado</Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReturnBook(loan.id)}
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Devolver
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loan History */}
      {loanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Empréstimos</CardTitle>
            <CardDescription>Livros que você já devolveu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loanHistory.slice(0, 5).map((loan) => {
                const book = getBookInfo(loan.bookId);
                
                return (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                  >
                    <div>
                      <h4 className="font-medium">{book?.title}</h4>
                      <p className="text-sm text-gray-600">{book?.author}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Devolvido em: {loan.returnDate && formatDate(loan.returnDate)}</p>
                      <Badge variant="secondary">Concluído</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MemberLoans;
