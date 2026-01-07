import React, { useEffect, useRef } from 'react';
import { AgentLog } from '../types';

interface TerminalProps {
  logs: AgentLog[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-full h-full bg-[#0d1117] font-mono text-xs md:text-sm p-4 overflow-y-auto border border-slate-700 rounded-lg shadow-inner">
      {logs.map((log, idx) => (
        <div key={idx} className="mb-1 break-words">
          <span className="text-slate-500 mr-2">[{log.timestamp}]</span>
          <span className={`font-bold mr-2 ${
            log.level === 'INFO' ? 'text-blue-400' :
            log.level === 'WARN' ? 'text-yellow-400' :
            log.level === 'ERROR' ? 'text-red-500' :
            'text-emerald-400'
          }`}>
            {log.level}:
          </span>
          <span className="text-slate-300">{log.message}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default Terminal;