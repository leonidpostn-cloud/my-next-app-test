import { Coordinates, Friend, Note, Place, Quest, StoredState } from '../lib/types'

export const defaultLocation: Coordinates = {
  lat: 56.0129,
  lng: 92.8742
}

export const places: Place[] = [
  {
    id: 'surf-sloy',
    name: 'Surf & Слой',
    company: 'Surf & Слой',
    category: 'coffee',
    lat: 56.0117,
    lng: 92.8748,
    address: 'ул. Дубровинского, 1И',
    description: 'Кофейня у воды с фильтром, выпечкой и местами для быстрых созвонов.',
    aiPitch: 'Спокойный старт дня или короткая пауза с кофе и видом на город.',
    tags: ['coffee', 'cozy', 'morning', 'solo', 'short', 'indoor'],
    partner: true,
    rewards: ['-15% на второй напиток после 4 визитов', 'Стикерпак за первую отметку'],
    highlight: 'linear-gradient(135deg, #f7b267 0%, #f4845f 100%)'
  },
  {
    id: 'bridge-bistro',
    name: 'Bridge Bistro',
    company: 'Bridge Bistro',
    category: 'food',
    lat: 56.0144,
    lng: 92.8721,
    address: 'наб. Усачёва, 8',
    description: 'Небольшой бистро-бар для поздних завтраков и спокойных свиданий.',
    aiPitch: 'Когда хочется красиво поесть без тяжёлого пафоса и остаться на подольше.',
    tags: ['food', 'date', 'view', 'cozy', 'evening', 'indoor'],
    partner: true,
    rewards: ['Десерт в подарок после 2 отметок', 'Промокод на сет для двоих'],
    highlight: 'linear-gradient(135deg, #ffd670 0%, #ff9770 100%)'
  },
  {
    id: 'yenisei-embankment',
    name: 'Енисейская набережная',
    company: 'Город',
    category: 'walk',
    lat: 56.0098,
    lng: 92.8797,
    address: 'Центральная набережная',
    description: 'Прогулочный маршрут вдоль воды, где удобно отмечать короткие городские вылазки.',
    aiPitch: 'Подходит, если нужно проветриться, не уезжая далеко от центра.',
    tags: ['walk', 'outdoor', 'view', 'fresh-air', 'friends', 'long'],
    partner: false,
    rewards: ['Городская ачивка за серию прогулок'],
    highlight: 'linear-gradient(135deg, #67b7d1 0%, #4d908e 100%)'
  },
  {
    id: 'museum-center',
    name: 'Музейный центр',
    company: 'Музейный центр',
    category: 'culture',
    lat: 56.0171,
    lng: 92.8655,
    address: 'пл. Мира, 1',
    description: 'Выставки, лекции и тихие залы, куда хорошо идти за новым контекстом.',
    aiPitch: 'Если хочется получить новый опыт и немного замедлиться, это сильный выбор.',
    tags: ['culture', 'quiet', 'indoor', 'solo', 'long'],
    partner: false,
    rewards: ['Значок “Культурный слой” за 2 визита'],
    highlight: 'linear-gradient(135deg, #b8c0ff 0%, #6d597a 100%)'
  },
  {
    id: 'pulse-climb',
    name: 'Pulse Climb',
    company: 'Pulse Climb',
    category: 'sport',
    lat: 56.0213,
    lng: 92.8726,
    address: 'ул. Ленина, 118',
    description: 'Скалодром и функциональный зал для тех, кому нужен ощутимый заряд.',
    aiPitch: 'Когда хочется не просто выйти, а реально включиться телом и головой.',
    tags: ['sport', 'active', 'energy', 'friends', 'indoor'],
    partner: true,
    rewards: ['Пробное занятие для друга', 'Магнезия в подарок за 3 визита'],
    highlight: 'linear-gradient(135deg, #84a59d 0%, #f6bd60 100%)'
  },
  {
    id: 'panorama-hill',
    name: 'Панорама на Караульной',
    company: 'Город',
    category: 'view',
    lat: 56.0304,
    lng: 92.8987,
    address: 'смотровая у часовни',
    description: 'Смотровая точка для закатов, фото и ощущения, что город у тебя на ладони.',
    aiPitch: 'Выбирай, если нужен вау-эффект, воздух и ощущение маленького путешествия.',
    tags: ['view', 'special', 'outdoor', 'date', 'walk', 'evening'],
    partner: false,
    rewards: ['Бейдж “Открыл вид”'],
    highlight: 'linear-gradient(135deg, #9bf6ff 0%, #5e60ce 100%)'
  },
  {
    id: 'book-yard',
    name: 'Книжный двор',
    company: 'Книжный двор',
    category: 'culture',
    lat: 56.0161,
    lng: 92.8785,
    address: 'пр. Мира, 42',
    description: 'Книги, камерные встречи и кофе-точка внутри исторического двора.',
    aiPitch: 'Хорош для спокойного свидания или одиночного вечера с ощущением открытия.',
    tags: ['culture', 'cozy', 'quiet', 'date', 'indoor'],
    partner: true,
    rewards: ['-10% на арт-альбомы для активных посетителей'],
    highlight: 'linear-gradient(135deg, #d8e2dc 0%, #b56576 100%)'
  },
  {
    id: 'green-loop',
    name: 'Зелёная петля',
    company: 'Экопарк',
    category: 'walk',
    lat: 56.0239,
    lng: 92.8844,
    address: 'парк в центре',
    description: 'Короткий маршрут через зелёный карман города для прогулок и встреч.',
    aiPitch: 'Когда нужен воздух и спокойный разговор без длинной логистики.',
    tags: ['walk', 'outdoor', 'quiet', 'friends', 'balanced'],
    partner: false,
    rewards: ['Городская серия прогулок'],
    highlight: 'linear-gradient(135deg, #90be6d 0%, #43aa8b 100%)'
  },
  {
    id: 'city-lift-gym',
    name: 'City Lift Gym',
    company: 'City Lift Gym',
    category: 'sport',
    lat: 56.0194,
    lng: 92.8612,
    address: 'ул. Карла Маркса, 88',
    description: 'Компактный зал для регулярных тренировок без лишнего блеска.',
    aiPitch: 'Подходит тем, кто хочет встроить спорт в ритм недели, а не делать из него событие.',
    tags: ['sport', 'active', 'indoor', 'solo', 'balanced'],
    partner: false,
    rewards: ['Ачивка за серию тренировок'],
    highlight: 'linear-gradient(135deg, #52b788 0%, #40916c 100%)'
  },
  {
    id: 'dumpling-night',
    name: 'Пельменная “Ночь”',
    company: 'Пельменная “Ночь”',
    category: 'food',
    lat: 56.0133,
    lng: 92.8679,
    address: 'ул. Парижской Коммуны, 21',
    description: 'Простое место для поздней еды, компании и понятного комфорта.',
    aiPitch: 'Выручает, когда хочется не церемоний, а честной и согревающей еды.',
    tags: ['food', 'friends', 'comfort-food', 'budget', 'evening', 'indoor'],
    partner: true,
    rewards: ['Промокод на комбо после трёх посещений'],
    highlight: 'linear-gradient(135deg, #ffbf69 0%, #ff9f1c 100%)'
  },
  {
    id: 'northern-brew',
    name: 'Northern Brew',
    company: 'Northern Brew',
    category: 'coffee',
    lat: 56.0184,
    lng: 92.8708,
    address: 'пр. Мира, 67',
    description: 'Спот для фильтра, ноутбука и коротких встреч посреди дня.',
    aiPitch: 'Если нужен понятный городской кофе и место собраться с мыслями, сюда.',
    tags: ['coffee', 'solo', 'work', 'mid-budget', 'indoor', 'balanced'],
    partner: false,
    rewards: ['Городской кофейный рейтинг'],
    highlight: 'linear-gradient(135deg, #e5989b 0%, #b5838d 100%)'
  }
]

