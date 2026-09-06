import React, { useState } from 'react';
import {
  RotateCw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
  Smartphone,
  X,
  CloudRain,
  Wheat,
  ChevronRight,
  Info
} from 'lucide-react';

interface AuthBadgeProps {
  mode: 'signin' | 'signup';
  isActive?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Precision SVG artwork matching the user's agricultural Sign In & Sign Up graphic.
 * Provides crisp, infinitely scalable rendering that adapts to both Light and Dark themes.
 */
export const SignInEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 180,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        {/* Background gradient for inner circle */}
        <radialGradient id="signInBg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f0fdf4" />
          <stop offset="70%" stopColor="#dcfce7" />
          <stop offset="100%" stopColor="#bbf7d0" />
        </radialGradient>

        {/* Button gradient */}
        <linearGradient id="signInBtnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>

        {/* Field gradients */}
        <linearGradient id="fieldGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="fieldGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient id="fieldGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>

        {/* Drop shadow */}
        <filter id="badgeShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.18" />
        </filter>
        <filter id="btnShadow" x="-10%" y="-20%" width="120%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#15803d" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Main Circular Frame with Outer Border */}
      <circle cx="100" cy="85" r="72" fill="url(#signInBg)" stroke="#15803d" strokeWidth="5.5" filter="url(#badgeShadow)" />

      {/* Clip path for inner circle content (fields, sun, avatar) */}
      <clipPath id="circleClip">
        <circle cx="100" cy="85" r="69.5" />
      </clipPath>

      <g clipPath="url(#circleClip)">
        {/* Sun on the right horizon */}
        <circle cx="150" cy="105" r="14" fill="#f59e0b" />
        {/* Sun rays */}
        <path d="M 150 83 L 150 87" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 166 89 L 163 92" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 172 105 L 168 105" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 134 89 L 137 92" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />

        {/* Terraced Agricultural Green Fields */}
        {/* Ridge 1 */}
        <path d="M 30 156 Q 75 118 170 120 L 170 160 L 30 160 Z" fill="url(#fieldGrad1)" />
        <path d="M 40 156 Q 90 122 170 124" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M 60 156 Q 105 125 170 128" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M 85 156 Q 120 128 170 132" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.7" />

        {/* Ridge 2 (foreground) */}
        <path d="M 30 142 Q 80 126 150 135 L 150 160 L 30 160 Z" fill="url(#fieldGrad2)" />
        <path d="M 30 148 Q 90 132 150 140" stroke="#bbf7d0" strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* Ridge 3 */}
        <path d="M 30 152 Q 100 138 170 148 L 170 160 L 30 160 Z" fill="url(#fieldGrad3)" />

        {/* Central Sign-In Silhouette (Farmer Head & Body with Arrow Into Door) */}
        <g transform="translate(68, 44)">
          {/* Head */}
          <circle cx="24" cy="18" r="13" fill="#064e3b" />
          {/* Body */}
          <path d="M 11 49 C 11 36 21 34 32 34 C 36 34 40 34.5 44 35.5 C 38 38 36 43 36 49 Z" fill="#064e3b" />
          {/* Door Bracket */}
          <path
            d="M 44 26 L 56 26 C 58.5 26 60 27.5 60 30 L 60 52 C 60 54.5 58.5 56 56 56 L 44 56"
            stroke="#064e3b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Arrow Entering Door */}
          <path d="M 32 41 L 52 41" stroke="#064e3b" strokeWidth="5" strokeLinecap="round" />
          <path d="M 45 34 L 53 41 L 45 48" stroke="#064e3b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* Sprouting Lush Green Leaves on Left of Circle */}
      <g transform="translate(14, 62)">
        {/* Large Leaf */}
        <path
          d="M 36 78 C 8 68 -2 36 24 10 C 38 32 44 62 36 78 Z"
          fill="#16a34a"
          stroke="#14532d"
          strokeWidth="2"
        />
        {/* Leaf Central Vein */}
        <path d="M 36 78 Q 28 48 24 10" stroke="#86efac" strokeWidth="2" fill="none" />
        <path d="M 32 56 Q 24 48 20 47" stroke="#86efac" strokeWidth="1.5" fill="none" />
        <path d="M 30 42 Q 22 36 17 35" stroke="#86efac" strokeWidth="1.5" fill="none" />

        {/* Secondary Front Leaf */}
        <path
          d="M 34 76 C 16 74 2 54 18 36 C 26 50 32 66 34 76 Z"
          fill="#22c55e"
          stroke="#15803d"
          strokeWidth="1.8"
        />
        <path d="M 34 76 Q 26 58 18 36" stroke="#dcfce7" strokeWidth="1.5" fill="none" />
      </g>

      {/* ------------------------------------------------------------- */}
      {/* Bottom Button Pill: "Sign In >"                               */}
      {/* ------------------------------------------------------------- */}
      <g transform="translate(18, 142)" filter="url(#btnShadow)">
        {/* Green pill button background */}
        <rect x="0" y="0" width="164" height="46" rx="23" fill="url(#signInBtnGrad)" />
        {/* Subtle highlight sheen */}
        <rect x="2" y="2" width="160" height="20" rx="10" fill="white" opacity="0.18" />

        {/* Small Leaf icon on left of text */}
        <g transform="translate(18, 12)">
          <path
            d="M 16 18 C 6 16 2 9 10 2 C 14 8 16 14 16 18 Z"
            fill="#86efac"
          />
          <path
            d="M 15 17 C 8 17 4 12 9 6 C 11 11 14 15 15 17 Z"
            fill="#dcfce7"
          />
        </g>

        {/* "Sign In" Label */}
        <text
          x="88"
          y="29"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="19"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          letterSpacing="0.2px"
        >
          Sign In
        </text>

        {/* Chevron > */}
        <path
          d="M 138 17 L 145 23 L 138 29"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const SignUpEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 180,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        {/* Background gradient for inner circle */}
        <radialGradient id="signUpBg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f0fdf4" />
          <stop offset="70%" stopColor="#dcfce7" />
          <stop offset="100%" stopColor="#bbf7d0" />
        </radialGradient>

        {/* Field gradients */}
        <linearGradient id="upField1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="upField2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>

        {/* Drop shadows */}
        <filter id="signUpShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.18" />
        </filter>
        <filter id="upBtnShadow" x="-10%" y="-20%" width="120%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Main Circular Frame with Outer Border */}
      <circle cx="100" cy="85" r="72" fill="url(#signUpBg)" stroke="#15803d" strokeWidth="5.5" filter="url(#signUpShadow)" />

      {/* Clip path for inner circle content */}
      <clipPath id="upCircleClip">
        <circle cx="100" cy="85" r="69.5" />
      </clipPath>

      <g clipPath="url(#upCircleClip)">
        {/* Terraced Agricultural Green Fields */}
        <path d="M 30 156 Q 80 118 170 122 L 170 160 L 30 160 Z" fill="url(#upField1)" />
        <path d="M 40 156 Q 90 124 170 128" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M 65 156 Q 110 128 170 134" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M 90 156 Q 125 132 170 138" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.7" />

        <path d="M 30 144 Q 85 128 150 138 L 150 160 L 30 160 Z" fill="url(#upField2)" />
        <path d="M 30 150 Q 95 134 150 142" stroke="#bbf7d0" strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* Central Sign-Up Silhouette (Farmer Avatar + Plus icon badge) */}
        <g transform="translate(64, 42)">
          {/* Head */}
          <circle cx="34" cy="18" r="14" fill="#064e3b" />
          {/* Body */}
          <path d="M 14 52 C 14 36 28 34 45 34 C 49 34 54 34.8 58 36.2 C 54 40 52 45 52 52 Z" fill="#064e3b" />

          {/* Plus Badge Overlay */}
          <circle cx="58" cy="46" r="13" fill="#064e3b" stroke="#ffffff" strokeWidth="2.5" />
          {/* Plus symbol */}
          <path d="M 58 39 L 58 53" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 51 46 L 65 46" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      </g>

      {/* Sprouting Lush Green Leaves on Left of Circle */}
      <g transform="translate(12, 60)">
        {/* Large Leaf */}
        <path
          d="M 38 80 C 10 70 -2 36 24 10 C 38 34 44 64 38 80 Z"
          fill="#16a34a"
          stroke="#14532d"
          strokeWidth="2"
        />
        <path d="M 38 80 Q 28 48 24 10" stroke="#86efac" strokeWidth="2" fill="none" />
        <path d="M 34 58 Q 24 50 20 49" stroke="#86efac" strokeWidth="1.5" fill="none" />
        <path d="M 32 44 Q 22 38 17 37" stroke="#86efac" strokeWidth="1.5" fill="none" />

        {/* Secondary Front Leaf */}
        <path
          d="M 35 78 C 16 75 2 54 18 36 C 26 50 32 66 35 78 Z"
          fill="#22c55e"
          stroke="#15803d"
          strokeWidth="1.8"
        />
        <path d="M 35 78 Q 26 58 18 36" stroke="#dcfce7" strokeWidth="1.5" fill="none" />
      </g>

      {/* ------------------------------------------------------------- */}
      {/* Bottom Button Pill: "Sign Up >" (White pill with green border) */}
      {/* ------------------------------------------------------------- */}
      <g transform="translate(18, 142)" filter="url(#upBtnShadow)">
        {/* White pill background */}
        <rect x="0" y="0" width="164" height="46" rx="23" fill="#ffffff" stroke="#15803d" strokeWidth="3" />

        {/* Small Leaf icon on left of text */}
        <g transform="translate(18, 12)">
          <path
            d="M 16 18 C 6 16 2 9 10 2 C 14 8 16 14 16 18 Z"
            fill="#16a34a"
          />
          <path
            d="M 15 17 C 8 17 4 12 9 6 C 11 11 14 15 15 17 Z"
            fill="#22c55e"
          />
        </g>

        {/* "Sign Up" Label */}
        <text
          x="88"
          y="29"
          textAnchor="middle"
          fill="#14532d"
          fontSize="19"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          letterSpacing="0.2px"
        >
          Sign Up
        </text>

        {/* Chevron > */}
        <path
          d="M 138 17 L 145 23 L 138 29"
          stroke="#14532d"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

