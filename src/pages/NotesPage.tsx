import { FormEvent, useEffect, useState } from 'react'
import { formatRelativeDate } from '../lib/time'
import { Visibility } from '../lib/types'
import { useAppState } from '../state/AppState'

type FeedFilter = 'all' | 'friends' | 'mine'

export default function NotesPage() {
  const { places, state, allNotes, addNote } = useAppState()
  const visitedPlaces = places.filter((place) => (state.visits[place.id] ?? 0) > 0)

  const [placeId, setPlaceId] = useState(visitedPlaces[0]?.id ?? '')
  const [text, setText] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('friends')
  const [imageUrl, setImageUrl] = useState('')
  const [filter, setFilter] = useState<FeedFilter>('all')

  useEffect(() => {
    if (!placeId && visitedPlaces[0]) {
      setPlaceId(visitedPlaces[0].id)
    }
  }, [placeId, visitedPlaces])

  const filteredNotes = allNotes.filter((note) => {
    if (filter === 'mine') {
      return note.authorId === 'self'
    }

    if (filter === 'friends') {
      return note.source === 'friend' || note.authorId === 'self'
    }

    return true
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!placeId || !text.trim()) {
      return
    }

    addNote({
      placeId,
      text,
      visibility,
      imageUrl
    })
    setText('')
    setImageUrl('')
  }

  return (
    <div className="page-grid">
      <section className="hero-card compact-hero">
        <div className="hero-copy">
          <div className="eyebrow">Заметки</div>
          <h2>Лента уже работает как смесь личного фотоальбома и social-feed</h2>
          <p>
            В тестовом режиме можно публиковать текстовые заметки, добавлять ссылку на фото и
            видеть записи приятелей и открытых профилей в общем потоке.
          </p>
        </div>
        <div className="mini-stat stacked">
          <span>Всего записей</span>
          <strong>{allNotes.length}</strong>
        </div>
      </section>

      <section className="composer-grid">
        <form className="note-form section-card" onSubmit={handleSubmit}>
          <div className="section-heading">
            <strong>Новая заметка</strong>
            <span className="muted">Публикуется сразу в локальную тестовую ленту.</span>
          </div>

          <label className="field">
            <span>Место</span>
            <select
              className="select-input"
              onChange={(event) => setPlaceId(event.target.value)}
              value={placeId}
            >
              {visitedPlaces.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Текст</span>
            <textarea
              className="textarea-input"
              onChange={(event) => setText(event.target.value)}
              placeholder="Что понравилось, что удивило, почему хочется вернуться..."
              rows={5}
              value={text}
            />
          </label>

          <label className="field">
            <span>Фото URL, если хочешь превью</span>
            <input
              className="text-input"
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              value={imageUrl}
            />
          </label>

          <label className="field">
            <span>Кто видит</span>
            <select
              className="select-input"
              onChange={(event) => setVisibility(event.target.value as Visibility)}
              value={visibility}
            >
              <option value="friends">Приятели</option>
              <option value="public">Все</option>
              <option value="private">Только я</option>
            </select>
          </label>

          <button className="primary-button" type="submit">
            Опубликовать заметку
          </button>
        </form>

        <aside className="section-card">
          <div className="section-heading">
            <strong>Что уже покрыто</strong>
          </div>
          <div className="pill-row compact">
            <div className="ghost-pill compact">Свои заметки</div>
            <div className="ghost-pill compact">Приятели</div>
            <div className="ghost-pill compact">Открытые аккаунты</div>
            <div className="ghost-pill compact">Приватность записи</div>
          </div>
        </aside>
      </section>

      <section className="section-card">
        <div className="feed-toolbar">
          <div className="section-heading">
            <strong>Лента</strong>
            <span className="muted">Сейчас это быстрый поток с простыми фильтрами.</span>
          </div>

          <div className="segmented">
            <button
              className={filter === 'all' ? 'segment active' : 'segment'}
              onClick={() => setFilter('all')}
              type="button"
            >
              Все
            </button>
            <button
              className={filter === 'friends' ? 'segment active' : 'segment'}
              onClick={() => setFilter('friends')}
              type="button"
            >
              Приятели
            </button>
            <button
              className={filter === 'mine' ? 'segment active' : 'segment'}
              onClick={() => setFilter('mine')}
              type="button"
            >
              Мои
            </button>
          </div>
        </div>

        <div className="notes-grid">
          {filteredNotes.map((note) => {
            const place = places.find((item) => item.id === note.placeId)
            const backgroundStyle = note.imageUrl
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(17,24,39,0.15), rgba(17,24,39,0.7)), url(${note.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }
              : { background: place?.highlight }

            return (
              <article className="note-card" key={note.id}>
                <div className="note-media" style={backgroundStyle} />
                <div className="place-badge">
                  <span className="scope-pill app">{place?.name ?? 'Неизвестное место'}</span>
                  <span>{formatRelativeDate(note.createdAt)}</span>
                </div>
                <h3>{note.authorName}</h3>
                <p>{note.text}</p>
                <div className="note-footer">
                  <span>{note.visibility}</span>
                  <span>{note.source === 'self' ? 'моя заметка' : note.source}</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
