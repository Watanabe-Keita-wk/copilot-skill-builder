import { NextRequest, NextResponse } from 'next/server'
import { verifyApiToken, getCurrentUser } from '@/lib/session'

// ユーザーごとのコード状態を保存
const codeStore = new Map<string, { code: string; timestamp: number }>()

export async function GET(
  request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  try {
    // APIトークンまたはセッション認証を試す
    let session = await verifyApiToken(request)
    
    if (!session) {
      const user = await getCurrentUser()
      if (user) {
        session = { 
          user: {
            id: user.id,
            email: user.email,
            name: user.name ?? null,
          }
        }
      }
    }

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const key = `${session.user.id}-${params.missionId}`
    const stored = codeStore.get(key)

    if (!stored) {
      return NextResponse.json({ code: null, timestamp: null })
    }

    return NextResponse.json({
      code: stored.code,
      timestamp: stored.timestamp,
    })
  } catch (error) {
    console.error('Get code sync error:', error)
    return NextResponse.json({ error: 'Failed to get code' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { missionId: string } }
) {
  try {
    // APIトークンまたはセッション認証を試す
    let session = await verifyApiToken(request)
    
    if (!session) {
      const user = await getCurrentUser()
      if (user) {
        session = { 
          user: {
            id: user.id,
            email: user.email,
            name: user.name ?? null,
          }
        }
      }
    }

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 })
    }

    const key = `${session.user.id}-${params.missionId}`
    const timestamp = Date.now()
    
    codeStore.set(key, { code, timestamp })

    return NextResponse.json({
      success: true,
      timestamp,
    })
  } catch (error) {
    console.error('Code sync error:', error)
    return NextResponse.json({ error: 'Failed to sync code' }, { status: 500 })
  }
}
