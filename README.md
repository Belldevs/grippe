

# Grippe

> A lightweight Node.js module that uses **Ollama** to automatically rewrite user prompts into clear, powerful, and context-aware versions — all locally or within your private servers.

---

## Features

 Works **offline** with local Ollama or connects to **remote Ollama servers**
 Automatically detects available models (`llama3`, `mistral`, `gemma`, etc.)
 Uses a **default temperature** (0.5) but supports user-defined creativity
 Returns clean JSON output for easy integration
 Fully open-source and **free** to use

---

## ⚙️ Installation

```bash
npm install grippe
```

You must also have [Ollama](https://ollama.ai/download) installed and running locally or on a remote server.

To start Ollama:

```bash
ollama serve
ollama pull llama3
```

---

##  Usage Example

### Simple Usage (default settings)**

```js
import { optimizePrompt } from "grippe";

const result = await optimizePrompt("what is a black hole?");
console.log(result);
```

### 📥 **Output**

```json
{
  "optimized_prompt": "You are an astrophysicist. Explain black holes simply to a curious audience using easy analogies."
}
```

---

### **Custom Model and Temperature**

```js
const result = await optimizePrompt(
  "explain quantum computing in simple terms",
  0.7,          // temperature (creativity level)
  "mistral"     // model name
);
console.log(result);
```

 **Input**

```json
{
  "prompt": "explain quantum computing in simple terms",
  "temperature": 0.7,
  "model": "mistral"
}
```

📥 **Output**

```json
{
  "optimized_prompt": "You are a teacher explaining quantum computing to beginners using playful and visual analogies."
}
```

---

## 🧠 Parameters

| Parameter     | Type     | Default    | Description         
                                        
| `prompt`      | `string` | —                         | The user’s raw input prompt                        |
| `temperature` | `number` | `0.5`                     | Controls creativity (0 = focused, 1 = imaginative) |
| `model`       | `string` | auto-detected or `llama3` | Which Ollama model to use                          |

---

## Environment Variables

You can configure defaults using a `.env` file:

```bash
# .env
OLLAMA_BASE_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=mistral
OLLAMA_TEMPERATURE=0.4
```

Your code doesn’t change — the module automatically picks these up.

---

## 💻 Example: API Integration

```js
import express from "express";
import cors from "cors";
import { optimizePrompt } from "ollama-prompt-engine";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/optimize", async (req, res) => {
  try {
    const { prompt, temperature, model } = req.body;
    const result = await optimizePrompt(prompt, temperature, model);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(8080, () => console.log(" Running at http://localhost:8080"));
```

---

### 🧩 Example Request (Postman or frontend)

**POST → `http://localhost:8080/optimize`**

**Body:**

```json
{
  "prompt": "teach me gravity like I’m 10 years old",
  "temperature": 0.6
}
```

**Response:**

```json
{
  "optimized_prompt": "You are a science teacher explaining gravity to a 10-year-old in a fun and easy way using everyday examples."
}
```

---

## ⚙️ Default Behaviors

| Scenario                         | What Happens                                                                                    
| No model provided                | The module auto-selects the best installed one (prefers Llama3 → Mistral → Gemma → Phi3 → CodeLlama) |
| No temperature provided          | Defaults to 0.5 (or `.env` value if defined)                                                         |
| Ollama not installed             | Error: instructs user to install Ollama                                                              |
| Ollama not running               | Error: suggests running `ollama serve`                                                               |
| Invalid temperature (e.g. 2, -1) | Automatically falls back to default                                                                  |

---

## 🧱 Input → Output Flow

```
User JSON Input
   ↓
{
  "prompt": "explain relativity simply",
  "temperature": 0.6,
  "model": "llama3"
}
   ↓
[ Grippe ]
  → Applies prompt-engineering logic
  → Sends to Ollama model
  → Returns rewritten version
   ↓
Output JSON
{
  "optimized_prompt": "You are a physicist. Explain Einstein’s theory of relativity in a simple and intuitive way."
}
```

---

## 🧰 CLI Usage (Optional)

You can expose a command-line tool for quick testing by adding this to your `package.json`:

```json
"bin": {
  "grippe": "./cli.js"
}
```

Then create `cli.js`:

```js
#!/usr/bin/env node
import { optimizePrompt } from "./index.js";

const prompt = process.argv.slice(2).join(" ") || "explain AI";
const result = await optimizePrompt(prompt);
console.log(result.optimized_prompt);
```

Run it with:

```bash
npx grippe "what is artificial intelligence?"
```

---

## 🏢 Enterprise Deployment

In large organizations:

* Ollama runs on GPU servers (not on developer laptops).
* The endpoint is set in `.env`, e.g.:

  ```bash
  OLLAMA_BASE_URL=http://ollama.internal.company.ai:11434/api/generate
  ```
* The module connects securely to that endpoint for multi-user access.

---

## 📊 Summary

| Feature           | Description                                |
| ----------------- | ------------------------------------------ |
| 🧠 Local & Remote | Works offline or via internal API          |
| ⚙️ Configurable   | Models, temperature, endpoint              |
| 💸 Free           | No API cost, fully open-source             |
| 🔒 Private        | Keeps data local — ideal for sensitive use |
| 🪶 Lightweight    | ~50KB package, no heavy dependencies       |

---

## 🧾 License

MIT © 2025 Bello Okatahi Dominic

---

## ❤️ Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/awesome`)
3. Commit your changes (`git commit -m 'Added awesome feature'`)
4. Push and open a PR

---

##  Example Developer Output

```
 Using model: mistral | Temperature: 0.7
 Optimized Prompt Result:
{
  "optimized_prompt": "You are an astrophysicist. Explain black holes clearly to a curious audience using simple analogies."
}