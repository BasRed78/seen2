import { createServerClient } from '@/lib/supabase'

export interface LetterToken {
  id: string
  token: string
  letter_id: string
  recipient_name: string
  recipient_email: string | null
  notes: string | null
  created_at: string
  revoked_at: string | null
}

export async function findToken(token: string): Promise<LetterToken | null> {
  if (!token || token.length > 200) return null
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('letter_tokens')
    .select('*')
    .eq('token', token)
    .is('revoked_at', null)
    .maybeSingle()
  if (error || !data) return null
  return data as LetterToken
}

export async function logEvent(
  tokenId: string,
  event: 'visit' | 'nda_accepted',
  ip: string | null,
  userAgent: string | null
): Promise<void> {
  const supabase = createServerClient()
  await supabase.from('letter_access_log').insert({
    token_id: tokenId,
    event,
    ip,
    user_agent: userAgent,
  })
}

export async function hasAcceptedNda(tokenId: string): Promise<boolean> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('letter_access_log')
    .select('id')
    .eq('token_id', tokenId)
    .eq('event', 'nda_accepted')
    .limit(1)
  return Boolean(data && data.length > 0)
}

export function getClientIp(request: Request): string | null {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return request.headers.get('x-real-ip')
}