export const quests: Quest[] = [
  {
    id: 'city-head',
    title: 'Городской голова',
    description: 'Открой 8 разных мест в городе и собери личную карту привычек.',
    type: 'unique_places',
    scope: 'app',
    target: 8,
    reward: {
      title: 'Бейдж “Городской голова”',
      kind: 'badge'
    }
  },
  {
    id: 'coffee-streak',
    title: 'Кофейный ход',
    description: 'Сделай 4 кофейных отметки и получи реальный промокод.',
    type: 'category_visits',
    scope: 'partner',
    target: 4,
    category: 'coffee',
    reward: {
      title: 'Промокод на напиток',
      kind: 'promo',
      code: 'BEAN-15'
    }
  },
  {
    id: 'sport-mode',
    title: 'Режим движения',
    description: 'Посети 2 разных спортивных места и разблокируй тренировочный бонус.',
    type: 'category_unique',
    scope: 'partner',
    target: 2,
    category: 'sport',
    reward: {
      title: '1 бесплатная тренировка',
      kind: 'gift'
    }
  },
  {
    id: 'culture-bloom',
    title: 'Культурный слой',
    description: 'Открой 2 культурные точки и получи коллекционный бейдж.',
    type: 'category_unique',
    scope: 'app',
    target: 2,
    category: 'culture',
    reward: {
      title: 'Бейдж “Культурный слой”',
      kind: 'badge'
    }
  },
  {
    id: 'bridge-repeat',
    title: 'Своё место у реки',
    description: 'Вернись в Bridge Bistro ещё раз и активируй десерт в подарок.',
    type: 'place_visits',
    scope: 'partner',
    target: 2,
    placeId: 'bridge-bistro',
    expiresAt: '2026-04-01T23:59:00+07:00',
    reward: {
      title: 'Десерт в подарок',
      kind: 'promo',
      code: 'DINNER-20'
    }
  },
  {
    id: 'favorite-route',
    title: 'Маршрут сердца',
    description: 'Отметь 3 любимых места и собери персональный набор рекомендаций.',
    type: 'favorites',
    scope: 'app',
    target: 3,
    reward: {
      title: 'Бейдж “Любимчик района”',
      kind: 'badge'
    }
  }
]

