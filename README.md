### Описание проекта:

> Проект представляет собой бэкенд приложение, разработанное на Node.js с использованием Express.js, PostgreSQL и Sequelize. Он предоставляет API для работы с комментариями пользователей, сохраняя их в базе данных. Функциональность включает в себя добавление и просмотр комментариев, а также поддерживает каскадный вывод комментариев для удобной навигации пользователей по обсуждениям. Проект обеспечивает валидацию ввода, а также предоставляет возможность прикрепления файлов к комментариям с автоматическим ограничением по размеру и формату файлов.

### start project

Файл `example.env` необходимо переименовать в `.env` и отредактировать значения ключей. 
Если проект запускается через Docker, обязательно укажите значение `POSTGRES_HOST` как `postgres`. 
Затем можно запустить проект одним из двух способов: через Docker или локально на вашем компьютере.

#### Через Docker:

+ Запустите скрипт `start.sh`. Он предварительно выполнит команду `sudo service postgresql stop`, а по завершению выполнит команду `sudo service postgresql start`. 
+ Или остановите все базы данных, которые могут конфликтовать с Docker, и запустите контейнер с помощью команды `docker-compose --file docker-compose.yaml up`.

#### На локальной машине:

+ Необходимо иметь `PostgreSQL` и убедиться, что настройки в файле `.env` введены верно.
+ Версия `node.js 16`, необходимы зависимости от `canvas`.
+ Глобально установите `sequelize-cli` командой, например, `npm install -g sequelize-cli`.
+ Из директории проекта выполните команду `npm install` или `yarn install`.
+ Затем, также из директории проекта, выполните команду миграции `npx sequelize-cli db:migrate`.
+ Для запуска проекта выполните команду `npm run start` или `yarn start` соответственно.

### Доступные endpoints

> Для всех endpoints необходимо добавить домен, например `http://localhost:4000`.  

#### Регистрация

+ `POST` `/api/auth/registration`
+ Сервер ожидает следующее тело запроса:
```json
{
  "userName": "Имя",
  "email": "name@example.com",
  "homePage": "https://example.com/example",
  "password": "PASSword8"
}
```
> `userName:` только буквы, минимум 2, максимум 64.  
> `email:` только буквы и цифры, формат адреса электронной почты, минимум 5, максимум 128, должен быть уникальным.  
> `homePage:` не обязательно, только буквы и символы, формат адреса электронной страницы, минимум 10, максимум 256.  
> `password:` только буквы латиницы и цифры. Строка должна содержать хотя бы одну строчную букву `[a-z]`, хотя бы одну заглавную букву `[A-Z]` и хотя бы одну цифру.  
+ Пример ответа:
```json
{
  "message": "success"
}
```

#### Логин и получение пары токенов

+ `POST` `/api/auth/login`
+ Сервер ожидает следующее тело запроса:
```json
{
  "email": "name@example.com",
  "password": "PASSword8"
}
```
> Требования к полям такие же, как в примере выше.  
+ Пример ответа:
```json
{
  "tokensPair": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6kpXVCJ9..."
  }
}
```

#### Обновление токена и получение новой пары токенов

