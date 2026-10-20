import React from 'react';
import { Metadata } from 'next';
import { UserDashboardClient } from './dashboard-client';

export const metadata: Metadata = {
  title: 'Dashboard — Web2MCP Command Center',
  description: 'View and manage your created MCP servers, monitor total calls, latency, and live invocation metrics.',
};

export default function DashboardPage() {
  return <UserDashboardClient />;
}
