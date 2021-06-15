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

### Todo API

All Todo APIs require HTTP header, "x-user-id" with the user id value, this is the user that calling the API, assumption is API gateway has authenticated the user already and is passing the user id via this header.

| Description | HTTP Method | URL/Path | Input | Output |
| ----------- | ----------- | -------- | ----- | ------ |
| Create a new to do | POST | /todos | JSON e.g. {"title":"test title"}  | HTTP 201 with JSON object response with generated id |
| Get list of to do (limit of max 100 records per page)| GET | /todos | query parameters 1) limit - number of records to return 2) page - page number, optional filters; 3) status = "not done" , "done" , "in progress" , "in review", "blocked"; 4) priority = 0, 1 or 2  | HTTP 200 with JSON object, items array of todos and meta data of request/data |
| Delete a to do by id | DELETE | /todos/:id | id in path param | HTTP 200 |
| Mark to do as done by id | POST | /todos/:id/done | id in path param | HTTP 201 with JSON object with raw and generatedMap props |
| Set priority of a to do item by id | POST | /todos/:id/setpriority | id in path param , JSON body with priority property (0 - high, 1 - normal, 2 - low) | HTTP 201 with JSON object with raw and generatedMap props |
| Set due date of a to do item by id | POST | /todos/:id/setduedate | id in path param , JSON body with date property (ISO8601) | HTTP 201 with JSON object with raw and generatedMap props |
| Set status of a to do item by id | POST | /todos/:id/setstaus | id in path param , JSON body with status property, enum "not done", "done", "in review" , "in progress" and "blocked" | HTTP 201 with JSON object with raw and generatedMap props |
| Get a todo item by id | GET   | /todos/:id | id in path param | HTTP 200 with JSON object |
### User API 

Only create user , listing for users and adding friends for a user is implemented.

| Description | HTTP Method | URL/Path | Input | Output |
| ----------- | ----------- | -------- | ----- | ------ |
| Create a user | POST |      /users   | JSON e.g. {"title":"test title"} | HTTP 201 with JSON object with raw and generatedMap props |
| Get a user by id | GET    | /users/:id |id in path parame | HTTP 200 with JSON object |
| Get users | GET           | /users   | none | HTTP 200 with JSON array of users |
| Add friend to a user | POST | /users/:id/addfriend/:friendId | id - user id and friend id - in path param | HTTP 201 with JSON object with raw and generatedMap props |

## Data Model


### Todo Model
| Field | Data Type | Description |
| ----- | --------- | ----------- |
| id    | String       | auto-generated uuid |
| title | String    | to do item title |
| status | String   | status of to do item, possible values: "not done"(default), "in progress", "in review" , "blocked" and "done" |
| priority | Int    | priority of to do item, 0 = high, 1 = normal/default , 2 = low|
| dueDate | Date    | due date of to do item , optional , format used in API is in ISO8601 string|
| private | Boolean | whether todo item is private |
| owner | User | Foreign key join owner of todo |

### User Model
| Field | Data Type | Description |
| ----- | --------- | ----------- |
| id    | String    | auto-generated uuid |
| name  | String    | name of user |
| email | String    | e-mail of user |
| friends | User array | Many to many join of User model to find friends |
| friendOf | User array | Many to many join of User model to find (reverse direction) of who is the user friends of |

## POSTMAN Collection

POSTMAN Collection file (v2.1) is in /postman for simple client testing.


## Test Sequence (for Round 3)

1. Create 3 users
2. As user 1, add user 3 as a friend
3. As user 1, create two Todo items
4. As user 1, mark one of the Todo items as private

### Expected Results

1. As user 1, I can view two Todo items
2. As user 2, I would not get back any Todo items (Empty array)
3. As user 3, I can view one Todo item belonging to user 1


## Considerations / Notes

- Using simple sqlite database for simplicity, typeorm will support postgres, mysql, mongodb
- Default status is "not done"
- Int was chosen as data type for priority so that records can be sorted by priority easily
- Three priority levels were chosen for simplicity low, normal and high.
- Default due date is not set/null
- Todo item list is returned with order by due date (asc/ soonest first )and then by priority (asc / highest first)
- Identifiers are using uuid v4 so that todo items and users ids cannot be easily guessed.
- Authentication is assumed to be done before calling APIs and authenticated user id should be in header key x-user-id
- If a user is not authorized to view todo item 1) user is not the owner 2) user not a friend of owner 3) user is a friend and todo is private
- Unable to remove friend from a user
- Able to add same friend to a user (todo: need to check before adding)