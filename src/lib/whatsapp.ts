export const WHATSAPP_NUMBER = '8801787715005';

export interface ApplicationPayload {
  job_role: string;
  full_name: string;
  email: string;
  phone: string;
  experience: string;
  portfolio_url?: string;
  cover_note?: string;
  resume_url?: string;
}

export function buildWhatsAppMessage(data: ApplicationPayload): string {
  const lines = [
    '🚀 New Planetrix Application',
    `Role: ${data.job_role}`,
    `Name: ${data.full_name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Experience: ${data.experience}`,
  ];
  if (data.portfolio_url) lines.push(`Portfolio: ${data.portfolio_url}`);
  if (data.resume_url) lines.push(`Resume: ${data.resume_url}`);
  if (data.cover_note) lines.push(`Note: ${data.cover_note}`);
  return lines.join('\n');
}

export function whatsAppUrl(data: ApplicationPayload): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(data))}`;
}

export function sendToWhatsApp(data: ApplicationPayload): Window | null {
  return window.open(whatsAppUrl(data), '_blank', 'noopener,noreferrer');
}
