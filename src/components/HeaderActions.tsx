import React, { useState } from 'react';

interface HeaderActionsProps {
  onExportPNG: () => void;
  onCopyLink: () => void;
}

export default function HeaderActions({ onExportPNG, onCopyLink }: HeaderActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Primary Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer text-xs"
      >
        <span>⚡ Publish & Share</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Action Options Dropdown */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-1.5 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Option 1: Publish & Export Badge */}
          <button
            onClick={() => {
              onExportPNG();
              setIsOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-100 hover:bg-amber-500/10 hover:text-amber-400 flex items-center gap-2.5 transition-all cursor-pointer"
          >
            <span className="text-base">📥</span>
            <div>
              <div>Publish & Export Badge</div>
              <div className="text-[10px] text-slate-400 font-normal">Download 2x HD Pass PNG</div>
            </div>
          </button>

          <div className="h-px bg-slate-800 my-1" />

          {/* Option 2: Copy Link */}
          <button
            onClick={() => {
              onCopyLink();
              setIsOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-100 hover:bg-slate-800 hover:text-slate-200 flex items-center gap-2.5 transition-all cursor-pointer"
          >
            <span className="text-base">🔗</span>
            <div>
              <div>Copy App Link</div>
              <div className="text-[10px] text-slate-400 font-normal">Copy URL to clipboard</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
