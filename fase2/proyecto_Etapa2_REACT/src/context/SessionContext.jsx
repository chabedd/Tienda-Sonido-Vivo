import { createContext, useContext, useMemo, useState } from 'react'

/*
  Sesión de usuario (Context). Estado: solo el usuario actual (o null).
  Se guarda en localStorage para sobrevivir a recargas. Sin autenticación real:
  el login valida contra los usuarios de db.js (ver pages/Login).
*/
export const CLAVE_SESION = 'sonidoVivoSesion'

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null
  } catch {
    return null
  }
}

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion)

  const valor = useMemo(
    () => ({
      usuario,
      iniciarSesion: (u) => {
        // nunca guardamos la contraseña en la sesión
        const { password: _omitida, ...segura } = u
        localStorage.setItem(CLAVE_SESION, JSON.stringify(segura))
        setUsuario(segura)
      },
      cerrarSesion: () => {
        localStorage.removeItem(CLAVE_SESION)
        setUsuario(null)
      },
    }),
    [usuario],
  )

  return <SessionContext.Provider value={valor}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession debe usarse dentro de <SessionProvider>')
  return ctx
}
