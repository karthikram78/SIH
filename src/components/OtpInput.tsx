'use client';

import React, { useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, ' ').split('').slice(0, length);

  useEffect(() => {
    // Auto-focus first empty box on mount
    const firstEmpty = digits.findIndex((d) => d === ' ');
    const idx = firstEmpty === -1 ? length - 1 : firstEmpty;
    inputsRef.current[idx]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (idx: number, char: string) => {
    if (!/^\d$/.test(char)) return;
    const arr = digits.map((d) => (d === ' ' ? '' : d));
    arr[idx] = char;
    onChange(arr.join(''));
    // Advance to next
    if (idx < length - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = digits.map((d) => (d === ' ' ? '' : d));
      if (arr[idx]) {
        arr[idx] = '';
        onChange(arr.join(''));
      } else if (idx > 0) {
        arr[idx - 1] = '';
        onChange(arr.join(''));
        inputsRef.current[idx - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted.length > 0) {
      onChange(pasted.padEnd(length, '').slice(0, length).replace(/ /g, ''));
      const focusIdx = Math.min(pasted.length, length - 1);
      inputsRef.current[focusIdx]?.focus();
    }
  };

  const borderColor = error
    ? 'border-red-400 bg-red-50 text-red-700'
    : 'border-slate-300 bg-white text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-200';

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, idx) => {
        const digit = digits[idx] === ' ' ? '' : digits[idx];
        return (
          <input
            key={idx}
            ref={(el) => { inputsRef.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={`
              w-11 h-14 text-center text-xl font-black rounded-xl border-2 outline-none
              transition-all duration-150 select-all
              disabled:opacity-50 disabled:cursor-not-allowed
              ${borderColor}
              ${digit ? 'scale-105 shadow-md' : ''}
              ${error ? 'animate-shake' : ''}
            `}
          />
        );
      })}
    </div>
  );
}
