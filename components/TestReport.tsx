import React from 'react';
import { TestSuite, TestStatus } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Download, CheckCircle2, XCircle, Code2, Terminal, Clock, Check, AlertCircle, FileText } from 'lucide-react';

interface TestReportProps {
  suite: TestSuite;
  onReset: () => void;
}

const TestReport: React.FC<TestReportProps> = ({ suite, onReset }) => {
  const passedCount = suite.steps.filter(s => s.status === TestStatus.PASSED).length;
  const failedCount = suite.steps.filter(s => s.status === TestStatus.FAILED).length;
  const totalSteps = suite.steps.length;
  const successRate = Math.round((passedCount / totalSteps) * 100);
  const totalDuration = suite.steps.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const avgDuration = Math.round(totalDuration / totalSteps);

  const pieData = [
    { name: 'Passed', value: passedCount, color: '#10b981' }, // Emerald 500
    { name: 'Failed', value: failedCount, color: '#ef4444' }, // Red 500
  ];

  const durationData = suite.steps.map(s => ({
    name: s.name,
    shortName: s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name,
    duration: s.duration || 0,
    status: s.status
  }));

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([suite.generatedCode], { type: 'text/typescript' });
    element.href = URL.createObjectURL(file);
    element.download = "playwright.test.ts";
    document.body.appendChild(element);
    element.click();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-slate-200 font-medium text-xs mb-1">{payload[0].payload.name}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <p className="text-blue-400 text-xs font-mono">
              {payload[0].value}ms
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-2 rounded-lg shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></span>
            <span className="text-slate-200 text-xs">{payload[0].name}: {payload[0].value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in pb-20">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{suite.name}</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${failedCount === 0
                ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400'
                : 'bg-red-950/30 border-red-800 text-red-400'
              }`}>
              {failedCount === 0 ? 'Suite Passed' : 'Suite Failed'}
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            {suite.description}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm transition-all border border-slate-700 hover:border-slate-600"
          >
            <Download size={16} />
            Export Code
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-all shadow-lg shadow-blue-900/20"
          >
            New Test
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 size={64} className="text-emerald-500" />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Success Rate</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl md:text-3xl font-bold ${successRate === 100 ? 'text-emerald-400' : successRate > 80 ? 'text-blue-400' : 'text-red-400'}`}>
              {successRate}%
            </span>
            <span className="text-[10px] md:text-xs text-slate-500">
              ({passedCount}/{totalSteps} passing)
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${successRate === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${successRate}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText size={64} className="text-blue-500" />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Scenarios</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-white">{totalSteps}</span>
            <span className="text-[10px] md:text-xs text-slate-500">steps executed</span>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Coverage: <span className="text-slate-300">Critical Paths</span>
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-xl backdrop-blur-sm relative overflow-hidden group sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock size={64} className="text-purple-500" />
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Avg Latency</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-white">{avgDuration}</span>
            <span className="text-[10px] md:text-xs text-slate-500">ms / step</span>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Total Time: <span className="text-slate-300">{(totalDuration / 1000).toFixed(2)}s</span>
          </p>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">

        {/* Latency Chart (Larger) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              Performance Waterfall
            </h3>
          </div>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={durationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}ms`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.4 }} />
                <Bar
                  dataKey="duration"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                >
                  {durationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'FAILED' ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Donut Chart (Smaller) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-emerald-500" />
            Outcome Distribution
          </h3>
          <div className="flex-1 min-h-[200px] md:min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  formatter={(value, entry: any) => (
                    <span className="text-slate-400 text-xs font-medium ml-2">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-14">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{totalSteps}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Code Block */}
        <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[400px] md:h-[600px] shadow-sm">
          <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
              <Code2 size={16} className="text-blue-400" />
              <span>generated_test.spec.ts</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">TypeScript</div>
          </div>
          <div className="p-4 overflow-auto flex-1 font-mono text-xs md:text-sm leading-relaxed custom-scrollbar text-wrap break-all md:text-nowrap md:break-normal">
            <pre className="text-slate-300">
              <code>{suite.generatedCode}</code>
            </pre>
          </div>
        </div>

        {/* Execution Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[400px] md:h-[600px] shadow-sm">
          <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-medium text-sm">
              <Terminal size={16} className="text-emerald-400" />
              <span>Execution Logs</span>
            </div>
            <span className="text-xs text-slate-500 hidden xs:inline">{suite.steps.length} steps logged</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {suite.steps.map((step, idx) => (
              <div key={step.id} className="border-b border-slate-800/50 p-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-1 rounded-full ${step.status === TestStatus.PASSED ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    {step.status === TestStatus.PASSED ? (
                      <Check size={12} className="text-emerald-500" />
                    ) : (
                      <XCircle size={12} className="text-red-500" />
                    )}
                  </div>
                  <span className="text-slate-200 text-sm font-medium">{step.name}</span>
                  <span className="text-xs text-slate-600 ml-auto font-mono">{step.duration}ms</span>
                </div>
                <div className="pl-9 space-y-1.5">
                  {step.logs.map((log, i) => (
                    <div key={i} className="text-xs font-mono text-slate-400 flex gap-2 items-start opacity-80">
                      <span className="text-slate-600 mt-0.5 select-none">{'>'}</span>
                      <span className="break-words">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestReport;