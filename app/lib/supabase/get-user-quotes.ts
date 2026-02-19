import { cacheTag } from 'next/cache';
import { createServiceRoleClient } from './service-role';

/**
 * Cached list of quote texts for a user (Next.js 16 "use cache").
 * Used to avoid inserting duplicates; revalidate with revalidateTag(`user-quotes-${userId}`, 'max').
 * Requires cacheComponents: true and SUPABASE_SERVICE_ROLE_KEY.
 */
export async function getUserQuotesCached(userId: string): Promise<string[]> {
  'use cache';
  cacheTag(`user-quotes-${userId}`);

  const supabase = createServiceRoleClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('quote')
    .select('quote')
    .eq('user_id', userId);

  if (error) {
    console.error('getUserQuotesCached:', error);
    return [];
  }
  return (data ?? []).map((row) => row.quote);
}
