import { Provider } from "../types.ts";
import { createAnthropic } from "./anthropic.ts";
import { createOpenAICompat } from "./openai-compat.ts";

const providers: Record<string, () => Provider> = {
  anthropic: createAnthropic,
  "anthropic-openai": () =>
    createOpenAICompat(
      "anthropic-openai",
      "https://api.anthropic.com/v1/",
      process.env.ANTHROPIC_API_KEY,
      "claude-sonnet-5",
    ),
  groq: () =>
    createOpenAICompat(
      "groq",
      "https://api.groq.com/openai/v1",
      process.env.GROQ_API_KEY || process.env.GROK_API_KEY,
      "qwen/qwen3.8-27b",
    ),
  gemini: () =>
    createOpenAICompat(
      "gemini",
      "https://generativelanguage.googleapis.com/v1beta/openai/",
      process.env.GEMINI_API_KEY || process.env.GROK_API_KEY || process.env.GROQ_API_KEY,
      "gemini-3.8-flash",
    ),
  grok: () => {
    const key = process.env.GROK_API_KEY || process.env.GEMINI_API_KEY;
    if (key?.startsWith("AQ.")) {
      return createOpenAICompat(
        "gemini",
        "https://generativelanguage.googleapis.com/v1beta/openai/",
        key,
        "gemini-3.8-flash",
      );
    }
    return createOpenAICompat(
      "grok",
      "https://api.x.ai/v1",
      key,
      "grok-beta",
    );
  },
  openrouter: () => {
    const key = process.env.OPENROUTER_API_KEY || process.env.openrouter_api_key;
    return createOpenAICompat(
      "openrouter",
      "https://openrouter.ai/api/v1",
      key,
      "openrouter/free",
    );
  },
};

export function getProvider(name: string): Provider {
  const create = providers[name];
  if (!create) {
    throw new Error(`kuchh to grbar h at index.ts: unknown provider "${name}"`);
  }
  return create();
}