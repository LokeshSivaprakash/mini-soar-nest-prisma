import { ExtractedIocs } from './ioc.util';

export type ReputationResult = {
  ioc: string;
  type: 'ip' | 'domain' | 'url' | 'hash';
  reputation: 'malicious' | 'suspicious' | 'unknown' | 'benign';
  confidence: number; // 0-100
  source: 'mock-ti';
};

function scoreFor(rep: ReputationResult['reputation']) {
  switch (rep) {
    case 'malicious': return 90;
    case 'suspicious': return 60;
    case 'unknown': return 30;
    case 'benign': return 5;
  }
}

export function enrichIocsMock(iocs: ExtractedIocs): ReputationResult[] {
  const results: ReputationResult[] = [];

  // simple deterministic logic: certain patterns are "bad"
  for (const ip of iocs.ips) {
    const rep = ip.startsWith('1.2.3.') ? 'malicious' : 'unknown';
    results.push({ ioc: ip, type: 'ip', reputation: rep, confidence: scoreFor(rep), source: 'mock-ti' });
  }

  for (const d of iocs.domains) {
    const rep = d.includes('evil') ? 'malicious' : 'unknown';
    results.push({ ioc: d, type: 'domain', reputation: rep, confidence: scoreFor(rep), source: 'mock-ti' });
  }

  for (const u of iocs.urls) {
    const rep = u.includes('data:text/html') ? 'malicious' : 'unknown';
    results.push({ ioc: u, type: 'url', reputation: rep, confidence: scoreFor(rep), source: 'mock-ti' });
  }

  for (const h of iocs.hashes) {
    const rep = h.startsWith('deadbeef') ? 'suspicious' : 'unknown';
    results.push({ ioc: h, type: 'hash', reputation: rep, confidence: scoreFor(rep), source: 'mock-ti' });
  }

  return results;
}
