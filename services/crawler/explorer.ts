import type { PageExplorationResult } from '../../types/platform';
import { TinyFishClient } from './tinyfish';
import { FallbackDriver } from './fallback-driver';

export interface ExplorationProgressEvent {
  step: 'init' | 'fetching' | 'tinyfish' | 'fallback' | 'extracting' | 'complete' | 'error';
  message: string;
  timestamp: Date;
}

export interface ExplorerOptions {
  onProgress?: (event: ExplorationProgressEvent) => void;
  tinyfishApiKey?: string;
  timeoutMs?: number;
}

export async function exploreWebsite(
  url: string,
  goal?: string,
  options?: ExplorerOptions
): Promise<PageExplorationResult> {
  const notify = (step: ExplorationProgressEvent['step'], message: string) => {
    if (options?.onProgress) {
      options.onProgress({
        step,
        message,
        timestamp: new Date(),
      });
    }
  };

  notify('init', `Initiating exploration for ${url}`);

  const tinyfish = new TinyFishClient({ apiKey: options?.tinyfishApiKey });

  if (tinyfish.isConfigured()) {
    notify('tinyfish', 'Dispatching autonomous exploration to TinyFish Agent API...');
    const result = await tinyfish.explore(url, goal);
    if (result) {
      notify('complete', `TinyFish successfully explored site: found ${result.forms.length} forms and ${result.listContainers.length} collections`);
      return result;
    }
    notify('fallback', 'TinyFish session unavailable. Engaging resilient fallback driver...');
  } else {
    notify('fallback', 'TinyFish key not specified. Engaging local headless driver...');
  }

  notify('fetching', `Fetching live DOM for ${url}...`);
  const fallbackDriver = new FallbackDriver();
  
  try {
    const explorationResult = await fallbackDriver.explore(url);
    notify('extracting', `Extracted ${explorationResult.forms.length} forms and ${explorationResult.listContainers.length} list containers`);
    notify('complete', `Completed exploration for ${explorationResult.title}`);
    return explorationResult;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    notify('error', `Exploration failed: ${errorMsg}`);
    throw err;
  }
}
