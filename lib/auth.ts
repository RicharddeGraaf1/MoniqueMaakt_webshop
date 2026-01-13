import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    const { redirect } = await import('next/navigation')
    redirect('/login')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== 'admin') {
    const { redirect } = await import('next/navigation')
    redirect('/')
  }
  return user
}
