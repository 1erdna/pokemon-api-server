from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

DATABASE = "pokemon.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def create_database():
    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS pokemon (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            level INTEGER NOT NULL
        )
    """)

    count = conn.execute(
        "SELECT COUNT(*) FROM pokemon"
    ).fetchone()[0]

    if count == 0:
        pokemon_data = [
            ("Pikachu", "Electric", 25),
            ("Charmander", "Fire", 15),
            ("Squirtle", "Water", 16),
            ("Bulbasaur", "Grass/Poison", 14),
            ("Jigglypuff", "Normal/Fairy", 18),
            ("Meowth", "Normal", 17),
            ("Psyduck", "Water", 20),
            ("Machop", "Fighting", 21),
            ("Geodude", "Rock/Ground", 19),
            ("Gastly", "Ghost/Poison", 22),
            ("Eevee", "Normal", 20),
            ("Snorlax", "Normal", 30),
            ("Dratini", "Dragon", 24),
            ("Abra", "Psychic", 16),
            ("Magikarp", "Water", 10)
        ]

        conn.executemany(
            "INSERT INTO pokemon (name, type, level) VALUES (?, ?, ?)",
            pokemon_data
        )

    conn.commit()
    conn.close()


# HOME
@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to my Pokemon API!"
    })


# GET ALL POKEMON
@app.route("/pokemon", methods=["GET"])
def get_all_pokemon():
    conn = get_db_connection()

    pokemon = conn.execute(
        "SELECT * FROM pokemon"
    ).fetchall()

    conn.close()

    return jsonify([
        dict(item) for item in pokemon
    ]), 200


# GET ONE POKEMON
@app.route("/pokemon/<int:pokemon_id>", methods=["GET"])
def get_pokemon(pokemon_id):
    conn = get_db_connection()

    pokemon = conn.execute(
        "SELECT * FROM pokemon WHERE id = ?",
        (pokemon_id,)
    ).fetchone()

    conn.close()

    if pokemon is None:
        return jsonify({
            "error": "Pokemon not found"
        }), 404

    return jsonify(dict(pokemon)), 200


# CREATE A POKEMON
@app.route("/pokemon", methods=["POST"])
def create_pokemon():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "Request body must contain JSON data"
        }), 400

    if "name" not in data or "type" not in data or "level" not in data:
        return jsonify({
            "error": "name, type, and level are required"
        }), 400

    if not data["name"] or not data["type"]:
        return jsonify({
            "error": "name and type cannot be empty"
        }), 400

    if not isinstance(data["level"], int):
        return jsonify({
            "error": "level must be an integer"
        }), 400

    conn = get_db_connection()

    cursor = conn.execute(
        "INSERT INTO pokemon (name, type, level) VALUES (?, ?, ?)",
        (
            data["name"],
            data["type"],
            data["level"]
        )
    )

    conn.commit()

    new_pokemon = conn.execute(
        "SELECT * FROM pokemon WHERE id = ?",
        (cursor.lastrowid,)
    ).fetchone()

    conn.close()

    return jsonify(dict(new_pokemon)), 201


# UPDATE A POKEMON
@app.route("/pokemon/<int:pokemon_id>", methods=["PUT"])
def update_pokemon(pokemon_id):
    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "error": "Request body must contain JSON data"
        }), 400

    if "name" not in data or "type" not in data or "level" not in data:
        return jsonify({
            "error": "name, type, and level are required"
        }), 400

    if not data["name"] or not data["type"]:
        return jsonify({
            "error": "name and type cannot be empty"
        }), 400

    if not isinstance(data["level"], int):
        return jsonify({
            "error": "level must be an integer"
        }), 400

    conn = get_db_connection()

    existing_pokemon = conn.execute(
        "SELECT * FROM pokemon WHERE id = ?",
        (pokemon_id,)
    ).fetchone()

    if existing_pokemon is None:
        conn.close()

        return jsonify({
            "error": "Pokemon not found"
        }), 404

    conn.execute(
        """
        UPDATE pokemon
        SET name = ?, type = ?, level = ?
        WHERE id = ?
        """,
        (
            data["name"],
            data["type"],
            data["level"],
            pokemon_id
        )
    )

    conn.commit()

    updated_pokemon = conn.execute(
        "SELECT * FROM pokemon WHERE id = ?",
        (pokemon_id,)
    ).fetchone()

    conn.close()

    return jsonify(dict(updated_pokemon)), 200


# DELETE A POKEMON
@app.route("/pokemon/<int:pokemon_id>", methods=["DELETE"])
def delete_pokemon(pokemon_id):
    conn = get_db_connection()

    existing_pokemon = conn.execute(
        "SELECT * FROM pokemon WHERE id = ?",
        (pokemon_id,)
    ).fetchone()

    if existing_pokemon is None:
        conn.close()

        return jsonify({
            "error": "Pokemon not found"
        }), 404

    conn.execute(
        "DELETE FROM pokemon WHERE id = ?",
        (pokemon_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Pokemon deleted successfully",
        "deleted_pokemon": dict(existing_pokemon)
    }), 200


if __name__ == "__main__":
    create_database()
    app.run(debug=True)