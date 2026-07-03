import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-neko-bg text-white flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}