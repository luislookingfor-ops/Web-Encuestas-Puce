import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InterviewForm from './pages/InterviewForm';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import QuestionManager from './pages/QuestionManager';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => (
  <div className="min-h-screen flex items-center justify-center p-4 px-6">
    <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(30,27,75,0.2)] max-w-lg w-full text-center border border-white/40 animate-in">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/10 text-green-600 rounded-full mb-10 border-4 border-green-500/5">
        <CheckCircle size={48} strokeWidth={2.5} />
      </div>
      <h1 className="text-5xl font-black text-blue-950 uppercase tracking-tighter mb-6 leading-none">
        ¡Registro Completo!
      </h1>
      <p className="text-blue-900/60 font-bold uppercase tracking-widest text-[10px] mb-12 px-4 shadow-sm py-2 bg-blue-900/5 rounded-full inline-block">
        Tu entrevista ha sido guardada con éxito
      </p>
      <p className="text-gray-600 font-medium mb-12 leading-relaxed text-lg">
        GRACIAS POR TU AYUDA!
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl transition transform active:scale-95 flex items-center justify-center space-x-3"
      >
        <span>Nueva Entrevista</span>
      </button>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<InterviewForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<QuestionManager />} />
          <Route path="/admin/interviews/:id/edit" element={<InterviewForm isAdmin={true} />} />
          <Route path="/thanks" element={<SuccessPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
