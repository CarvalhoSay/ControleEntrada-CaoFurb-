import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import ReceptionKiosk from './pages/RecepcaoPage'

export default function App(){
  return (
    <div>
      <nav style={{padding:'10px 16px', borderBottom:'1px solid #eee'}}>
        <NavLink to='/' style={{marginRight:16}}>Dashboard</NavLink>
        <NavLink to='/reception'>Recepção (Scanner)</NavLink>
      </nav>
      <Routes>
        <Route path='/' element={<DashboardPage/>} />
        <Route path='/reception' element={<ReceptionKiosk/>} />
        <Route path='*' element={<Navigate to='/' replace/>} />
      </Routes>
    </div>
  )
}
