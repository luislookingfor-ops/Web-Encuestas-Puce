import React from 'react';

const QuestionRow = ({ index, questionText, literalResponse, learningInsight, onUpdate, isAdmin = false }) => {
  return (
    <div className="glass-card rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/5 group border-white/40">
      <div className="bg-gradient-to-r from-gray-50/50 to-transparent p-8 border-b border-black/5">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-[2px] bg-[#00B6D9] rounded-full"></div>
          <span className="text-[10px] font-black text-[#00B6D9] uppercase tracking-[0.3em]">Pregunta {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="text-2xl font-black text-[#1e1b4b] leading-tight tracking-tight">{questionText}</h3>
      </div>

      <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-2 divide-y md:divide-y-0 md:divide-x' : ''} divide-black/5`}>
        <div className="p-8 space-y-4">
          <label className="block text-[10px] font-black text-blue-900/40 uppercase tracking-widest ml-1">Respuesta Literal</label>
          <textarea
            value={literalResponse}
            onChange={(e) => onUpdate(index, 'literal_response', e.target.value)}
            className="w-full text-base font-bold bg-white/30 glass-morphism p-6 rounded-2xl border-none focus:ring-4 ring-[#00B6D9]/10 outline-none transition-all min-h-[160px] text-[#1e1b4b] placeholder:text-gray-200"
            placeholder="Escribe aquí la respuesta exacta..."
          />
        </div>

        {isAdmin && (
          <div className="p-8 space-y-4 bg-[#00B6D9]/5">
            <label className="block text-[10px] font-black text-[#00B6D9] uppercase tracking-widest ml-1">Aprendizaje / Insight Docente</label>
            <textarea
              value={learningInsight}
              onChange={(e) => onUpdate(index, 'learning_insight', e.target.value)}
              className="w-full text-base font-bold bg-white/40 glass-morphism p-6 rounded-2xl border-none focus:ring-4 ring-[#00B6D9]/10 outline-none transition-all min-h-[160px] text-[#1e1b4b] placeholder:text-cyan-900/10"
              placeholder="¿Qué descubrimos con esta respuesta?"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionRow;
