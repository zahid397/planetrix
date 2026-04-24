import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import StarfieldCanvas from '@/components/StarfieldCanvas';
export default function ResetPassword() {
  return (
    <div style={{ minHeight: '100vh', background: '#03060f', position: 'relative', overflow: 'hidden' }}>
      <StarfieldCanvas />
      <Link to="/auth" className="auth-back-link"><ArrowLeft className="w-4 h-4" /> <span>Back</span></Link>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div className="auth-glass" style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <CheckCircle className="mx-auto mb-4" size={52} color="#10B981" />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Password Reset</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 20 }}>
            This standalone app uses local auth — no email is sent.<br />
            Use the demo credentials on the sign-in page to try the app.
          </p>
          <Link to="/auth" className="admin-submit" style={{ display: 'inline-flex', textDecoration: 'none', maxWidth: 200 }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
