'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Brain, 
  Heart, 
  Shield, 
  Check, 
  AlertCircle, 
  ShoppingBag, 
  Briefcase, 
  Coffee, 
  Wine, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Users
} from 'lucide-react';

const StarIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
  </svg>
);

// Updated colors to match landing page
const colors = {
  coral: '#C25441',
  coralLight: '#E07A5F',
  cyan: '#5B8F8F',
  cyanLight: '#7ab5b5',
  cream: '#FAF8F5',
  lightCream: '#F5F0E8',
  dark: '#1a1a2e',
  darkLight: '#252540',
};

export default function QuizPage() {
  const router = useRouter();
  const [stage, setStage] = useState('preamble');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [email, setEmail] = useState('');
  const [pattern, setPattern] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [preambleStep, setPreambleStep] = useState(0);
  const [consentChecks, setConsentChecks] = useState([false, false]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showSources, setShowSources] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage, currentQuestion, preambleStep]);

  // QUESTIONS - 14 total
  // 3 warmup + 1 branching + 10 universal follow-up
  const warmupQuestions = [
    {
      id: 1,
      text: "When you're stressed or overwhelmed, are you usually aware of it in the moment?",
      options: ["Yes, I notice right away", "Sometimes, depends on the situation", "Not really — I realize it later", "I'm not sure"],
      citation: "Self-awareness is the foundation of change"
    },
    {
      id: 2,
      text: "After a stressful day, how do you typically feel by evening?",
      options: ["I've processed it and feel okay", "Still carrying some tension", "Exhausted and wanting escape", "Numb or disconnected"],
      citation: "Emotional processing patterns reveal coping styles"
    },
    {
      id: 3,
      text: "When something difficult happens, what's your first instinct?",
      options: ["Talk to someone about it", "Distract myself with activities", "Try to fix it immediately", "Withdraw and process alone"],
      citation: "Initial responses often predict habitual patterns"
    }
  ];

  // Updated branching question with clearer option descriptions
  const branchingQuestion = {
    id: 4,
    text: "When you're stressed, anxious, or emotionally overwhelmed, which of these feels most familiar?",
    options: [
      "Reaching for connection — texting past connections, seeking attention, craving intensity",
      "Reaching for a substance — alcohol, food, cannabis, something to change how I feel",
      "Reaching for my wallet — buying things, browsing shops, retail therapy",
      "Reaching for work — staying busy, being productive, proving myself",
      "Reaching for reassurance — checking if people like me, seeking approval",
      "Reaching for escape — sleeping, avoiding, numbing out with screens",
      "Reaching for intensity — sex, romance, dating apps, the thrill of something new",
      "A mix of several of these"
    ],
    citation: "Stress responses tend to cluster into distinct patterns"
  };

  // Universal follow-up questions (after branching)
  const universalQuestions = [
    {
      id: 5,
      text: "How often does this pattern show up when you're stressed?",
      options: ["Almost every time", "More often than not", "Sometimes", "Rarely"],
      citation: "Frequency indicates pattern strength"
    },
    {
      id: 6,
      text: "After engaging in this behavior, how do you typically feel?",
      options: ["Worse than before", "Temporarily better, then worse", "Conflicted or confused", "Actually relieved"],
      citation: "Emotional aftermath shapes pattern reinforcement"
    },
    {
      id: 7,
      text: "Has this pattern affected other areas of your life?",
      options: ["Yes, significantly", "Somewhat", "A little", "Not really"],
      citation: "Cross-domain effects reveal pattern impact"
    },
    {
      id: 8,
      text: "When did you first notice this pattern?",
      options: ["Recently (past few months)", "Past 1-2 years", "Several years ago", "As long as I can remember"],
      citation: "Pattern duration informs approach"
    },
    {
      id: 9,
      text: "Do you recognize what triggers this behavior?",
      options: ["Yes, I can usually identify triggers", "Sometimes I notice them", "Rarely — it feels automatic", "I haven't thought about it"],
      citation: "Trigger awareness is key to interruption"
    },
    {
      id: 10,
      text: "Have you tried to change this pattern before?",
      options: ["Yes, multiple times", "Once or twice", "I've thought about it but haven't tried", "No"],
      citation: "Change history informs readiness"
    },
    {
      id: 11,
      text: "Does anyone else know about this pattern?",
      options: ["No one", "One or two people", "A few close people", "It's not something I hide"],
      citation: "Secrecy often intensifies shame cycles"
    },
    {
      id: 12,
      text: "How do you feel about this pattern?",
      options: ["Ashamed or embarrassed", "Frustrated with myself", "Curious about why I do it", "Accepting — it is what it is"],
      citation: "Emotional relationship to pattern affects change"
    },
    {
      id: 13,
      text: "What's your main motivation for understanding this pattern?",
      options: ["I want to stop hurting myself or others", "I'm tired of the cycle", "I want to understand myself better", "Someone suggested I look at this"],
      citation: "Motivation type predicts engagement"
    },
    {
      id: 14,
      text: "How ready do you feel to look at this pattern honestly?",
      options: ["Very ready — that's why I'm here", "Ready but nervous", "Curious but unsure", "Not sure I want to go deeper"],
      citation: "Readiness for change predicts success"
    }
  ];

  // PATTERNS - Updated with neuroscience-informed notes
  const patterns: Record<string, {
    title: string;
    subtitle: string;
    description: string;
    mechanism: string;
    note: string;
    icon: React.ReactNode;
    color: string;
    citation: string;
  }> = {
    intimacy_seeking: {
      title: "Intimacy Seeking",
      subtitle: "You reach for connection, romance, or intensity when stressed",
      description: "When stress hits, you reach for connection — people, attention, the feeling of being wanted. This might look like texting someone you shouldn't, seeking validation, or craving intensity when what you actually need is stability.",
      mechanism: "Your nervous system learned that connection means safety. It's trying to help — it just hasn't figured out how to choose connections that actually soothe rather than spike your stress.",
      note: "Your nervous system learned that connection equals survival. That's not broken — it's adaptive. The work now is teaching it the difference between connections that soothe and connections that spike. Recognition is where that starts.",
      icon: <Heart className="w-12 h-12" />,
      color: colors.coral,
      citation: "Kafka, 2010; Kraus et al., 2018; Lewczuk et al., 2022"
    },
    substance_soothing: {
      title: "Substance Soothing", 
      subtitle: "You use substances to manage difficult emotions",
      description: "When things get hard, you reach for something to change how you feel — alcohol, food, cannabis, or other substances. It works in the moment, which is exactly why your brain keeps suggesting it.",
      mechanism: "Your brain discovered a reliable way to shift your internal state. It's not broken — it's just using a tool that creates new problems while solving the immediate one.",
      note: "Your brain found something that works — fast. The problem is the cost. Research shows that when you can name what you're actually feeling underneath the urge, it loses some of its grip. That's not willpower. That's how the brain works.",
      icon: <Wine className="w-12 h-12" />,
      color: colors.coral,
      citation: "Khantzian, 1997; Koob & Volkow, 2016; Sinha, 2008"
    },
    compulsive_spending: {
      title: "Compulsive Spending",
      subtitle: "You spend money to manage stress",
      description: "When everything feels chaotic, you reach for the control and excitement of spending. The anticipation, the decision, the purchase — it's a complete distraction from what's actually bothering you.",
      mechanism: "Shopping activates your brain's reward system and gives a sense of control. The problem comes later, when the temporary high fades and consequences arrive.",
      note: "Spending often increases during uncertainty — it's a way of asserting control when everything else feels out of your hands. Naming that need for control is the first step toward meeting it differently.",
      icon: <ShoppingBag className="w-12 h-12" />,
      color: colors.cyan,
      citation: "Dittmar, 2005; McElroy et al., 1994; Müller et al., 2019"
    },
    achievement_hiding: {
      title: "Achievement Hiding",
      subtitle: "You work harder when you should rest",
      description: "When stress hits, you do more — work harder, stay busier, prove yourself. Productivity becomes a hiding place. As long as you're accomplishing things, you don't have to feel what's underneath.",
      mechanism: "Your brain learned that achievement equals safety and worth. But exhaustion catches up, and the things you're avoiding stay right where you left them.",
      note: "Society rewards this one, which makes it harder to see as a stress response. But productivity-as-hiding still has a cost. The feelings you're outrunning don't disappear — they wait. Recognizing the pattern is the first crack in the armor.",
      icon: <Briefcase className="w-12 h-12" />,
      color: colors.cyan,
      citation: "Schaufeli et al., 2009; Andreassen et al., 2012; Killinger, 2006"
    },
    approval_chasing: {
      title: "Approval Chasing",
      subtitle: "You seek approval and external validation",
      description: "When you're stressed, you look outward for reassurance — Am I okay? Am I doing enough? Do people still like me? This constant checking can exhaust both you and your relationships.",
      mechanism: "Your sense of self gets outsourced to others when stress depletes your internal resources. The need for validation often masks deeper questions about self-worth.",
      note: "External approval can never quite provide the lasting peace you're looking for — that has to come from somewhere else. But recognizing the pattern is how you start building that internal ground.",
      icon: <Users className="w-12 h-12" />,
      color: colors.cyan,
      citation: "Crocker & Park, 2004; Joiner et al., 1999; Leary & Baumeister, 2000"
    },
    withdrawal_avoidance: {
      title: "Withdrawal & Avoidance",
      subtitle: "You retreat into comfort and avoidance",
      description: "When stress hits, you withdraw — more sleep, more food, more screens, less everything else. It feels like self-care but functions more like hiding.",
      mechanism: "Your nervous system is trying to conserve energy and avoid further threat. But avoidance disguised as rest doesn't actually restore you — it just delays the reckoning.",
      note: "Rest is essential. But there's a difference between rest that restores and avoidance that compounds. Naming what you're actually avoiding is often more restorative than the hiding itself.",
      icon: <Coffee className="w-12 h-12" />,
      color: colors.coral,
      citation: "Carver et al., 1989; Hayes et al., 1996; Nolen-Hoeksema et al., 2008"
    },
    complex_mixed: {
      title: "Complex / Mixed Pattern",
      subtitle: "You use multiple strategies depending on the situation",
      description: "Your stress responses don't fit neatly into one category — you might reach for connection one day and isolation the next, or cycle through several patterns in a single stressful week.",
      mechanism: "Having multiple coping mechanisms isn't unusual. Many people developed layered strategies over time, each serving a different function or emerging in different contexts.",
      note: "Having multiple patterns isn't unusual — it often means your brain is creative in finding relief. Focus on identifying which pattern causes the most distress. Understanding one deeply often illuminates the others.",
      icon: <Brain className="w-12 h-12" />,
      color: colors.cyan,
      citation: "Folkman & Moskowitz, 2004"
    }
  };

  // Research sources - Updated with Lieberman citation
  const generalSources = [
    { authors: "Gross, J. J., & John, O. P.", year: "2003", title: "Individual differences in two emotion regulation processes", journal: "Journal of Personality and Social Psychology", url: "https://doi.org/10.1037/0022-3514.85.2.348" },
    { authors: "Lazarus, R. S., & Folkman, S.", year: "1984", title: "Stress, Appraisal, and Coping", journal: "Springer Publishing", url: "https://books.google.com/books/about/Stress_Appraisal_and_Coping.html" },
    { authors: "Carver, C. S., Scheier, M. F., & Weintraub, J. K.", year: "1989", title: "Assessing coping strategies", journal: "Journal of Personality and Social Psychology", url: "https://doi.org/10.1037/0022-3514.56.2.267" },
    { authors: "Aldao, A., Nolen-Hoeksema, S., & Schweizer, S.", year: "2010", title: "Emotion-regulation strategies across psychopathology", journal: "Clinical Psychology Review", url: "https://doi.org/10.1016/j.cpr.2009.11.004" },
    { authors: "Lieberman, M. D., Eisenberger, N. I., Crockett, M. J., et al.", year: "2007", title: "Putting feelings into words: Affect labeling disrupts amygdala activity in response to affective stimuli", journal: "Psychological Science", url: "https://doi.org/10.1111/j.1467-9280.2007.01916.x" },
  ];

  // Updated pattern sources with new keys and citations
  const patternSources: Record<string, Array<{authors: string; year: string; title: string; journal: string; url: string}>> = {
    intimacy_seeking: [
      { authors: "Kafka, M. P.", year: "2010", title: "Hypersexual disorder: A proposed diagnosis for DSM-5", journal: "Archives of Sexual Behavior", url: "https://doi.org/10.1007/s10508-009-9552-0" },
      { authors: "Kraus, S. W., et al.", year: "2018", title: "Compulsive sexual behavior disorder in the ICD-11", journal: "World Psychiatry", url: "https://doi.org/10.1002/wps.20499" },
      { authors: "Lewczuk, K., et al.", year: "2022", title: "Compulsive sexual behavior disorder and emotion dysregulation", journal: "Journal of Behavioral Addictions", url: "https://doi.org/10.1556/2006.2022.00035" },
      { authors: "Mikulincer, M., & Shaver, P. R.", year: "2007", title: "Attachment in Adulthood: Structure, Dynamics, and Change", journal: "Guilford Press", url: "https://www.guilford.com/books/Attachment-in-Adulthood/Mikulincer-Shaver/9781462525546" },
    ],
    substance_soothing: [
      { authors: "Khantzian, E. J.", year: "1997", title: "The self-medication hypothesis of substance use disorders", journal: "Harvard Review of Psychiatry", url: "https://doi.org/10.3109/10673229709030550" },
      { authors: "Koob, G. F., & Volkow, N. D.", year: "2016", title: "Neurobiology of addiction: A neurocircuitry analysis", journal: "The Lancet Psychiatry", url: "https://doi.org/10.1016/S2215-0366(16)00104-8" },
      { authors: "Sinha, R.", year: "2008", title: "Chronic stress, drug use, and vulnerability to addiction", journal: "Annals of the New York Academy of Sciences", url: "https://doi.org/10.1196/annals.1441.030" },
    ],
    compulsive_spending: [
      { authors: "Dittmar, H.", year: "2005", title: "Compulsive buying—a growing concern?", journal: "British Journal of Psychology", url: "https://doi.org/10.1348/000712605X53533" },
      { authors: "McElroy, S. L., et al.", year: "1994", title: "Compulsive buying: A report of 20 cases", journal: "Journal of Clinical Psychiatry", url: "https://pubmed.ncbi.nlm.nih.gov/8071278/" },
      { authors: "Müller, A., et al.", year: "2019", title: "Buying-shopping disorder—is there enough evidence to support its inclusion in ICD-11?", journal: "CNS Spectrums", url: "https://doi.org/10.1017/S1092852918001323" },
    ],
    achievement_hiding: [
      { authors: "Schaufeli, W. B., Taris, T. W., & van Rhenen, W.", year: "2009", title: "Workaholism, burnout, and work engagement", journal: "Applied Psychology", url: "https://doi.org/10.1111/j.1464-0597.2007.00285.x" },
      { authors: "Andreassen, C. S., et al.", year: "2012", title: "Development of a work addiction scale", journal: "Scandinavian Journal of Psychology", url: "https://doi.org/10.1111/j.1467-9450.2012.00947.x" },
      { authors: "Killinger, B.", year: "2006", title: "The workaholic breakdown syndrome", journal: "Research Companion to Working Time and Work Addiction", url: "https://doi.org/10.4337/9781847202833.00016" },
    ],
    approval_chasing: [
      { authors: "Crocker, J., & Park, L. E.", year: "2004", title: "The costly pursuit of self-esteem", journal: "Psychological Bulletin", url: "https://doi.org/10.1037/0033-2909.130.3.392" },
      { authors: "Joiner, T. E., et al.", year: "1999", title: "Excessive reassurance-seeking distinguishes depressed persons", journal: "Psychological Medicine", url: "https://doi.org/10.1017/S0033291799008855" },
      { authors: "Leary, M. R., & Baumeister, R. F.", year: "2000", title: "The nature and function of self-esteem: Sociometer theory", journal: "Advances in Experimental Social Psychology", url: "https://doi.org/10.1016/S0065-2601(00)80003-9" },
    ],
    withdrawal_avoidance: [
      { authors: "Carver, C. S., Scheier, M. F., & Weintraub, J. K.", year: "1989", title: "Assessing coping strategies: A theoretically based approach", journal: "Journal of Personality and Social Psychology", url: "https://doi.org/10.1037/0022-3514.56.2.267" },
      { authors: "Hayes, S. C., et al.", year: "1996", title: "Experiential avoidance and behavioral disorders", journal: "Journal of Consulting and Clinical Psychology", url: "https://doi.org/10.1037/0022-006X.64.6.1152" },
      { authors: "Nolen-Hoeksema, S., et al.", year: "2008", title: "Rethinking rumination", journal: "Perspectives on Psychological Science", url: "https://doi.org/10.1111/j.1745-6924.2008.00088.x" },
    ],
    complex_mixed: [
      { authors: "Folkman, S., & Moskowitz, J. T.", year: "2004", title: "Coping: Pitfalls and promise", journal: "Annual Review of Psychology", url: "https://doi.org/10.1146/annurev.psych.55.090902.141456" },
    ]
  };

  const getPatternSources = (patternKey: string) => {
    return patternSources[patternKey] || patternSources.complex_mixed;
  };

  // UPDATED: Preamble with neuroscience-informed language
  const preambleSteps = [
    {
      title: "Your brain has a go-to move when things get hard.",
      content: "It's automatic. You probably don't even think about it. When stress hits, your brain says 'do this' — and you do it. This isn't weakness. It's a pathway your brain learned to follow."
    },
    {
      title: "Everyone has a pattern.",
      content: "For some people, it's reaching out to someone from the past. For others, it's shutting everyone out. Some people spend money, some stop eating, some pick fights, some work themselves to exhaustion. The behavior varies. The mechanism is the same."
    },
    {
      title: "Naming it changes something.",
      content: "Research shows that simply identifying what you're feeling — putting words to it — quiets the brain's alarm system. This quiz helps you name your pattern. Not to shame it. Just to see it clearly."
    }
  ];

  const totalQuestions = 14;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Updated handleAnswer with new pattern keys
  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    setTimeout(() => {
      const updatedAnswers = { ...answers, [currentQuestion]: answerIndex };
      setAnswers(updatedAnswers);

      // Set pattern based on branching question (question 4, index 3)
      // Updated with new pattern keys from briefing
      if (currentQuestion === 3) {
        const patternMap: Record<number, string> = {
          0: 'intimacy_seeking',      // Reaching for connection
          1: 'substance_soothing',    // Reaching for a substance
          2: 'compulsive_spending',   // Reaching for my wallet
          3: 'achievement_hiding',    // Reaching for work
          4: 'approval_chasing',      // Reaching for reassurance
          5: 'withdrawal_avoidance',  // Reaching for escape
          6: 'intimacy_seeking',      // Reaching for intensity (alternate path)
          7: 'complex_mixed'          // A mix of several
        };
        setPattern(patternMap[answerIndex] || 'complex_mixed');
      }

      setSelectedAnswer(null);
      
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setStage('results');
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (stage === 'quiz') {
      setStage('consent');
    }
  };

  const getCurrentQuestion = () => {
    if (currentQuestion < 3) return warmupQuestions[currentQuestion];
    if (currentQuestion === 3) return branchingQuestion;
    return universalQuestions[currentQuestion - 4];
  };

  // PREAMBLE STAGE
  if (stage === 'preamble') {
    const step = preambleSteps[preambleStep];
    
    return (
      <div className="min-h-screen flex items-center px-6 py-16" style={{ backgroundColor: colors.dark }}>
        <div className="max-w-2xl mx-auto w-full">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-12">
            {preambleSteps.map((_, idx) => (
              <div 
                key={idx}
                className="w-2 h-2 rounded-full transition-all"
                style={{ 
                  backgroundColor: idx === preambleStep ? colors.coral : colors.cream,
                  opacity: idx === preambleStep ? 1 : 0.3
                }}
              />
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: colors.cream }}>
              {step.title}
            </h2>
            <p className="text-lg mb-12 leading-relaxed" style={{ color: colors.cream, opacity: 0.8 }}>
              {step.content}
            </p>

            <div className="flex justify-center gap-4">
              {preambleStep > 0 && (
                <button
                  onClick={() => setPreambleStep(preambleStep - 1)}
                  className="px-6 py-3 rounded-xl font-semibold border-2 transition-all"
                  style={{ borderColor: colors.coral, color: colors.coral }}
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <button
                onClick={() => {
                  if (preambleStep < preambleSteps.length - 1) {
                    setPreambleStep(preambleStep + 1);
                  } else {
                    setStage('consent');
                  }
                }}
                className="px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2"
                style={{ backgroundColor: colors.coral, color: colors.cream }}
              >
                {preambleStep < preambleSteps.length - 1 ? 'Continue' : 'Start'}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CONSENT STAGE
  if (stage === 'consent') {
    return (
      <div className="min-h-screen flex items-center p-6" style={{ backgroundColor: colors.dark }}>
        <div className="max-w-2xl mx-auto w-full">
          <div className="rounded-2xl p-8 md:p-10 border" style={{ backgroundColor: colors.darkLight, borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${colors.coral}20` }}>
                <Shield className="w-6 h-6" style={{ color: colors.coral }} />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: colors.cream }}>Before we start</h2>
            </div>
            
            <div className="space-y-4 mb-8" style={{ color: colors.cream }}>
              <p className="leading-relaxed opacity-80">
                This is a tool for self-reflection — not therapy, not a diagnosis. Think of it as a mirror, not a prescription.
              </p>
              
              <div className="p-4 rounded-xl border-l-4" style={{ backgroundColor: `${colors.coral}10`, borderColor: colors.coral }}>
                <p className="font-semibold mb-2" style={{ color: colors.coral }}>If you're in crisis</p>
                <p className="text-sm mb-3" style={{ opacity: 0.8 }}>
                  This isn't the right place. Please reach out to a mental health professional or crisis line.
                </p>
                <div className="text-sm space-y-1" style={{ opacity: 0.8 }}>
                  <p><strong>Netherlands:</strong> 113 Zelfmoordpreventie: 0900-0113 (24/7)</p>
                  <p><strong>Netherlands:</strong> De Luisterlijn: 088-0767000 (24/7)</p>
                  <p><strong>International:</strong> <a href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" rel="noopener noreferrer" style={{ color: colors.coral, textDecoration: 'underline' }}>Find a crisis center</a></p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {[
                "I understand this is for self-reflection, not diagnosis",
                "I'm not currently in crisis"
              ].map((text, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={consentChecks[idx]}
                    onChange={() => {
                      const newChecks = [...consentChecks];
                      newChecks[idx] = !newChecks[idx];
                      setConsentChecks(newChecks);
                    }}
                    className="mt-1 w-5 h-5 rounded" 
                    style={{ accentColor: colors.coral }}
                  />
                  <span className="text-sm" style={{ color: colors.cream, opacity: 0.8 }}>{text}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStage('preamble')}
                className="flex-1 px-6 py-4 border-2 rounded-xl font-semibold transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: colors.cream }}
              >
                Back
              </button>
              <button
                onClick={() => setStage('quiz')}
                disabled={!consentChecks.every(Boolean)}
                className="flex-1 px-6 py-4 rounded-xl font-semibold transition-all"
                style={{ 
                  backgroundColor: consentChecks.every(Boolean) ? colors.coral : 'rgba(255,255,255,0.1)',
                  color: consentChecks.every(Boolean) ? colors.cream : 'rgba(255,255,255,0.3)',
                  cursor: consentChecks.every(Boolean) ? 'pointer' : 'not-allowed'
                }}
              >
                I understand
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ STAGE
  if (stage === 'quiz') {
    const question = getCurrentQuestion();

    return (
      <div className="min-h-screen p-6 py-12" style={{ backgroundColor: colors.dark }}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="px-4 py-2 rounded-xl font-semibold border-2 transition-all flex items-center gap-2"
              style={{ 
                borderColor: currentQuestion === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
                color: currentQuestion === 0 ? 'rgba(255,255,255,0.3)' : colors.cream,
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div className="px-4 py-2 rounded-full flex items-center gap-2" style={{ backgroundColor: colors.darkLight }}>
              <Lock className="w-4 h-4" style={{ color: colors.cyan }} />
              <span className="text-sm font-medium" style={{ color: colors.cream }}>Private</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-10">
            <div className="flex justify-between text-sm font-medium mb-3" style={{ color: colors.cream }}>
              <span>Question {currentQuestion + 1} of {totalQuestions}</span>
              <span style={{ color: colors.cyan }}>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: colors.coral }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="rounded-2xl p-8 md:p-10 border" style={{ backgroundColor: colors.darkLight, borderColor: 'rgba(255,255,255,0.1)' }}>
            <h2 className="text-xl md:text-2xl font-bold mb-8" style={{ color: colors.cream }}>
              {question.text}
            </h2>
            
            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => selectedAnswer === null && handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className="w-full text-left p-5 rounded-xl border-2 font-medium transition-all"
                    style={{ 
                      borderColor: isSelected ? colors.coral : 'rgba(255,255,255,0.1)',
                      backgroundColor: isSelected ? colors.coral : 'transparent',
                      color: colors.cream,
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      cursor: selectedAnswer !== null ? 'default' : 'pointer'
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {question.citation && (
              <div className="mt-8 pt-6 border-t flex items-start gap-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <Brain className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.cyan }} />
                <p className="text-xs italic" style={{ color: colors.cream, opacity: 0.4 }}>
                  {question.citation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RESULTS STAGE
  if (stage === 'results') {
    const patternData = patterns[pattern || 'complex_mixed'];

    return (
      <div className="min-h-screen p-6 py-12" style={{ backgroundColor: colors.dark }}>
        <div className="max-w-3xl mx-auto">
          {/* Courage acknowledgment - prominent */}
          <div className="rounded-2xl p-6 mb-8 text-center border" style={{ backgroundColor: `${colors.cyan}15`, borderColor: `${colors.cyan}30` }}>
            <p className="text-xl md:text-2xl font-medium" style={{ color: colors.cream }}>
              That took honesty.
            </p>
            <p className="text-lg mt-2" style={{ color: colors.cream, opacity: 0.7 }}>
              Most people don't look at this stuff. You just did.
            </p>
          </div>

          {/* Pattern Card */}
          <div className="rounded-2xl overflow-hidden mb-8 border" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="p-8 text-center" style={{ backgroundColor: patternData.color }}>
              <p className="text-sm uppercase tracking-wider mb-3" style={{ color: colors.cream, opacity: 0.7 }}>
                Your Pattern
              </p>
              <div className="flex justify-center mb-4" style={{ color: colors.cream }}>
                {patternData.icon}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: colors.cream }}>
                {patternData.title}
              </h1>
              <p className="text-lg" style={{ color: colors.cream, opacity: 0.8 }}>
                {patternData.subtitle}
              </p>
            </div>

            <div className="p-8" style={{ backgroundColor: colors.darkLight }}>
              <p className="text-lg leading-relaxed mb-6" style={{ color: colors.cream }}>
                {patternData.description}
              </p>
              
              <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: colors.cyan }}>
                  Why this happens
                </p>
                <p className="text-sm leading-relaxed" style={{ color: colors.cream, opacity: 0.8 }}>
                  {patternData.mechanism}
                </p>
              </div>

              <div className="p-4 rounded-xl border-l-4" style={{ backgroundColor: `${colors.coral}10`, borderColor: colors.coral }}>
                <p className="text-sm" style={{ color: colors.cream }}>
                  {patternData.note}
                </p>
              </div>

              <p className="text-xs mt-6" style={{ color: colors.cream, opacity: 0.4 }}>
                Research: {patternData.citation}
              </p>
            </div>
          </div>

          {/* NEW: Why Awareness Matters callout */}
          <div 
            className="rounded-xl p-5 mb-8 flex items-start gap-3 border"
            style={{ backgroundColor: `${colors.cyan}10`, borderColor: `${colors.cyan}30` }}
          >
            <Brain size={20} className="flex-shrink-0 mt-0.5" style={{ color: colors.cyan }} />
            <div>
              <p className="font-semibold mb-1" style={{ color: colors.cream }}>
                Why seeing this matters
              </p>
              <p className="text-sm" style={{ color: colors.cream, opacity: 0.8 }}>
                You just did something your brain resists: you looked directly at a pattern you usually run on autopilot. Research shows this kind of self-observation activates the prefrontal cortex — the part of your brain that can choose, not just react. The more you practice seeing, the wider the gap becomes between trigger and behavior.
              </p>
            </div>
          </div>

          {/* Email capture */}
          <div className="rounded-2xl p-8 text-center border" style={{ backgroundColor: colors.darkLight, borderColor: colors.coral }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.cream }}>
              Want to go deeper?
            </h3>
            <p className="mb-6 text-sm" style={{ color: colors.cream, opacity: 0.7 }}>
              Get a detailed breakdown of your pattern and learn what you can do next.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl text-center sm:text-left"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.cream, border: 'none' }}
              />
              <button
                className="px-6 py-3 rounded-xl font-semibold transition-all"
                style={{ backgroundColor: colors.coral, color: colors.cream }}
              >
                Send me more
              </button>
            </div>
            <p className="text-xs mt-4" style={{ color: colors.cream, opacity: 0.4 }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>

          {/* Tester login link */}
          <div className="rounded-2xl p-6 mt-6 text-center border" style={{ backgroundColor: colors.darkLight, borderColor: 'rgba(255,255,255,0.1)' }}>
            <p className="text-sm mb-3" style={{ color: colors.cream, opacity: 0.7 }}>
              Already have an invite code?
            </p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 rounded-xl font-semibold transition-all inline-flex items-center gap-2"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: colors.cream }}
            >
              Login to check-ins <ArrowRight size={16} />
            </button>
          </div>

          {/* Research Sources */}
          <div className="rounded-xl mt-8 border" style={{ backgroundColor: colors.darkLight, borderColor: 'rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setShowSources(!showSources)}
              className="w-full p-4 flex items-center justify-between font-medium transition-all"
              style={{ color: colors.cream }}
            >
              <span className="flex items-center gap-2">
                <Brain size={18} style={{ color: colors.cyan }} />
                Research sources
              </span>
              {showSources ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {showSources && (
              <div className="px-4 pb-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <p className="text-sm py-4" style={{ color: colors.cream, opacity: 0.6 }}>
                  The science behind this assessment:
                </p>
                
                {/* Pattern-specific research */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: colors.cyan }}>
                    Research on your pattern
                  </h4>
                  <div className="space-y-2">
                    {getPatternSources(pattern || 'complex_mixed').map((source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg transition-all hover:opacity-80"
                        style={{ backgroundColor: `${colors.cyan}10` }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium" style={{ color: colors.cream }}>
                              {source.authors} ({source.year})
                            </p>
                            <p className="text-sm italic" style={{ color: colors.cream, opacity: 0.7 }}>
                              {source.title}
                            </p>
                            <p className="text-xs" style={{ color: colors.cyan }}>
                              {source.journal}
                            </p>
                          </div>
                          <ExternalLink size={14} className="flex-shrink-0 mt-1" style={{ color: colors.cyan }} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* General research */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: colors.cream, opacity: 0.5 }}>
                    General stress & coping research
                  </h4>
                  <div className="space-y-2">
                    {generalSources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg transition-all hover:opacity-80"
                        style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium" style={{ color: colors.cream }}>
                              {source.authors} ({source.year})
                            </p>
                            <p className="text-sm italic" style={{ color: colors.cream, opacity: 0.7 }}>
                              {source.title}
                            </p>
                            <p className="text-xs" style={{ color: colors.coral }}>
                              {source.journal}
                            </p>
                          </div>
                          <ExternalLink size={14} className="flex-shrink-0 mt-1" style={{ color: colors.cream, opacity: 0.4 }} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Back to home */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/')}
              className="text-sm font-medium transition-all"
              style={{ color: colors.cream, opacity: 0.5 }}
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