+ `POST` `/api/auth/refresh`
+ Сервер ожидает следующее тело запроса:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6kpXVCJ9..."
}
```
> `refreshToken:` токен, который был получен при логине или обновлении, и который не просрочен.  
+ Пример ответа:
```json
{
  "tokensPair": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6kpXVCJ9..."
  }
}
```

#### Получение капчи

+ `GET` `/api/captcha`
+ Пример ответа: изображение капчи в формате `image/png` для текущей сессии.

#### Добавление комментария

+ `POST` `/api/comments/comment`
+ В заголовке запроса обязательно укажите `Authorization` с токеном в формате `bearer accessToken`. Данные пользователя будут взяты из токена.
+ Сервер ожидает следующее тело запроса:
```json
{
  "content": "Текст самого сообщения!",
  "parentCommentId": 32,
  "captcha": "AgRT5f"
}
```
> `content:` обязательное поле, содержит текст комментария. Не допускаются пробелы и доступны следующие теги: `<a href="" title=""></a>`, `<code></code>`, `<i></i>`, `<strong></strong>`. Остальные теги вызовут ошибку.  
> `parentCommentId:` ID комментария-родителя, необязательное поле. Необходимо только в случае, если комментарий должен быть вложен в другой комментарий.  
> `captcha:` текст капчи из запроса `/api/captcha`.  
> `file:` изображение или файл в формате `TXT`. Доступные форматы изображений: `JPG`, `GIF`, `PNG`. Размер не должен превышать `320x240` пикселей. Изображение будет сконвертировано в формат `WEBP` с указанными размерами.  
+ Пример ответа:
```json
{
  "createdAt": "2024-02-15T13:17:26.231Z",
  "commentId": 51,
  "parentCommentId": 32,
  "content": "Текст самого сообщения!",
  "fileName": null,
  "user": {
    "userName": "Имя",
    "email": "name@example.com",
    "homePage": "https://example.com/example"
  }
}
```
> `fileName:` Если ранее был отправлен файл, то будет возвращено новое имя файла, которое хранится на сервере.  

#### Получение комментариев

+ `GET` `/api/comments/getComments`
+ Сервер ожидает следующие параметры:
> `limit:` необязательное поле. Лимит вывода комментариев по умолчанию `25`.  
> `page:` необязательное поле. Страница, которую необходимо отобразить, по умолчанию `1`, исходя из значения `limit`.  
> `sort:` необязательное поле. Колонка сортировки: `email`, `userName` или `createdAt`. По умолчанию `createdAt`.  
> `sortDirect:` необязательное поле. Направление сортировки: `ASC` или `DESC`. По умолчанию `DESC`.  
+ Пример ответа:
```json
{
  "totalPages": 7,
  "comments": [
    {
      "commentId": 50,
      "parentCommentId": null,
      "content": "Текст самого сообщения!",
      "fileName": "9a5d7f01-1b11-432f-a966-5254ed7beb9c.webp",
      "createdAt": "2024-02-11T13:43:51.776Z",
      "user": {
        "userName": "Имя",
        "email": "example@example.com",
        "homePage": "https://example.com/Name"
      },
      "replies": [
        {
          "commentId": 51,
          "parentCommentId": 50,
          "content": "Текст самого сообщения!",
          "fileName": null,
          "createdAt": "2024-02-11T13:45:38.858Z",
          "user": {
            "userName": "Имя",
            "email": "example@example.com",
            "homePage": "https://example.com/Name"
          },
          "replies": [
            {
              "commentId": 55,
              "parentCommentId": 51,
              "content": "Текст самого сообщения!",
              "fileName": null,
              "createdAt": "2024-02-11T13:46:31.466Z",
              "user": {
                "userName": "Имя",
                "email": "example@example.com",
                "homePage": "https://example.com/Name"
              },
              "replies": []
            }
          ]
        }
      ]
    }
  ]
}
```
> `totalPages:` Общее количество страниц, учитывая `limit`, указанный в параметрах запроса.  
> `comments:` Массив комментариев.  
> `replies:` Массив ответов на комментарии внутри каждого комментария. Уровень вложенности неограничен, сортировка `LIFO`.  

#### Вебсокет

+ Для реализации вебсокетов используем библиотеку `Socket.IO`.
+ Подключаемся к серверу по адресу `ws or wss` `://HOST_NAME` `/notifications`.
+ Ожидаем получение события `comment` от сервера.
+ При получении события получаем новые комментарии от сервера в формате JSON:
```json
{
  "createdAt": "2024-02-15T13:17:26.231Z",
  "commentId": 51,
  "parentCommentId": 32,
  "content": "Текст самого сообщения!",
  "fileName": null,
  "user": {
    "userName": "name",
    "email": "name@example.com",
    "homePage": "https://example.com/example"
  }
}
```

#### Загруженные файлы

+ Ранее загруженные файлы доступны по адресу `/public/` плюс `fileName`.
+ Например, если ваш локальный сервер запущен на `http://localhost:4000`, то адрес для доступа к файлу будет следующим: `http://localhost:4000/public/0c970859-78b3-418b-9b0e-8e5a29d46e13.webp`.