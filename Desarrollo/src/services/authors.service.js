import pool from "../db/pool.js";

export function getAllAuthors() {
    return pool.query(
        "SELECT * FROM authors ORDER BY id"
    );
}

export function getAuthorById(id) {
    return pool.query(
        "SELECT * FROM authors WHERE id = $1",
        [id]
    );
}

export function createAuthor(name, email, bio) {
    return pool.query(
        `INSERT INTO authors (name, email, bio)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [name, email, bio]
    );
}

export function updateAuthor(id, name, email, bio) {
    return pool.query(
        `UPDATE authors
         SET name = $1,
             email = $2,
             bio = $3
         WHERE id = $4
         RETURNING *`,
        [name, email, bio, id]
    );
}

export function deleteAuthor(id) {
    return pool.query(
        "DELETE FROM authors WHERE id = $1 RETURNING *",
        [id]
    );
}