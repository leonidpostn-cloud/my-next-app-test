import { useAppState } from '../state/AppState'

export default function ProfilePage() {
  const { state, appStats, friends, activeQuest, updateProfile, resetDemo } = useAppState()
  const initials = (state.profile.avatarSeed || state.profile.nickname || 'LE')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="page-grid">
      <section className="hero-card compact-hero">
        <div className="hero-copy">
          <div className="eyebrow">Профиль и настройки</div>
          <h2>Профиль уже покрывает приватность, автозачёт и блок приятелей</h2>
          <p>
            Этот экран можно использовать как рабочую основу под реальный аккаунт пользователя,
            пока без авторизации и бэкенда.
          </p>
        </div>
      </section>

      <section className="profile-grid">
        <div className="profile-card section-card">
          <div className="detail-header">
            <div className="avatar-badge">{initials}</div>
            <div>
              <h3>{state.profile.nickname}</h3>
              <p>{state.profile.bio}</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <strong>{appStats.uniqueVisited}</strong>
              <span>мест открыто</span>
            </div>
            <div className="stat-card">
              <strong>{appStats.totalVisits}</strong>
              <span>всего визитов</span>
            </div>
            <div className="stat-card">
              <strong>{appStats.favorites}</strong>
              <span>любимых точек</span>
            </div>
            <div className="stat-card">
              <strong>{appStats.notes}</strong>
              <span>заметок</span>
            </div>
          </div>

          <div className="section-heading">
            <strong>Главная цель сейчас</strong>
          </div>
          <div className="ghost-pill compact">
            {activeQuest.quest.title}: {activeQuest.current}/{activeQuest.quest.target}
          </div>
        </div>

        <form className="profile-card section-card">
          <div className="section-heading">
            <strong>Редактирование профиля</strong>
          </div>

          <div className="form-grid">
            <label className="field">
              <span>Никнейм</span>
              <input
                className="text-input"
                onChange={(event) => updateProfile({ nickname: event.target.value })}
                value={state.profile.nickname}
              />
            </label>

            <label className="field">
              <span>Город</span>
              <input
                className="text-input"
                onChange={(event) => updateProfile({ city: event.target.value })}
                value={state.profile.city}
              />
            </label>

            <label className="field">
              <span>Инициалы / seed для аватара</span>
              <input
                className="text-input"
                maxLength={2}
                onChange={(event) => updateProfile({ avatarSeed: event.target.value })}
                value={state.profile.avatarSeed}
              />
            </label>

            <label className="field full-span">
              <span>О себе</span>
              <textarea
                className="textarea-input"
                onChange={(event) => updateProfile({ bio: event.target.value })}
                rows={4}
                value={state.profile.bio}
              />
            </label>

            <label className="field">
              <span>Кто видит профиль</span>
              <select
                className="select-input"
                onChange={(event) =>
                  updateProfile({
                    privacy: event.target.value as typeof state.profile.privacy
                  })
                }
                value={state.profile.privacy}
              >
                <option value="public">Все</option>
                <option value="friends">Только приятели</option>
                <option value="private">Только я</option>
              </select>
            </label>
          </div>

          <label className="toggle-row">
            <input
              checked={state.profile.shareLocation}
              onChange={(event) =>
                updateProfile({ shareLocation: event.target.checked })
              }
              type="checkbox"
            />
            <span>Делиться местоположением с приятелями</span>
          </label>

          <label className="toggle-row">
            <input
              checked={state.profile.autoCheckin}
              onChange={(event) =>
                updateProfile({ autoCheckin: event.target.checked })
              }
              type="checkbox"
            />
            <span>Включить автоотметки после 3 подтверждённых посещений</span>
          </label>
        </form>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <strong>Приятели</strong>
          <span className="muted">Блок для друзей и обмена локацией уже можно развивать дальше.</span>
        </div>

        <div className="friend-grid">
          {friends.map((friend) => (
            <article className="friend-card" key={friend.id}>
              <div className="avatar-badge small" style={{ background: friend.gradient }}>
                {friend.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3>{friend.name}</h3>
                <p>{friend.handle}</p>
                <p className="muted">{friend.status}</p>
              </div>
              <div className="mini-stat stacked">
                <span>{friend.shareLocation ? 'Локация видна' : 'Локация скрыта'}</span>
                <strong>{friend.lastSpot}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="danger-zone section-card">
        <div className="section-heading">
          <strong>Сброс тестового сценария</strong>
          <span className="muted">
            Возвращает мок-профиль, визиты, заметки и квесты к начальному состоянию.
          </span>
        </div>
        <button className="secondary-button" onClick={resetDemo} type="button">
          Сбросить demo-данные
        </button>
      </section>
    </div>
  )
}