/**
 * Dual Interactive Badges for Auth Screens:
 * Displays both the Sign In and Sign Up visual artwork side by side.
 */
export const AuthChoiceBadges: React.FC<{
  currentMode: 'signin' | 'signup';
  onSelectMode: (mode: 'signin' | 'signup') => void;
}> = ({ currentMode, onSelectMode }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-4 my-2">
      {/* Sign In Badge Card */}
      <button
        type="button"
        onClick={() => onSelectMode('signin')}
        className={`group relative flex flex-col items-center transition-all duration-200 cursor-pointer p-3 rounded-3xl ${
          currentMode === 'signin'
            ? 'scale-105 bg-emerald-500/10 ring-4 ring-emerald-500 shadow-xl'
            : 'opacity-85 hover:opacity-100 hover:scale-102 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
        }`}
        title="Choose Sign In"
      >
        {currentMode === 'signin' && (
          <span className="absolute -top-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md z-10 animate-pulse">
            Active
          </span>
        )}
        <div className="relative w-40 sm:w-48 transition-transform group-hover:-translate-y-1">
          <SignInEmblem size={190} className="w-full h-auto drop-shadow-md" />
        </div>
        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-1">
          Existing Farmer Account
        </span>
      </button>

      {/* Sign Up Badge Card */}
      <button
        type="button"
        onClick={() => onSelectMode('signup')}
        className={`group relative flex flex-col items-center transition-all duration-200 cursor-pointer p-3 rounded-3xl ${
          currentMode === 'signup'
            ? 'scale-105 bg-emerald-500/10 ring-4 ring-emerald-500 shadow-xl'
            : 'opacity-85 hover:opacity-100 hover:scale-102 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
        }`}
        title="Choose Sign Up"
      >
        {currentMode === 'signup' && (
          <span className="absolute -top-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md z-10 animate-pulse">
            Active
          </span>
        )}
        <div className="relative w-40 sm:w-48 transition-transform group-hover:-translate-y-1">
          <SignUpEmblem size={190} className="w-full h-auto drop-shadow-md" />
        </div>
        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mt-1">
          Register New Land Parcel
        </span>
      </button>
    </div>
  );
};

