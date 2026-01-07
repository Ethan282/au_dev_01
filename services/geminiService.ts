// import { GoogleGenAI, Type } from "@google/genai";
// import { TestSuite, TestStep, TestStatus } from "../types";

// // Initialize the API client
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// // Using gemini-3-pro-preview for better reasoning capabilities in test generation
// const MODEL_NAME = "gemini-1.5-pro";

// export const generateTestPlan = async (url: string, username?: string): Promise<TestSuite> => {
//   const prompt = `
//     Act as a Senior QA Automation Architect. 
//     I need to automate testing for a website with the URL: ${url}.
//     ${username ? `The testing involves a user login scenario (User: ${username}).` : 'This is a public access test.'}

//     Please infer the likely functionality of this website based on its URL (e.g., e-commerce, saas, blog, portal).

//     1. Create a logical "Test Suite Name" and "Description".
//     2. Generate a list of 5-8 critical "Test Steps" (scenarios) that an automation agent would execute.
//        - Include happy paths (e.g., Load Homepage, Check Navigation).
//        - Include functional paths (e.g., Login, Search, Add to Cart - if applicable).
//        - Include edge cases (e.g., Invalid Input).
//     3. Generate a complete, valid Playwright (TypeScript) script that would implement these tests.
//     4. Provide a brief summary of the testing strategy.

//     Return the response in JSON format.
//   `;

//   try {
//     const response = await ai.models.generateContent({
//       model: MODEL_NAME,
//       contents: prompt,
//       config: {
//         responseMimeType: "application/json",
//         responseSchema: {
//           type: Type.OBJECT,
//           properties: {
//             name: { type: Type.STRING },
//             description: { type: Type.STRING },
//             summary: { type: Type.STRING },
//             steps: {
//               type: Type.ARRAY,
//               items: {
//                 type: Type.OBJECT,
//                 properties: {
//                   id: { type: Type.STRING },
//                   name: { type: Type.STRING },
//                   description: { type: Type.STRING },
//                 },
//                 required: ["id", "name", "description"]
//               }
//             },
//             generatedCode: { type: Type.STRING }
//           },
//           required: ["name", "description", "steps", "generatedCode", "summary"]
//         }
//       }
//     });

//     if (response.text) {
//       const data = JSON.parse(response.text);

//       // Transform into our internal type
//       const steps: TestStep[] = data.steps.map((s: any) => ({
//         ...s,
//         status: TestStatus.PENDING,
//         logs: [],
//         duration: 0
//       }));

//       return {
//         name: data.name,
//         description: data.description,
//         summary: data.summary,
//         generatedCode: data.generatedCode,
//         steps: steps
//       };
//     }

//     throw new Error("Empty response from AI");
//   } catch (error) {
//     console.error("Failed to generate test plan:", error);
//     throw error;
//   }
// };

// export const simulateStepExecution = async (step: TestStep, url: string): Promise<{ logs: string[], status: TestStatus }> => {
//   // We use a lighter model for quick simulation log generation to reduce latency
//   const SIM_MODEL = "gemini-1.5-flash";

//   const prompt = `
//     We are simulating the execution of an automation test step: "${step.name}" - "${step.description}"
//     Target URL: ${url}

//     Generate 3-5 realistic execution log lines that a Playwright/Selenium runner would output during this step.
//     Determine if this step is likely to PASS or FAIL based on common web instability (95% pass rate).

//     Return JSON: { "logs": string[], "status": "PASSED" | "FAILED" }
//   `;

//   try {
//     const response = await ai.models.generateContent({
//       model: SIM_MODEL,
//       contents: prompt,
//       config: {
//         responseMimeType: "application/json",
//         responseSchema: {
//           type: Type.OBJECT,
//           properties: {
//             logs: {
//               type: Type.ARRAY,
//               items: { type: Type.STRING }
//             },
//             status: { type: Type.STRING } // We map this manually to enum
//           }
//         }
//       }
//     });

//     const text = response.text;
//     if (!text) throw new Error("No text");

//     const data = JSON.parse(text);
//     return {
//       logs: data.logs,
//       status: data.status === 'FAILED' ? TestStatus.FAILED : TestStatus.PASSED
//     };

//   } catch (e) {
//     return {
//       logs: ["Error connecting to simulation engine", "Retry attempt 1...", "Execution timeout"],
//       status: TestStatus.PASSED // Fallback to pass to not break demo
//     };
//   }
// };
import { TestSuite, TestStep, TestStatus } from "../types";

export const generateTestPlan = async (url: string, username?: string): Promise<TestSuite> => {
  // MOCK DATA for local testing
  const mockSteps: TestStep[] = [
    { id: "1", name: "Load Homepage", description: "Navigate to the site and verify connectivity", status: TestStatus.PENDING, logs: [], duration: 0 },
    { id: "2", name: "Check Navigation", description: "Verify that top-level menu items are clickable", status: TestStatus.PENDING, logs: [], duration: 0 },
    { id: "3", name: "Verify Metadata", description: "Check page title and meta descriptions for SEO", status: TestStatus.PENDING, logs: [], duration: 0 },
    { id: "4", name: "Responsiveness Test", description: "Check layout on mobile and tablet viewport sizes", status: TestStatus.PENDING, logs: [], duration: 0 },
    { id: "5", name: "Footer Check", description: "Ensure contact info and social links are present", status: TestStatus.PENDING, logs: [], duration: 0 }
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: `Automated Test Suite for ${new URL(url).hostname}`,
        description: `Autonomous quality assessment for ${url} (Mock Mode)`,
        summary: "This is a pre-generated testing strategy focused on critical web vitals and basic functionality, used because live API calling is disabled.",
        steps: mockSteps,
        generatedCode: `
import { test, expect } from '@playwright/test';

test('basic website check', async ({ page }) => {
  await page.goto('${url}');
  await expect(page).toHaveTitle(/./);
  
  // Navigation check
  const links = await page.locator('nav a').count();
  console.log('Found ' + links + ' navigation links');
});`
      });
    }, 1500); // Simulate network latency
  });

  /* Original API calling logic (Disabled)
  const prompt = `...`;
  try {
    const response = await ai.models.generateContent({ ... });
    ...
  } catch (error) { ... }
  */
};

export const simulateStepExecution = async (step: TestStep, url: string): Promise<{ logs: string[], status: TestStatus }> => {
  // MOCK SIMULATION
  return new Promise((resolve) => {
    setTimeout(() => {
      const logs = [
        `[${new Date().toLocaleTimeString()}] Executing Playwright task: ${step.name}`,
        `[${new Date().toLocaleTimeString()}] Navigating to path: /`,
        `[${new Date().toLocaleTimeString()}] Selector '.main-content' found and visible`,
        `[${new Date().toLocaleTimeString()}] Assertion passed: ${step.description}`,
        `[${new Date().toLocaleTimeString()}] Step finished with zero errors.`
      ];
      resolve({ logs, status: TestStatus.PASSED });
    }, 1000);
  })
}