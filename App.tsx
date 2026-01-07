import React, { useState, useEffect, useRef } from 'react';
import { AppStatus, TestConfig, TestSuite, TestStep, TestStatus, AgentLog } from './types';
import { generateTestPlan, simulateStepExecution } from './services/geminiService';
import Terminal from './components/Terminal';
import TestReport from './components/TestReport';
import AccountProfile from './components/AccountProfile';
import { Play, Activity, Globe, Lock, Shield, Cpu, RefreshCw, Zap, LayoutTemplate, Menu, X, User as UserIcon, CircleUser } from 'lucide-react';

enum AppView {
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE'
}

const INITIAL_LOGS: AgentLog[] = [
  { timestamp: new Date().toLocaleTimeString(), level: 'INFO', message: 'System initialized. Waiting for target configuration...' }
];

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [config, setConfig] = useState<TestConfig>({ url: '', username: '', password: '' });
  const [logs, setLogs] = useState<AgentLog[]>(INITIAL_LOGS);
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);

  const addLog = (message: string, level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' = 'INFO') => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    }]);
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.url) return;

    setStatus(AppStatus.PLANNING);
    setLogs([]); // Clear previous logs
    addLog(`Target acquired: ${config.url}`, 'INFO');
    addLog('Initializing AI Test Architect Agent...', 'INFO');

    try {
      addLog('Analyzing target application structure...', 'INFO');
      const plan = await generateTestPlan(config.url, config.username);

      setTestSuite(plan);
      addLog(`Test Plan Generated: ${plan.name}`, 'SUCCESS');
      addLog(`Description: ${plan.description}`, 'INFO');
      addLog(`Identified ${plan.steps.length} critical test scenarios.`, 'INFO');

      setStatus(AppStatus.RUNNING);
    } catch (error) {
      addLog('Failed to generate test plan. Check API Key or Network.', 'ERROR');
      setStatus(AppStatus.ERROR);
    }
  };

  // Effect to run the test suite when status changes to RUNNING
  useEffect(() => {
    let isCancelled = false;

    const runTests = async () => {
      if (status !== AppStatus.RUNNING || !testSuite) return;

      const newSteps = [...testSuite.steps];

      for (let i = 0; i < newSteps.length; i++) {
        if (isCancelled) break;

        const step = newSteps[i];
        setCurrentStepId(step.id);

        // Update UI to show running
        step.status = TestStatus.RUNNING;
        setTestSuite(prev => prev ? ({ ...prev, steps: [...newSteps] }) : null);
        addLog(`Executing Step [${i + 1}/${newSteps.length}]: ${step.name}...`, 'INFO');

        // Simulate work duration
        const startTime = Date.now();

        // Call AI to simulate logs and outcome
        const result = await simulateStepExecution(step, config.url);

        if (isCancelled) break;

        // Add detailed logs from the "runner"
        result.logs.forEach(log => addLog(`[RUNNER] ${log}`, 'INFO'));

        // Update step result
        step.status = result.status;
        step.logs = result.logs;
        step.duration = Date.now() - startTime;

        // Update state
        setTestSuite(prev => prev ? ({ ...prev, steps: [...newSteps] }) : null);
        addLog(`Step ${step.name} finished: ${step.status}`, result.status === TestStatus.PASSED ? 'SUCCESS' : 'ERROR');

        // Small delay between steps for visual effect
        await new Promise(r => setTimeout(r, 800));
      }

      if (!isCancelled) {
        setStatus(AppStatus.COMPLETE);
        addLog('Test Suite Execution Completed.', 'SUCCESS');
        setCurrentStepId(null);
      }
    };

    runTests();

    return () => { isCancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // Only re-run if status flips to RUNNING explicitly

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setTestSuite(null);
    setLogs(INITIAL_LOGS);
    setCurrentStepId(null);
    setView(AppView.DASHBOARD);
    setConfig({ url: '', username: '', password: '' });
  };

  const handleSignOut = () => {
    // Mocking a sign-out by resetting everything and showing a "logging out" log
    handleReset();
    addLog('User signed out. Session terminated.', 'INFO');
  };

  // --- Render Helpers ---

  const renderSidebar = () => (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed lg:static inset-y-0 left-0 w-80 bg-slate-950 border-r border-slate-800 flex flex-col h-full z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <h1 className="font-bold text-xl text-white tracking-tight">AutoQA<span className="text-emerald-500">.AI</span></h1>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {status === AppStatus.IDLE && (
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <LayoutTemplate size={14} /> Workflow
              </h3>
              <ul className="text-xs text-slate-400 space-y-3 pl-2">
                <li className="flex gap-2">
                  <span className="text-blue-500">1.</span> Enter target coordinates (URL)
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">2.</span> Agent scans and maps architecture
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">3.</span> Autonomous execution of scenarios
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">4.</span> Generate artifacts & report
                </li>
              </ul>
            </div>
          )}

          {testSuite && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">Test Sequence</h3>
              {testSuite.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-md border text-sm transition-all relative overflow-hidden ${currentStepId === step.id
                    ? 'bg-blue-950/40 border-blue-500/50'
                    : step.status === TestStatus.PASSED
                      ? 'bg-slate-900/30 border-slate-800 text-slate-400 opacity-70'
                      : step.status === TestStatus.FAILED
                        ? 'bg-red-950/20 border-red-900/40 text-slate-300'
                        : 'bg-slate-900/20 border-slate-800 text-slate-600'
                    }`}
                >
                  {currentStepId === step.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                  )}
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <span className={`font-medium truncate ${currentStepId === step.id ? 'text-blue-400' : 'text-slate-300'}`}>
                      <span className="text-xs font-mono opacity-50 mr-2">{String(idx + 1).padStart(2, '0')}</span>
                      {step.name}
                    </span>
                    <div className="shrink-0">
                      {step.status === TestStatus.RUNNING && <Activity size={14} className="text-blue-400 animate-spin" />}
                      {step.status === TestStatus.PASSED && <Zap size={14} className="text-emerald-500" />}
                      {step.status === TestStatus.FAILED && <div className="w-2 h-2 rounded-full bg-red-500 mt-1"></div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>GEMINI-3-PRO</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${status === AppStatus.ERROR ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
              <span>{status === AppStatus.ERROR ? 'OFFLINE' : 'CONNECTED'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen w-full bg-[#0b1120] text-slate-200 overflow-hidden selection:bg-blue-500/30">
      {renderSidebar()}

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* Header Area */}
        <header className="h-16 border-b border-slate-800 bg-[#0b1120]/90 backdrop-blur flex items-center justify-between px-4 md:px-6 z-20">
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Toggle Sidebar"
              >
                <Menu size={22} />
              </button>

              <button
                onClick={() => setView(view === AppView.PROFILE ? AppView.DASHBOARD : AppView.PROFILE)}
                className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${view === AppView.PROFILE
                  ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                title="User Profile"
              >
                <CircleUser size={24} className={view === AppView.PROFILE ? 'animate-pulse' : ''} />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Account</span>
              </button>
            </div>

            <div className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest border uppercase flex items-center gap-2 ${status === AppStatus.IDLE ? 'bg-slate-900 border-slate-700 text-slate-500' :
              status === AppStatus.RUNNING ? 'bg-blue-950/50 border-blue-800 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' :
                status === AppStatus.COMPLETE ? 'bg-emerald-950/50 border-emerald-800 text-emerald-400' :
                  'bg-red-950/50 border-red-800 text-red-400'
              }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${status === AppStatus.RUNNING ? 'bg-blue-400 animate-pulse' :
                status === AppStatus.COMPLETE ? 'bg-emerald-400' :
                  'bg-slate-500'
                }`}></div>
              {status}
            </div>

            {config.url && (
              <div className="flex items-center gap-2 text-xs md:text-sm font-mono text-slate-400 min-w-0">
                <Globe size={14} className="text-slate-600 shrink-0 hidden xs:block" />
                <span className="truncate max-w-[120px] xs:max-w-[200px] md:max-w-[400px] hover:text-slate-300 transition-colors cursor-default" title={config.url}>
                  {config.url}
                </span>
              </div>
            )}
          </div>

          {status !== AppStatus.IDLE && (
            <button
              onClick={handleReset}
              className="text-xs flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-md transition-all border border-transparent hover:border-slate-700"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">New Session</span>
            </button>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative flex flex-col">

          {view === AppView.PROFILE ? (
            <AccountProfile onSignOut={handleSignOut} onBack={() => setView(AppView.DASHBOARD)} />
          ) : (
            <>
              {/* View: IDLE (Form) */}
              {status === AppStatus.IDLE && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-fade-in z-10">
                  <div className="max-w-lg w-full">
                    <div className="text-center space-y-6 mb-10">
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 rounded-full"></div>
                        <div className="relative p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                          <Cpu size={48} className="text-blue-500" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Target Configuration</h2>
                        <p className="text-slate-400">Initialize the autonomous quality assurance agent.</p>
                      </div>
                    </div>

                    <form onSubmit={handleStart} className="space-y-6 bg-slate-900/80 p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500 opacity-50"></div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Target Endpoint</label>
                          <div className="relative group/input">
                            <Globe className="absolute left-3 top-3.5 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                            <input
                              type="url"
                              required
                              placeholder="https://platform.example.com"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm shadow-inner"
                              value={config.url}
                              onChange={e => setConfig({ ...config, url: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Auth User</label>
                            <div className="relative group/input">
                              <Shield className="absolute left-3 top-3.5 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                              <input
                                type="text"
                                placeholder="Optional"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm shadow-inner"
                                value={config.username}
                                onChange={e => setConfig({ ...config, username: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">Auth Key</label>
                            <div className="relative group/input">
                              <Lock className="absolute left-3 top-3.5 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                              <input
                                type="password"
                                placeholder="Optional"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono text-sm shadow-inner"
                                value={config.password}
                                onChange={e => setConfig({ ...config, password: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.4)] hover:-translate-y-0.5"
                      >
                        <Play size={18} className="fill-white" />
                        <span>Initialize Test Agent</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* View: PLANNING / RUNNING (Console) */}
              {(status === AppStatus.PLANNING || status === AppStatus.RUNNING) && (
                <div className="absolute inset-0 p-6 flex flex-col gap-4">
                  <div className="flex-1 bg-[#0d1117] rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative">
                    {/* Terminal Header */}
                    <div className="bg-slate-900/80 backdrop-blur px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                        </div>
                        <span className="ml-3 text-xs text-slate-500 font-mono flex items-center gap-2">
                          <Activity size={12} />
                          agent_runtime --verbose
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-slate-600">PID: {Math.floor(Math.random() * 9000) + 1000}</div>
                    </div>

                    {/* Status Overlay */}
                    <div className="absolute top-16 right-6 z-10 pointer-events-none">
                      <div className="bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-3 shadow-xl">
                        <div className="flex items-center gap-3">
                          <div className="relative w-2 h-2">
                            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                            <div className="absolute inset-0 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="font-mono text-xs text-blue-400 font-bold uppercase">
                            {status === AppStatus.PLANNING ? 'Constructing Plan' : 'Executing Steps'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Terminal logs={logs} />
                  </div>
                </div>
              )}

              {/* View: COMPLETE (Report) */}
              {status === AppStatus.COMPLETE && testSuite && (
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                  <TestReport suite={testSuite} onReset={handleReset} />
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;