/**
 * Compact Header Navigation Buttons:
 * Styled identically to the Sign In and Sign Up buttons in the artwork,
 * featuring green leaves, custom gradients, and chevron arrows.
 */
export const HeaderAuthButtons: React.FC<{
  onSignIn: () => void;
  onSignUp: () => void;
}> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Sign In Pill Button */}
      <button
        type="button"
        onClick={onSignIn}
        className="group relative flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-95 text-white font-bold text-xs shadow-sm hover:shadow-emerald-500/30 transition cursor-pointer border border-emerald-400/40"
        title="Sign In to your Farmer Account"
      >
        {/* Leaf icon */}
        <svg
          className="w-3.5 h-3.5 text-emerald-100 shrink-0 transform -rotate-12 group-hover:scale-110 transition-transform"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
        <span className="tracking-wide">Sign In</span>
        <span className="text-[11px] font-black text-emerald-100 group-hover:translate-x-0.5 transition-transform">
          &gt;
        </span>
      </button>

      {/* Sign Up Pill Button */}
      <button
        type="button"
        onClick={onSignUp}
        className="group relative flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0c121d] hover:bg-emerald-50 dark:hover:bg-emerald-950/60 active:scale-95 text-emerald-800 dark:text-emerald-300 font-bold text-xs border-2 border-emerald-600 shadow-xs hover:shadow-md transition cursor-pointer"
        title="Sign Up for New Account"
      >
        {/* Leaf icon */}
        <svg
          className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 transform -rotate-12 group-hover:scale-110 transition-transform"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
        </svg>
        <span className="tracking-wide">Sign Up</span>
        <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
          &gt;
        </span>
      </button>
    </div>
  );
};

