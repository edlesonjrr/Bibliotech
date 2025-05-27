
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  coverUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'admin' | 'librarian' | 'member';
  registrationDate: Date;
  isActive: boolean;
}

export interface Loan {
  id: string;
  bookId: string;
  userId: string;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'returned' | 'overdue';
  notes?: string;
}

export interface LibraryStats {
  totalBooks: number;
  totalUsers: number;
  activeLoans: number;
  overdueLoans: number;
  booksPerCategory: { [key: string]: number };
  usersByType: { [key: string]: number };
}
