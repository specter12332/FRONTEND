import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'

export default function CambiarContrasena() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !user.id) {
      alert('Necesitas iniciar sesión para cambiar la contraseña')
      return
    }
    if (!currentPassword || !newPassword) {
      alert('Rellena los campos')
      return
    }
    if (newPassword !== confirm) {
      alert('La nueva contraseña y su confirmación no coinciden')
      return
    }
    setLoading(true)
    try {
      const resp = await fetch(`http://localhost:3003/api/contacts/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}) },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      if (resp.ok) {
        alert('Contraseña cambiada con éxito')
        navigate('/ajustes')
      } else {
        const err = await resp.json().catch(() => ({ error: resp.statusText }))
        alert(err.error || err.mensaje || 'Error cambiando contraseña')
      }
    } catch (e) {
      console.error('Error cambiando contraseña:', e)
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '80px auto', padding: 20 }}>
      <h2>Cambiar contraseña</h2>
      <p className="muted">Cambia tu contraseña actual. Por seguridad, se te pedirá la contraseña actual.</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input type="password" placeholder="Contraseña actual" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={{ padding: 8 }} />
        <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ padding: 8 }} />
        <input type="password" placeholder="Confirmar nueva contraseña" value={confirm} onChange={e => setConfirm(e.target.value)} style={{ padding: 8 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Guardando…' : 'Cambiar contraseña'}</button>
          <button type="button" className="btn-outline" onClick={() => navigate('/ajustes')}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
