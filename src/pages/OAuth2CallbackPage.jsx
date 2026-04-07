import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken, getProfile } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function OAuth2CallbackPage() {
  const navigate    = useNavigate();
  const { setProfile } = useAuth();
  const toast       = useToast();
  const processed   = useRef(false);  // guard against double execution (StrictMode)

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    const error  = params.get('error');

    if (error) {
      toast.show(decodeURIComponent(error), 'error');
      navigate('/login', { replace: true });
      return;
    }

    if (!token) {
      toast.show('Authentication failed. No token received.', 'error');
      navigate('/login', { replace: true });
      return;
    }

    setToken(token);

    getProfile()
      .then(profile => {
        setProfile(profile);
        toast.show('Login successful!', 'success');
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        setToken(null);
        toast.show('Authentication failed. Please try again.', 'error');
        navigate('/login', { replace: true });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '12px' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#6b7280', fontSize: '14px' }}>Completing sign-in…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
