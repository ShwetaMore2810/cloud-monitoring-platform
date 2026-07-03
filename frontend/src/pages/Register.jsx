import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../AuthProvider'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/auth/register', { username, email, password })
      const loginResp = await api.post('/auth/login', { username, password })
      const { token, user } = loginResp.data
      login(token, user)
      navigate('/LandingPage')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-neko-bg flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-md bg-neko-panel border border-neko-border rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-1">Register</h2>
        <p className="text-slate-400 text-sm mb-5">Create your Neko Monitor account</p>

        {error && <div className="mb-3 text-sm text-red-400">{error}</div>}

        <label className="block mb-3">
          <span className="text-sm text-slate-300">Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-neko-panel-2 border border-neko-border text-slate-100" />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-slate-300">Email (optional)</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-neko-panel-2 border border-neko-border text-slate-100" />
        </label>

        <label className="block mb-5">
          <span className="text-sm text-slate-300">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-neko-panel-2 border border-neko-border text-slate-100" />
        </label>

        <div className="flex items-center justify-between">
          <button className="bg-neko-purple hover:bg-neko-purple-light px-4 py-2 rounded-lg text-white text-sm font-medium" type="submit">Register</button>
          <Link to="/login" className="text-sm text-slate-300 hover:text-white underline">Login</Link>
        </div>
      </form>
    </div>
  )
}