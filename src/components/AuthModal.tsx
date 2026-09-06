import React from 'react';
import { X } from 'lucide-react';
import { AppLanguage, User } from '../types';
import { AuthView } from './AuthView';

interface AuthModalProps {
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onSignInProfile: (user: User) => void;
  onSignOut: () => void;
  onUpdateProfile?: (updated: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  language,
  onSignInProfile,
  onSignOut,
  onUpdateProfile
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl my-auto">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:top-4 sm:right-4 z-50 p-2 text-white sm:text-slate-500 hover:text-white sm:hover:text-slate-900 bg-black/40 sm:bg-slate-100 sm:hover:bg-slate-200 rounded-full transition cursor-pointer"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <AuthView
          currentUser={currentUser}
          language={language}
          onAuthSuccess={(user) => {
            onSignInProfile(user);
            onClose();
          }}
          onSignOut={() => {
            onSignOut();
          }}
          onUpdateProfile={onUpdateProfile}
          isModal={true}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
