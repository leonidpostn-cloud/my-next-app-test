import { Link } from 'react-router-dom'
import { useAppState } from '../state/AppState'

function progressPercent(current: number, target: number) {
  return Math.min(100, Math.round((current / target) * 100))
}

export default function RewardsPage() {
  const { questProgress, activeQuest, setActiveQuest, unlockedRewards, physicalRewards, appStats } =
    useAppState()

  const sortedQuests = [...questProgress].sort((left, right) => {
    if (left.completed !== right.completed) {
      return Number(left.completed) - Number(right.completed)
    }

    if (left.nearPartner !== right.nearPartner) {
      return Number(right.nearPartner) - Number(left.nearPartner)
    }

    return left.remaining - right.remaining
  })

  return (
    <div className="page-grid">
      <section className="hero-card compact-hero">
        <div className="hero-copy">
          <div className="eyebrow">Призы и квесты</div>
          <h2>Вся механика достижений уже собрана в одном месте</h2>
          <p>
            Здесь видно, к чему пользователь идёт, какие партнёрские акции рядом и какие
            реальные бонусы уже доступны.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <strong>{questProgress.filter((quest) => quest.completed).length}</strong>
            <span>завершено</span>
          </div>
          <div className="stat-card">
            <strong>{questProgress.filter((quest) => !quest.completed).length}</strong>
            <span>в прогрессе</span>
          </div>
          <div className="stat-card">
            <strong>{questProgress.filter((quest) => quest.nearPartner).length}</strong>
            <span>рядом с тобой</span>
          </div>
          <div className="stat-card">
            <strong>{appStats.unlockedRewards}</strong>
            <span>разблокировано</span>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <strong>Быстрый доступ к выданным бонусам</strong>
          <span className="muted">Именно эту часть удобно выносить наверх карты.</span>
        </div>

        <div className="reward-card-grid">
          {physicalRewards.length > 0 ? (
            physicalRewards.map((reward) => (
              <article className="reward-card" key={reward.id}>
                <span className="scope-pill partner">{reward.kind === 'promo' ? 'Промокод' : 'Подарок'}</span>
                <h3>{reward.title}</h3>
                {reward.code ? <div className="code-chip">{reward.code}</div> : <p>Можно показать партнёру на кассе.</p>}
              </article>
            ))
          ) : (
            <div className="empty-state">
              <p>Физические призы ещё не открыты. Самый быстрый путь сейчас через кофейный и гастро-квесты.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <strong>Активные квесты</strong>
          <span className="muted">
            Партнёрские задачи подсвечены, если они уже доступны рядом с текущей точкой.
          </span>
        </div>

        <div className="quest-list">
          {sortedQuests.map((item) => {
            const percent = progressPercent(item.current, item.quest.target)
            const isActive = activeQuest.quest.id === item.quest.id

            return (
              <article className={isActive ? 'quest-card active' : 'quest-card'} key={item.quest.id}>
                <div className="quest-topline">
                  <div>
                    <div className="place-badge">
                      <span className={item.quest.scope === 'partner' ? 'scope-pill partner' : 'scope-pill app'}>
                        {item.quest.scope === 'partner' ? 'Партнёр' : 'Приложение'}
                      </span>
                      {item.nearPartner ? <span className="scope-pill near">рядом</span> : null}
                      {item.completed ? <span className="scope-pill done">готово</span> : null}
                    </div>
                    <h3>{item.quest.title}</h3>
                    <p>{item.quest.description}</p>
                  </div>

                  <div className="mini-stat stacked">
                    <span>Прогресс</span>
                    <strong>
                      {item.current}/{item.quest.target}
                    </strong>
                  </div>
                </div>

                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${percent}%` }} />
                </div>

                <div className="quest-meta">
                  <span>
                    {item.completed ? 'Награда доступна' : `Осталось ${item.remaining}`}
                  </span>
                  <span>{item.quest.reward.title}</span>
                  {item.quest.expiresAt ? (
                    <span>
                      до{' '}
                      {new Date(item.quest.expiresAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  ) : null}
                </div>

                <div className="quest-footer">
                  <button
                    className={isActive ? 'secondary-button small' : 'primary-button'}
                    onClick={() => setActiveQuest(item.quest.id)}
                    type="button"
                  >
                    {isActive ? 'Цель на карте активна' : 'Показывать на карте'}
                  </button>

                  {item.quest.placeId ? (
                    <Link className="secondary-button small" to={`/?focus=${item.quest.placeId}`}>
                      Открыть точку
                    </Link>
                  ) : (
                    <Link className="secondary-button small" to="/discover">
                      Найти место
                    </Link>
                  )}
                </div>

                {item.completed && item.quest.reward.code ? (
                  <div className="code-chip">{item.quest.reward.code}</div>
                ) : null}
              </article>
            )
          })}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <strong>Что уже разблокировано</strong>
          <span className="muted">Даже бейджи лучше показывать отдельно, чтобы прогресс был осязаемым.</span>
        </div>

        <div className="pill-row compact">
          {unlockedRewards.length > 0 ? (
            unlockedRewards.map((reward) => (
              <div className="reward-pill compact" key={reward.id}>
                <span>{reward.title}</span>
                <strong>{reward.kind}</strong>
              </div>
            ))
          ) : (
            <div className="ghost-pill compact">Пока только путь к наградам, без завершённых ачивок.</div>
          )}
        </div>
      </section>
    </div>
  )
}
