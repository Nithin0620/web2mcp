import type { ToolRiskLevel } from '../../types/platform';

export interface SafetyClassification {
  riskLevel: ToolRiskLevel;
  requiresApproval: boolean;
  reason?: string;
}

const CONSEQUENTIAL_ACTIONS = [
  'book',
  'booking',
  'reserve',
  'reservation',
  'purchase',
  'buy',
  'pay',
  'payment',
  'checkout',
  'order',
  'bid',
  'tender_bid',
  'apply',
  'submit',
  'delete',
  'cancel',
  'remove',
  'terminate',
  'transfer',
  'charge',
];

const MUTATING_ACTIONS = [
  'update',
  'set',
  'toggle',
  'save',
  'draft',
  'edit',
  'change',
  'create',
];

export function classifyToolSafety(name: string, description: string): SafetyClassification {
  const lowerName = name.toLowerCase();

  // Search and detail tools are safe and read-only by definition
  if (lowerName.startsWith('search_') || lowerName.startsWith('get_') || lowerName.startsWith('list_') || lowerName.startsWith('read_')) {
    return {
      riskLevel: 'read_only',
      requiresApproval: false,
      reason: 'Tool executes safe, read-only search or entity retrieval queries.',
    };
  }

  // Check tool name for consequential verbs
  for (const action of CONSEQUENTIAL_ACTIONS) {
    const wordRegex = new RegExp(`(^|_)${action}(_|$)`, 'i');
    if (wordRegex.test(lowerName)) {
      return {
        riskLevel: 'consequential',
        requiresApproval: true,
        reason: `Tool executes consequential external action ('${action}'). Explicit user authorization is required before execution.`,
      };
    }
  }

  // Check tool name for mutating verbs
  for (const action of MUTATING_ACTIONS) {
    const wordRegex = new RegExp(`(^|_)${action}(_|$)`, 'i');
    if (wordRegex.test(lowerName)) {
      return {
        riskLevel: 'mutating',
        requiresApproval: false,
        reason: 'Tool performs state mutation without direct financial or destructive side-effects.',
      };
    }
  }

  return {
    riskLevel: 'read_only',
    requiresApproval: false,
    reason: 'Tool executes safe query operations.',
  };
}
