import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  const referer = headersList.get('referer')
  const url = request.url

  const debugInfo = {
    userAgent,
    referer,
    url,
    headers: Object.fromEntries(headersList.entries()),
    timestamp: new Date().toISOString()
  }

  // 记录到控制台
  console.log('Debug Info:', JSON.stringify(debugInfo, null, 2))

  return NextResponse.json(debugInfo)
} 