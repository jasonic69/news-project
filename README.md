# News API

## Project Summary

The aim of this project was to build an API for the purpose of accessing application data programmatically.  This was to mimic the building of a real world backend service (like Reddit) which would provide this information to the front end architecture.

Experience gained:-

* Querying a database.
* Using a TDD approach to cover both the happy and error paths.
* Setting a RESTful API with a number of endpoints which cover CRUD operations.
* Setting up parametric endpoints.
* Handling complex queries.
* Manipulating data to respond to client requirements.
* Hosting your server and DB.

The hosted version can be seen here:-
https://nc-news-bpw3.onrender.com/api/ 
(the response will be **all** the endpoints for the API)


## How To Clone

git clone https://github.com/jasonic69/news-project.git

## How To Install Dependancies

```
npm install 
```

## Create The Environment Variables:-

You will need to create a .env.test file and add `PGDATABASE=EXAMPLE_TEST`, replace EXAMPLE_TEST with the correct database name for that environment. You will also need to create a .env.development and add `PGDATABASE=DEVELOPMENT`, replacing DEVELOPMENT with the correct database name for that environment.

## How To Create The Databases
```
npm run setup-dbs
```
## How To Seed Local Database
```
npm run seed
```

## How To Run Tests
```
npm run test __tests__/app.test.js
```

## Minimum Requirements

* Node.js version 22.4.1
* Postgres version 8.7.3

