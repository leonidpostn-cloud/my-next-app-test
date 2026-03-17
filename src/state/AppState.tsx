import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from 'react'
import { createInitialState, defaultLocation, externalNotes, friends, places, quests } from '../data/mockData'
import { distanceMeters } from '../lib/geo'
import {
  Coordinates,
  Note,
  Place,
  ProfileSettings,
  Quest,
  QuestProgress,
  StoredState,
  UnlockedReward,
  Visibility
} from '../lib/types'

const STORAGE_KEY = 'otkryvaika-demo-state-v1'

interface AppStats {
  uniqueVisited: number
  totalVisits: number
  favorites: number
  notes: number
  unlockedRewards: number
}

interface CreateNoteInput {
  placeId: string
  text: string
  visibility: Visibility
  imageUrl?: string
}

interface AppStateValue {
  places: Place[]
  quests: Quest[]
  friends: typeof friends
  state: StoredState
  visitedPlaceIds: string[]
  allNotes: Note[]
  nearbyPlaces: Array<{ place: Place; distance: number }>
  questProgress: QuestProgress[]
  activeQuest: QuestProgress
  unlockedRewards: UnlockedReward[]
  physicalRewards: UnlockedReward[]
  appStats: AppStats
  checkIn: (placeId: string, options?: { auto?: boolean }) => void
  toggleFavorite: (placeId: string) => void
  addNote: (input: CreateNoteInput) => void
  updateProfile: (patch: Partial<ProfileSettings>) => void
  setActiveQuest: (questId: string) => void
  setCurrentLocation: (coords: Coordinates, source?: 'manual' | 'gps' | 'test') => void
  moveToTestSpot: () => void
  dismissSystemMessage: () => void
  resetDemo: () => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

function getQuestCurrent(quest: Quest, state: StoredState) {
  const visitedIds = Object.entries(state.visits)
    .filter(([, count]) => count > 0)
    .map(([placeId]) => placeId)

  switch (quest.type) {
    case 'unique_places':
      return visitedIds.length
    case 'category_unique':
      return visitedIds.filter((placeId) => {
        const place = places.find((item) => item.id === placeId)
        return place?.category === quest.category
      }).length
    case 'place_visits':
      return quest.placeId ? state.visits[quest.placeId] ?? 0 : 0
    case 'category_visits':
      return places
        .filter((place) => place.category === quest.category)
        .reduce((sum, place) => sum + (state.visits[place.id] ?? 0), 0)
    case 'favorites':
      return state.favoriteIds.length
    default:
      return 0
  }
}

function maybeApplyAutoCheckin(state: StoredState, coords: Coordinates) {
  if (!state.profile.autoCheckin) {
    return state
  }

  const eligible = places
    .filter((place) => (state.visits[place.id] ?? 0) >= 3)
    .map((place) => ({
      place,
      distance: distanceMeters(coords, { lat: place.lat, lng: place.lng })
    }))
    .filter((item) => item.distance < 220)
    .sort((left, right) => left.distance - right.distance)[0]

  if (!eligible) {
    return state
  }

  const autoKey = `${eligible.place.id}:${new Date().toDateString()}`
  if (state.lastAutoCheckinKey === autoKey) {
    return state
  }

  return {
    ...state,
    visits: {
      ...state.visits,
      [eligible.place.id]: (state.visits[eligible.place.id] ?? 0) + 1
    },
    lastAutoCheckinKey: autoKey,
    systemMessage: `Автоотметка сработала: ${eligible.place.name} засчитано без подтверждения.`
  }
}

function loadStoredState() {
  if (typeof window === 'undefined') {
    return createInitialState()
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return createInitialState()
  }

  try {
    const parsed = JSON.parse(raw) as StoredState
    return {
      ...createInitialState(),
      ...parsed,
      profile: {
        ...createInitialState().profile,
        ...parsed.profile
      }
    }
  } catch {
    return createInitialState()
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(() => loadStoredState())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const visitedPlaceIds = Object.entries(state.visits)
    .filter(([, count]) => count > 0)
    .map(([placeId]) => placeId)

  const questProgress = quests.map((quest) => {
    const current = getQuestCurrent(quest, state)
    const relatedPlace = quest.placeId
      ? places.find((place) => place.id === quest.placeId)
      : undefined
    const nearPartner = relatedPlace
      ? distanceMeters(state.currentLocation, {
          lat: relatedPlace.lat,
          lng: relatedPlace.lng
        }) < 900
      : quest.scope === 'partner' &&
        places.some(
          (place) =>
            place.partner &&
            (!quest.category || place.category === quest.category) &&
            distanceMeters(state.currentLocation, { lat: place.lat, lng: place.lng }) < 900
        )

    return {
      quest,
      current,
      remaining: Math.max(quest.target - current, 0),
      completed: current >= quest.target,
      nearPartner
    }
  })

  const activeQuest =
    questProgress.find((item) => item.quest.id === state.activeQuestId) ?? questProgress[0]

  const unlockedRewards = questProgress
    .filter((item) => item.completed)
    .map((item) => ({
      ...item.quest.reward,
      id: `reward-${item.quest.id}`,
      questId: item.quest.id
    }))

  const physicalRewards = unlockedRewards.filter((reward) => reward.kind !== 'badge')

  const allNotes = [...externalNotes, ...state.notes].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  )

  const nearbyPlaces = places
    .map((place) => ({
      place,
      distance: distanceMeters(state.currentLocation, { lat: place.lat, lng: place.lng })
    }))
    .sort((left, right) => left.distance - right.distance)

  const appStats: AppStats = {
    uniqueVisited: visitedPlaceIds.length,
    totalVisits: Object.values(state.visits).reduce((sum, count) => sum + count, 0),
    favorites: state.favoriteIds.length,
    notes: allNotes.length,
    unlockedRewards: unlockedRewards.length
  }

  function checkIn(placeId: string, options?: { auto?: boolean }) {
    const place = places.find((item) => item.id === placeId)
    if (!place) {
      return
    }

    setState((current) => ({
      ...current,
      visits: {
        ...current.visits,
        [placeId]: (current.visits[placeId] ?? 0) + 1
      },
      systemMessage: options?.auto
        ? `Автоотметка добавила ещё одно посещение для ${place.name}.`
        : `Посещение ${place.name} засчитано. Прогресс по наградам обновлён.`
    }))
  }

  function toggleFavorite(placeId: string) {
    setState((current) => {
      const isFavorite = current.favoriteIds.includes(placeId)

      return {
        ...current,
        favoriteIds: isFavorite
          ? current.favoriteIds.filter((id) => id !== placeId)
          : [...current.favoriteIds, placeId],
        systemMessage: isFavorite
          ? 'Место убрано из любимых.'
          : 'Место добавлено в любимые.'
      }
    })
  }

  function addNote(input: CreateNoteInput) {
    setState((current) => ({
      ...current,
      notes: [
        {
          id: `note-${Date.now()}`,
          placeId: input.placeId,
          authorId: 'self',
          authorName: current.profile.nickname,
          text: input.text.trim(),
          imageUrl: input.imageUrl?.trim() || undefined,
          createdAt: new Date().toISOString(),
          visibility: input.visibility,
          source: 'self'
        },
        ...current.notes
      ],
      systemMessage: 'Заметка опубликована в ленте.'
    }))
  }

  function updateProfile(patch: Partial<ProfileSettings>) {
    setState((current) => ({
      ...current,
      profile: {
        ...current.profile,
        ...patch
      }
    }))
  }

  function setActiveQuest(questId: string) {
    setState((current) => ({
      ...current,
      activeQuestId: questId,
      systemMessage: 'Активная цель на карте обновлена.'
    }))
  }

  function setCurrentLocation(coords: Coordinates, source: 'manual' | 'gps' | 'test' = 'manual') {
    setState((current) => {
      const baseState: StoredState = {
        ...current,
        currentLocation: coords,
        systemMessage:
          source === 'gps'
            ? 'Геопозиция обновлена с устройства.'
            : source === 'test'
              ? 'Тестовая позиция сдвинута. Можно проверить новые подсказки рядом.'
              : current.systemMessage
      }

      return maybeApplyAutoCheckin(baseState, coords)
    })
  }

  function moveToTestSpot() {
    const radius = 0.008
    const latOffset = (Math.random() - 0.5) * radius
    const lngOffset = (Math.random() - 0.5) * radius

    setCurrentLocation(
      {
        lat: defaultLocation.lat + latOffset,
        lng: defaultLocation.lng + lngOffset
      },
      'test'
    )
  }

  function dismissSystemMessage() {
    setState((current) => ({
      ...current,
      systemMessage: undefined
    }))
  }

  function resetDemo() {
    setState(createInitialState())
  }

  return (
    <AppStateContext.Provider
      value={{
        places,
        quests,
        friends,
        state,
        visitedPlaceIds,
        allNotes,
        nearbyPlaces,
        questProgress,
        activeQuest,
        unlockedRewards,
        physicalRewards,
        appStats,
        checkIn,
        toggleFavorite,
        addNote,
        updateProfile,
        setActiveQuest,
        setCurrentLocation,
        moveToTestSpot,
        dismissSystemMessage,
        resetDemo
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)

  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }

  return context
}
