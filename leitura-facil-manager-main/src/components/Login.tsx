
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLibrary } from '../context/LibraryContext';
import { BookOpen, User, Users, Shield } from 'lucide-react';

interface LoginProps {
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useLibrary();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      // Login successful
    } else {
      setError('Email ou senha incorretos');
    }
  };

  const handleQuickLogin = (userEmail: string) => {
    if (login(userEmail, 'password')) {
      // Login successful
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">BiblioTech</CardTitle>
            <CardDescription>Entre em sua conta para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
            
            <div className="text-center">
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:underline text-sm"
              >
                Não tem conta? Cadastre-se aqui
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Acesso Rápido - Demo</CardTitle>
            <CardDescription>Clique em um dos botões abaixo para testar diferentes tipos de usuário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => handleQuickLogin('ana.silva@biblioteca.com')}
              className="w-full justify-start bg-red-600 hover:bg-red-700"
            >
              <Shield className="w-4 h-4 mr-2" />
              Administrador
              <span className="ml-auto text-xs">Acesso Total</span>
            </Button>
            
            <Button
              onClick={() => handleQuickLogin('carlos.santos@biblioteca.com')}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
            >
              <Users className="w-4 h-4 mr-2" />
              Bibliotecário
              <span className="ml-auto text-xs">Livros + Empréstimos</span>
            </Button>
            
            <Button
              onClick={() => handleQuickLogin('maria.oliveira@email.com')}
              className="w-full justify-start bg-green-600 hover:bg-green-700"
            >
              <User className="w-4 h-4 mr-2" />
              Membro
              <span className="ml-auto text-xs">Acesso Limitado</span>
            </Button>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              <p className="font-medium mb-1">Tipos de usuário:</p>
              <p>• <strong>Administrador:</strong> Acesso completo ao sistema</p>
              <p>• <strong>Bibliotecário:</strong> Gerencia livros e empréstimos</p>
              <p>• <strong>Membro:</strong> Consulta livros e seus empréstimos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
