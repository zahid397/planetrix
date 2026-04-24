import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { GitCompare, X, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { PLANETS, type Planet } from '@/data/planets';
import { mockComparePlanets } from '@/lib/mockAI';
export default function ComparePlanets({ initialPlanetId }: { initialPlanetId: string }) {
  const [open, setOpen] = useState(false);
  const [a, setA] = useState<Planet>(PLANETS.find((p)=>p.id===initialPlanetId)??PLANETS[3]);
  const [b, setB] = useState<Planet>(PLANETS.find((p)=>p.id!==a.id)??PLANETS[4]);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const abort = useRef(false);
  useEffect(() => {
    if (!open) return;
    const cur = PLANETS.find((p)=>p.id===initialPlanetId)??PLANETS[3];
    setA(cur); setB((prev)=>prev.id===cur.id?PLANETS.find((p)=>p.id!==cur.id)!:prev); setAnalysis('');
  }, [open, initialPlanetId]);
  const run = async () => {
    if (a.id===b.id){toast.error('Pick two different planets.');return;}
    abort.current=false; setLoading(true); setAnalysis(''); let acc='';
    try {
      await mockComparePlanets(a,b,(chunk)=>{if(abort.current)return;acc+=chunk;setAnalysis(acc);});
    } catch(e:any){if(!abort.current)toast.error('Something went wrong.');}
    finally{setLoading(false);}
  };
  return (<>
    <button onClick={()=>setOpen(true)} aria-label="Compare two planets" className="fixed top-5 right-5 md:top-6 md:right-8 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full text-[12px] font-semibold"
      style={{background:'linear-gradient(135deg,hsl(180 70% 35%/0.85),hsl(220 80% 35%/0.85))',border:'1px solid rgba(255,255,255,0.18)',boxShadow:'0 6px 22px hsl(190 80% 45%/0.35)',backdropFilter:'blur(8px)',color:'#fff'}}>
      <GitCompare className="w-3.5 h-3.5"/><span className="hidden sm:inline">Compare</span>
    </button>
    {open&&(
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6" onClick={(e)=>{if(e.target===e.currentTarget){setOpen(false);abort.current=true;}}}>
        <div className="absolute inset-0" style={{background:'rgba(3,6,18,0.65)',backdropFilter:'blur(8px)'}}/>
        <div className="chat-panel-enter relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden"
          style={{background:'linear-gradient(180deg,hsl(222 60% 8%/0.97),hsl(222 60% 5%/0.99))',border:'1px solid rgba(255,255,255,0.10)',boxShadow:'0 30px 80px rgba(0,0,0,0.6)'}}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-2"><GitCompare className="w-4 h-4" style={{color:'hsl(190 85% 65%)'}}/><h3 className="text-sm font-semibold">Compare Planets</h3></div>
            <button onClick={()=>{setOpen(false);abort.current=true;}} className="p-1.5 rounded-md hover:bg-white/10 transition"><X className="w-4 h-4"/></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 border-b border-white/10">
            <Picker label="Planet A" value={a} onChange={setA}/><ArrowRight className="hidden sm:block text-white/40 mx-auto"/><Picker label="Planet B" value={b} onChange={setB}/>
          </div>
          <div className="grid grid-cols-2 gap-3 px-5 py-4 border-b border-white/10">
            <StatsCard planet={a} accent="hsl(190 85% 60%)"/><StatsCard planet={b} accent="hsl(280 80% 65%)"/>
          </div>
          <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between gap-3">
            <p className="text-[11px] text-white/55">AI will write a vivid side-by-side comparison.</p>
            <button onClick={run} disabled={loading||a.id===b.id} className="text-[12px] font-semibold px-4 py-2 rounded-full text-white disabled:opacity-40 flex items-center gap-2" style={{background:'linear-gradient(135deg,hsl(190 85% 45%),hsl(280 80% 55%))'}}>
              {loading?<Loader2 className="w-3.5 h-3.5 animate-spin"/>:<GitCompare className="w-3.5 h-3.5"/>}
              {loading?'Analyzing…':analysis?'Re-analyze':'Generate comparison'}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {!analysis&&!loading&&<p className="text-center text-white/45 text-xs py-12">Pick two planets and tap "Generate comparison".</p>}
            {loading&&!analysis&&<div className="flex items-center justify-center py-12 text-white/55 text-xs gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Composing…</div>}
            {analysis&&<div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-strong:text-white prose-p:text-white/85"><ReactMarkdown>{analysis}</ReactMarkdown></div>}
          </div>
        </div>
      </div>
    )}
  </>);
}
function Picker({label,value,onChange}:{label:string;value:Planet;onChange:(p:Planet)=>void}) {
  return (<label className="flex flex-col gap-1.5">
    <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/45">{label}</span>
    <select value={value.id} onChange={(e)=>{const p=PLANETS.find((pl)=>pl.id===e.target.value);if(p)onChange(p);}} className="bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/40 transition">
      {PLANETS.map((p)=><option key={p.id} value={p.id} className="bg-[#0a0e1f]">{p.name}</option>)}
    </select>
  </label>);
}
function StatsCard({planet,accent}:{planet:Planet;accent:string}) {
  return (<div className="rounded-xl p-3 border" style={{background:`${accent.replace(')','/ 0.10)').replace('hsl','hsla')}`,borderColor:'rgba(255,255,255,0.08)'}}>
    <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full" style={{background:accent}}/><h4 className="text-xs font-bold tracking-wider uppercase">{planet.name}</h4></div>
    <dl className="space-y-1 text-[11px]">
      {[['Diameter',planet.diameter],['Day',planet.lengthOfDay],['Avg Temp',planet.avgTemp]].map(([k,v])=>(
        <div key={k} className="flex justify-between gap-2"><dt className="text-white/45">{k}</dt><dd className="text-white text-right">{v}</dd></div>
      ))}
    </dl>
  </div>);
}
