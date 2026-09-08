import express from "express";
import pool from "./db/pool.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";

const app = express();

app.use(express.json());

const openapiFile = fs.readFileSync("./docs/openapi.yaml", "utf8");
const swaggerDocument = YAML.parse(openapiFile);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.get("/", (req, res) => {
    res.json({ message: "MiniBlog API funcionando" });
});

app.get("/authors", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM authors");
        return res.status(200).json(result.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los autores"
        });
    }
});

app.get("/authors/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM authors WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Autor no encontrado"
            });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el autor"
        });
    }
});

app.post("/authors", async (req, res) => {
    const { name, email, bio } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({
            message: "El nombre es obligatorio"
        });
    }

    if (!email || email.trim() === "") {
        return res.status(400).json({
            message: "El email es obligatorio"
        });
    }

    try {
        const result = await pool.query(
            "INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bio]
        );

        return res.status(201).json(result.rows[0]);

    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                message: "El email ya está registrado"
            });
        }

        return res.status(500).json({
            message: "Error al crear el autor"
        });
    }
});

app.put("/authors/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, bio } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({
            message: "El nombre es obligatorio"
        });
    }

    if (!email || email.trim() === "") {
        return res.status(400).json({
            message: "El email es obligatorio"
        });
    }

    try {
        const result = await pool.query(
            "UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *",
            [name, email, bio, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Autor no encontrado"
            });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        if (error.code === "23505") {
            return res.status(400).json({
                message: "El email ya está registrado"
            });
        }

        return res.status(500).json({
            message: "Error al actualizar el autor"
        });
    }
});

app.delete("/authors/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM authors WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Autor no encontrado"
            });
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el autor"
        });
    }
});

app.get("/posts", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM posts");

        return res.status(200).json(result.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los posts"
        });
    }
});

app.get("/posts/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "SELECT * FROM posts WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el post"
        });
    }
});

app.get("/posts/author/:authorId", async (req, res) => {
    const { authorId } = req.params;

    try {
        const result = await pool.query(
            `SELECT
                posts.*,
                authors.name AS author_name,
                authors.email AS author_email,
                authors.bio AS author_bio
            FROM posts
            JOIN authors ON posts.author_id = authors.id
            WHERE posts.author_id = $1`,
            [authorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "No se encontraron posts para este autor"
            });
        }

        return res.status(200).json(result.rows);

    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los posts del autor"
        });
    }
});

app.post("/posts", async (req, res) => {
    const {
        author_id,
        title,
        content,
        published = false
    } = req.body;

    if (!author_id) {
        return res.status(400).json({
            message: "El autor es obligatorio"
        });
    }

    if (!title || title.trim() === "") {
        return res.status(400).json({
            message: "El título es obligatorio"
        });
    }

    if (!content || content.trim() === "") {
        return res.status(400).json({
            message: "El contenido es obligatorio"
        });
    }

    try {
        const result = await pool.query(
            "INSERT INTO posts (author_id, title, content, published) VALUES ($1, $2, $3, $4) RETURNING *",
            [author_id, title, content, published]
        );

        return res.status(201).json(result.rows[0]);

    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).json({
                message: "El autor del post no existe"
            });
        }

        return res.status(500).json({
            message: "Error al crear el post"
        });
    }
});

app.put("/posts/:id", async (req, res) => {
    const { id } = req.params;
    const {
        author_id,
        title,
        content,
        published = false
    } = req.body;

    if (!author_id) {
        return res.status(400).json({
            message: "El autor es obligatorio"
        });
    }

    if (!title || title.trim() === "") {
        return res.status(400).json({
            message: "El título es obligatorio"
        });
    }

    if (!content || content.trim() === "") {
        return res.status(400).json({
            message: "El contenido es obligatorio"
        });
    }

    try {
        const result = await pool.query(
            "UPDATE posts SET author_id = $1, title = $2, content = $3, published = $4 WHERE id = $5 RETURNING *",
            [author_id, title, content, published, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).json({
                message: "El autor del post no existe"
            });
        }

        return res.status(500).json({
            message: "Error al actualizar el post"
        });
    }
});

app.delete("/posts/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM posts WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el post"
        });
    }
});

export default app;