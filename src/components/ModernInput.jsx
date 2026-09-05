import React from 'react';
import { X } from 'lucide-react';

/**
 * Modern Mobile-Optimized Input Component
 * Features:
 * - 16px (text-base) on mobile to prevent iOS Safari auto-zoom
 * - 48px touch-friendly height (h-12)
 * - Glassmorphic dark styling with active ambient glow
 * - Touch-optimized clear button and keyboard hints
 */
export const ModernInput = ({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  onClear,
  placeholder,
  required = false,
  inputMode,
  enterKeyHint,
  autoComplete,
  className = '',
  rightElement,
  readOnly = false,
  error = '',
  helperText = ''
}) => {
  const showClear = onClear && value && !readOnly;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            {Icon && <Icon className="w-3.5 h-3.5 text-amber-400" />}
            <span>{label}</span>
            {required && <span className="text-amber-500 font-black ml-0.5">*</span>}
          </label>
          {rightElement}
        </div>
      )}

      <div className="relative flex items-center rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-200 group overflow-hidden">
        {Icon && !label && (
          <div className="pl-4 text-slate-500 group-focus-within:text-amber-400 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          autoComplete={autoComplete}
          className={`w-full h-12 bg-transparent px-4 text-base sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none ${
            readOnly ? 'cursor-not-allowed opacity-80' : ''
          }`}
        />

        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="pr-3 text-slate-500 hover:text-slate-300 p-1.5 rounded-full hover:bg-slate-800 active:scale-95 transition-all"
            aria-label="Clear input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && <p className="text-[11px] font-semibold text-rose-400 mt-1">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
};

export const ModernTextArea = ({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  className = '',
  rightElement,
  error = '',
  helperText = ''
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            {Icon && <Icon className="w-3.5 h-3.5 text-amber-400" />}
            <span>{label}</span>
            {required && <span className="text-amber-500 font-black ml-0.5">*</span>}
          </label>
          {rightElement}
        </div>
      )}

      <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/15 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-200 group overflow-hidden">
        <textarea
          rows={rows}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent p-3.5 text-base sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed"
        />
      </div>

      {error && <p className="text-[11px] font-semibold text-rose-400 mt-1">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
};

export default ModernInput;
