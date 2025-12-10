import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/session'
import { nanoid } from 'nanoid'

// GET /api/tokens - ユーザーのトークン一覧取得
export async function GET() {
  try {
    const session = await requireAuth()
    
    const tokens = await prisma.apiToken.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json({ tokens })
  } catch (error) {
    console.error('Error fetching tokens:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
}

// POST /api/tokens - 新しいトークンを生成
export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    const { name } = await request.json()
    
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Token name is required' },
        { status: 400 }
      )
    }
    
    // トークン生成（32文字のランダム文字列）
    const tokenValue = nanoid(32)
    
    // トークンの有効期限を1年後に設定
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    
    const token = await prisma.apiToken.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        token: tokenValue,
        expiresAt: expiresAt,
        lastUsedAt: new Date(),
      },
    })
    
    return NextResponse.json({ token })
  } catch (error) {
    console.error('Error creating token:', error)
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    )
  }
}

// DELETE /api/tokens - トークンを削除
export async function DELETE(request: Request) {
  try {
    const session = await requireAuth()
    const { tokenId } = await request.json()
    
    if (!tokenId) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      )
    }
    
    // トークンの所有者確認
    const token = await prisma.apiToken.findUnique({
      where: { id: tokenId },
    })
    
    if (!token || token.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      )
    }
    
    await prisma.apiToken.delete({
      where: { id: tokenId },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting token:', error)
    return NextResponse.json(
      { error: 'Failed to delete token' },
      { status: 500 }
    )
  }
}
