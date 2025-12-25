// Get user's insight summary (for dashboard)

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const full = searchParams.get('full') === 'true';

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const supabase = getSupabase();

  try {
    // Get check-in data
    const { data: checkins, error: checkinsError } = await supabase
      .from('checkins')
      .select('id, created_at, completed')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (checkinsError) throw checkinsError;

    // Calculate streak
    const completedCheckins = (checkins || []).filter(c => c.completed);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasCheckin = completedCheckins.some(c => 
        c.created_at.split('T')[0] === dateStr
      );
      
      if (hasCheckin) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i === 0) {
        // Today hasn't checked in yet, that's ok
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Check if checked in today
    const todayStr = today.toISOString().split('T')[0];
    const hasCheckedInToday = completedCheckins.some(c => 
      c.created_at.split('T')[0] === todayStr
    );

    // Calculate weeks active
    const firstCheckin = completedCheckins[completedCheckins.length - 1];
    let weeksActive = 1;
    if (firstCheckin) {
      const firstDate = new Date(firstCheckin.created_at);
      const diffTime = Math.abs(today.getTime() - firstDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      weeksActive = Math.max(1, Math.ceil(diffDays / 7));
    }

    // This week's check-ins
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const thisWeek = days.map((day, idx) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + idx);
      const dateStr = date.toISOString().split('T')[0];
      const checkedIn = completedCheckins.some(c => 
        c.created_at.split('T')[0] === dateStr
      );
      return { day, checkedIn };
    });

    // Basic response for home page
    const basicResponse = {
      streak,
      totalCheckins: completedCheckins.length,
      weeksActive,
      hasCheckedInToday,
      thisWeek,
    };

    // If not requesting full data, return basic
    if (!full) {
      // Try to get latest insight
      const { data: latestCheckin } = await supabase
        .from('checkins')
        .select('insights')
        .eq('user_id', userId)
        .eq('completed', true)
        .not('insights', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestCheckin?.insights) {
        return NextResponse.json({
          ...basicResponse,
          latestInsight: {
            title: "From your last check-in",
            body: latestCheckin.insights
          }
        });
      }

      return NextResponse.json(basicResponse);
    }

    // Full dashboard data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get emotions named
    const { data: emotionsData } = await supabase
      .from('extractions')
      .select('value')
      .eq('user_id', userId)
      .eq('type', 'emotion_named')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const emotionCounts: Record<string, number> = {};
    for (const row of emotionsData || []) {
      emotionCounts[row.value] = (emotionCounts[row.value] || 0) + 1;
    }
    const emotions = Object.entries(emotionCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get breakthroughs/moments
    const { data: breakthroughsData } = await supabase
      .from('breakthroughs')
      .select('description, category, occurred_at')
      .eq('user_id', userId)
      .order('occurred_at', { ascending: false })
      .limit(5);

    const moments = (breakthroughsData || []).map(b => ({
      date: new Date(b.occurred_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      text: b.description,
      type: b.category || 'honesty'
    }));

    // Get latest reflection
    const { data: latestReflection } = await supabase
      .from('weekly_reflections')
      .select('reflection_text')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Get triggers
    const { data: triggersData } = await supabase
      .from('extractions')
      .select('value')
      .eq('user_id', userId)
      .eq('type', 'trigger')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const triggerCounts: Record<string, number> = {};
    for (const row of triggersData || []) {
      triggerCounts[row.value] = (triggerCounts[row.value] || 0) + 1;
    }

    return NextResponse.json({
      ...basicResponse,
      practice: {
        currentStreak: streak,
        checkinsThisWeek: thisWeek.filter(d => d.checkedIn).length,
        checkinsTotal: completedCheckins.length,
        weeksActive,
      },
      emotions,
      moments,
      reflection: latestReflection?.reflection_text || null,
      triggers: Object.entries(triggerCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    });

  } catch (error) {
    console.error('[API:INSIGHTS] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