/**
 * Precision SVG artwork for agricultural Sign Out.
 * Complements the Sign In emblem with user exiting through the gate/door,
 * lush crop leaves, terraced fields, and a "Sign Out >" pill button.
 */
export const SignOutEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 180,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        <radialGradient id="signOutBg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fef2f2" />
          <stop offset="60%" stopColor="#f0fdf4" />
          <stop offset="100%" stopColor="#dcfce7" />
        </radialGradient>

        <linearGradient id="signOutBtnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        <linearGradient id="outField1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="outField2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>

        <filter id="signOutShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.18" />
        </filter>
        <filter id="outBtnShadow" x="-10%" y="-20%" width="120%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#dc2626" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Main Circular Frame with Outer Border */}
      <circle cx="100" cy="85" r="72" fill="url(#signOutBg)" stroke="#dc2626" strokeWidth="5.5" filter="url(#signOutShadow)" />

      <clipPath id="signOutCircleClip">
        <circle cx="100" cy="85" r="69.5" />
      </clipPath>

      <g clipPath="url(#signOutCircleClip)">
        {/* Sun on right horizon */}
        <circle cx="150" cy="105" r="14" fill="#f59e0b" />
        <path d="M 150 83 L 150 87" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 166 89 L 163 92" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 172 105 L 168 105" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />

        {/* Terraced Agricultural Green Fields */}
        <path d="M 30 156 Q 75 118 170 120 L 170 160 L 30 160 Z" fill="url(#outField1)" />
        <path d="M 40 156 Q 90 122 170 124" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M 60 156 Q 105 125 170 128" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.7" />

        <path d="M 30 142 Q 80 126 150 135 L 150 160 L 30 160 Z" fill="url(#outField2)" />

        {/* Central Sign-Out Silhouette (Farmer Avatar + Door + Exiting Arrow) */}
        <g transform="translate(62, 44)">
          {/* Head */}
          <circle cx="20" cy="18" r="13" fill="#064e3b" />
          {/* Body */}
          <path d="M 7 49 C 7 36 17 34 28 34 C 32 34 36 34.5 40 35.5 C 34 38 32 43 32 49 Z" fill="#064e3b" />
          {/* Door Bracket */}
          <path
            d="M 46 26 L 56 26 C 58.5 26 60 27.5 60 30 L 60 52 C 60 54.5 58.5 56 56 56 L 46 56"
            stroke="#064e3b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Exiting Arrow pointing OUT */}
          <path d="M 28 41 L 64 41" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
          <path d="M 56 33 L 65 41 L 56 49" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>

      {/* Sprouting Lush Green Leaves on Left of Circle */}
      <g transform="translate(14, 62)">
        <path
          d="M 36 78 C 8 68 -2 36 24 10 C 38 32 44 62 36 78 Z"
          fill="#16a34a"
          stroke="#14532d"
          strokeWidth="2"
        />
        <path d="M 36 78 Q 28 48 24 10" stroke="#86efac" strokeWidth="2" fill="none" />
        <path
          d="M 34 76 C 16 74 2 54 18 36 C 26 50 32 66 34 76 Z"
          fill="#22c55e"
          stroke="#15803d"
          strokeWidth="1.8"
        />
      </g>

      {/* Bottom Button Pill: "Sign Out >" */}
      <g transform="translate(18, 142)" filter="url(#outBtnShadow)">
        <rect x="0" y="0" width="164" height="46" rx="23" fill="url(#signOutBtnGrad)" />
        <rect x="2" y="2" width="160" height="20" rx="10" fill="white" opacity="0.18" />

        {/* Small Leaf icon */}
        <g transform="translate(14, 12)">
          <path d="M 16 18 C 6 16 2 9 10 2 C 14 8 16 14 16 18 Z" fill="#fecaca" />
        </g>

        <text
          x="88"
          y="29"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="18"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="800"
          letterSpacing="0.2px"
        >
          Sign Out
        </text>

        <path
          d="M 140 17 L 147 23 L 140 29"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

