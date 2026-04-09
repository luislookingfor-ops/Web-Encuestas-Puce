import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // For the simple demo, we'll just check if the credentials match a hardcoded admin
      // In a real app, this would be an API call to /api/login
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch (error) {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl transform transition hover:scale-[1.02]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tighter">Admin Panel</h1>
          <p className="text-gray-500 font-medium">Gestión de Entrevistas</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Correo Electrónico</label>
            <div className="flex items-center border-2 border-gray-100 rounded-lg focus-within:border-blue-500 transition px-3 bg-gray-50">
              <Mail size={20} className="text-gray-400 mr-2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-transparent outline-none text-gray-700 font-medium"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Contraseña</label>
            <div className="flex items-center border-2 border-gray-100 rounded-lg focus-within:border-blue-500 transition px-3 bg-gray-50">
              <Lock size={20} className="text-gray-400 mr-2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-transparent outline-none text-gray-700 font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold uppercase tracking-widest shadow-lg transition transform active:scale-95"
          >
            Iniciar Sesión
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <button 
                onClick={() => navigate('/')}
                className="text-sm font-bold text-blue-600 hover:underline uppercase"
            >
                Volver al Formulario
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
