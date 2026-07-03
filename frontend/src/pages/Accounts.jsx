import { useAuth } from '../AuthProvider'

export default function Accounts() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-white mb-6">My Account</h1>

      <div className="bg-neko-panel border border-neko-border rounded-2xl p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-neko-panel-2 border border-neko-border rounded-lg p-4">
            <p className="text-slate-400 text-sm">Username</p>
            <p className="text-white text-lg font-semibold mt-1">{user?.username || '-'}</p>
          </div>
          <div className="bg-neko-panel-2 border border-neko-border rounded-lg p-4">
            <p className="text-slate-400 text-sm">Email</p>
            <p className="text-white text-lg font-semibold mt-1">{user?.email || '-'}</p>
          </div>
          <div className="bg-neko-panel-2 border border-neko-border rounded-lg p-4">
            <p className="text-slate-400 text-sm">User ID</p>
            <p className="text-white text-lg font-semibold mt-1">{user?.id || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}