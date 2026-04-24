import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { Check, Loader2, ExternalLink, X, Paperclip, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { appsDB } from '@/lib/localDB';
import { sendToWhatsApp, whatsAppUrl, type ApplicationPayload } from '@/lib/whatsapp';
const ALLOWED = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX = 5*1024*1024;
const schema = z.object({
  full_name:z.string().trim().min(2,'Min 2 chars').max(100),
  email:z.string().trim().email('Valid email required').max(255),
  phone:z.string().trim().min(5,'Valid phone required').max(30),
  experience:z.enum(['0-1','1-3','3-5','5+'],{errorMap:()=>({message:'Pick experience'})}),
  portfolio_url:z.string().trim().max(300).url('Must be a valid URL').optional().or(z.literal('')),
  cover_note:z.string().trim().max(600).optional().or(z.literal('')),
});
type FS={full_name:string;email:string;phone:string;experience:''|'0-1'|'1-3'|'3-5'|'5+';portfolio_url:string;cover_note:string};
const EMPTY:FS={full_name:'',email:'',phone:'',experience:'',portfolio_url:'',cover_note:''};
const DRAFT='planetrix_apply_draft';
export default function ApplyForm({jobRole,onClose}:{jobRole:string;onClose:()=>void}) {
  const [data,setData]=useState<FS>(()=>{try{const r=localStorage.getItem(DRAFT);return r?{...EMPTY,...JSON.parse(r)}:EMPTY;}catch{return EMPTY;}});
  const [errors,setErrors]=useState<Partial<Record<keyof FS,string>>>({});
  const [submitting,setSubmitting]=useState(false);
  const [success,setSuccess]=useState<ApplicationPayload|null>(null);
  const [resume,setResume]=useState<File|null>(null);
  const firstRef=useRef<HTMLInputElement>(null);
  const fileRef=useRef<HTMLInputElement>(null);
  useEffect(()=>{firstRef.current?.focus();},[]);
  useEffect(()=>{localStorage.setItem(DRAFT,JSON.stringify(data));},[data]);
  const set=<K extends keyof FS>(k:K,v:FS[K])=>{setData((d)=>({...d,[k]:v}));setErrors((e)=>({...e,[k]:undefined}));};
  const pickFile=(f:File|null)=>{
    if(!f){setResume(null);return;}
    if(!ALLOWED.includes(f.type)){toast.error('Only PDF or DOC/DOCX');return;}
    if(f.size>MAX){toast.error('File too large — max 5 MB');return;}
    setResume(f);
  };
  const onSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    const p=schema.safeParse(data);
    if(!p.success){const fe:Partial<Record<keyof FS,string>>={};for(const i of p.error.issues){const k=i.path[0] as keyof FS;if(!fe[k])fe[k]=i.message;}setErrors(fe);toast.error('Fix highlighted fields');return;}
    setSubmitting(true);
    try {
      appsDB.insert({job_role:jobRole,full_name:p.data.full_name,email:p.data.email,phone:p.data.phone,experience:p.data.experience,portfolio_url:p.data.portfolio_url||null,cover_note:p.data.cover_note||null,resume_path:resume?resume.name:null});
      const payload:ApplicationPayload={job_role:jobRole,full_name:p.data.full_name,email:p.data.email,phone:p.data.phone,experience:p.data.experience,portfolio_url:p.data.portfolio_url||undefined,cover_note:p.data.cover_note||undefined};
      localStorage.removeItem(DRAFT);
      const popup=sendToWhatsApp(payload);
      if(!popup)toast.message('Popup blocked',{description:'Tap "Open WhatsApp" below.'});
      else toast.success('Application sent!',{description:'WhatsApp is opening…'});
      setSuccess(payload);
    } catch(err:any){toast.error('Submission failed',{description:err?.message??'Try again.'});}
    finally{setSubmitting(false);}
  };
  if(success)return(
    <div className="apply-success animate-fade-in text-center py-6">
      <div className="apply-check mx-auto mb-4"><Check size={32} strokeWidth={3}/></div>
      <h3 style={{fontSize:18,fontWeight:700,color:'#fff'}}>Application Sent</h3>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.65)',marginTop:8,lineHeight:1.6}}>Thanks {success.full_name.split(' ')[0]} — received for <b>{success.job_role}</b>.</p>
      <div className="flex gap-2 justify-center mt-5">
        <a href={whatsAppUrl(success)} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 inline-flex items-center gap-2" style={{fontSize:11,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#0A1628',background:'linear-gradient(135deg,#25D366,#128C7E)'}}>
          <ExternalLink size={12}/> Open WhatsApp
        </a>
        <button onClick={onClose} className="rounded-full px-4 py-2" style={{fontSize:11,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'#fff',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)'}}>Close</button>
      </div>
    </div>
  );
  return(
    <form onSubmit={onSubmit} className="apply-form-slide space-y-3">
      <div className="flex items-center justify-between">
        <div><div style={{fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.5)'}}>Applying for</div><div style={{fontSize:15,fontWeight:700,color:'#fff',marginTop:2}}>{jobRole}</div></div>
        <button type="button" onClick={onClose} className="text-white/60 hover:text-white"><X size={18}/></button>
      </div>
      {([['Full Name','full_name','Ada Lovelace','text','name'],['Email','email','you@galaxy.com','email','email'],['Phone / WhatsApp','phone','+880 17XX-XXXXXX','tel','tel']] as const).map(([label,key,ph,type,ac])=>(
        <Field key={key} label={label} error={errors[key as keyof FS]}>
          <input ref={key==='full_name'?firstRef:undefined} type={type} value={data[key as keyof FS]} onChange={(e)=>set(key as keyof FS,e.target.value)} className="apply-input" placeholder={ph} autoComplete={ac}/>
        </Field>
      ))}
      <Field label="Years of Experience" error={errors.experience}>
        <select value={data.experience} onChange={(e)=>set('experience',e.target.value as FS['experience'])} className="apply-input">
          <option value="" style={{background:'#0A1628'}}>Select…</option>
          {['0-1','1-3','3-5','5+'].map((v)=><option key={v} value={v} style={{background:'#0A1628'}}>{v==='5+'?'5+ years':`${v} years`}</option>)}
        </select>
      </Field>
      <Field label="Portfolio / LinkedIn (optional)" error={errors.portfolio_url}>
        <input type="url" value={data.portfolio_url} onChange={(e)=>set('portfolio_url',e.target.value)} className="apply-input" placeholder="https://…"/>
      </Field>
      <Field label="Resume / CV (PDF, DOC · max 5MB)">
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={(e)=>pickFile(e.target.files?.[0]??null)} style={{display:'none'}}/>
        {!resume?<button type="button" onClick={()=>fileRef.current?.click()} className="apply-file-pick"><Paperclip size={13}/> Attach resume</button>
          :<div className="apply-file-chip"><FileText size={13}/><span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{resume.name} <span style={{opacity:.5}}>({(resume.size/1024).toFixed(0)} KB)</span></span><button type="button" onClick={()=>{setResume(null);if(fileRef.current)fileRef.current.value=''}}><X size={13}/></button></div>}
      </Field>
      <Field label="Cover Note" error={errors.cover_note} hint={`${data.cover_note.length}/600`}>
        <textarea value={data.cover_note} onChange={(e)=>set('cover_note',e.target.value.slice(0,600))} className="apply-input" placeholder="Why you'd fit the mission…" rows={4} style={{resize:'none',minHeight:90}}/>
      </Field>
      <button type="submit" disabled={submitting} className="w-full rounded-full px-4 py-3 inline-flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-60 mt-2"
        style={{fontSize:12,fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'#0A1628',background:'linear-gradient(135deg,#fff,#cfe0ff)',boxShadow:'0 8px 30px rgba(120,160,255,0.25)'}}>
        {submitting?<><Loader2 size={14} className="animate-spin"/> Sending…</>:'Send Application'}
      </button>
    </form>
  );
}
function Field({label,error,hint,children}:{label:string;error?:string;hint?:string;children:React.ReactNode}) {
  return(<label className="block">
    <div className="flex items-center justify-between mb-1.5">
      <span style={{fontSize:11,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(255,255,255,0.7)'}}>{label}</span>
      {hint&&<span style={{fontSize:10,color:'rgba(255,255,255,0.4)'}}>{hint}</span>}
    </div>
    {children}
    {error&&<div style={{fontSize:11,color:'#ff8aa0',marginTop:4}}>{error}</div>}
  </label>);
}
