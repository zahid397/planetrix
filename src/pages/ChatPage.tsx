import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Send, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import StarfieldCanvas from '@/components/StarfieldCanvas';
import GalaxyCanvas from '@/components/GalaxyCanvas';
import Logo from '@/components/Logo';
import { PLANETS, type Planet } from '@/data/planets';
import { chatDB } from '@/lib/localDB';
import { mockPlanetChat } from '@/lib/mockAI';
import { getSessionId } from '@/lib/session';
type Msg = { role:'user'|'assistant'; content:string };
const LAST_KEY = 'last_planet_id';
export default function ChatPage() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const initId = params.get('planet') || localStorage.getItem(LAST_KEY) || PLANETS[0].id;
  const [planetId, setPlanetId] = useState(initId);
  const planet: Planet = useMemo(() => PLANETS.find((p)=>p.id===planetId)||PLANETS[0],[planetId]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abort = useRef(false);
  useEffect(() => {
    abort.current = true; setMessages([]); setInput(''); setLoading(false);
    setTimeout(() => { abort.current = false; }, 0);
    setMessages(chatDB.getForPlanet(getSessionId(), planet.id).map((r)=>({role:r.role,content:r.content})));
  }, [planet.id]);
  useEffect(() => { scrollRef.current?.scrollTo({top:scrollRef.current.scrollHeight,behavior:'smooth'}); }, [messages, loading]);
  const changePlanet = (id:string) => { setPlanetId(id); setParams({planet:id}); localStorage.setItem(LAST_KEY,id); };
  const clear = () => { chatDB.clearForPlanet(getSessionId(),planet.id); setMessages([]); toast.success('History cleared'); };
  const send = async () => {
    const text = input.trim(); if (!text||loading) return;
    setInput('');
    const next: Msg[] = [...messages, {role:'user',content:text}];
    setMessages(next); setLoading(true); abort.current = false;
    chatDB.insert({session_id:getSessionId(),planet_id:planet.id,role:'user',content:text});
    let acc = '';
    try {
      await mockPlanetChat(planet, next, (chunk) => {
        if (abort.current) return;
        acc += chunk;
        setMessages((prev) => { const last = prev[prev.length-1]; if (last?.role==='assistant') return prev.map((m,i)=>i===prev.length-1?{...m,content:acc}:m); return [...prev,{role:'assistant',content:acc}]; });
      });
      if (acc.trim()) chatDB.insert({session_id:getSessionId(),planet_id:planet.id,role:'assistant',content:acc});
    } catch (e:any) { if (!abort.current) toast.error('Something went wrong.'); }
    finally { setLoading(false); }
  };
  return (
    <><GalaxyCanvas/><StarfieldCanvas/><div className="star-field" aria-hidden/>
    <main className="relative flex flex-col" style={{height:'100dvh'}}>
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-3">
          <button onClick={()=>nav('/dashboard')} className="dash-back"><ArrowLeft className="w-4 h-4"/></button>
          <Logo size={16}/>
        </div>
        <div className="flex items-center gap-2">
          <select value={planet.id} onChange={(e)=>changePlanet(e.target.value)} className="planet-select">
            {PLANETS.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {messages.length>0 && <button onClick={clear} className="p-2 rounded-md hover:bg-white/10 transition text-white/60 hover:text-white"><Trash2 className="w-4 h-4"/></button>}
        </div>
      </header>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length===0 && (
            <div className="text-center text-white/55 mt-10 space-y-4">
              <Sparkles className="w-8 h-8 mx-auto" style={{color:'hsl(280 85% 70%)'}}/>
              <p className="text-lg">Curious about <span className="text-white font-semibold">{planet.name}</span>?</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[`Why is ${planet.name} unique?`,`Could humans live on ${planet.name}?`,`Fun facts about ${planet.name}`].map((q)=>(
                  <button key={q} onClick={()=>setInput(q)} className="px-3 py-1.5 rounded-full text-xs border border-white/15 hover:bg-white/10 transition">{q}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m,i)=>(
            <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role==='user'?'rounded-br-sm text-white':'rounded-bl-sm text-white/90'}`}
                style={{background:m.role==='user'?'linear-gradient(135deg,hsl(280 70% 50%),hsl(220 80% 50%))':'rgba(255,255,255,0.06)',border:m.role==='assistant'?'1px solid rgba(255,255,255,0.08)':'none'}}>
                {m.role==='assistant'?<div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{m.content||'…'}</ReactMarkdown></div>:m.content}
              </div>
            </div>
          ))}
          {loading&&messages[messages.length-1]?.role==='user'&&(
            <div className="flex justify-start"><div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/6 border border-white/10"><Loader2 className="w-4 h-4 animate-spin text-white/60"/></div></div>
          )}
        </div>
      </div>
      <form onSubmit={(e)=>{e.preventDefault();send();}} className="border-t border-white/10 bg-black/30 backdrop-blur-md px-4 md:px-8 py-3">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder={`Ask anything about ${planet.name}…`} className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm outline-none focus:border-white/30 transition" disabled={loading}/>
          <button type="submit" disabled={loading||!input.trim()} className="rounded-full w-12 h-12 flex items-center justify-center text-white disabled:opacity-40 transition" style={{background:'linear-gradient(135deg,hsl(280 85% 60%),hsl(220 90% 55%))'}}>
            {loading?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4"/>}
          </button>
        </div>
      </form>
    </main></>
  );
}
