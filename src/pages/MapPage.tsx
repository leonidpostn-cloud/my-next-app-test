import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link, useSearchParams } from 'react-router-dom'
import { formatDistance } from '../lib/geo'
import { Coordinates, Place } from '../lib/types'
import { useAppState } from '../state/AppState'

function progressPercent(current: number, target: number) {
  return Math.min(100, Math.round((current / target) * 100))
}

function MapFocus({ target }: { target: Coordinates }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([target.lat, target.lng], 14, { duration: 0.9 })
  }, [map, target.lat, target.lng])

  return null
}

function markerColor(place: Place, selectedPlaceId: string | null, visitCount: number) {
  if (selectedPlaceId === place.id) {
    return '#e76f51'
  }

  if (visitCount > 0) {
    return '#2a9d8f'
  }

  if (place.partner) {
    return '#f4a261'
  }

  return '#457b9d'
}

export default function MapPage() {
  const [searchParams] = useSearchParams()
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [dismissedPrompts, setDismissedPrompts] = useState<string[]>([])
  const {
    places,
    state,
    nearbyPlaces,
    activeQuest,
    physicalRewards,
    checkIn,
    toggleFavorite,
    setCurrentLocation,
    moveToTestSpot,
    dismissSystemMessage
  } = useAppState()

  useEffect(() => {
    const focusedPlaceId = searchParams.get('focus')
    if (focusedPlaceId && places.some((place) => place.id === focusedPlaceId)) {
      setSelectedPlaceId(focusedPlaceId)
    }
  }, [places, searchParams])

  useEffect(() => {
    if (!selectedPlaceId && nearbyPlaces[0]) {
      setSelectedPlaceId(nearbyPlaces[0].place.id)
    }
  }, [nearbyPlaces, selectedPlaceId])

  const selectedPlace =
    places.find((place) => place.id === selectedPlaceId) ?? nearbyPlaces[0]?.place ?? null

  const focusedLocation = selectedPlace
    ? { lat: selectedPlace.lat, lng: selectedPlace.lng }
    : state.currentLocation

  const nearbyPrompts = nearbyPlaces
    .filter(
      (item) =>
        item.distance < 1400 &&
        !dismissedPrompts.includes(item.place.id) &&
        (state.visits[item.place.id] ?? 0) === 0
    )
    .slice(0, 3)

  const selectedDistance =
    nearbyPlaces.find((item) => item.place.id === selectedPlace?.id)?.distance ?? null

  const questPercent = progressPercent(activeQuest.current, activeQuest.quest.target)

  function handleLocateMe() {
    if (!navigator.geolocation) {
      moveToTestSpot()
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentLocation(
          {
            lat: coords.latitude,
            lng: coords.longitude
          },
          'gps'
        )
      },
      () => moveToTestSpot(),
      {
        enableHighAccuracy: true,
        timeout: 7000
      }
    )
  }

  return (
    <div className="page-grid">
      {/* Полноразмерная карта */}
      <section className="map-layout-full">
        <div className="leaflet-shell">
          <MapContainer
            center={[state.currentLocation.lat, state.currentLocation.lng]}
            zoom={14}
            scrollWheelZoom
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapFocus target={focusedLocation} />

            <CircleMarker
              center={[state.currentLocation.lat, state.currentLocation.lng]}
              pathOptions={{ color: '#2a9d8f', fillColor: '#2a9d8f', fillOpacity: 0.9 }}
              radius={11}
            >
              <Popup>Вы здесь</Popup>
            </CircleMarker>

            {places.map((place) => {
              const visitCount = state.visits[place.id] ?? 0
              return (
                <CircleMarker
                  key={place.id}
                  center={[place.lat, place.lng]}
                  pathOptions={{
                    color: markerColor(place, selectedPlaceId, visitCount),
                    fillColor: markerColor(place, selectedPlaceId, visitCount),
                    fillOpacity: 0.88
                  }}
                  radius={selectedPlaceId === place.id ? 10 : 8}
                  eventHandlers={{
                    click: () => setSelectedPlaceId(place.id)
                  }}
                >
                  <Popup>
                    <strong>{place.name}</strong>
                    <br />
                    {visitCount > 0 ? `Посещений: ${visitCount}` : 'Ещё не открыто'}
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>

        {/* Подсказка о местоположении */}
        {state.locationPrompt && (
          <div className="location-prompt">
            <h3>{places.find(p => p.id === state.locationPrompt?.placeId)?.name} Вы здесь?</h3>
            <div className="prompt-actions">
              <button
                className="primary-button"
                onClick={() => checkIn(state.locationPrompt!.placeId)}
                type="button"
              >
                Да
              </button>
              <button
                className="secondary-button"
                onClick={() => {
                  // При нажатии "Нет" подсказка закрывается
                  // Новая подсказка появится через LOCATION_PROMPT_INTERVAL
                }}
                type="button"
              >
                Нет
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="hero-card">
        <div className="hero-copy">
          <div className="eyebrow">Главная карта</div>
          <h2>Отмечай места, открывай награды и собирай личный маршрут города</h2>
          <p>
            Верхняя панель уже работает как быстрый доступ к реальным бонусам и к главной
            цели, которую видно прямо на карте.
          </p>
        </div>

        <div className="hero-progress">
          <div className="section-heading">
            <span>Текущая цель</span>
            <strong>{activeQuest.quest.title}</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${questPercent}%` }} />
          </div>
          <div className="mini-stat">
            <span>
              {activeQuest.current} / {activeQuest.quest.target}
            </span>
            <span>{activeQuest.remaining > 0 ? `ещё ${activeQuest.remaining}` : 'готово'}</span>
          </div>
          <p className="muted">{activeQuest.quest.description}</p>
        </div>

        <div className="pill-row">
          {physicalRewards.length > 0 ? (
            physicalRewards.map((reward) => (
              <div className="reward-pill" key={reward.id}>
                <span>{reward.title}</span>
                {reward.code ? <strong>{reward.code}</strong> : <strong>активен</strong>}
              </div>
            ))
          ) : (
            <div className="ghost-pill">
              <span>Пока нет выданных промокодов</span>
              <Link to="/rewards" className="inline-link">
                посмотреть квесты
              </Link>
            </div>
          )}
        </div>
      </section>

      {state.systemMessage ? (
        <div className="banner">
          <span>{state.systemMessage}</span>
          <button className="banner-close" onClick={dismissSystemMessage} type="button">
            скрыть
          </button>
        </div>
      ) : null}

      <section className="section-card">
        <div className="section-heading">
          <strong>Подсказки рядом</strong>
          <span className="muted">Сценарий “Вы здесь?” в тестовом режиме</span>
        </div>

        <div className="action-row">
          <button className="action-button" onClick={handleLocateMe} type="button">
            Определить мою позицию
          </button>
          <button className="secondary-button" onClick={moveToTestSpot} type="button">
            Сдвинуть тестовую точку
          </button>
          <Link to="/discover" className="secondary-button">
            Подобрать новое место
          </Link>
        </div>

        <div className="prompt-grid">
          {nearbyPrompts.length > 0 ? (
            nearbyPrompts.map(({ place, distance }) => (
              <article className="prompt-card" key={place.id}>
                <div className="place-badge">
                  <span className={place.partner ? 'badge-partner' : 'badge-visited'}>
                    {place.partner ? 'Партнёр' : 'Городская точка'}
                  </span>
                  <span>{formatDistance(distance)}</span>
                </div>
                <h3>{place.name}</h3>
                <p>{place.description}</p>
                <div className="detail-actions">
                  <button
                    className="primary-button"
                    onClick={() => {
                      checkIn(place.id)
                      setSelectedPlaceId(place.id)
                    }}
                    type="button"
                  >
                    Да, я тут
                  </button>
                  <button
                    className="secondary-button small"
                    onClick={() =>
                      setDismissedPrompts((current) => [...current, place.id])
                    }
                    type="button"
                  >
                    Не сейчас
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <p>
                Поблизости нет новых непосещённых точек. Можно сдвинуть тестовую позицию или
                открыть подборку в “Открывайке”.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
