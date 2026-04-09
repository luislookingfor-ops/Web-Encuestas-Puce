import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, Save, X, GripVertical, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newQuestion.trim()) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/questions`, {
        question_text: newQuestion,
        sort_order: questions.length
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setQuestions([...questions, response.data]);
      setNewQuestion('');
    } catch (error) {
      alert('Error al añadir pregunta');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/questions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/questions/${id}`, {
        question_text: editText
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setQuestions(questions.map(q => q.id === id ? response.data : q));
      setEditingId(null);
    } catch (error) {
      alert('Error al actualizar');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <button 
                onClick={() => navigate('/admin')}
                className="flex items-center text-blue-600 font-bold text-xs uppercase mb-2 hover:underline"
            >
                <ArrowLeft size={14} className="mr-1" /> Volver al Dashboard
            </button>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Gestión de Preguntas</h1>
            <p className="text-gray-500 font-medium italic">Configuración dinámica del formulario</p>
          </div>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="flex-1 p-4 border-2 border-gray-100 rounded-lg focus:border-blue-500 outline-none font-medium transition"
              placeholder="Escriba una nueva pregunta..."
            />
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-lg font-bold uppercase tracking-widest shadow-lg transition active:scale-95 flex items-center"
            >
              <Plus size={20} className="mr-2" /> Añadir
            </button>
          </div>
        </section>

        {loading ? (
          <div className="text-center py-10">Cargando preguntas...</div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition">
                <div className="text-gray-300 cursor-grab">
                  <GripVertical size={20} />
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  {editingId === q.id ? (
                    <input
                      type="text"
                      className="w-full p-2 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{q.question_text}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {editingId === q.id ? (
                    <>
                      <button onClick={() => handleUpdate(q.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"><Save size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition"><X size={18} /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setEditingId(q.id); setEditText(q.question_text); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-100"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(q.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100"><Trash2 size={18} /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <div className="text-center py-20 bg-white border border-dashed rounded-xl text-gray-400 italic">No hay preguntas configuradas.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionManager;
