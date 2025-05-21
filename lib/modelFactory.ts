interface AIModel {
  start: (workflowId: string, options: any) => Promise<void>;
  stop: () => void;
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
}

// Concrete implementation for default VAPI model
class DefaultVAPIModel implements AIModel {
  private vapi;

  constructor() {
    this.vapi = require("@/lib/vapi.sdk").vapi;
  }

  async start(workflowId: string, options: any) {
    return this.vapi.start(workflowId, options);
  }

  stop() {
    return this.vapi.stop();
  }

  on(event: string, callback: Function) {
    return this.vapi.on(event, callback);
  }

  off(event: string, callback: Function) {
    return this.vapi.off(event, callback);
  }
}

// OpenAI GPT-4o implementation (latest model from OpenAI)
class GPT4oModel implements AIModel {
  private vapi;

  constructor() {
    this.vapi = require("@/lib/vapi.sdk").vapi;
  }

  async start(workflowId: string, options: any) {
    const gpt4oOptions = {
      ...options,
      variableValues: {
        ...options.variableValues,
        model: "gpt-4o",
      },
    };
    return this.vapi.start(process.env.NEXT_PUBLIC_GPT4_WORKFLOW_ID || workflowId, gpt4oOptions);
  }

  stop() {
    return this.vapi.stop();
  }

  on(event: string, callback: Function) {
    return this.vapi.on(event, callback);
  }

  off(event: string, callback: Function) {
    return this.vapi.off(event, callback);
  }
}

// OpenAI GPT-3.5 Turbo implementation
class GPT35TurboModel implements AIModel {
  private vapi;

  constructor() {
    this.vapi = require("@/lib/vapi.sdk").vapi;
  }

  async start(workflowId: string, options: any) {
    const gpt35Options = {
      ...options,
      variableValues: {
        ...options.variableValues,
        model: "gpt-3.5-turbo",
      },
    };
    return this.vapi.start(process.env.NEXT_PUBLIC_GPT4_WORKFLOW_ID || workflowId, gpt35Options);
  }

  stop() {
    return this.vapi.stop();
  }

  on(event: string, callback: Function) {
    return this.vapi.on(event, callback);
  }

  off(event: string, callback: Function) {
    return this.vapi.off(event, callback);
  }
}

// Claude 3 Opus implementation (Anthropic's most capable model)
class Claude3OpusModel implements AIModel {
  private vapi;

  constructor() {
    this.vapi = require("@/lib/vapi.sdk").vapi;
  }

  async start(workflowId: string, options: any) {
    const claudeOptions = {
      ...options,
      variableValues: {
        ...options.variableValues,
        model: "claude-3-opus-20240229",
      },
    };
    return this.vapi.start(process.env.NEXT_PUBLIC_CLAUDE_WORKFLOW_ID || workflowId, claudeOptions);
  }

  stop() {
    return this.vapi.stop();
  }

  on(event: string, callback: Function) {
    return this.vapi.on(event, callback);
  }

  off(event: string, callback: Function) {
    return this.vapi.off(event, callback);
  }
}

// Claude 3 Sonnet implementation (Anthropic's balanced model)
class Claude3SonnetModel implements AIModel {
  private vapi;

  constructor() {
    this.vapi = require("@/lib/vapi.sdk").vapi;
  }

  async start(workflowId: string, options: any) {
    const claudeOptions = {
      ...options,
      variableValues: {
        ...options.variableValues,
        model: "claude-3-sonnet-20240229",
      },
    };
    return this.vapi.start(process.env.NEXT_PUBLIC_CLAUDE_WORKFLOW_ID || workflowId, claudeOptions);
  }

  stop() {
    return this.vapi.stop();
  }

  on(event: string, callback: Function) {
    return this.vapi.on(event, callback);
  }

  off(event: string, callback: Function) {
    return this.vapi.off(event, callback);
  }
}

// Gemini 1.5 Pro implementation (Google's latest model)
class Gemini15ProModel implements AIModel {
  private vapi;

  constructor() {
    this.vapi = require("@/lib/vapi.sdk").vapi;
  }

  async start(workflowId: string, options: any) {
    const geminiOptions = {
      ...options,
      variableValues: {
        ...options.variableValues,
        model: "gemini-1.5-pro",
      },
    };
    return this.vapi.start(process.env.NEXT_PUBLIC_GEMINI_PRO_WORKFLOW_ID || workflowId, geminiOptions);
  }

  stop() {
    return this.vapi.stop();
  }

  on(event: string, callback: Function) {
    return this.vapi.on(event, callback);
  }

  off(event: string, callback: Function) {
    return this.vapi.off(event, callback);
  }
}

// Model Factory
class ModelFactory {
  static createModel(modelType: string): AIModel {
    switch (modelType) {
      case "gpt-4o":
        return new GPT4oModel();
      case "gpt-3.5-turbo":
        return new GPT35TurboModel();
      case "claude-3-opus":
        return new Claude3OpusModel();
      case "claude-3-sonnet":
        return new Claude3SonnetModel();
      case "gemini-1.5-pro":
        return new Gemini15ProModel();
      default:
        return new DefaultVAPIModel();
    }
  }
}

export default ModelFactory;