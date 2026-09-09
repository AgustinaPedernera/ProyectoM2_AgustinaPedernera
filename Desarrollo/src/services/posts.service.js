import pool from "../db/pool.js";

export function getAllPosts() {
    return pool.query(
        "SELECT * FROM posts ORDER BY id"
    );
}

export function getPostById(id) {
    return pool.query(
        "SELECT * FROM posts WHERE id = $1",
        [id]
    );
}

export function getPostsByAuthor(authorId) {
    return pool.query(
        `SELECT
            posts.*,
            authors.name AS author_name,
            authors.email AS author_email,
            authors.bio AS author_bio
         FROM posts
         JOIN authors
            ON posts.author_id = authors.id
         WHERE posts.author_id = $1
         ORDER BY posts.id`,
        [authorId]
    );
}

export function createPost(
    authorId,
    title,
    content,
    published
) {
    return pool.query(
        `INSERT INTO posts (
            author_id,
            title,
            content,
            published
         )
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [authorId, title, content, published]
    );
}

export function updatePost(
    id,
    authorId,
    title,
    content,
    published
) {
    return pool.query(
        `UPDATE posts
         SET author_id = $1,
             title = $2,
             content = $3,
             published = $4
         WHERE id = $5
         RETURNING *`,
        [authorId, title, content, published, id]
    );
}

export function deletePost(id) {
    return pool.query(
        "DELETE FROM posts WHERE id = $1 RETURNING *",
        [id]
    );
}