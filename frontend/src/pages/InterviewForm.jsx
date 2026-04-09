import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CameraCapture from '../components/CameraCapture';
import QuestionRow from '../components/QuestionRow';
import { useNavigate, useParams } from 'react-router-dom';
import { Send, Camera, User, ClipboardList, Info, Check, ArrowRight, Layout } from 'lucide-react';
import puceLogo from '../assets/logo-puce-nuevo.png';

const InterviewForm = ({ isAdmin = false }) => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    interviewee_name: '',
    current_role: '',
    organization: '',
    client_type: '',
    validates_hypothesis: false,
    date: new Date().toISOString().split('T')[0],
    location: '',
    photo: null,
    responses: []
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchInterviewData(id);
    } else {
      fetchQuestions();
    }
  }, [id]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/questions`);
      setQuestions(response.data);
      setFormData(prev => ({
        ...prev,
        responses: response.data.map(q => ({
          question_id: q.id,
          question_text: q.question_text,
          literal_response: '',
          learning_insight: ''
        }))
      }));
    } catch (error) {
      console.error('Error fetching questions:', error);
      const fallback = [
        { id: 1, question_text: '¿Cuál es su mayor dolor en el proceso actual?' },
        { id: 2, question_text: '¿Cómo soluciona ese problema hoy en día?' }
      ];
      setQuestions(fallback);
      setFormData(prev => ({
        ...prev,
        responses: fallback.map(q => ({
          question_id: q.id,
          question_text: q.question_text,
          literal_response: '',
          learning_insight: ''
        }))
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewData = async (interviewId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/interviews/${interviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = response.data;
      setFormData({
        interviewee_name: data.interviewee_name || '',
        current_role: data.current_role || '',
        organization: data.organization || '',
        client_type: data.client_type || '',
        validates_hypothesis: !!data.validates_hypothesis,
        date: data.date || new Date().toISOString().split('T')[0],
        location: data.location || '',
        photo: data.photo_path ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${data.photo_path}` : null,
        responses: (data.responses || []).map(r => ({
          question_id: r.question_id,
          question_text: r.question?.question_text || '',
          literal_response: r.literal_response || '',
          learning_insight: r.learning_insight || ''
        }))
      });
    } catch (error) {
      console.error('Error fetching interview:', error);
      alert('Error al cargar la entrevista.');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseUpdate = (index, field, value) => {
    const newResponses = [...formData.responses];
    newResponses[index][field] = value;
    setFormData({ ...formData, responses: newResponses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.photo) {
      alert('La foto es obligatoria');
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('interviewee_name', formData.interviewee_name);
    data.append('current_role', formData.current_role);
    data.append('organization', formData.organization);
    data.append('client_type', formData.client_type);
    data.append('validates_hypothesis', formData.validates_hypothesis ? 1 : 0);
    data.append('date', formData.date);
    data.append('location', formData.location);

    if (id) {
      data.append('_method', 'PUT');
    }

    if (formData.photo && typeof formData.photo === 'string' && formData.photo.startsWith('data:image')) {
      const blob = await fetch(formData.photo).then(r => r.blob());
      data.append('photo', blob, 'capture.jpg');
    } else if (formData.photo instanceof File || formData.photo instanceof Blob) {
      data.append('photo', formData.photo);
    }

    data.append('responses', JSON.stringify(formData.responses));

    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const url = id
      ? `${apiBaseUrl}/api/interviews/${id}`
      : `${apiBaseUrl}/api/interviews`;

    try {
      await axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (id) {
        alert('Entrevista actualizada con éxito');
        navigate('/admin');
      } else {
        navigate('/thanks');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error al enviar la entrevista. Por favor verifique la conexión.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <div className="w-16 h-16 border-4 border-[#00B6D9] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#00B6D9] font-black uppercase tracking-[0.3em] text-[10px]">Configurando Entorno...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col md:flex-row">

      {/* Subtle Sidebar / Floating Logo Section */}
      <aside className="md:w-32 lg:w-48 flex-shrink-0 z-50 md:sticky md:top-0 md:h-screen flex flex-col items-center py-8">
        <div className="glass-card p-4 md:p-6 rounded-[2rem] border-white/20 transition-all hover:scale-105">
          <img src={puceLogo} alt="PUCE Logo" className="w-16 md:w-20 lg:w-24 drop-shadow-xl" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full p-4 md:p-8 lg:p-12 xl:p-24">

        <header className="mb-16 md:mb-24 animate-fade-up">
          <div className="flex items-center space-x-3 text-[#00B6D9] font-black uppercase tracking-[0.3em] text-[10px] mb-4">
            <Layout size={14} />
            <span>{isAdmin ? 'ADMIN PANEL' : 'Interfaz de Usuario'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-balance leading-none uppercase tracking-tighter">
            {id ? 'Editar Reporte Técnico' : 'Registro de Encuesta'}
          </h1>
          <p className="mt-6 text-sm md:text-md font-bold opacity-40 uppercase tracking-widest">
            {new Date().toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="max-w-5xl space-y-24 md:space-y-32">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            {/* Snapshot Section */}
            <section className="glass-card p-8 md:p-12 rounded-[3rem] space-y-10 animate-fade-up">
              <div className="flex items-center space-x-3 border-b border-black/5 dark:border-white/5 pb-6">
                <Camera className="text-[#00B6D9]" size={24} />
                <h2 className="text-xl font-black uppercase tracking-tight">Fotografía Obligatoria</h2>
              </div>
              <CameraCapture onPhotoCapture={(photo) => setFormData({ ...formData, photo })} initialPhoto={formData.photo} />
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest leading-relaxed">
                La fotografía frontal garantiza la trazabilidad y veracidad de la encuesta.
              </p>
            </section>

            {/* Profile Section */}
            <section className="glass-card p-8 md:p-12 rounded-[3rem] space-y-10 animate-fade-up [animation-delay:100ms]">
              <div className="flex items-center space-x-3 border-b border-black/5 dark:border-white/5 pb-6">
                <User className="text-indigo-500" size={24} />
                <h2 className="text-xl font-black uppercase tracking-tight">Datos Personales</h2>
              </div>
              <div className="space-y-10">
                <div className="relative group">
                  <label className="block text-[10px] font-black text-[#00B6D9] uppercase tracking-widest mb-3 ml-2">Nombre Completo</label>
                  <input
                    type="text" required
                    placeholder="Nombre del entrevistado"
                    value={formData.interviewee_name}
                    onChange={(e) => setFormData({ ...formData, interviewee_name: e.target.value })}
                    className="w-full p-5 bg-black/5 dark:bg-white/5 rounded-2xl border-none ring-1 ring-black/5 dark:ring-white/10 focus:ring-4 ring-[#00B6D9]/20 outline-none transition-all font-bold placeholder:opacity-30"
                  />
                </div>
                <div className="relative group">
                  <label className="block text-[10px] font-black text-[#00B6D9] uppercase tracking-widest mb-3 ml-2">Estudiante | Profesor |Padre de Familia</label>
                  <input
                    type="text"
                    placeholder="Estudiante"
                    value={formData.current_role}
                    onChange={(e) => setFormData({ ...formData, current_role: e.target.value })}
                    className="w-full p-5 bg-black/5 dark:bg-white/5 rounded-2xl border-none ring-1 ring-black/5 dark:ring-white/10 focus:ring-4 ring-[#00B6D9]/20 outline-none transition-all font-bold placeholder:opacity-30"
                  />
                </div>
                <div className="relative group">
                  <label className="block text-[10px] font-black text-[#00B6D9] uppercase tracking-widest mb-3 ml-2">Institución Educativa</label>
                  <input
                    type="text"
                    placeholder="Nombre de la institución"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full p-5 bg-black/5 dark:bg-white/5 rounded-2xl border-none ring-1 ring-black/5 dark:ring-white/10 focus:ring-4 ring-[#00B6D9]/20 outline-none transition-all font-bold placeholder:opacity-30"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Admin Tools */}
          {isAdmin === true && window.location.pathname.includes('/admin') && (
            <section className="glass-card p-8 md:p-16 rounded-[4rem] border-cyan-500/10 animate-fade-up [animation-delay:200ms]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Editor Administrativo</h3>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Herramientas de clasificación y validación académica</p>
                </div>
                <div className="p-4 bg-fuchsia-500/10 rounded-2xl">
                  <ClipboardList className="text-fuchsia-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <h4 className="text-[10px] font-black text-[#00B6D9] uppercase tracking-[0.2em] mb-8">Segmentación de Cliente</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {['Usuario Final', 'Pagador', 'Decisor', 'Influenciador', 'Experto'].map((type) => (
                      <label key={type} className="flex items-center space-x-4 cursor-pointer p-4 bg-black/5 dark:bg-white/5 rounded-2xl transition-all hover:bg-black/10 dark:hover:bg-white/10 group">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={(formData.client_type || '').split(', ').includes(type)}
                            onChange={(e) => {
                              const currentTypes = (formData.client_type || '').split(', ').filter(t => t !== '');
                              let newTypes = e.target.checked ? [...currentTypes, type] : currentTypes.filter(t => t !== type);
                              setFormData({ ...formData, client_type: newTypes.join(', ') });
                            }}
                            className="peer h-6 w-6 appearance-none rounded-lg border-2 border-black/10 dark:border-white/10 checked:bg-[#00B6D9] transition-all"
                          />
                          <Check className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 left-1" strokeWidth={5} />
                        </div>
                        <span className="text-[11px] font-black uppercase opacity-40 group-hover:opacity-100 transition-opacity">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-16">
                  <div>
                    <h4 className="text-[10px] font-black text-[#00B6D9] uppercase tracking-[0.2em] mb-8">Estado de Aprobación</h4>
                    <label className="flex items-center space-x-6 cursor-pointer bg-[#00B6D9]/5 p-8 rounded-[2.5rem] ring-2 ring-dashed ring-[#00B6D9]/20 hover:bg-[#00B6D9]/10 transition-all">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.validates_hypothesis}
                          onChange={(e) => setFormData({ ...formData, validates_hypothesis: e.target.checked })}
                          className="peer h-10 w-10 appearance-none rounded-2xl border-2 border-[#00B6D9]/20 bg-white dark:bg-slate-800 checked:bg-[#00B6D9] transition-all"
                        />
                        <Check className="absolute h-6 w-6 text-white opacity-0 peer-checked:opacity-100 left-2" strokeWidth={5} />
                      </div>
                      <div>
                        <span className="block text-sm font-black uppercase tracking-tight">Validado por Docente</span>
                        <span className="text-[10px] font-bold opacity-40 uppercase">Certificación oficial del proceso</span>
                      </div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#00B6D9] uppercase tracking-widest ml-1">Fecha</label>
                      <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full p-5 bg-black/5 dark:bg-white/5 rounded-2xl font-bold text-xs ring-1 ring-black/5 dark:ring-white/10" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-[#00B6D9] uppercase tracking-widest ml-1">Lugar</label>
                      <input type="text" placeholder="Ubicación" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full p-5 bg-black/5 dark:bg-white/5 rounded-2xl font-bold text-xs ring-1 ring-black/5 dark:ring-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Survey Logic */}
          <div className="space-y-16 animate-fade-up">
            <div className="flex items-center space-x-6">
              <div className="h-16 w-16 bg-[#1e1b4b] dark:bg-white text-white dark:text-[#1e1b4b] flex items-center justify-center font-black text-2xl rounded-3xl shadow-2xl">02</div>
              <div>
                <h2 className="text-sm font-black text-[#00B6D9] uppercase tracking-[0.3em] mb-1">Interacción Directa</h2>
                <p className="text-3xl font-black uppercase tracking-tighter leading-none">Preguntas</p>
              </div>
            </div>

            <div className="space-y-12">
              {formData.responses.map((resp, idx) => (
                <QuestionRow
                  key={resp.question_id}
                  index={idx}
                  questionText={resp.question_text}
                  literalResponse={resp.literal_response}
                  learningInsight={resp.learning_insight}
                  onUpdate={handleResponseUpdate}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>

          {/* Submission Footer */}
          <footer className="pt-24 border-t-2 border-dashed border-black/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-12 pb-48">
            <div className="flex items-start space-x-4 max-w-md opacity-40">
              <Info size={40} strokeWidth={2.5} className="mt-1 flex-shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Al registrar la encuesta, declaras que las respuestas son literales
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group relative flex items-center space-x-8 bg-[#1e1b4b] dark:bg-white dark:text-[#1e1b4b] text-white p-2 pr-12 rounded-full transition-all duration-700 hover:scale-105 active:scale-95 disabled:opacity-50 shadow-2xl shadow-indigo-500/20"
            >
              <div className="bg-[#00B6D9] p-6 rounded-full group-hover:bg-[#1e1b4b] dark:group-hover:bg-[#00B6D9] group-hover:text-white transition-all duration-500">
                {submitting ? <div className="h-6 w-6 border-b-2 border-white rounded-full animate-spin"></div> : <ArrowRight size={28} strokeWidth={3} />}
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter">
                {id ? 'Actualizar Encuesta' : 'Registrar Encuesta'}
              </span>
              <div className="absolute -top-4 -right-4 bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">ACCIÓN REQUERIDA</div>
            </button>
          </footer>

        </form>
      </main>

      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-transparent overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[50rem] h-[50rem] bg-cyan-400/5 dark:bg-cyan-400/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[50rem] h-[50rem] bg-indigo-400/5 dark:bg-indigo-400/10 rounded-full blur-[150px] animate-pulse [animation-delay:2s]"></div>
      </div>
    </div>
  );
};

export default InterviewForm;
