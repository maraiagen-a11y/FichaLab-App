import React, { useState } from 'react';
import { MOCK_RESOURCES } from '../constants';
import { EducationLevel, Resource, Subject, User, UserPlan } from '../types';
import { Search, Filter, Lock, Download, Eye } from 'lucide-react';
import { Button } from '../components/Button';

interface ResourceLibraryProps {
  user: User;
}

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'ALL'>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | 'ALL'>('ALL');

  const filteredResources = MOCK_RESOURCES.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'ALL' || resource.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'ALL' || resource.level === selectedLevel;
    return matchesSearch && matchesSubject && matchesLevel;
  });

  const handleDownload = (resource: Resource) => {
    if (resource.isPremium && user.plan === UserPlan.FREE) {
      alert("Este recurso es exclusivo para usuarios Premium. Por favor actualiza tu plan.");
      return;
    }
    alert(`Descargando: ${resource.title}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Biblioteca de Recursos</h1>
        <p className="text-slate-500 mt-1">Explora cientos de materiales educativos listos para usar.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Buscar por título o tema..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <select 
            className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as Subject | 'ALL')}
          >
            <option value="ALL">Todas las Asignaturas</option>
            {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select 
            className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as EducationLevel | 'ALL')}
          >
            <option value="ALL">Todos los Niveles</option>
            {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="h-40 bg-slate-100 rounded-t-xl relative flex items-center justify-center border-b border-slate-100">
              <span className="text-4xl">📄</span>
              {resource.isPremium && (
                <div className="absolute top-3 right-3 bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold flex items-center">
                  <Lock size={12} className="mr-1" /> PREMIUM
                </div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded uppercase tracking-wide">
                  {resource.subject}
                </span>
                <span className="text-xs text-slate-500 border border-slate-200 px-2 py-1 rounded">
                  {resource.level}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{resource.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{resource.description}</p>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">{resource.downloads} descargas</span>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors" title="Previsualizar">
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => handleDownload(resource)}
                    className={`p-2 rounded transition-colors ${
                      resource.isPremium && user.plan === UserPlan.FREE
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-brand-600 hover:bg-brand-50'
                    }`}
                    title="Descargar"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No se encontraron recursos</h3>
          <p className="text-slate-500">Intenta ajustar tus filtros de búsqueda.</p>
        </div>
      )}
    </div>
  );
};
