import { generateEventSuggestions, type EventCopySuggestions } from '@/lib/ai/suggestions'
import type { EventType } from '@/types/event'

export async function getEventSuggestionsWithLlm(event: {
  name: string
  type: EventType
  date?: string | null
  location?: string | null
  organization?: string | null
  language?: string
}): Promise<{ suggestions: EventCopySuggestions; source: 'llm' | 'rules' }> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    return { suggestions: generateEventSuggestions(event), source: 'rules' }
  }

  try {
    const prompt = `Tadbir: ${event.name}, tur: ${event.type}, til: ${event.language ?? 'uz'}.
JSON qaytaring: invitation (string), certificateSubtitle (string), socialPost (string), agenda (string[] 4-5 qator).`

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Siz Gildia tadbir platformasi uchun matn yordamchisisiz. Faqat JSON javob bering.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 800,
      }),
    })

    if (!res.ok) throw new Error('LLM failed')

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const text = data.choices?.[0]?.message?.content?.trim()
    if (!text) throw new Error('Empty LLM')

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON')
    const parsed = JSON.parse(jsonMatch[0]) as Partial<EventCopySuggestions>

    const fallback = generateEventSuggestions(event)
    return {
      suggestions: {
        invitation: parsed.invitation ?? fallback.invitation,
        agenda: Array.isArray(parsed.agenda) ? parsed.agenda : fallback.agenda,
        socialPost: parsed.socialPost ?? fallback.socialPost,
        certificateSubtitle: parsed.certificateSubtitle ?? fallback.certificateSubtitle,
      },
      source: 'llm',
    }
  } catch (e) {
    console.error('LLM suggestions fallback:', e)
    return { suggestions: generateEventSuggestions(event), source: 'rules' }
  }
}
