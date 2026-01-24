export type ExtractedIocs = {
  ips: string[];
  domains: string[];
  urls: string[];
  hashes: string[];
};

// basic regexes (good enough for MVP)
const ipRegex = /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g;
const domainRegex = /\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b/g;
const urlRegex = /\bhttps?:\/\/[^\s"]+\b/g;
const hashRegex = /\b[a-fA-F0-9]{32}\b|\b[a-fA-F0-9]{40}\b|\b[a-fA-F0-9]{64}\b/g;

export function extractIocs(obj: any): ExtractedIocs {
  const text = JSON.stringify(obj ?? {});

  const ips: string[] = text.match(ipRegex) ?? [];
  const urls: string[] = text.match(urlRegex) ?? [];
  const hashes: string[] = text.match(hashRegex) ?? [];
  const domains: string[] = (text.match(domainRegex) ?? []).filter(
    (d: string) => !ips.includes(d),
  );

  return {
    ips: [...new Set(ips)],
    domains: [...new Set(domains)],
    urls: [...new Set(urls)],
    hashes: [...new Set(hashes)],
  };
}
