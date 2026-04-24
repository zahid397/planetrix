import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

export default function ContactContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) {
      toast.error('Please fill in all fields');
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success('Message sent!', { description: `Thanks ${name}, we’ll reply to ${email} soon.` });
      setName(''); setEmail(''); setMsg('');
      setSending(false);
    }, 700);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#fff',
    fontSize: 13,
    outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 6,
    display: 'block',
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
        Send us a transmission. We answer every signal — usually within 48 Earth hours. 📡
      </p>
      <div>
        <label style={labelStyle}>Name</label>
        <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
      </div>
      <div>
        <label style={labelStyle}>Email</label>
        <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ada@cosmos.io" />
      </div>
      <div>
        <label style={labelStyle}>Message</label>
        <textarea
          style={{ ...inputStyle, minHeight: 110, resize: 'vertical', fontFamily: 'inherit' }}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Tell us about your mission…"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-full py-3 transition-all hover:scale-[1.02] disabled:opacity-60"
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#0A1628',
          background: 'linear-gradient(135deg, #ffffff 0%, #a8c8ff 100%)',
          boxShadow: '0 8px 30px rgba(120,160,255,0.35)',
        }}
      >
        {sending ? 'Transmitting…' : 'Send Transmission'}
      </button>
    </form>
  );
}
