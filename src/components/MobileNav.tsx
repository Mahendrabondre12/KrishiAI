import React from 'react';
import { Home, Sprout, Sparkles, Stethoscope, MessageSquare, BookOpen, Layers } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface MobileNavProps {
  activeView: string;
  onSelectView: (view: string) => void;
  language: AppLanguage;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeView,
  onSelectView,
  language
}) => {
  const t = TRANSLATIONS[language];

  const tabs = [
    { id: 'dashboard', label: t.navHome, icon: Home },
    { id: 'advisor', label: t.navAdvisor, icon: Sparkles },
    { id: 'crop-doctor', label: t.navCropDoctor, icon: Stethoscope },
    { id: 'chat', label: t.navChat, icon: MessageSquare },
    { id: 'farms', label: t.navFarms, icon: Sprout }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl md:hidden">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectView(tab.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-100' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight truncate max-w-[64px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
