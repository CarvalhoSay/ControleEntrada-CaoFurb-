import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import ReceptionKiosk from './pages/RecepcaoPage'
import LoginPage from './pages/LoginPage'
import { isAuth, logout, getUser } from './auth'

function Protected({ children }: { children: JSX.Element }) {
  const authed = isAuth();
  const loc = useLocation();
  if (!authed) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

export default function App(){
  const authed = isAuth();
  const user = getUser();

  return (
    <div>
      {authed && (
        <nav style={{padding:'10px 16px', borderBottom:'1px solid #eee', display:'flex', gap:12, alignItems:'center'}}>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/reception">Recepção (Scanner)</NavLink>
          <div style={{marginLeft:'auto', display:'inline-flex', alignItems:'center', gap:12}}>
            <span style={{fontSize:12, color:'#555'}}>Olá, {user?.username ?? 'usuário'}</span>
            <button
              onClick={()=>{ logout(); window.location.href='/login'; }}
              style={{padding:'6px 10px', borderRadius:8, border:'1px solid #ddd', background:'#fff', cursor:'pointer'}}
            >
              Sair
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={authed ? <Navigate to="/" replace /> : <LoginPage/>} />
        <Route path="/" element={<Protected><DashboardPage/></Protected>} />
        <Route path="/reception" element={<Protected><ReceptionKiosk/></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
