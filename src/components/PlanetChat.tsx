import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, X, Send, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Planet } from '@/data/planets';
import { chatDB } from '@/lib/localDB';
import { mockPlanetChat } from '@/lib/mockAI';
import { getSessionId } from '@/lib/session';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function PlanetChat({ planet }: { planet: Planet }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abort = useRef(false);

  useEffect(() => {
    abort.current = false; setMessages([]); setInput(''); setLoading(false);
    const sid = getSessionId();
    setMessages(chatDB.getForPlanet(sid, planet.id).map((r) => ({ role: r.role, content: r.content })));
  }, [planet.id]);

  const clear = () => { chatDB.clearForPlanet(getSessionId(), planet.id); setMessages([]); toast.success('History cleared'); };
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, loading]);

  const send = async () => {
    const text = input.trim(); if (!text || loading) return;
    setInput('');
    const next: Msg[] = [...messages, { role: 'user', content: text }];
    setMessages(next); setLoading(true); abort.current = false;
    chatDB.insert({ session_id: getSessionId(), planet_id: planet.id, role: 'user', content: text });
    let acc = '';
    try {
      await mockPlanetChat(planet, next, (chunk) => {
        if (abort.current) return;
        acc += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: acc } : m);
          return [...prev, { role: 'assistant', content: acc }];
        });
      });
      if (acc.trim()) chatDB.insert({ session_id: getSessionId(), planet_id: planet.id, role: 'assistant', content: acc });
    } catch (e: any) { if (!abort.current) toast.error('Something went wrong.'); }
    finally { setLoading(false); }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Ask about this planet" className="fixed bottom-20 right-5 md:bottom-24 md:right-8 z-50"
        style={{ width:56,height:56,borderRadius:'999px',background:'linear-gradient(135deg,hsl(280 85% 60%),hsl(220 90% 55%))',boxShadow:'0 10px 30px hsl(280 85% 60%/0.45)',animation:'chatPulse 2.4s ease-in-out infinite' }}>
        <Sparkles className="w-6 h-6 mx-auto text-white" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end" onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); abort.current = true; } }}>
          <div className="absolute inset-0" style={{ background:'rgba(3,6,18,0.55)',backdropFilter:'blur(6px)' }} />
          <div className="chat-panel-enter relative w-full md:w-[420px] h-[80vh] md:h-full flex flex-col"
            style={{ background:'linear-gradient(180deg,hsl(222 60% 8%/0.96),hsl(222 60% 5%/0.98))',borderLeft:'1px solid rgba(255,255,255,0.08)',borderTop:'1px solid rgba(255,255,255,0.08)',borderTopLeftRadius:20,borderTopRightRadius:20 }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color:'hsl(280 85% 70%)' }} />
                <h3 className="text-sm font-semibold">Ask about <span className="text-white">{planet.name}</span></h3>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && <button onClick={clear} className="p-1.5 rounded-md hover:bg-white/10 transition text-white/60 hover:text-white" title="Clear history"><Trash2 className="w-4 h-4" /></button>}
                <button onClick={() => { setOpen(false); abort.current = true; }} className="p-1.5 rounded-md hover:bg-white/10 transition" aria-label="Close"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-white/55 text-xs mt-8 space-y-3">
                  <p>Curious about {planet.name}? Ask anything.</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[`Why is ${planet.name} unique?`,`Could humans live on ${planet.name}?`,`Fun facts about ${planet.name}`].map((q) => (
                      <button key={q} onClick={() => setInput(q)} className="px-3 py-1.5 rounded-full text-[11px] border border-white/15 hover:bg-white/10 transition">{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${m.role==='user'?'rounded-br-sm text-white':'rounded-bl-sm text-white/90'}`}
                    style={{ background:m.role==='user'?'linear-gradient(135deg,hsl(280 70% 50%),hsl(220 80% 50%))':'rgba(255,255,255,0.06)', border:m.role==='assistant'?'1px solid rgba(255,255,255,0.08)':'none' }}>
                    {m.role==='assistant'?<div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{m.content||'…'}</ReactMarkdown></div>:m.content}
                  </div>
                </div>
              ))}
              {loading && messages[messages.length-1]?.role==='user' && (
                <div className="flex justify-start"><div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white/6 border border-white/10"><Loader2 className="w-4 h-4 animate-spin text-white/60" /></div></div>
              )}
            </div>
            <form onSubmit={(e)=>{e.preventDefault();send();}} className="p-3 border-t border-white/10 flex gap-2">
              <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder={`Ask anything about ${planet.name}…`} className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-[13px] outline-none focus:border-white/30 transition" disabled={loading} />
              <button type="submit" disabled={loading||!input.trim()} className="rounded-full w-10 h-10 flex items-center justify-center text-white disabled:opacity-40 transition" style={{ background:'linear-gradient(135deg,hsl(280 85% 60%),hsl(220 90% 55%))' }} aria-label="Send">
                {loading?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4"/>}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
