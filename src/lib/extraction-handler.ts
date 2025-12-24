// ============================================
// SEEN INSIGHT SYSTEM: EXTRACTION HANDLER
// ============================================
// This service extracts structured data from completed check-ins
// and stores it in the extractions/breakthroughs tables
// 
// Version: 2.0
// Last updated: December 2024
// ============================================

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { 
  EXTRACTION_SYSTEM_PROMPT, 
  EXTRACTION_VERSION,
  ExtractionResult 
} from './extraction-prompts';

// Initialize clients lazily
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


/**
 * Main extraction function
 * Call this after a check-in is completed
 */
export async function extractFromCheckin(checkinId: string): Promise<{
  success: boolean;
  extractionCount: number;
  breakthroughDetected: boolean;
  error?: string;
}> {
  const anthropic = getAnthropic();
  const supabase = getSupabase();

  try {
    // 1. Get the check-in and its messages
    const { data: checkin, error: checkinError } = await supabase
      .from('checkins')
      .select('*, users(*)')
      .eq('id', checkinId)
      .single();

    if (checkinError || !checkin) {
      return { success: false, extractionCount: 0, breakthroughDetected: false, error: 'Check-in not found' };
    }

    // Skip if already extracted
    if (checkin.extracted) {
      return { success: true, extractionCount: 0, breakthroughDetected: false, error: 'Already extracted' };
    }

    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('checkin_id', checkinId)
      .order('created_at', { ascending: true });

    if (messagesError || !messages || messages.length === 0) {
      return { success: false, extractionCount: 0, breakthroughDetected: false, error: 'No messages found' };
    }

    // 2. Format conversation for extraction
    const conversationText = messages
      .map(m => `${m.role === 'assistant' ? 'Seen' : 'User'}: ${m.content}`)
      .join('\n\n');

    // 3. Call Claude for extraction
    const extractionResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: EXTRACTION_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Extract observations from this check-in conversation:\n\n${conversationText}`
      }],
    });

    const rawOutput = extractionResponse.content[0].type === 'text' 
      ? extractionResponse.content[0].text 
      : '';

    // 4. Parse JSON response
    let extraction: ExtractionResult;
    try {
      // Clean potential markdown formatting
      const cleanJson = rawOutput
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      extraction = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('[EXTRACTION] Failed to parse JSON:', rawOutput);
      return { success: false, extractionCount: 0, breakthroughDetected: false, error: 'JSON parse failed' };
    }

    // 5. Store extractions
    const userId = checkin.user_id;
    const extractions: Array<{
      checkin_id: string;
      user_id: string;
      type: string;
      value: string;
      confidence: number | null;
      extraction_version: string;
    }> = [];

    // Stress level
    if (extraction.stress_level?.value) {
      extractions.push({
        checkin_id: checkinId,
        user_id: userId,
        type: 'stress_level',
        value: extraction.stress_level.value.toString(),
        confidence: extraction.stress_level.confidence,
        extraction_version: EXTRACTION_VERSION
      });
    }

    // Episode
    if (extraction.episode?.status) {
      extractions.push({
        checkin_id: checkinId,
        user_id: userId,
        type: 'episode',
        value: extraction.episode.status,
        confidence: extraction.episode.confidence,
        extraction_version: EXTRACTION_VERSION
      });

      if (extraction.episode.behavior) {
        extractions.push({
          checkin_id: checkinId,
          user_id: userId,
          type: 'behavior',
          value: extraction.episode.behavior,
          confidence: extraction.episode.confidence,
          extraction_version: EXTRACTION_VERSION
        });
      }

      if (extraction.episode.time_of_day) {
        extractions.push({
          checkin_id: checkinId,
          user_id: userId,
          type: 'time_of_day',
          value: extraction.episode.time_of_day,
          confidence: extraction.episode.confidence,
          extraction_version: EXTRACTION_VERSION
        });
      }

      if (extraction.episode.duration_minutes) {
        extractions.push({
          checkin_id: checkinId,
          user_id: userId,
          type: 'duration_minutes',
          value: extraction.episode.duration_minutes.toString(),
          confidence: extraction.episode.confidence,
          extraction_version: EXTRACTION_VERSION
        });
      }
    }

    // Triggers
    if (extraction.triggers) {
      for (const trigger of extraction.triggers) {
        extractions.push({
          checkin_id: checkinId,
          user_id: userId,
          type: 'trigger',
          value: trigger.value,
          confidence: trigger.confidence,
          extraction_version: EXTRACTION_VERSION
        });
      }
    }

    // Emotions before
    if (extraction.emotions?.before) {
      for (const emotion of extraction.emotions.before) {
        extractions.push({
          checkin_id: checkinId,
          user_id: userId,
          type: 'emotion_before',
          value: emotion.value,
          confidence: emotion.confidence,
          extraction_version: EXTRACTION_VERSION
        });
      }
    }

    // Emotions after
    if (extraction.emotions?.after) {
      for (const emotion of extraction.emotions.after) {
        extractions.push({
          checkin_id: checkinId,
          user_id: userId,
          type: 'emotion_after',
          value: emotion.value,
          confidence: emotion.confidence,
          extraction_version: EXTRACTION_VERSION
        });
      }
    }

    // Themes
    if (extraction.themes) {
      for (const theme of extraction.themes) {
        extractions.push({
          checkin_id: checkinId,
          user_id: userId,
          type: 'theme',
          value: theme,
          confidence: 0.9,
          extraction_version: EXTRACTION_VERSION
        });
      }
    }

    // Readiness signals
    if (extraction.readiness_signals) {
      if (extraction.readiness_signals.change_talk === true) {
        extractions.push({
          checkin_id: checkinId,
          user_id: userId,
          type: 'change_talk',
          value: 'true',
          confidence: extraction.readiness_signals.confidence,
          extraction_version: EXTRACTION_VERSION
        });
      }
      if (extraction.readiness_signals.resistance_attempt === true) {
        extractions.push({
          checkin_id: checkinId,
          user_id: userId,
          type: 'resistance_attempt',
          value: 'true',
          confidence: extraction.readiness_signals.confidence,
          extraction_version: EXTRACTION_VERSION
        });
      }
      if (extraction.readiness_signals.help_openness === true) {
        extractions.push({
          checkin_id: checkinId,
          user_id: userId,
          type: 'help_openness',
          value: 'true',
          confidence: extraction.readiness_signals.confidence,
          extraction_version: EXTRACTION_VERSION
        });
      }
    }

    // Insight summary
    if (extraction.insight_summary) {
      extractions.push({
        checkin_id: checkinId,
        user_id: userId,
        type: 'insight_summary',
        value: extraction.insight_summary,
        confidence: 1.0,
        extraction_version: EXTRACTION_VERSION
      });
    }

    // 6. Insert extractions
    if (extractions.length > 0) {
      const { error: insertError } = await supabase
        .from('extractions')
        .insert(extractions);

      if (insertError) {
        console.error('[EXTRACTION] Failed to insert extractions:', insertError);
        return { success: false, extractionCount: 0, breakthroughDetected: false, error: 'Insert failed' };
      }
    }

    // 7. Handle breakthrough separately (dedicated table)
    let breakthroughDetected = false;
    if (extraction.breakthrough?.detected && extraction.breakthrough.description) {
      breakthroughDetected = true;
      
      const { error: breakthroughError } = await supabase
        .from('breakthroughs')
        .insert({
          user_id: userId,
          checkin_id: checkinId,
          description: extraction.breakthrough.description,
          category: extraction.breakthrough.category || null,
          occurred_at: new Date().toISOString()
        });

      if (breakthroughError) {
        console.error('[EXTRACTION] Failed to insert breakthrough:', breakthroughError);
      } else {
        console.log(`[EXTRACTION] 🎯 Breakthrough detected: ${extraction.breakthrough.description}`);
      }
    }

    // 8. Mark check-in as extracted
    await supabase
      .from('checkins')
      .update({ 
        extracted: true, 
        extracted_at: new Date().toISOString(),
        extraction_version: EXTRACTION_VERSION,
        insights: extraction.insight_summary || null
      })
      .eq('id', checkinId);

    console.log(`[EXTRACTION] Completed for check-in ${checkinId}: ${extractions.length} extractions`);
    
    return { 
      success: true, 
      extractionCount: extractions.length,
      breakthroughDetected
    };

  } catch (error) {
    console.error('[EXTRACTION] Error:', error);
    return { 
      success: false, 
      extractionCount: 0, 
      breakthroughDetected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}


/**
 * Batch extraction for historical check-ins
 */
export async function extractHistoricalCheckins(userId?: string, limit: number = 100): Promise<{
  processed: number;
  successful: number;
  failed: number;
}> {
  const supabase = getSupabase();

  let query = supabase
    .from('checkins')
    .select('id')
    .eq('completed', true)
    .or('extracted.is.null,extracted.eq.false')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data: checkins, error } = await query;

  if (error || !checkins) {
    console.error('[EXTRACTION] Failed to fetch historical check-ins:', error);
    return { processed: 0, successful: 0, failed: 0 };
  }

  let successful = 0;
  let failed = 0;

  for (const checkin of checkins) {
    const result = await extractFromCheckin(checkin.id);
    if (result.success) {
      successful++;
    } else {
      failed++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`[EXTRACTION] Historical batch complete: ${successful} successful, ${failed} failed`);
  return { processed: checkins.length, successful, failed };
}


/**
 * Get extraction summary for a user
 */
export async function getExtractionSummary(userId: string, days: number = 30): Promise<{
  total_extractions: number;
  by_type: Record<string, number>;
  top_triggers: Array<{trigger: string; count: number}>;
  episode_breakdown: Record<string, number>;
  breakthroughs: number;
}> {
  const supabase = getSupabase();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: typeData } = await supabase
    .from('extractions')
    .select('type')
    .eq('user_id', userId)
    .gte('created_at', since.toISOString());

  const byType: Record<string, number> = {};
  for (const row of typeData || []) {
    byType[row.type] = (byType[row.type] || 0) + 1;
  }

  const { data: triggerData } = await supabase
    .from('extractions')
    .select('value')
    .eq('user_id', userId)
    .eq('type', 'trigger')
    .gte('created_at', since.toISOString());

  const triggerCounts: Record<string, number> = {};
  for (const row of triggerData || []) {
    triggerCounts[row.value] = (triggerCounts[row.value] || 0) + 1;
  }
  const topTriggers = Object.entries(triggerCounts)
    .map(([trigger, count]) => ({ trigger, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const { data: episodeData } = await supabase
    .from('extractions')
    .select('value')
    .eq('user_id', userId)
    .eq('type', 'episode')
    .gte('created_at', since.toISOString());

  const episodeBreakdown: Record<string, number> = {};
  for (const row of episodeData || []) {
    episodeBreakdown[row.value] = (episodeBreakdown[row.value] || 0) + 1;
  }

  const { count: breakthroughCount } = await supabase
    .from('breakthroughs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', since.toISOString());

  return {
    total_extractions: Object.values(byType).reduce((a, b) => a + b, 0),
    by_type: byType,
    top_triggers: topTriggers,
    episode_breakdown: episodeBreakdown,
    breakthroughs: breakthroughCount || 0
  };
}
