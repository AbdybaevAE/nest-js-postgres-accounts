Stack: 
* NestJS
* TypeORM
* PostgreSQL



Для того, чтобы запустить проект локально нужно сделать следующие действия:
* Установить зависимости(npm install)
```sh
npm install
```
* Создать .env файл в корне проекта с содержимым о порте сервера и подключения к базе(название переменных окружений в файле .env.sample)
```sh
touch .env

cat .env.sample
NODE_ENV = "development"
PORT = "3000"
POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = ""
POSTGRES_DB = "overgear"
POSTGRES_HOST = "localhost"
POSTGRES_PORT = "5432"
```
* Запустить скрипт
```sh
# Запуск в режиме отладки
npm run start:dev
```

## Для запуска миграций можно использовать скрипт: 
```sh
npm run migration:create -- --config src/ormconfig.ts -n SomeNewMigration
# и аналогичные скрипты generate, run, revert
# 
```
## Миграции применяются как посредством cli так и при запуске сервера


## Также есть Dockerfile и docker-compose.yml.

***ВАЖНО!!!***
## Для модели user есть отдельный endpoint (для создания и просмотра списка), то есть это значит, что нельзя управлять счетом пользователя без предварительного создания последнего. 
```sh
# Список пользователей
curl --location --request GET 'http://localhost:3000/users' \
--header 'Content-Type: application/json' 

# Добавление пользователя
curl --location --request POST 'http://localhost:3000/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "test@gmail.com"
}'
```


