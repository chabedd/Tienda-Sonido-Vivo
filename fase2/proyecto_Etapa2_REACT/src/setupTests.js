// Se ejecuta antes de cada archivo de pruebas: agrega matchers como toBeInTheDocument()
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup() // desmonta lo renderizado
  localStorage.clear() // cada prueba parte con almacenamiento limpio
})
