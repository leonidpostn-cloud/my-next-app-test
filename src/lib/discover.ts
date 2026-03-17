import { Place } from './types'

export interface DiscoverOption {
  label: string
  tags: string[]
}

export interface DiscoverQuestion {
  id: string
  title: string
  hint: string
  options: DiscoverOption[]
}

export interface DiscoverAnswer {
  questionId: string
  label: string
  tags: string[]
  freeform?: string
}

export const discoverQuestions: DiscoverQuestion[] = [
  {
    id: 'mood',
    title: 'Чего тебе хочется прямо сейчас?',
    hint: 'Первый ответ задаёт общий ритм подборки.',
    options: [
      { label: 'Поесть вкусно', tags: ['food', 'cozy', 'friends'] },
      { label: 'Кофе и выдохнуть', tags: ['coffee', 'cozy', 'solo'] },
      { label: 'Погулять', tags: ['walk', 'view', 'fresh-air'] },
      { label: 'Встряхнуться', tags: ['sport', 'active', 'energy'] }
    ]
  },
  {
    id: 'company',
    title: 'Какой формат компании?',
    hint: 'Это влияет на выбор атмосферы.',
    options: [
      { label: 'Один / одна', tags: ['solo', 'quiet'] },
      { label: 'С приятелями', tags: ['friends', 'lively'] },
      { label: 'Свидание', tags: ['date', 'view', 'cozy'] },
      { label: 'Семейно и спокойно', tags: ['family', 'quiet'] }
    ]
  },
  {
    id: 'tempo',
    title: 'Какой нужен темп?',
    hint: 'Можно выдохнуть, а можно устроить движ.',
    options: [
      { label: 'Максимально спокойно', tags: ['quiet', 'cozy'] },
      { label: 'Средний, без суеты', tags: ['balanced'] },
      { label: 'Поживее', tags: ['active', 'lively'] },
      { label: 'Хочу вау-эффект', tags: ['view', 'special'] }
    ]
  },
  {
    id: 'time',
    title: 'На какое время рассчитываем?',
    hint: 'Это помогает отсечь слишком длинные сценарии.',
    options: [
      { label: '15-30 минут', tags: ['short', 'coffee'] },
      { label: 'Около часа', tags: ['balanced'] },
      { label: 'Пара часов', tags: ['long', 'walk', 'culture'] },
      { label: 'Хоть весь вечер', tags: ['evening', 'food', 'view'] }
    ]
  },
  {
    id: 'budget',
    title: 'Какой бюджет настроения?',
    hint: 'Здесь можно сказать просто “побюджетнее” или “хочу красиво”.',
    options: [
      { label: 'Экономно', tags: ['budget'] },
      { label: 'Комфортно', tags: ['mid-budget'] },
      { label: 'Можно потратиться', tags: ['premium'] },
      { label: 'Неважно', tags: ['flex'] }
    ]
  },
  {
    id: 'setting',
    title: 'Тянет больше внутрь или наружу?',
    hint: 'Помогает развести прогулки и indoor-места.',
    options: [
      { label: 'Внутри', tags: ['indoor'] },
      { label: 'На улице', tags: ['outdoor', 'walk'] },
      { label: 'Микс', tags: ['flex', 'balanced'] },
      { label: 'Пусть удивит', tags: ['special'] }
    ]
  },
  {
    id: 'anchor',
    title: 'Что точно хочется получить в итоге?',
    hint: 'Последний штрих для финальной четвёрки.',
    options: [
      { label: 'Красивый вид', tags: ['view', 'special'] },
      { label: 'Вкусную еду', tags: ['food', 'comfort-food'] },
      { label: 'Новый опыт', tags: ['culture', 'sport'] },
      { label: 'Место, куда захочется вернуться', tags: ['cozy', 'favorite'] }
    ]
  }
]

const freeformTagRules: Array<{ pattern: RegExp; tags: string[] }> = [
  { pattern: /(коф|раф|капуч|латте)/i, tags: ['coffee', 'cozy'] },
  { pattern: /(поесть|еда|ужин|обед|завтрак|вкус)/i, tags: ['food'] },
  { pattern: /(гулять|прогул|набереж|улиц|парк|воздух)/i, tags: ['walk', 'outdoor'] },
  { pattern: /(спорт|зал|трен|скал|актив)/i, tags: ['sport', 'active'] },
  { pattern: /(музей|книга|культура|выстав)/i, tags: ['culture', 'quiet'] },
  { pattern: /(вид|панорам|закат|красиво)/i, tags: ['view', 'special'] },
  { pattern: /(тихо|спокойно|уют)/i, tags: ['quiet', 'cozy'] },
  { pattern: /(свидан|романт)/i, tags: ['date', 'view'] },
  { pattern: /(друз|компан)/i, tags: ['friends', 'lively'] },
  { pattern: /(дёш|бюджет|эконом)/i, tags: ['budget'] }
]

export function inferTagsFromFreeform(input: string) {
  const found = new Set<string>()

  for (const rule of freeformTagRules) {
    if (rule.pattern.test(input)) {
      for (const tag of rule.tags) {
        found.add(tag)
      }
    }
  }

  return Array.from(found)
}

export function buildTagWeights(answers: DiscoverAnswer[]) {
  const weights = new Map<string, number>()

  answers.forEach((answer, index) => {
    const baseWeight = index < 2 ? 3 : 2
    answer.tags.forEach((tag) => {
      weights.set(tag, (weights.get(tag) ?? 0) + baseWeight)
    })
  })

  return weights
}

export function recommendPlaces(places: Place[], answers: DiscoverAnswer[]) {
  const weights = buildTagWeights(answers)

  return places
    .map((place) => {
      let score = place.partner ? 0.8 : 0
      const matchedTags = new Set<string>()

      place.tags.forEach((tag) => {
        const weight = weights.get(tag)
        if (weight) {
          score += weight
          matchedTags.add(tag)
        }
      })

      const categoryBoost = weights.get(place.category)
      if (categoryBoost) {
        score += categoryBoost * 1.4
        matchedTags.add(place.category)
      }

      if (weights.get('view') && place.category === 'walk') {
        score += 1.2
      }

      if (weights.get('favorite') && place.partner) {
        score += 0.5
      }

      return {
        place,
        score,
        matchedTags: Array.from(matchedTags)
      }
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map((item, index) => ({
      ...item,
      reason:
        index === 0
          ? `Лучшее совпадение по настроению: ${item.place.aiPitch}`
          : item.matchedTags.length > 0
            ? `Совпадает по тегам: ${item.matchedTags.slice(0, 3).join(', ')}.`
            : 'Подходит как нейтральный запасной вариант рядом.'
    }))
}