/**
 * Compact circular Sign In Emblem Logo (for in-line buttons and dashboard headers).
 */
export const SignInLogoIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
    >
      <circle cx="18" cy="18" r="16" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2.4" />
      {/* Terraced field curves */}
      <path d="M 5 28 Q 14 21 31 23 L 31 33 L 5 33 Z" fill="#22c55e" opacity="0.65" />
      <path d="M 5 26 Q 16 23 31 26" stroke="#15803d" strokeWidth="1.2" fill="none" opacity="0.7" />
      {/* Sun hint */}
      <circle cx="28" cy="12" r="3" fill="#f59e0b" />
      {/* Avatar Head & Body */}
      <circle cx="13" cy="13" r="3.6" fill="#064e3b" />
      <path d="M 7 24 C 7 19.5 11 18.5 15.5 18.5 C 17 18.5 18.5 19 19.5 19.5 C 17.5 21 16.5 22.5 16.5 24 Z" fill="#064e3b" />
      {/* Door Bracket */}
      <path d="M 21.5 11.5 L 26 11.5 C 27 11.5 27.5 12 27.5 13 L 27.5 22 C 27.5 23 27 23.5 26 23.5 L 21.5 23.5" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Arrow into door */}
      <path d="M 16 17.5 L 24 17.5" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" />
      <path d="M 21 14.5 L 24.5 17.5 L 21 20.5" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sprouting leaf on outer circle */}
      <path d="M 5 18 C 1.5 14.5 3 8.5 9 7.5 C 9 12 7 16 5 18 Z" fill="#16a34a" />
    </svg>
  );
};

/**
 * Compact circular Sign Out Emblem Logo (for in-line buttons and dashboard headers).
 */
export const SignOutLogoIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className = ''
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
    >
      <circle cx="18" cy="18" r="16" fill="#fef2f2" stroke="#dc2626" strokeWidth="2.4" />
      {/* Terraced field curves */}
      <path d="M 5 28 Q 14 21 31 23 L 31 33 L 5 33 Z" fill="#22c55e" opacity="0.5" />
      {/* Sun hint */}
      <circle cx="28" cy="12" r="3" fill="#f59e0b" />
      {/* Avatar Head & Body */}
      <circle cx="12" cy="13" r="3.6" fill="#064e3b" />
      <path d="M 6 24 C 6 19.5 10 18.5 14.5 18.5 C 16 18.5 17.5 19 18.5 19.5 C 16.5 21 15.5 22.5 15.5 24 Z" fill="#064e3b" />
      {/* Door Bracket */}
      <path d="M 21.5 11.5 L 26 11.5 C 27 11.5 27.5 12 27.5 13 L 27.5 22 C 27.5 23 27 23.5 26 23.5 L 21.5 23.5" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Arrow EXITING door in bright crimson */}
      <path d="M 15 17.5 L 27.5 17.5" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 24.5 14.5 L 28 17.5 L 24.5 20.5" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sprouting leaf on outer circle */}
      <path d="M 5 18 C 1.5 14.5 3 8.5 9 7.5 C 9 12 7 16 5 18 Z" fill="#ef4444" />
    </svg>
  );
};

