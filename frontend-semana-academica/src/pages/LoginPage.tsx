import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../auth';

type Cred = { username: string; password: string };
const DEFAULT: Cred = { username: 'ana', password: 'ana' };

export default function LoginPage(){
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (u: string, p: string) => (u === DEFAULT.username && p === DEFAULT.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if(!username.trim() || !password){
      setError('Preencha usuário e senha.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = validate(username.trim(), password);
      setLoading(false);
      if(!ok){ setError('Credenciais inválidas.'); return; }
      login(username.trim(), remember);
      nav('/', { replace: true });
    }, 400);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card as React.CSSProperties}>
        <h1 style={styles.title}>Entrar</h1>
        <p style={styles.sub}>Acesso de controle (somente frontend)</p>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>
            <span style={styles.labelText}>Usuário</span>
            <input
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              placeholder='Digite o usuário'
              autoComplete='username'
              style={styles.input as React.CSSProperties}
            />
          </label>

          <label style={styles.label}>
            <span style={styles.labelText}>Senha</span>
            <input
              type='password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder='Digite a senha'
              autoComplete='current-password'
              style={styles.input as React.CSSProperties}
              onKeyDown={(e)=>{ if(e.key==='Enter'){ /* allow submit on enter */ } }}
            />
          </label>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'8px 0 12px'}}>
            <label style={{display:'inline-flex', alignItems:'center', gap:8, fontSize:13, color:'#555'}}>
              <input type='checkbox' checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
              Lembrar-me
            </label>
          </div>

          {error && <div style={{color:'#b91c1c', fontSize:13, marginBottom:8}}>{error}</div>}

          <button type='submit' disabled={loading} style={styles.button as React.CSSProperties}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div style={{marginTop:8, fontSize:12, color:'#6b7280'}}>
            Dica: usuário <b>admin</b> / senha <b>admin123</b>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f7fb', padding:24 },
  card: { width:'100%', maxWidth:420, background:'#fff', border:'1px solid #eee', borderRadius:16, padding:24, boxShadow:'0 6px 20px rgba(0,0,0,0.06)' },
  title: { fontSize:22, margin:'0 0 4px', color:'#111827' },
  sub: { margin:'0 0 16px', fontSize:13, color:'#6b7280' },
  label: { display:'block', marginBottom:12 },
  labelText: { display:'block', fontSize:13, color:'#374151', marginBottom:6 },
  input: { width:'100%', padding:'12px 14px', border:'1px solid #e5e7eb', borderRadius:10, fontSize:14, outline:'none' },
  button: { width:'100%', padding:'12px 16px', border:'none', borderRadius:12, background:'linear-gradient(90deg,#4f46e5,#6366f1)', color:'#fff', fontWeight:600, cursor:'pointer', boxShadow:'0 6px 16px rgba(79,70,229,0.25)' }
};
