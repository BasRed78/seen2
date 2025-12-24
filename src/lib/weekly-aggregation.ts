// ============================================
// SEEN INSIGHT SYSTEM: WEEKLY AGGREGATION
// ============================================
// Generates weekly summaries and reflections for users
// Run this as a cron job every Sunday (or user's preferred day)
//
// Version: 2.1
// Last updated: December 2024
// Added: gap_notices, alternative_actions_reported, emotions_user_named
// ============================================

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { 
  WEEKLY_AGGREGATION_PROMPT,
  WeeklyAggregation 
} from './extraction-prompts';

// Lazy initialization
function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const AGGREGATION_VERSION = '2.1.0';


/**
 * Get the date range for this week (Monday to Sunday)
 */
function getWeekRange(date: Date = new Date()): { start: Date; end: Date } {
  const current = new Date(date);
  const day = current.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return { start: monday, end: sunday };
}


/**
 * Get last week's date range
 */
function getLastWeekRange(): { start: Date; end: Date } {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  return getWeekRange(lastWeek);
}


/**
 * Fetch all extractions for a user within a date range
 * Now includes metadata for v2.1 fields
 */
async function getExtractionsForPeriod(
  userId: string, 
  startDate: Date, 
  endDate: Date
): Promise<Array<{type: string; value: string; confidence: number; created_at: string; metadata?: Record<string, unknown>}>> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('extractions')
    .select('type, value, confidence, created_at, metadata')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[AGGREGATION] Failed to fetch extractions:', error);
    return [];
  }

  return data || [];
}


/**
 * Fetch breakthroughs for a user within a date range
 */
async function getBreakthroughsForPeriod(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{id: string; description: string; category: string | null; occurred_at: string}>> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('breakthroughs')
    .select('id, description, category, occurred_at')
    .eq('user_id', userId)
    .gte('occurred_at', startDate.toISOString())
    .lte('occurred_at', endDate.toISOString())
    .order('occurred_at', { ascending: true });

  if (error) {
    console.error('[AGGREGATION] Failed to fetch breakthroughs:', error);
    return [];
  }

  return data || [];
}


/**
 * Count check-ins for a user within a date range
 */
async function getCheckinCount(userId: string, startDate: Date, endDate: Date): Promise<number> {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from('checkins')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) {
    console.error('[AGGREGATION] Failed to count check-ins:', error);
    return 0;
  }

  return count || 0;
}


/**
 * Aggregate alternative actions into {action, count} format
 * v2.1 helper function
 */
function aggregateAlternativeActions(
  rawActions: Array<{action: string; user_words?: string}>
): Array<{action: string; count: number}> {
  const counts: Record<string, number> = {};
  
  for (const item of rawActions) {
    counts[item.action] = (counts[item.action] || 0) + 1;
  }
  
  return Object.entries(counts)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count);
}


/**
 * Compute statistics from extractions
 * Updated for v2.1: includes gap_notices, alternative_actions, emotions_user_named
 */
function computeStats(extractions: Array<{type: string; value: string; confidence: number; metadata?: Record<string, unknown>}>) {
  const stats = {
    episodes_occurred: 0,
    episodes_resisted: 0,
    episodes_almost: 0,
    gap_notices: 0,  // v2.1: Count of gap_noticed extractions
    stress_levels: [] as number[],
    triggers: {} as Record<string, number>,
    emotions_before: {} as Record<string, number>,
    emotions_after: {} as Record<string, number>,
    emotions_user_named: {} as Record<string, number>,  // v2.1: Emotions explicitly named by user
    themes: {} as Record<string, number>,
    change_talk_count: 0,
    resistance_attempt_count: 0,
    help_openness_count: 0,
    alternative_actions_raw: [] as Array<{action: string; user_words?: string}>,  // v2.1: Raw data
  };

  for (const ext of extractions) {
    switch (ext.type) {
      case 'episode':
        if (ext.value === 'occurred') stats.episodes_occurred++;
        else if (ext.value === 'resisted') stats.episodes_resisted++;
        else if (ext.value === 'almost') stats.episodes_almost++;
        break;
      
      case 'stress_level':
        const level = parseInt(ext.value, 10);
        if (!isNaN(level)) stats.stress_levels.push(level);
        break;
      
      case 'trigger':
        stats.triggers[ext.value] = (stats.triggers[ext.value] || 0) + 1;
        break;
      
      case 'emotion_before':
        stats.emotions_before[ext.value] = (stats.emotions_before[ext.value] || 0) + 1;
        break;
      
      case 'emotion_after':
        stats.emotions_after[ext.value] = (stats.emotions_after[ext.value] || 0) + 1;
        break;
      
      case 'emotion_named':  // v2.1: User explicitly named this emotion
        stats.emotions_user_named[ext.value] = (stats.emotions_user_named[ext.value] || 0) + 1;
        break;
      
      case 'theme':
        stats.themes[ext.value] = (stats.themes[ext.value] || 0) + 1;
        break;
      
      case 'change_talk':
        if (ext.value === 'true') stats.change_talk_count++;
        break;
      
      case 'resistance_attempt':
        if (ext.value === 'true') stats.resistance_attempt_count++;
        break;
      
      case 'help_openness':
        if (ext.value === 'true') stats.help_openness_count++;
        break;
      
      case 'gap_noticed':  // v2.1: User noticed the pause between urge and action
        if (ext.value === 'true') stats.gap_notices++;
        break;
      
      case 'alternative_action':  // v2.1: What user did instead when they resisted
        const metadata = ext.metadata as {user_words?: string} | undefined;
        stats.alternative_actions_raw.push({
          action: ext.value,
          user_words: metadata?.user_words
        });
        break;
    }
  }

  return stats;
}


