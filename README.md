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

## API and HTTP Endpoints

| Description | HTTP Method | URL/Path | Input | Output |
| ----------- | ----------- | -------- | ----- | ------ |
| Create a new to do | POST | /todos | JSON e.g. {"title":"test title"}  | HTTP 201 with JSON object response with generated id |
| Get list of to do (limit of max 100 records per page)| GET | /todos | query parameters 1) limit - number of records to return 2) page - page number, optional filters; 3) status = "not done" , "done" , "in progress" , "in review", "blocked"; 4) priority = 0, 1 or 2  | HTTP 200 with JSON object, items array of todos and meta data of request/data |
| Delete a to do by id | DELETE | /todos/:id | id in path param | HTTP 200 |
| Mark to do as done by id | POST | /todos/:id/done | id in path param | HTTP 201 with JSON object with raw and generatedMap props |
| Set priority of a to do item by id | POST | /todos/:id/setpriority | id in path param , JSON body with priority property (0 - high, 1 - normal, 2 - low) | HTTP 201 with JSON object with raw and generatedMap props |
| Set due date of a to do item by id | POST | /todos/:id/setduedate | id in path param , JSON body with date property (ISO8601) | HTTP 201 with JSON object with raw and generatedMap props |
| Set status of a to do item by id | POST | /todos/:id/setstaus | id in path param , JSON body with status property, enum "not done", "done", "in review" , "in progress" and "blocked" | HTTP 201 with JSON object with raw and generatedMap props |

## Data Model

| Field | Data Type | Description |
| ----- | --------- | ----------- |
| id    | Int       | auto-generated id from database |
| title | String    | to do item title |
| status | String   | status of to do item, possible values: "not done"(default), "in progress", "in review" , "blocked" and "done" |
| priority | Int    | priority of to do item, 0 = high, 1 = normal/default , 2 = low|
| dueDate | Date    | due date of to do item , optional , format used in API is in ISO8601 string|

## POSTMAN Collection

POSTMAN Collection file is in /postman for simple client testing.

## Considerations / Notes

- Using simple sqlite database for simplicity, typeorm will support postgres, mysql, mongodb
- Default status is "not done"
- Int was chosen as data type for priority so that records can be sorted by priority easily
- Three priority levels were chosen for simplicity low, normal and high.
- Default due date is not set/null
- Todo item list is returned with order by due date (asc/ soonest first )and then by priority (asc / highest first)