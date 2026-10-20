export interface LLMAnalysisPrompt {
  systemPrompt: string;
  userPrompt: string;
}

export class AIAnalyzer {
  private apiKey: string | null;
  private endpoint: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || null;
    this.endpoint = process.env.OPENROUTER_API_KEY
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async complete(prompt: LLMAnalysisPrompt): Promise<string | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.LLM_MODEL || 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: prompt.systemPrompt },
            { role: 'user', content: prompt.userPrompt },
          ],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        console.warn(`[AIAnalyzer] LLM request returned ${response.status}`);
        return null;
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (err) {
      console.warn('[AIAnalyzer] LLM query failed, using built-in deterministic schema synthesizer:', err);
      return null;
    }
  }
}
