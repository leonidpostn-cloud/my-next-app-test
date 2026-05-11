# Открывайка MVP

Тестовый runnable MVP, собранный по идее из файла `Открывайка - приложуха.docx`.

## Что уже есть

- Карта с точками, отметками посещений, подсказками "Вы здесь?" и быстрым доступом к призам
- Квесты и награды с вычисляемым прогрессом
- "Открывайка" как мастер вопросов с подборкой из 4 мест
- Профиль с настройками приватности и автоотметками
- Лента заметок с локальным созданием новых записей
- Сохранение состояния в `localStorage`

## Запуск

```bash
npm install
npm run dev
```

Открыть: `http://127.0.0.1:5173/`

## Production build

```bash
npm run build
npm run preview
```

## Ограничения test-mode

- Данные о местах, друзьях, квестах и заметках сейчас моковые
- Реальной авторизации, бэкенда и загрузки фото пока нет
- "ИИ-подбор" сделан как эвристический мастер вопросов без внешней модели

# 1. Инициализируйте Git (если ещё не сделано)
# cd c:\Users\lyonc\Downloads\GigaStudio-50696f09-master\gigastudio-50696f09
# git init

# 2. Создайте аккаунт на GitHub и войдите
#    Перейдите: https://github.com

# 3. Создайте новый публичный репозиторий (например, "my-next-app")

# 4. Свяжите локальный проект с GitHub
git config --global user.email "leonid.postn@gmail.com"
git config --global user.name "leonidpostn-cloud"
git remote add origin https://github.com/leonidpostn-cloud/my-next-app.git

# 5. Добавьте и отправьте файлы
git add .
git commit -m "Первая версия"
git branch -M main
git push -u origin main