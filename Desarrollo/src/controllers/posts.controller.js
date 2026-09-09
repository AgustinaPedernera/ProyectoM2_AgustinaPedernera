import {
    getAllPosts,
    getPostById,
    getPostsByAuthor,
    createPost,
    updatePost,
    deletePost
} from "../services/posts.service.js";

import {
    getAuthorById
} from "../services/authors.service.js";

export async function listPosts(req, res, next) {
    try {
        const result = await getAllPosts();

        return res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
}

export async function showPost(req, res, next) {
    const { id } = req.params;

    try {
        const result = await getPostById(id);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function listPostsByAuthor(req, res, next) {
    const { authorId } = req.params;

    try {
        const authorResult = await getAuthorById(authorId);

        if (authorResult.rows.length === 0) {
            return res.status(404).json({
                message: "Autor no encontrado"
            });
        }

        const postsResult = await getPostsByAuthor(authorId);

        return res.status(200).json(postsResult.rows);
    } catch (error) {
        next(error);
    }
}

export async function addPost(req, res, next) {
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
        const result = await createPost(
            author_id,
            title.trim(),
            content.trim(),
            published
        );

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function editPost(req, res, next) {
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
        const result = await updatePost(
            id,
            author_id,
            title.trim(),
            content.trim(),
            published
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function removePost(req, res, next) {
    const { id } = req.params;

    try {
        const result = await deletePost(id);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Post no encontrado"
            });
        }

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}