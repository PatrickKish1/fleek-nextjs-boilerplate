import { domainToASCII as _domainToASCII } from 'url';
export const domainToASCII = _domainToASCII || function (domain) {
  if (!domain) return domain;
  try {
    return new URL(domain.startsWith('http') ? domain : `https://${domain}`).hostname.toLowerCase();
  } catch {
    return domain.toLowerCase();
  }
};