/**
 * Build trigger chains from extractions
 * Looks at same-day patterns: trigger → emotion → behavior
 */
function buildTriggerChains(extractions: Array<{type: string; value: string; created_at: string}>): Array<{pattern: string; frequency: number}> {
  // Group extractions by date
  const byDate: Record<string, Array<{type: string; value: string}>> = {};
  
  for (const ext of extractions) {
    const date = ext.created_at.split('T')[0];
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push({ type: ext.type, value: ext.value });
  }

  // For each day, try to build a chain
  const chains: Record<string, number> = {};
  
  for (const exts of Object.values(byDate)) {
    const trigger = exts.find(e => e.type === 'trigger')?.value;
    const emotion = exts.find(e => e.type === 'emotion_before')?.value;
    const behavior = exts.find(e => e.type === 'behavior')?.value;
    
    if (trigger && emotion && behavior) {
      const chain = `${trigger} → ${emotion} → ${behavior}`;
      chains[chain] = (chains[chain] || 0) + 1;
    } else if (trigger && behavior) {
      const chain = `${trigger} → ${behavior}`;
      chains[chain] = (chains[chain] || 0) + 1;
    }
  }

  return Object.entries(chains)
    .map(([pattern, frequency]) => ({ pattern, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);
}


/**
 * Determine overall readiness level
 */
function computeReadiness(
  changeTalkCount: number,
  resistanceCount: number,
  helpOpenness: number,
  checkinCount: number
): 'low' | 'emerging' | 'moderate' | 'high' {
  if (checkinCount === 0) return 'low';
  
  const changeTalkRate = changeTalkCount / checkinCount;
  const resistanceRate = resistanceCount / checkinCount;
  
  if (helpOpenness > 0 || (changeTalkRate > 0.5 && resistanceRate > 0.3)) {
    return 'high';
  } else if (changeTalkRate > 0.3 || resistanceRate > 0.2) {
    return 'moderate';
  } else if (changeTalkRate > 0.1 || resistanceRate > 0) {
    return 'emerging';
  }
  return 'low';
}


/**
 * Generate weekly summary for a single user
 */
export async function generateWeeklySummary(userId: string): Promise<{
  success: boolean;
  aggregationId?: string;
  error?: string;
}> {
  const anthropic = getAnthropic();
  const supabase = getSupabase();

  try {
    const { start: weekStart, end: weekEnd } = getWeekRange();
    const { start: lastWeekStart, end: lastWeekEnd } = getLastWeekRange();

    // Check if we already generated this week's summary
    const { data: existing } = await supabase
      .from('aggregations')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'weekly_summary')
      .eq('period_start', weekStart.toISOString().split('T')[0])
      .single();

    if (existing) {
      return { success: true, aggregationId: existing.id, error: 'Already generated' };
    }

    // Fetch this week's data
    const extractions = await getExtractionsForPeriod(userId, weekStart, weekEnd);
    const breakthroughs = await getBreakthroughsForPeriod(userId, weekStart, weekEnd);
    const checkinCount = await getCheckinCount(userId, weekStart, weekEnd);

    // If no check-ins this week, skip
    if (checkinCount === 0) {
      console.log(`[AGGREGATION] No check-ins for user ${userId} this week, skipping`);
      return { success: true, error: 'No check-ins this week' };
    }

    // Fetch last week's stats for comparison
    const lastWeekExtractions = await getExtractionsForPeriod(userId, lastWeekStart, lastWeekEnd);
    const lastWeekCheckinCount = await getCheckinCount(userId, lastWeekStart, lastWeekEnd);

    // Compute stats
    const stats = computeStats(extractions);
    const lastWeekStats = computeStats(lastWeekExtractions);

    // Build trigger chains
    const triggerChains = buildTriggerChains(extractions);

    // Get top triggers
    const topTriggers = Object.entries(stats.triggers)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get emotion patterns
    const emotionsBefore = Object.entries(stats.emotions_before)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);
    
    const emotionsAfter = Object.entries(stats.emotions_after)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    // v2.1: Get emotions user explicitly named
    const emotionsUserNamed = Object.entries(stats.emotions_user_named)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    // v2.1: Aggregate alternative actions into {action, count} format
    const alternativeActionsAggregated = aggregateAlternativeActions(stats.alternative_actions_raw);

    // Get themes
    const themes = Object.entries(stats.themes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    // Compute readiness
    const readiness = computeReadiness(
      stats.change_talk_count,
      stats.resistance_attempt_count,
      stats.help_openness_count,
      checkinCount
    );

    // Week comparison
    let weekComparison: 'better' | 'similar' | 'harder' | 'first_week' = 'first_week';
    let notableChanges = '';
    
    if (lastWeekCheckinCount > 0) {
      const thisWeekEpisodes = stats.episodes_occurred;
      const lastWeekEpisodes = lastWeekStats.episodes_occurred;
      const thisWeekResisted = stats.episodes_resisted;
      const lastWeekResisted = lastWeekStats.episodes_resisted;

      if (thisWeekEpisodes < lastWeekEpisodes || thisWeekResisted > lastWeekResisted) {
        weekComparison = 'better';
        notableChanges = `Episodes: ${lastWeekEpisodes} → ${thisWeekEpisodes}. Resisted: ${lastWeekResisted} → ${thisWeekResisted}.`;
      } else if (thisWeekEpisodes > lastWeekEpisodes) {
        weekComparison = 'harder';
        notableChanges = `More episodes this week (${thisWeekEpisodes} vs ${lastWeekEpisodes}).`;
      } else {
        weekComparison = 'similar';
        notableChanges = 'Similar pattern to last week.';
      }
    }

    // Prepare data for Claude to generate reflection
    const weekData = {
      checkin_count: checkinCount,
      episodes: {
        occurred: stats.episodes_occurred,
        resisted: stats.episodes_resisted,
        almost: stats.episodes_almost
      },
      avg_stress: stats.stress_levels.length > 0 
        ? Math.round(stats.stress_levels.reduce((a, b) => a + b, 0) / stats.stress_levels.length * 10) / 10
        : null,
      gap_notices: stats.gap_notices,  // v2.1
      alternative_actions: alternativeActionsAggregated,  // v2.1: Now in {action, count} format
      top_triggers: topTriggers,
      emotions_before: emotionsBefore,
      emotions_after: emotionsAfter,
      emotions_user_named: emotionsUserNamed,  // v2.1
      themes,
      breakthroughs: breakthroughs.map(b => ({
        description: b.description,
        date: new Date(b.occurred_at).toLocaleDateString()
      })),
      readiness: {
        change_talk: stats.change_talk_count,
        resistance_attempts: stats.resistance_attempt_count,
        help_openness: stats.help_openness_count,
        level: readiness
      },
      trigger_chains: triggerChains,
      comparison: {
        vs_last_week: weekComparison,
        notable_changes: notableChanges
      }
    };

    // Generate reflection text with Claude
    const reflectionResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: WEEKLY_AGGREGATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Generate a weekly summary for this user's data:\n\n${JSON.stringify(weekData, null, 2)}`
      }],
    });

    const rawOutput = reflectionResponse.content[0].type === 'text'
      ? reflectionResponse.content[0].text
      : '';

    let aggregationData: WeeklyAggregation;
    try {
      const cleanJson = rawOutput
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      aggregationData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('[AGGREGATION] Failed to parse reflection JSON:', rawOutput);
      // Fall back to storing just the computed stats without AI reflection
      aggregationData = {
        stats: {
          checkin_count: checkinCount,
          episodes_occurred: stats.episodes_occurred,
          episodes_resisted: stats.episodes_resisted,
          episodes_almost: stats.episodes_almost,
          avg_stress: weekData.avg_stress || 0,
          gap_notices: stats.gap_notices  // v2.1
        },
        top_triggers: topTriggers,
        emotion_patterns: {
          most_common_before: emotionsBefore,
          most_common_after: emotionsAfter,
          emotions_user_named: emotionsUserNamed  // v2.1
        },
        alternative_actions_reported: alternativeActionsAggregated,  // v2.1: Now properly aggregated
        themes_this_week: themes,
        breakthroughs_this_week: breakthroughs.map(b => ({
          id: b.id,
          description: b.description,
          category: b.category || 'unknown',
          date: new Date(b.occurred_at).toLocaleDateString()
        })),
        readiness_indicators: {
          change_talk_instances: stats.change_talk_count,
          resistance_attempts: stats.resistance_attempt_count,
          help_openness_instances: stats.help_openness_count,
          overall_readiness: readiness
        },
        trigger_chains: triggerChains,
        week_comparison: {
          vs_last_week: weekComparison,
          notable_changes: notableChanges
        },
        reflection_text: 'We noticed your check-ins this week but couldn\'t generate a personalized reflection. Check back next week!'
      };
    }

    // Store the aggregation
    const { data: inserted, error: insertError } = await supabase
      .from('aggregations')
      .insert({
        user_id: userId,
        type: 'weekly_summary',
        period_start: weekStart.toISOString().split('T')[0],
        period_end: weekEnd.toISOString().split('T')[0],
        data: aggregationData,
        summary_text: aggregationData.reflection_text,
        generation_version: AGGREGATION_VERSION
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('[AGGREGATION] Failed to insert:', insertError);
      return { success: false, error: 'Insert failed' };
    }

    // Update user's last reflection timestamp
    await supabase
      .from('users')
      .update({ last_reflection_at: new Date().toISOString() })
      .eq('id', userId);

    console.log(`[AGGREGATION] Generated weekly summary for user ${userId}`);
    return { success: true, aggregationId: inserted.id };

  } catch (error) {
    console.error('[AGGREGATION] Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}


/**
 * Generate weekly summaries for all active users
 * Run this as a cron job
 */
export async function generateAllWeeklySummaries(): Promise<{
  total: number;
  successful: number;
  failed: number;
}> {
  const supabase = getSupabase();
  
  // Get users who have check-ins this week and haven't received a reflection yet
  const { start: weekStart } = getWeekRange();

  const { data: users, error } = await supabase
    .from('users')
    .select('id')
    .or(`last_reflection_at.is.null,last_reflection_at.lt.${weekStart.toISOString()}`);

  if (error || !users) {
    console.error('[AGGREGATION] Failed to fetch users:', error);
    return { total: 0, successful: 0, failed: 0 };
  }

  let successful = 0;
  let failed = 0;

  for (const user of users) {
    const result = await generateWeeklySummary(user.id);
    if (result.success && !result.error?.includes('No check-ins')) {
      successful++;
    } else if (!result.success) {
      failed++;
    }
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`[AGGREGATION] Weekly batch complete: ${successful} successful, ${failed} failed`);
  return { total: users.length, successful, failed };
}


/**
 * Get a user's weekly reflection (for display)
 */
export async function getWeeklyReflection(userId: string, weekStart?: Date): Promise<{
  found: boolean;
  reflection?: string;
  data?: WeeklyAggregation;
  periodStart?: string;
  periodEnd?: string;
}> {
  const supabase = getSupabase();
  const { start } = weekStart ? getWeekRange(weekStart) : getWeekRange();

  const { data, error } = await supabase
    .from('aggregations')
    .select('*')
    .eq('user_id', userId)
    .eq('type', 'weekly_summary')
    .eq('period_start', start.toISOString().split('T')[0])
    .single();

  if (error || !data) {
    return { found: false };
  }

  return {
    found: true,
    reflection: data.summary_text,
    data: data.data as WeeklyAggregation,
    periodStart: data.period_start,
    periodEnd: data.period_end
  };
}
