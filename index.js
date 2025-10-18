import axios from 'axios';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

// Normalize the base URL
// Allow both full URLs like "http://localhost:11434/api/generate"
// and base URLs like "http://remote-server.com"
let baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
baseUrl = baseUrl.replace(/\/+$/, ""); // remove trailing slashes

if (baseUrl.endsWith("/api/generate")) {
    baseUrl = baseUrl.replace("/api/generate", "");
}

const API_GENERATE_URL = `${baseUrl}/api/generate`;
const API_TAGS_URL = `${baseUrl}/api/tags`;
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "mistral";

// Check if Ollama is installed and available, skip when using remote server
async function ensureOllamaAvailable() {
    if (!baseUrl.includes("localhost")) return; // Skip for remote servers

    try {
        execSync("ollama --version", { stdio: "ignore" });
    } catch {
        throw new Error("Ollama not found, install it via https://ollama.ai/download");
    }

    try {
        await axios.get(baseUrl);
    } catch {
        throw new Error('Ollama is installed but not running. Start with "ollama serve".');
    }
}

// Detect available models on this Ollama instance
async function detectAvailableModels() {
    try {
        const response = await axios.get(API_TAGS_URL);
        const models = response.data.models?.map((m) => m.name) || [];
        if (models.length === 0) console.warn("No models detected");
        return models;
    } catch (error) {
        console.warn("Could not detect models automatically:", error.message);
        return [];
    }
}

// Picks best model available: Mistral > Llama3 > Gemma > Phi3 > CodeLlama
async function getBestModel() {
    const available = await detectAvailableModels();
    const preferenceOrder = ["mistral", "llama3", "gemma", "phi3", "codellama"];
    const chosen = preferenceOrder.find((m) => available.some((a) => a.includes(m)));

    if (chosen) {
        console.log(`Auto-selected best available model: ${chosen}`);
        return chosen;
    } else {
        console.warn(`No preferred models found. Defaulting to ${DEFAULT_MODEL}`);
        return DEFAULT_MODEL;
    }
}

/**
 * Prompt optimizing logic
 * @param {string} prompt - The raw user input
 * @param {number} [temperature=0.5] - Creativity level (0–1)
 * @param {string} [model] - Ollama model name
 * @returns {Promise<{ optimized_prompt: string }>}
 */
async function optimizePrompt(prompt, temperature = 0.5, model = DEFAULT_MODEL) {
  const instruction = `
  You are a prompt optimization assistant.
  Rewrite the following user prompt to make it clearer, more detailed, and effective for AI models.
  Respond only in JSON format: {"optimized_prompt": "<rewritten prompt>"}.
  User prompt: ${prompt}
  `;

  try {
    const response = await axios.post(API_GENERATE_URL, {
      model,
      prompt: instruction,
      options: { temperature },
      stream: false,
    });

    const text = response.data.response.trim();
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : { optimized_prompt: text };
  } catch (error) {
    console.error("Ollama Error:", error.response?.data || error.message);
    throw new Error(`Ollama request failed at ${API_GENERATE_URL}`);
  }
}


export {
    ensureOllamaAvailable,
    detectAvailableModels,
    getBestModel,
    optimizePrompt,
};