export const friends: Friend[] = [
  {
    id: 'friend-1',
    name: 'Соня',
    handle: '@sonya.route',
    shareLocation: true,
    lastSpot: 'Музейный центр',
    status: 'Собирает тихие места для воскресений',
    gradient: 'linear-gradient(135deg, #f6bd60 0%, #e76f51 100%)'
  },
  {
    id: 'friend-2',
    name: 'Марк',
    handle: '@mark.moves',
    shareLocation: false,
    lastSpot: 'Pulse Climb',
    status: 'Любит спортивные квесты и соревновательные ачивки',
    gradient: 'linear-gradient(135deg, #90be6d 0%, #577590 100%)'
  },
  {
    id: 'friend-3',
    name: 'Ира',
    handle: '@ira.open.city',
    shareLocation: true,
    lastSpot: 'Енисейская набережная',
    status: 'Ходит за красивым светом и новыми фототочками',
    gradient: 'linear-gradient(135deg, #9bf6ff 0%, #4361ee 100%)'
  }
]

export const externalNotes: Note[] = [
  {
    id: 'note-friend-1',
    placeId: 'museum-center',
    authorId: 'friend-1',
    authorName: 'Соня',
    text: 'Попала на маленькую лекцию после выставки и осталась дольше, чем планировала. Отличное место для тихого вечера.',
    createdAt: '2026-03-16T18:20:00+07:00',
    visibility: 'friends',
    source: 'friend'
  },
  {
    id: 'note-friend-2',
    placeId: 'pulse-climb',
    authorId: 'friend-2',
    authorName: 'Марк',
    text: 'Трассы бодрые, новичкам норм. Если нужен быстрый дофамин после работы, очень ок.',
    createdAt: '2026-03-16T21:05:00+07:00',
    visibility: 'public',
    source: 'friend'
  },
  {
    id: 'note-open-1',
    placeId: 'panorama-hill',
    authorId: 'open-1',
    authorName: 'Открытый профиль',
    text: 'Закат сегодня был мощный, а людей на удивление немного. Хорошая точка, чтобы показать город приезжим.',
    createdAt: '2026-03-15T20:50:00+07:00',
    visibility: 'public',
    source: 'open'
  },
  {
    id: 'note-friend-3',
    placeId: 'yenisei-embankment',
    authorId: 'friend-3',
    authorName: 'Ира',
    text: 'Идеальный маршрут на 40 минут: вода, ветер и несколько точек для фото без толпы.',
    createdAt: '2026-03-14T12:10:00+07:00',
    visibility: 'friends',
    source: 'friend'
  }
]

export function createInitialState(): StoredState {
  return {
    visits: {
      'surf-sloy': 2,
      'bridge-bistro': 1,
      'yenisei-embankment': 1,
      'museum-center': 1,
      'city-lift-gym': 2
    },
    favoriteIds: ['surf-sloy', 'panorama-hill'],
    notes: [
      {
        id: 'note-self-1',
        placeId: 'yenisei-embankment',
        authorId: 'self',
        authorName: 'Лео',
        text: 'Набережная неожиданно хорошо переключает после рабочего дня. Хочу собрать ещё пару прогулочных точек рядом.',
        createdAt: '2026-03-16T19:00:00+07:00',
        visibility: 'friends',
        source: 'self'
      }
    ],
    profile: {
      nickname: 'Лео',
      city: 'Красноярск',
      bio: 'Собираю город как коллекцию небольших открытий.',
      avatarSeed: 'LE',
      privacy: 'friends',
      shareLocation: true,
      autoCheckin: false
    },
    activeQuestId: 'city-head',
    currentLocation: defaultLocation,
    systemMessage:
      'Запущен тестовый режим: карта, награды и подбор мест работают на локальных данных.',
    locationPrompt: null
  };
}

