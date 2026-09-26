# Pokemon REST API Server

A simple REST API server built using Python, Flask, and SQLite. This project demonstrates full CRUD (Create, Read, Update, Delete) operations for managing Pokemon data.

## Technologies Used

- Python
- Flask
- SQLite
- Postman

## Project Features

The API supports the following operations:

- View all Pokemon
- View a single Pokemon by ID
- Create a new Pokemon
- Update an existing Pokemon
- Delete a Pokemon
- Validate required fields
- Return appropriate HTTP status codes

## Pokemon Data Structure

Each Pokemon contains the following fields:

```json
{
  "id": 1,
  "name": "Pikachu",
  "type": "Electric",
  "level": 25
}
```

## Base URL

When running locally:

```text
http://127.0.0.1:5000
```

---

## API Endpoints

### 1. GET All Pokemon

**Method:** GET

**Endpoint:**

```text
/pokemon
```

**Example Request:**

```text
GET http://127.0.0.1:5000/pokemon
```

**Example Response:**

```json
[
  {
    "id": 1,
    "name": "Pikachu",
    "type": "Electric",
    "level": 25
  },
  {
    "id": 2,
    "name": "Charmander",
    "type": "Fire",
    "level": 15
  }
]
```

**Status Code:**

```text
200 OK
```

---

### 2. GET Pokemon by ID

**Method:** GET

**Endpoint:**

```text
/pokemon/:id
```

**Example Request:**

```text
GET http://127.0.0.1:5000/pokemon/1
```

**Example Response:**

```json
{
  "id": 1,
  "name": "Pikachu",
  "type": "Electric",
  "level": 25
}
```

**Status Code:**

```text
200 OK
```

If the Pokemon does not exist:

```json
{
  "error": "Pokemon not found"
}
```

**Status Code:**

```text
404 NOT FOUND
```

---

### 3. POST Create Pokemon

**Method:** POST

**Endpoint:**

```text
/pokemon
```

**Example Request:**

```json
{
  "name": "Mewtwo",
  "type": "Psychic",
  "level": 70
}
```

**Example Response:**

```json
{
  "id": 16,
  "name": "Mewtwo",
  "type": "Psychic",
  "level": 70
}
```

**Status Code:**

```text
201 CREATED
```

If a required field is missing:

```json
{
  "error": "name, type, and level are required"
}
```

**Status Code:**

```text
400 BAD REQUEST
```

---

### 4. PUT Update Pokemon

**Method:** PUT

**Endpoint:**

```text
/pokemon/:id
```

**Example Request:**

```text
PUT http://127.0.0.1:5000/pokemon/16
```

**Request Body:**

```json
{
  "name": "Mewtwo",
  "type": "Psychic",
  "level": 75
}
```

**Example Response:**

```json
{
  "id": 16,
  "name": "Mewtwo",
  "type": "Psychic",
  "level": 75
}
```

**Status Code:**

```text
200 OK
```

If the Pokemon does not exist:

```json
{
  "error": "Pokemon not found"
}
```

**Status Code:**

```text
404 NOT FOUND
```

---

### 5. DELETE Pokemon

**Method:** DELETE

**Endpoint:**

```text
/pokemon/:id
```

**Example Request:**

```text
DELETE http://127.0.0.1:5000/pokemon/16
```

**Example Response:**

```json
{
  "deleted_pokemon": {
    "id": 16,
    "name": "Mewtwo",
    "type": "Psychic",
    "level": 75
  },
  "message": "Pokemon deleted successfully"
}
```

**Status Code:**

```text
200 OK
```

If the Pokemon does not exist:

```json
{
  "error": "Pokemon not found"
}
```

**Status Code:**

```text
404 NOT FOUND
```

---

## Validation

POST and PUT requests require all three fields:

- `name`
- `type`
- `level`

If a required field is missing, the API returns:

```json
{
  "error": "name, type, and level are required"
}
```

with HTTP status:

```text
400 BAD REQUEST
```

The `level` field must also be an integer.

## How to Run the Project

### 1. Install Flask

```bash
pip install flask
```

### 2. Run the API server

```bash
python app.py
```

### 3. Open the API

```text
http://127.0.0.1:5000/pokemon
```

### 4. Test the API

The endpoints can be tested using Postman or curl.

## HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Successful GET, PUT, or DELETE |
| 201 | Pokemon successfully created |
| 400 | Bad request or missing required field |
| 404 | Pokemon not found |

## Database

The project uses SQLite.

The database file is:

```text
pokemon.db
```

The database contains 15 initial Pokemon records.

## Author

Andrei Nacaya

## Project

Build Your Own API Server Challenge