import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'

// Redesigned settings page: left nav + right content
export default function Ajustes({ modoClaro, setModoClaro }) {
  const navigate = useNavigate()
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('baseFontSize')
    return saved ? parseInt(saved, 10) : 16
  })
  const [section, setSection] = useState('mi-cuenta')
  const { user, setUser } = useUser()
  const [editingEmail, setEditingEmail] = useState(false)
  const [editingPhone, setEditingPhone] = useState(false)
  const [emailInput, setEmailInput] = useState(() => user?.email || '')
  const [phoneInput, setPhoneInput] = useState(() => user?.phone || '')

  useEffect(() => {
    setEmailInput(user?.email || '')
    setPhoneInput(user?.phone || '')
  }, [user])

  useEffect(() => {
    document.body.style.fontSize = fontSize + 'px'
    localStorage.setItem('baseFontSize', fontSize)
  }, [fontSize])

  const navItems = [
    { id: 'mi-cuenta', label: 'Mi cuenta' },
    { id: 'perfiles', label: 'Perfiles' },
    { id: 'contenido', label: 'Contenido y social' },
    { id: 'privacidad', label: 'Datos y privacidad' },
    { id: 'dispositivos', label: 'Dispositivos' },
  ]

  const formatDate = (iso) => {
    if (!iso) return 'No disponible'
    try {
      const d = new Date(iso)
      return d.toLocaleString()
    } catch (e) {
      return iso
    }
  }

  return (
    <div className="ajustes-root" style={{ minHeight: '82vh', paddingTop: 80 }}>
      <div className="ajustes-container">
        <aside className="ajustes-sidebar">
          <div className="ajustes-logo">LECTURA INFINITA</div>
          <nav className="ajustes-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`ajustes-nav-item ${section === item.id ? 'active' : ''}`}
                onClick={() => setSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: 'auto', padding: '1rem' }}>
            <button className="ajustes-logout" onClick={() => navigate(-1)}>Volver</button>
          </div>
        </aside>

        <main className="ajustes-main">
          <div className="ajustes-card">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{navItems.find(n => n.id === section).label}</h2>
            </header>

            <div style={{ marginTop: 18 }}>
              {section === 'mi-cuenta' && (
                <div className="mi-cuenta-grid">
                  <div className="mi-cuenta-left">
                    <div className="avatar-large">👤</div>
                    <div style={{ marginTop: 12 }}>
                      <strong>Nombre de visualización</strong>
                      <div className="muted">{user?.name || user?.username || 'usuario_demo'}</div>
                      <div style={{ marginTop: 8, fontSize: '0.9rem', color: '#aeb6bb' }}>
                        <div>Rol: <strong style={{ color: '#ffd8b0' }}>{user?.role || 'usuario'}</strong></div>
                        <div>Cuenta creada: <span className="muted">{formatDate(user?.createdAt)}</span></div>
                        <div>Último acceso: <span className="muted">{formatDate(user?.lastLogin)}</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="mi-cuenta-right">
                    <div className="field-row">
                      <div>
                        <div className="field-label">Correo electrónico</div>
                        <div className="field-value">
                          {!editingEmail ? (
                            user?.email ? (
                              (() => {
                                const parts = user.email.split('@')
                                const name = parts[0]
                                const domain = parts[1] || ''
                                const visible = name.length > 2 ? name[0] + '***' + name.slice(-1) : '***'
                                return `${visible}@${domain}`
                              })()
                            ) : '************@gmail.com'
                          ) : (
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <input value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="correo@ejemplo.com" style={{ padding: 6, borderRadius: 4 }} />
                              <button className="btn-small" onClick={async () => {
                                // Guardar en backend
                                if (!user || !user.id) {
                                  alert('No hay usuario logueado. Por favor inicia sesión antes de editar.');
                                  return;
                                }
                                try {
                                  const resp = await fetch(`http://localhost:3003/api/contacts/${user.id}/email`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}) },
                                    body: JSON.stringify({ correo: emailInput })
                                  })
                                  if (resp.ok) {
                                    const updated = await resp.json()
                                    // Actualizar contexto
                                    setUser(prev => ({ ...prev, email: updated.correo }))
                                    setEditingEmail(false)
                                  } else {
                                    // Intentar leer JSON; si falla, leer texto (HTML) y mostrarlo
                                    try {
                                      const err = await resp.json()
                                      alert(err.error || err.mensaje || 'Error actualizando correo')
                                    } catch (parseErr) {
                                      const txt = await resp.text()
                                      console.error('Server returned non-JSON error:', txt)
                                      alert('Error del servidor: ' + (txt.slice(0, 200) || resp.statusText))
                                    }
                                  }
                                } catch (err) {
                                  console.error('Error guardando correo:', err)
                                  alert('Error de conexión al guardar correo')
                                }
                              }}>Guardar</button>
                              <button className="btn-outline" onClick={() => { setEditingEmail(false); setEmailInput(user?.email || '') }}>Cancelar</button>
                            </div>
                          )}
                        </div>
                        <div style={{ marginTop: 6, fontSize: '0.85rem', color: '#9fb6bd' }}>
                          Estado de verificación: <strong style={{ color: user?.verified ? '#8ef' : '#ffb57f' }}>{user?.verified ? 'Verificado' : 'Sin verificar'}</strong>
                        </div>
                      </div>
                      <div>
                        <button className="btn-outline" onClick={() => setEditingEmail(true)}>Editar</button>
                      </div>
                    </div>

                    <div className="field-row">
                      <div>
                        <div className="field-label">Número de teléfono</div>
                        <div className="field-value">
                          {!editingPhone ? (
                            user?.phone || 'Aún no añadido'
                          ) : (
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <input value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="+34 600 000 000" style={{ padding: 6, borderRadius: 4 }} />
                              <button className="btn-small" onClick={async () => {
                                if (!user || !user.id) {
                                  alert('No hay usuario logueado. Por favor inicia sesión antes de editar.');
                                  return;
                                }
                                try {
                                  const resp = await fetch(`http://localhost:3003/api/contacts/${user.id}/number`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}) },
                                    body: JSON.stringify({ number: phoneInput })
                                  })
                                  if (resp.ok) {
                                    const updated = await resp.json()
                                    setUser(prev => ({ ...prev, phone: updated.number }))
                                    setEditingPhone(false)
                                  } else {
                                    try {
                                      const err = await resp.json()
                                      alert(err.error || err.mensaje || 'Error actualizando número')
                                    } catch (parseErr) {
                                      const txt = await resp.text()
                                      console.error('Server returned non-JSON error:', txt)
                                      alert('Error del servidor: ' + (txt.slice(0, 200) || resp.statusText))
                                    }
                                  }
                                } catch (err) {
                                  console.error('Error guardando número:', err)
                                  alert('Error de conexión al guardar número')
                                }
                              }}>Guardar</button>
                              <button className="btn-outline" onClick={() => { setEditingPhone(false); setPhoneInput(user?.phone || '') }}>Cancelar</button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <button className="btn-outline" onClick={() => setEditingPhone(true)}>{user?.phone ? 'Editar' : 'Añadir'}</button>
                      </div>
                    </div>

                    <div className="field-row">
                      <div>
                        <div className="field-label">Tamaño de texto</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button className="btn-small" onClick={() => setFontSize(s => Math.max(12, s - 1))}>A-</button>
                          <div className="muted">{fontSize}px</div>
                          <button className="btn-small" onClick={() => setFontSize(s => Math.min(28, s + 1))}>A+</button>
                        </div>
                      </div>
                    </div>

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.03)', margin: '18px 0' }} />

                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
                      <button className="btn-primary" onClick={() => navigate('/cambiar-contrasena')}>Cambiar contraseña</button>
                      <button className="btn-outline" onClick={() => {
                        // Cierre de sesión local (no llama al backend)
                        if (confirm('¿Cerrar sesión de esta cuenta?')) {
                          setUser(null)
                          navigate('/')
                        }
                      }}>Cerrar sesión</button>
                    </div>

                    <div className="field-row">
                      <div>
                        <div className="field-label">Tema</div>
                        <div style={{ marginTop: 6 }}>
                          <button className="btn-primary" onClick={() => setModoClaro(m => !m)}>{modoClaro ? 'Modo oscuro' : 'Modo claro'}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {section !== 'mi-cuenta' && (
                <div style={{ padding: '0.6rem 0' }}>
                  {section === 'perfiles' && (
                    <>
                      <h3>Perfiles</h3>
                      <p className="muted">Crea y administra perfiles de lectura (por ejemplo: Familiar, Lectura Rápida, Investigación). Cada perfil puede tener preferencias de tamaño de texto, tema y accesibilidad.</p>
                    </>
                  )}

                  {section === 'contenido' && (
                    <>
                      <h3>Contenido y social</h3>
                      <p className="muted">Configura cómo compartes tus lecturas. Aquí puedes elegir si tu biblioteca es pública, gestionar conexiones con redes sociales y ajustes de recomendaciones personalizadas.</p>
                    </>
                  )}

                  {section === 'privacidad' && (
                    <>
                      <h3>Datos y privacidad</h3>
                      <p className="muted">Revisa qué datos almacenamos y cómo se usan. Puedes descargar una copia de tus datos o solicitar su eliminación. También puedes configurar permisos para recomendaciones y análisis.</p>
                    </>
                  )}

                  {section === 'dispositivos' && (
                    <>
                      <h3>Dispositivos</h3>
                      <p className="muted">Lista los dispositivos con sesión activa. Revoca sesiones que no reconozcas para proteger tu cuenta.</p>
                      <div style={{ marginTop: 12 }}>
                        <ul style={{ color: '#cfeff6' }}>
                          <li>Chrome — Escritorio — Última actividad: {formatDate(user?.lastLogin)}</li>
                          <li>Android — Teléfono — Última actividad: No disponible</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
