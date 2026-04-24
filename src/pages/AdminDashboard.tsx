import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LogOut, Search, Loader2, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Trash2, Check, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { appsDB, type JobApplication } from '@/lib/localDB';
import { toCSV, downloadCSV } from '@/lib/csv';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type SortKey = keyof Pick<JobApplication,'created_at'|'job_role'|'full_name'|'email'|'experience'>;
const PAGE_SIZE = 20;

export default function AdminDashboard() {
  const nav = useNavigate();
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const [rows, setRows] = useState<JobApplication[]>([]);
  const [fetching, setFetching] = useState(true);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [expFilter, setExpFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'new'|'reviewed'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<string,boolean>>({});
  const [pendingDelete, setPendingDelete] = useState<JobApplication|null>(null);

  useEffect(() => { if (!loading && (!user || !isAdmin)) nav('/auth?next=/admin', { replace: true }); }, [user, isAdmin, loading, nav]);

  useEffect(() => {
    if (!isAdmin) return;
    setFetching(true);
    setRows(appsDB.getAll());
    setFetching(false);
  }, [isAdmin]);

  const roles = useMemo(() => Array.from(new Set(rows.map((r) => r.job_role))).sort(), [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((r) => {
        if (roleFilter && r.job_role !== roleFilter) return false;
        if (expFilter && r.experience !== expFilter) return false;
        if (statusFilter === 'new' && r.reviewed) return false;
        if (statusFilter === 'reviewed' && !r.reviewed) return false;
        if (!q) return true;
        return r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.job_role.toLowerCase().includes(q) || r.phone.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const cmp = String(a[sortKey]??'').localeCompare(String(b[sortKey]??''));
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [rows, query, roleFilter, expFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  useEffect(() => { setPage(1); }, [query, roleFilter, expFilter, statusFilter, sortKey, sortDir]);

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7*86400000;
    return { total: rows.length, week: rows.filter((r) => new Date(r.created_at).getTime() >= weekAgo).length, pending: rows.filter((r) => !r.reviewed).length, withResume: rows.filter((r) => !!r.resume_path).length };
  }, [rows]);

  const toggleSort = (k: SortKey) => { if (sortKey===k) setSortDir((d)=>d==='asc'?'desc':'asc'); else { setSortKey(k); setSortDir('desc'); } };
  const sortIcon = (k: SortKey) => sortKey!==k?<ArrowUpDown size={11}/>:sortDir==='asc'?<ArrowUp size={11}/>:<ArrowDown size={11}/>;

  const toggleReviewed = (r: JobApplication) => {
    const next = !r.reviewed;
    appsDB.update(r.id, { reviewed: next, reviewed_at: next ? new Date().toISOString() : null });
    setRows(appsDB.getAll());
    toast.success(next ? 'Marked as reviewed' : 'Marked as new');
  };

  const exportCSV = () => {
    const csv = toCSV(filtered.map((r) => ({ ...r, reviewed_label: r.reviewed ? 'Yes' : 'No' })), [
      { key: 'created_at', header: 'Submitted' }, { key: 'job_role', header: 'Role' }, { key: 'full_name', header: 'Name' }, { key: 'email', header: 'Email' }, { key: 'phone', header: 'Phone' }, { key: 'experience', header: 'Experience' }, { key: 'reviewed_label', header: 'Reviewed' }, { key: 'portfolio_url', header: 'Portfolio' }, { key: 'cover_note', header: 'Cover Note' },
    ]);
    downloadCSV(`planetrix-applications-${new Date().toISOString().slice(0,10)}.csv`, csv);
    toast.success(`Exported ${filtered.length} applications`);
  };

  const handleSignOut = async () => { signOut(); nav('/auth', { replace: true }); };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    appsDB.delete(pendingDelete.id);
    setRows(appsDB.getAll());
    toast.success('Application deleted');
    setPendingDelete(null);
  };

  if (loading || (!isAdmin && user)) return <div style={{ minHeight:'100vh',background:'#03060f',display:'grid',placeItems:'center',color:'#fff' }}><Loader2 className="animate-spin"/></div>;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <div style={{ fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(255,255,255,0.5)' }}>Planetrix · Mission Control</div>
          <h1 style={{ fontSize:22,fontWeight:800,color:'#fff',marginTop:2 }}>Applications ({stats.total})</h1>
        </div>
        <div className="flex items-center gap-3">
          <span style={{ fontSize:11,color:'rgba(255,255,255,0.6)' }}>{user?.email}</span>
          <button onClick={handleSignOut} className="admin-btn-ghost"><LogOut size={12}/> Sign out</button>
        </div>
      </header>

      <div className="admin-stats">
        {[['Total',stats.total],['Last 7 days',stats.week],['Pending Review',stats.pending],['With Resume',stats.withResume]].map(([l,v])=>(
          <div key={l as string} className="admin-stat"><div className="admin-stat-value">{v}</div><div className="admin-stat-label">{l}</div></div>
        ))}
      </div>

      <div className="admin-toolbar">
        <div className="admin-search"><Search size={14}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search name, email, role…"/></div>
        <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as 'all'|'new'|'reviewed')} className="admin-select"><option value="all">All status</option><option value="new">New only</option><option value="reviewed">Reviewed only</option></select>
        <select value={roleFilter} onChange={(e)=>setRoleFilter(e.target.value)} className="admin-select"><option value="">All roles</option>{roles.map((r)=><option key={r} value={r}>{r}</option>)}</select>
        <select value={expFilter} onChange={(e)=>setExpFilter(e.target.value)} className="admin-select"><option value="">All experience</option>{['0-1','1-3','3-5','5+'].map((v)=><option key={v} value={v}>{v}</option>)}</select>
        <button onClick={exportCSV} className="admin-btn-primary" disabled={!filtered.length}><Download size={12}/> Export CSV</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr>
            <th onClick={()=>toggleSort('created_at')} style={{cursor:'pointer'}}><span className="inline-flex items-center gap-1">Date {sortIcon('created_at')}</span></th>
            <th>Status</th>
            <th onClick={()=>toggleSort('job_role')} style={{cursor:'pointer'}}><span className="inline-flex items-center gap-1">Role {sortIcon('job_role')}</span></th>
            <th onClick={()=>toggleSort('full_name')} style={{cursor:'pointer'}}><span className="inline-flex items-center gap-1">Name {sortIcon('full_name')}</span></th>
            <th onClick={()=>toggleSort('email')} style={{cursor:'pointer'}}><span className="inline-flex items-center gap-1">Email {sortIcon('email')}</span></th>
            <th>Phone</th>
            <th onClick={()=>toggleSort('experience')} style={{cursor:'pointer'}}><span className="inline-flex items-center gap-1">Exp {sortIcon('experience')}</span></th>
            <th>Links</th><th>Note</th><th></th>
          </tr></thead>
          <tbody>
            {fetching&&<tr><td colSpan={10} style={{padding:30,textAlign:'center',color:'rgba(255,255,255,0.5)'}}><Loader2 className="animate-spin inline" size={16}/> Loading…</td></tr>}
            {!fetching&&rows.length===0&&<tr><td colSpan={10} style={{padding:40,textAlign:'center',color:'rgba(255,255,255,0.45)'}}>No applications yet — submit one via the Careers section.</td></tr>}
            {!fetching&&rows.length>0&&pageRows.length===0&&<tr><td colSpan={10} style={{padding:40,textAlign:'center',color:'rgba(255,255,255,0.4)'}}>No applications match the current filters.</td></tr>}
            {pageRows.map((r)=>(
              <tr key={r.id} className={r.reviewed?'row-reviewed':''}>
                <td style={{whiteSpace:'nowrap',fontSize:11,color:'rgba(255,255,255,0.6)'}}>{new Date(r.created_at).toLocaleDateString()}<br/><span style={{fontSize:10,opacity:.6}}>{new Date(r.created_at).toLocaleTimeString()}</span></td>
                <td><button onClick={()=>toggleReviewed(r)} className={`review-pill ${r.reviewed?'review-pill-done':'review-pill-new'}`} title={r.reviewed_at?`Reviewed ${new Date(r.reviewed_at).toLocaleString()}`:'Click to mark reviewed'}>{r.reviewed?<Check size={10}/>:<Circle size={10}/>}{r.reviewed?'Reviewed':'New'}</button></td>
                <td><span className="admin-chip">{r.job_role}</span></td>
                <td style={{fontWeight:600,color:'#fff'}}>{r.full_name}</td>
                <td><a href={`mailto:${r.email}`} className="admin-link">{r.email}</a></td>
                <td><a href={`tel:${r.phone}`} className="admin-link">{r.phone}</a></td>
                <td><span className="admin-chip-soft">{r.experience}</span></td>
                <td>{r.portfolio_url&&<a href={r.portfolio_url} target="_blank" rel="noopener noreferrer" className="admin-icon-btn" title="Portfolio"><ExternalLink size={12}/></a>}</td>
                <td style={{maxWidth:240,fontSize:11,color:'rgba(255,255,255,0.7)'}}>
                  {r.cover_note?(<span>{expanded[r.id]?r.cover_note:(r.cover_note.length>60?r.cover_note.slice(0,60)+'…':r.cover_note)}{r.cover_note.length>60&&<button onClick={()=>setExpanded((e)=>({...e,[r.id]:!e[r.id]}))} style={{marginLeft:6,color:'#7fb3ff',fontSize:10}}>{expanded[r.id]?'less':'more'}</button>}</span>):<span style={{opacity:.3}}>—</span>}
                </td>
                <td><button onClick={()=>setPendingDelete(r)} className="admin-icon-btn admin-icon-danger" title="Delete"><Trash2 size={12}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages>1&&(
        <div className="admin-pagination">
          <button onClick={()=>setPage((p)=>Math.max(1,p-1))} disabled={page===1}>Prev</button>
          <span>Page {page} / {totalPages}</span>
          <button onClick={()=>setPage((p)=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next</button>
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(o)=>!o&&setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this application?</AlertDialogTitle>
            <AlertDialogDescription>{pendingDelete&&<>Permanently remove <strong>{pendingDelete.full_name}</strong>'s application for <strong>{pendingDelete.job_role}</strong>. This cannot be undone.</>}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e)=>{e.preventDefault();confirmDelete();}} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete permanently</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
