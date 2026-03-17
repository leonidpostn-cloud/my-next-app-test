export type PlaceCategory =
  | 'coffee'
  | 'food'
  | 'walk'
  | 'culture'
  | 'sport'
  | 'view'

export type QuestType =
  | 'unique_places'
  | 'category_unique'
  | 'place_visits'
  | 'category_visits'
  | 'favorites'

export type RewardKind = 'promo' | 'gift' | 'badge'

export type Visibility = 'public' | 'friends' | 'private'

export interface Coordinates {
  lat: number
  lng: number
}

export interface Place {
  id: string
  name: string
  company: string
  category: PlaceCategory
  lat: number
  lng: number
  address: string
  description: string
  aiPitch: string
  tags: string[]
  partner: boolean
  rewards: string[]
  highlight: string
}

export interface QuestReward {
  title: string
  kind: RewardKind
  code?: string
}

export interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  scope: 'app' | 'partner'
  target: number
  category?: PlaceCategory
  placeId?: string
  reward: QuestReward
  expiresAt?: string
  competitive?: boolean
}

export interface Note {
  id: string
  placeId: string
  authorId: string
  authorName: string
  text: string
  imageUrl?: string
  createdAt: string
  visibility: Visibility
  source: 'self' | 'friend' | 'open'
}

export interface Friend {
  id: string
  name: string
  handle: string
  shareLocation: boolean
  lastSpot: string
  status: string
  gradient: string
}

export interface ProfileSettings {
  nickname: string
  city: string
  bio: string
  avatarSeed: string
  privacy: Visibility
  shareLocation: boolean
  autoCheckin: boolean
}

export interface StoredState {
  visits: Record<string, number>
  favoriteIds: string[]
  notes: Note[]
  profile: ProfileSettings
  activeQuestId: string
  currentLocation: Coordinates
  lastAutoCheckinKey?: string
  systemMessage?: string
}

export interface NearbyPlace {
  place: Place
  distance: number
}

export interface QuestProgress {
  quest: Quest
  current: number
  remaining: number
  completed: boolean
  nearPartner: boolean
}

export interface UnlockedReward extends QuestReward {
  id: string
  questId: string
}