/**
 * Dashboard Sign In Button (featuring the authentic Logo + Leaf + Chevron)
 */
export const DashboardSignInButton: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({ onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-95 text-white font-black text-xs shadow-md hover:shadow-emerald-500/30 transition cursor-pointer border border-emerald-400/40 select-none ${className}`}
      title="Sign In with your Farmer Account"
    >
      <SignInLogoIcon size={20} className="transform group-hover:scale-110 transition-transform" />
      <span className="tracking-wide">Sign In</span>
      <span className="text-xs font-black text-emerald-100 group-hover:translate-x-0.5 transition-transform">
        &gt;
      </span>
    </button>
  );
};

/**
 * Dashboard Sign Out Button (featuring the authentic Sign Out Logo + Chevron)
 */
export const DashboardSignOutButton: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({ onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-red-500/20 active:scale-95 text-red-200 hover:text-white font-bold text-xs shadow-xs border border-red-400/40 hover:border-red-400 transition cursor-pointer select-none ${className}`}
      title="Sign Out of Farmer Account"
    >
      <SignOutLogoIcon size={20} className="transform group-hover:scale-110 transition-transform" />
      <span className="tracking-wide">Sign Out</span>
      <span className="text-xs font-black text-red-300 group-hover:translate-x-0.5 transition-transform">
        &gt;
      </span>
    </button>
  );
};

/**
 * 3D Flippable Authentication Image Card:
 * Features realistic 3D perspective flip between the Sign In and Sign Up agricultural emblems.
 * Provides explicit guidance: "Don't have an account? Flip the image to Sign Up!"
 */
export const FlippableAuthImageCard: React.FC<{
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
  size?: number;
  interactive?: boolean;
  showFlipPrompt?: boolean;
  showSegmentedControls?: boolean;
  onOpenDashboardInfo?: () => void;
  className?: string;
}> = ({
  mode,
  onModeChange,
  size = 210,
  interactive = true,
  showFlipPrompt = true,
  showSegmentedControls = true,
  onOpenDashboardInfo,
  className = ''
}) => {
  const isSignUp = mode === 'signup';
  const [isHovered, setIsHovered] = useState(false);

  const handleFlip = () => {
    if (!interactive) return;
    onModeChange(isSignUp ? 'signin' : 'signup');
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Explicit User Guidance Banner: "If don't sign up, do this: Flip the image" */}
      {showFlipPrompt && (
        <div className="mb-3 animate-fadeIn">
          <button
            type="button"
            onClick={handleFlip}
            className="group px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 via-teal-50 to-emerald-100 hover:from-emerald-200 hover:to-teal-100 dark:from-emerald-950/80 dark:via-slate-900 dark:to-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs font-black transition flex items-center space-x-2 shadow-xs border border-emerald-300/80 dark:border-emerald-700 cursor-pointer active:scale-95"
            title="Click to Flip Image"
          >
            <RotateCw className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
            <span>
              {isSignUp ? (
                <>
                  <span className="text-emerald-700 dark:text-emerald-400">Already registered?</span>{' '}
                  <span className="underline decoration-emerald-500">Flip image to Sign In ↶</span>
                </>
              ) : (
                <>
                  <span className="text-emerald-700 dark:text-emerald-400">Don't have an account?</span>{' '}
                  <span className="underline decoration-emerald-500">Flip image to Sign Up ↷</span>
                </>
              )}
            </span>
          </button>
        </div>
      )}

      {/* 3D Perspective Stage */}
      <div
        className="relative cursor-pointer group"
        style={{
          perspective: '1400px',
          width: size,
          height: size + 16
        }}
        onClick={handleFlip}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={
          interactive
            ? `Click image to flip! Showing ${isSignUp ? 'Sign Up' : 'Sign In'}`
            : undefined
        }
      >
        {/* Flipping 3D Element with native CSS transforms */}
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isSignUp ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* FRONT FACE: SIGN IN EMBLEM */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <div className={`relative transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}>
              <SignInEmblem size={size} className="drop-shadow-xl" />
              
              {/* Bottom Tag Overlay */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-emerald-800 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center space-x-1 border border-emerald-500">
                <span>Existing Farmer</span>
                <span className="text-emerald-300">• Flip 🔄</span>
              </div>
            </div>
          </div>

          {/* BACK FACE: SIGN UP EMBLEM */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className={`relative transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}>
              <SignUpEmblem size={size} className="drop-shadow-xl" />

              {/* Bottom Tag Overlay */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-emerald-900 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center space-x-1 border border-emerald-400">
                <span>Register Land</span>
                <span className="text-emerald-300">• Flip 🔄</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls below the image */}
      {showSegmentedControls && (
        <div className="flex items-center gap-2 mt-4">
          {/* Sign In Choice Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onModeChange('signin');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer flex items-center space-x-1.5 select-none ${
              !isSignUp
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/80 scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 opacity-80'
            }`}
          >
            <SignInLogoIcon size={16} />
            <span>Sign In</span>
            {!isSignUp && <span className="text-[10px] font-black">&gt;</span>}
          </button>

          {/* Quick Flip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFlip();
            }}
            className="px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center space-x-1 border border-slate-300 dark:border-slate-700 cursor-pointer active:scale-95 shadow-2xs"
            title="Click to Flip Image"
          >
            <RotateCw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px]">Flip</span>
          </button>

          {/* Sign Up Choice Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onModeChange('signup');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer flex items-center space-x-1.5 select-none ${
              isSignUp
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/80 scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-300 dark:border-slate-700 opacity-80'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Sign Up</span>
            {isSignUp && <span className="text-[10px] font-black">&gt;</span>}
          </button>
        </div>
      )}

      {/* Dashboard Information Link */}
      {onOpenDashboardInfo && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDashboardInfo();
          }}
          className="mt-3 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-bold flex items-center space-x-1.5 cursor-pointer group"
        >
          <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="underline decoration-emerald-400">View Farm Sync Dashboard Information</span>
        </button>
      )}
    </div>
  );
};

