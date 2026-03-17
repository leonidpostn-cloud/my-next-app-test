import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  discoverQuestions,
  inferTagsFromFreeform,
  recommendPlaces,
  type DiscoverAnswer,
  type DiscoverOption
} from '../lib/discover'
import { useAppState } from '../state/AppState'

export default function DiscoverPage() {
  const { places } = useAppState()
  const [answers, setAnswers] = useState<DiscoverAnswer[]>([])
  const [freeform, setFreeform] = useState('')
  const [error, setError] = useState('')

  const step = answers.length
  const currentQuestion = discoverQuestions[step]

  const recommendations = recommendPlaces(places, answers)

  function advanceWithOption(option: DiscoverOption) {
    if (!currentQuestion) {
      return
    }

    setError('')
    setAnswers((current) => [
      ...current,
      {
        questionId: currentQuestion.id,
        label: option.label,
        tags: option.tags
      }
    ])
    setFreeform('')
  }

  function submitFreeform(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!currentQuestion) {
      return
    }

    const value = freeform.trim()
    if (!value) {
      setError('Нужен хотя бы короткий ответ, чтобы продолжить.')
      return
    }

    const tags = inferTagsFromFreeform(value)
    setError('')
    setAnswers((current) => [
      ...current,
      {
        questionId: currentQuestion.id,
        label: value,
        freeform: value,
        tags: tags.length > 0 ? tags : ['special']
      }
    ])
    setFreeform('')
  }

  function resetQuiz() {
    setAnswers([])
    setFreeform('')
    setError('')
  }

  return (
    <div className="page-grid">
      <section className="hero-card compact-hero">
        <div className="hero-copy">
          <div className="eyebrow">Открывайка</div>
          <h2>Тестовый ИИ-помощник уже может довести пользователя до 4 рекомендаций</h2>
          <p>
            Здесь вместо настоящего LLM пока работает умная эвристика на тегах и вопросах,
            но сам сценарий “спросил → уточнил → показал подборку” уже можно тестировать.
          </p>
        </div>
        <div className="quiz-progress">
          <span>Шаг {Math.min(step + 1, discoverQuestions.length)} из {discoverQuestions.length}</span>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${(answers.length / discoverQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      <section className="quiz-shell">
        {currentQuestion ? (
          <div className="quiz-question-card">
            <div className="section-heading">
              <strong>{currentQuestion.title}</strong>
              <span className="muted">{currentQuestion.hint}</span>
            </div>

            <div className="option-grid">
              {currentQuestion.options.map((option) => (
                <button
                  className="option-card"
                  key={option.label}
                  onClick={() => advanceWithOption(option)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>

            <form className="freeform-row" onSubmit={submitFreeform}>
              <input
                className="text-input"
                onChange={(event) => setFreeform(event.target.value)}
                placeholder="Или ответь свободно: например “хочу тихое место с видом”"
                value={freeform}
              />
              <button className="primary-button" type="submit">
                Понять ответ
              </button>
            </form>

            {error ? <p className="error-copy">{error}</p> : null}

            <div className="answer-summary">
              {answers.map((answer) => (
                <span className="summary-chip" key={answer.questionId}>
                  {answer.label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="quiz-results section-card">
            <div className="section-heading">
              <strong>Готовая подборка</strong>
              <span className="muted">Финальные 4 места, которые лучше всего совпали с ответами.</span>
            </div>

            <div className="answer-summary">
              {answers.map((answer) => (
                <span className="summary-chip" key={answer.questionId}>
                  {answer.label}
                </span>
              ))}
            </div>

            <div className="recommend-grid">
              {recommendations.map((item, index) => (
                <article className="recommend-card" key={item.place.id}>
                  <div
                    className="place-gradient"
                    style={{ background: item.place.highlight }}
                  />
                  <div className="recommend-rank">#{index + 1}</div>
                  <h3>{item.place.name}</h3>
                  <p>{item.reason}</p>
                  <div className="chip-row">
                    {item.place.tags.slice(0, 4).map((tag) => (
                      <span className="info-chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="detail-actions">
                    <Link className="primary-button" to={`/?focus=${item.place.id}`}>
                      На карте
                    </Link>
                    <Link className="secondary-button small" to="/notes">
                      Смотреть заметки
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="action-row">
              <button className="secondary-button" onClick={resetQuiz} type="button">
                Пройти ещё раз
              </button>
              <Link className="secondary-button" to="/rewards">
                Проверить бонусы
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
