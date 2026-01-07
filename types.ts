export enum AppStatus {
  IDLE = 'IDLE',
  PLANNING = 'PLANNING',
  RUNNING = 'RUNNING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface TestConfig {
  url: string;
  username?: string;
  password?: string;
}

export enum TestStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED'
}

export interface TestStep {
  id: string;
  name: string;
  description: string;
  status: TestStatus;
  logs: string[];
  duration?: number;
}

export interface TestSuite {
  name: string;
  description: string;
  steps: TestStep[];
  generatedCode: string; // The Playwright/Cypress code
  summary: string;
}

export interface AgentLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}