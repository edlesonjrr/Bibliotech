import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, User, Loan, LibraryStats } from '../types/library';

interface LibraryContextType {
  books: Book[];
  users: User[];
  loans: Loan[];
  stats: LibraryStats;
  currentUser: User | null;
  
  // Book management
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  searchBooks: (query: string) => Book[];
  
  // User management
  addUser: (user: Omit<User, 'id' | 'registrationDate'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Loan management
  createLoan: (bookId: string, userId: string) => boolean;
  returnBook: (loanId: string) => void;
  getUserLoans: (userId: string) => Loan[];
  
  // Authentication
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Permissions
  canManageUsers: () => boolean;
  canManageBooks: () => boolean;
  canManageAllLoans: () => boolean;
  canViewAllUsers: () => boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      isbn: '9788525406958',
      category: 'Literatura',
      publishedYear: 1899,
      totalCopies: 5,
      availableCopies: 3,
      description: 'Romance clássico da literatura brasileira'
    },
    {
      id: '2',
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      category: 'Ficção',
      publishedYear: 1949,
      totalCopies: 8,
      availableCopies: 6,
      description: 'Distopia clássica sobre vigilância e totalitarismo'
    },
    {
      id: '3',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '9780132350884',
      category: 'Tecnologia',
      publishedYear: 2008,
      totalCopies: 4,
      availableCopies: 2,
      description: 'Guia para escrever código limpo e mantível'
    }
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana.silva@biblioteca.com',
      phone: '(11) 99999-9999',
      type: 'admin',
      registrationDate: new Date('2023-01-15'),
      isActive: true
    },
    {
      id: '2',
      name: 'Carlos Santos',
      email: 'carlos.santos@biblioteca.com',
      phone: '(11) 88888-8888',
      type: 'librarian',
      registrationDate: new Date('2023-02-20'),
      isActive: true
    },
    {
      id: '3',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      phone: '(11) 77777-7777',
      type: 'member',
      registrationDate: new Date('2023-03-10'),
      isActive: true
    }
  ]);

  const [loans, setLoans] = useState<Loan[]>([
    {
      id: '1',
      bookId: '1',
      userId: '3',
      loanDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      status: 'active'
    },
    {
      id: '2',
      bookId: '3',
      userId: '3',
      loanDate: new Date('2024-01-10'),
      dueDate: new Date('2024-02-10'),
      returnDate: new Date('2024-02-05'),
      status: 'returned'
    }
  ]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const calculateStats = (): LibraryStats => {
    const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
    const activeLoans = loans.filter(loan => loan.status === 'active').length;
    const overdueLoans = loans.filter(loan => 
      loan.status === 'active' && new Date() > loan.dueDate
    ).length;

    const booksPerCategory = books.reduce((acc, book) => {
      acc[book.category] = (acc[book.category] || 0) + book.totalCopies;
      return acc;
    }, {} as { [key: string]: number });

    const usersByType = users.reduce((acc, user) => {
      acc[user.type] = (acc[user.type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalBooks,
      totalUsers: users.length,
      activeLoans,
      overdueLoans,
      booksPerCategory,
      usersByType
    };
  };

  const [stats, setStats] = useState<LibraryStats>(calculateStats());

  useEffect(() => {
    setStats(calculateStats());
  }, [books, users, loans]);

  const addBook = (bookData: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString()
    };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...bookData } : book
    ));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const searchBooks = (query: string): Book[] => {
    const lowercaseQuery = query.toLowerCase();
    return books.filter(book =>
      book.title.toLowerCase().includes(lowercaseQuery) ||
      book.author.toLowerCase().includes(lowercaseQuery) ||
      book.isbn.includes(query)
    );
  };

  const addUser = (userData: Omit<User, 'id' | 'registrationDate'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      registrationDate: new Date()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const createLoan = (bookId: string, userId: string): boolean => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) {
      return false;
    }

    const newLoan: Loan = {
      id: Date.now().toString(),
      bookId,
      userId,
      loanDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'active'
    };

    setLoans(prev => [...prev, newLoan]);
    updateBook(bookId, { availableCopies: book.availableCopies - 1 });
    return true;
  };

  const returnBook = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;

    const book = books.find(b => b.id === loan.bookId);
    if (book) {
      updateBook(book.id, { availableCopies: book.availableCopies + 1 });
    }

    setLoans(prev => prev.map(l => 
      l.id === loanId 
        ? { ...l, returnDate: new Date(), status: 'returned' as const }
        : l
    ));
  };

  const getUserLoans = (userId: string): Loan[] => {
    return loans.filter(loan => loan.userId === userId);
  };

  const login = (email: string, password: string): boolean => {
    // Simulação simples de autenticação - em produção, seria verificado no backend
    const user = users.find(u => u.email === email);
    if (user && user.isActive) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const canManageUsers = (): boolean => {
    return currentUser?.type === 'admin';
  };

  const canManageBooks = (): boolean => {
    return currentUser?.type === 'admin' || currentUser?.type === 'librarian';
  };

  const canManageAllLoans = (): boolean => {
    return currentUser?.type === 'admin' || currentUser?.type === 'librarian';
  };

  const canViewAllUsers = (): boolean => {
    return currentUser?.type === 'admin' || currentUser?.type === 'librarian';
  };

  return (
    <LibraryContext.Provider value={{
      books,
      users,
      loans,
      stats,
      currentUser,
      addBook,
      updateBook,
      deleteBook,
      searchBooks,
      addUser,
      updateUser,
      deleteUser,
      createLoan,
      returnBook,
      getUserLoans,
      login,
      logout,
      canManageUsers,
      canManageBooks,
      canManageAllLoans,
      canViewAllUsers
    }}>
      {children}
    </LibraryContext.Provider>
  );
};
