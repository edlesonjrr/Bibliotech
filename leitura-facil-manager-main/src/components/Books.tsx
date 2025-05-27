
import React, { useState } from 'react';
import { Search, Book, Edit, Trash2, BookPlus } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Books: React.FC = () => {
  const { books, addBook, updateBook, deleteBook, searchBooks } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publishedYear: new Date().getFullYear(),
    totalCopies: 1,
    availableCopies: 1,
    description: ''
  });

  const displayBooks = searchQuery ? searchBooks(searchQuery) : books;

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      publishedYear: new Date().getFullYear(),
      totalCopies: 1,
      availableCopies: 1,
      description: ''
    });
    setShowAddForm(false);
    setEditingBook(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      updateBook(editingBook, formData);
    } else {
      addBook(formData);
    }
    resetForm();
  };

  const handleEdit = (book: any) => {
    setFormData(book);
    setEditingBook(book.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
      deleteBook(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Livros</h2>
          <p className="text-gray-600">Gerencie o acervo da biblioteca</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <BookPlus className="w-4 h-4" />
          Adicionar Livro
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Buscar por título, autor ou ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBook ? 'Editar Livro' : 'Adicionar Novo Livro'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <Input
                placeholder="Autor"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                required
              />
              <Input
                placeholder="ISBN"
                value={formData.isbn}
                onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                required
              />
              <Input
                placeholder="Categoria"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
              <Input
                type="number"
                placeholder="Ano de Publicação"
                value={formData.publishedYear}
                onChange={(e) => setFormData({...formData, publishedYear: parseInt(e.target.value)})}
                required
              />
              <Input
                type="number"
                placeholder="Total de Cópias"
                min="1"
                value={formData.totalCopies}
                onChange={(e) => setFormData({...formData, totalCopies: parseInt(e.target.value)})}
                required
              />
              <div className="md:col-span-2">
                <Input
                  placeholder="Descrição (opcional)"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">
                  {editingBook ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Books List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayBooks.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <p className="text-gray-600">{book.author}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(book)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(book.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ISBN:</span>
                  <span>{book.isbn}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Categoria:</span>
                  <Badge variant="secondary">{book.category}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ano:</span>
                  <span>{book.publishedYear}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Disponíveis:</span>
                  <span className={book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}>
                    {book.availableCopies} de {book.totalCopies}
                  </span>
                </div>
                {book.description && (
                  <p className="text-sm text-gray-600 mt-2">{book.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchQuery ? 'Nenhum livro encontrado para sua busca.' : 'Nenhum livro cadastrado.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Books;
