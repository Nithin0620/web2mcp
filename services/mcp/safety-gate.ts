import crypto from 'crypto';

interface PendingApproval {
  token: string;
  toolName: string;
  projectId: string;
  createdAt: number;
}

const pendingApprovals = new Map<string, PendingApproval>();
const EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

export function requestApprovalToken(
  toolName: string,
  projectId: string
): { token: string; message: string } {
  const token = `CONFIRM_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  pendingApprovals.set(token, {
    token,
    toolName,
    projectId,
    createdAt: Date.now(),
  });

  const message = `⚠️ Safety Gate Alert: The tool '${toolName}' executes a consequential or state-mutating external action.
To execute this operation, you must explicitly confirm by re-running with the parameter:
  "approvalToken": "${token}"`;

  return { token, message };
}

export function verifyApprovalToken(token: string | undefined, toolName: string): boolean {
  if (!token) return false;

  const approval = pendingApprovals.get(token);
  if (!approval) return false;

  if (Date.now() - approval.createdAt > EXPIRATION_MS) {
    pendingApprovals.delete(token);
    return false;
  }

  if (approval.toolName !== toolName) {
    return false;
  }

  // Once consumed, remove to avoid reuse
  pendingApprovals.delete(token);
  return true;
}
