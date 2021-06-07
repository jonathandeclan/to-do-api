# To-do List 

## Description

To-do list Data Layer API based on NestJS with TypeORM using SQLite DB

[Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm install
```

## Database

SQLite database will be stored into filename 'db' in same path as application

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Application will run at port 3000 (TO-DO: update to be configurable via environment variable)

Local testing will be http://localhost:3000

# HTTP Endpoints

| Description | HTTP Method | URL/Path | Input | Output |
| ----------- | ----------- | -------- | ----- | ------ |
| Create a new to do | POST | /todos | JSON e.g. {"title":"test title"}  | HTTP 201 with JSON object response with generated id |
| Get list of to do | GET | /todos | None | HTTP 200 with JSON array of todos |
| Delete a to do by id | DELETE | /todos/:id | id in path param | HTTP 200 |
| Mark to do as done by id | POST | /todos/:id/done | id in path param | HTTP 200 |

## Data Model

| Field | Data Type | Description |
| ----- | --------- | ----------- |
| id    | Int       | auto-generated id from database |
| title | String    | to do item title |
| status | String   | status of to do item, possible values: "not done" and "done" |
