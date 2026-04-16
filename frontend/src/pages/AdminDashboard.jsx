import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, User, Calendar, MapPin, Filter, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/interviews`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setInterviews(response.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      // Mock data for demo
      setInterviews([
        { id: 1, interviewee_name: 'Juan Perez', current_role: 'Gerente', organization: 'ABC S.A.', date: '2024-04-02', location: 'Lima' },
        { id: 2, interviewee_name: 'Maria Garcia', current_role: 'Dueña de Negocio', organization: 'Tienda Maria', date: '2024-04-01', location: 'Cusco' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/interviews/${id}/pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `entrevista_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Intentar leer el mensaje de error si la respuesta es un Blob (común con responseType: 'blob')
      if (error.response && error.response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            alert(`Error al generar el PDF: ${errorData.message || errorData.error || 'Error desconocido'}`);
          } catch (e) {
            alert('Error al generar el PDF (500). Por favor, revisa los logs del servidor.');
          }
        };
        reader.readAsText(error.response.data);
      } else {
        alert('Error al generar el PDF. Por favor, intenta de nuevo.');
      }
    }
  };

  const deleteInterview = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta entrevista? Esta acción no se puede deshacer.')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/interviews/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setInterviews(interviews.filter(interview => interview.id !== id));
      } catch (error) {
        console.error('Error deleting interview:', error);
        alert('Error al eliminar la entrevista.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white/20 backdrop-blur-md border-r border-white/20 text-blue-950">
        <div className="p-6">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Panel Admin</h1>
          <p className="text-blue-300 text-xs font-bold mt-1">Encuestas v1.0</p>
        </div>
        <nav className="mt-6 flex flex-col space-y-1">
          <button className="flex items-center px-6 py-4 bg-blue-800 border-l-4 border-yellow-400 font-bold uppercase text-xs tracking-widest">
            <User size={18} className="mr-3" /> Entrevistas
          </button>
          <button
            onClick={() => navigate('/admin/questions')}
            className="flex items-center px-6 py-4 hover:bg-blue-800 border-l-4 border-transparent hover:border-yellow-400 font-bold uppercase text-xs tracking-widest transition"
          >
            <Filter size={18} className="mr-3" /> Preguntas
          </button>
          <button
            onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
            className="flex items-center px-6 py-4 hover:bg-red-800 text-red-300 font-bold uppercase text-xs tracking-widest transition mt-auto"
          >
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Registro de Entrevistas</h2>
            <p className="text-gray-500 font-medium">Visualización y descarga de informes PDF</p>
          </div>
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm border">
            <Calendar size={20} className="text-blue-600" />
            <span className="text-sm font-bold text-gray-700">{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center p-20">Cargando datos...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest">
                  <th className="p-5">Entrevistado</th>
                  <th className="p-5">Organización</th>
                  <th className="p-5">Fecha / Lugar</th>
                  <th className="p-5 text-right whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {interviews.map(interview => (
                  <tr key={interview.id} className="hover:bg-blue-50 transition group">
                    <td className="p-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-600 group-hover:text-white transition">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{interview.interviewee_name}</p>
                          <p className="text-xs text-gray-500 font-medium">{interview.current_role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase">
                        {interview.organization || 'Sin Org.'}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-700 flex items-center">
                          <Calendar size={12} className="mr-1" /> {interview.date}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center">
                          <MapPin size={10} className="mr-1" /> {interview.location}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/admin/interviews/${interview.id}/edit`)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-sm transition active:scale-95 mr-2"
                      >
                        <Edit2 size={16} className="mr-2" /> Editar
                      </button>
                      <button
                        onClick={() => downloadPDF(interview.id)}
                        className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-black uppercase tracking-widest rounded-lg shadow-sm transition active:scale-95 mr-2"
                      >
                        <Download size={16} className="mr-2" /> PDF
                      </button>
                      <button
                        onClick={() => deleteInterview(interview.id)}
                        className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-sm transition active:scale-95"
                      >
                        <Trash2 size={16} className="mr-2" /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {interviews.length === 0 && (
              <div className="p-20 text-center text-gray-400 italic">No hay entrevistas registradas aún.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
