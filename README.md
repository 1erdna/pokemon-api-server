# Pokemon Full Stack CRUD App

A simple full stack Pokemon manager built with **Python, Flask, SQLite, HTML, CSS, and JavaScript Fetch API**.

The project now includes the original REST API backend plus a browser frontend that can list, view, add, edit, and delete Pokemon.

## Features

### Backend API
- GET all Pokemon
- GET one Pokemon by ID
- POST a new Pokemon
- PUT updates to an existing Pokemon
- DELETE a Pokemon
- Validation with HTTP 400 responses
- Graceful HTTP 404 responses
- SQLite database with starter Pokemon data

### Frontend
- List view showing all Pokemon
- Detail view using GET by ID
- Add form using POST
- Edit form using PUT
- Delete button using DELETE
- API validation messages shown in the interface
- Graceful 404 display
- Loading state while fetching data
- Responsive app styling

The frontend is served by the same Flask application as the API, so both use the same origin and do not need a separate CORS package.

## Project Structure

```text
pokemon-api-server/
├── app.py
├── pokemon.db
├── requirements.txt
├── README.md
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── screenshots/
    ├── GET.png
    ├── POST.png
    ├── PUT.png
    └── DELETE.png
```

## How to Run the Backend and Frontend

### 1. Clone the repository

```bash
git clone https://github.com/1erdna/pokemon-api-server.git
cd pokemon-api-server
```

### 2. Install the dependency

```bash
pip install -r requirements.txt
```

### 3. Start the Flask backend

```bash
python app.py
```

You should see Flask running locally, normally at:

```text
http://127.0.0.1:5000
```

### 4. Open the frontend

Open this URL in your browser:

```text
http://127.0.0.1:5000
```

The frontend is served by Flask automatically. You do **not** need to start a second frontend server.

## Pokemon Data Structure

```json
{
  "id": 1,
  "name": "Pikachu",
  "type": "Electric",
  "level": 25
}
```

## API Endpoints

| Method | Endpoint | Purpose | Success Status |
|---|---|---|---|
| GET | `/pokemon` | Retrieve all Pokemon | 200 |
| GET | `/pokemon/:id` | Retrieve one Pokemon | 200 |
| POST | `/pokemon` | Create a Pokemon | 201 |
| PUT | `/pokemon/:id` | Update a Pokemon | 200 |
| DELETE | `/pokemon/:id` | Delete a Pokemon | 200 |

## Validation

POST and PUT use these required fields:

- `name`
- `type`
- `level`

Example validation response:

```json
{
  "error": "name, type, and level are required"
}
```

Status:

```text
400 BAD REQUEST
```

If a Pokemon ID does not exist:

```json
{
  "error": "Pokemon not found"
}
```

Status:

```text
404 NOT FOUND
```

## Frontend Fetch Example

The frontend calls the API with JavaScript Fetch API. For example, loading the list uses:

```javascript
const items = await apiRequest('/pokemon');
```

The shared `apiRequest()` helper uses `fetch()` and displays error messages returned by the backend.

## Suggested Walkthrough Order

For the required recording, show these in order:

1. Flask backend running in the terminal
2. Pokemon list loading in the browser
3. Adding a Pokemon through the form
4. Editing a Pokemon
5. Deleting a Pokemon
6. Triggering a validation error by leaving a required field empty
7. Opening `frontend/app.js` and briefly showing a Fetch API call

Do not show secrets, API keys, `.env` files, or database connection strings while recording.

## API Testing Screenshots

### GET - Retrieve All Pokemon

![GET Pokemon](screenshots/GET.png)

### POST - Create a Pokemon

![POST Pokemon](screenshots/POST.png)

### PUT - Update a Pokemon

![PUT Pokemon](screenshots/PUT.png)

### DELETE - Delete a Pokemon

![DELETE Pokemon](screenshots/DELETE.png)

## Technologies Used

- Python
- Flask
- SQLite
- HTML5
- CSS3
- JavaScript
- Fetch API
- Postman

## Author

Andrei Nacaya

## Project

Build Your Own API Server Challenge + Frontend for Your API Server Lab