/**
 * Dashboard Auth Information & Flip Modal:
 * Displays full dashboard synchronization benefits, with the interactive 3D Flippable image
 * and quick access to Sign In or Sign Up directly.
 */
export const DashboardAuthInfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onProceedAuth: (mode: 'signin' | 'signup') => void;
}> = ({ isOpen, onClose, initialMode = 'signin', onProceedAuth }) => {
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup'>(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0c121d] rounded-3xl shadow-2xl border border-emerald-200 dark:border-emerald-800/80 overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base shadow-xs">
              🌾
            </div>
            <div>
              <h3 className="font-black text-sm tracking-wide">
                Krishi Vikas • Dashboard Information
              </h3>
              <p className="text-[11px] text-emerald-100">
                Interactive Farm Sync &amp; Access Controls
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-emerald-100 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Centered 3D Flippable Image Card */}
          <div className="bg-gradient-to-b from-emerald-50/70 via-slate-50 to-white dark:from-slate-900/60 dark:via-[#090d15] dark:to-[#0c121d] p-4 rounded-2xl border border-emerald-100 dark:border-slate-800 shadow-xs">
            <FlippableAuthImageCard
              mode={currentMode}
              onModeChange={setCurrentMode}
              size={180}
              showFlipPrompt={true}
              showSegmentedControls={true}
            />
          </div>

          {/* Dashboard Sync Benefits Breakdown */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Synced Dashboard Features for Your Farm</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                <Wheat className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Crop Lifecycle Engine</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    4-stage growth model &amp; ideal harvest window predictor.
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                <Layers className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Soil Intelligence Card</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Track Nitrogen, Phosphorus, Potassium &amp; pH levels.
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                <CloudRain className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">GPS Rain &amp; Soil Sensor</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Hyper-local rain alerts and 7-day spray feasibility index.
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start space-x-2">
                <Smartphone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">06:00 AM Daily Alerts</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Automated WhatsApp and SMS farm notifications.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Prompt */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Instant cloud synchronization</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                Dismiss
              </button>

              <button
                type="button"
                onClick={() => {
                  onProceedAuth(currentMode);
                  onClose();
                }}
                className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-95 text-white font-black text-xs shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>{currentMode === 'signup' ? 'Proceed to Sign Up' : 'Proceed to Sign In'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


