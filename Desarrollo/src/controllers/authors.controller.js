import {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
} from "../services/authors.service.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function listAuthors(req, res, next) {
    try {
        const result = await getAllAuthors();

        return res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
}

export async function showAuthor(req, res, next) {
    const { id } = req.params;

    try {
        const result = await getAuthorById(id);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Autor no encontrado"
            });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function addAuthor(req, res, next) {
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

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "El formato del email no es válido"
        });
    }

    try {
        const result = await createAuthor(
            name.trim(),
            email.trim(),
            bio
        );

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function editAuthor(req, res, next) {
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

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "El formato del email no es válido"
        });
    }

    try {
        const result = await updateAuthor(
            id,
            name.trim(),
            email.trim(),
            bio
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Autor no encontrado"
            });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

export async function removeAuthor(req, res, next) {
    const { id } = req.params;

    try {
        const result = await deleteAuthor(id);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Autor no encontrado"
            });
        }

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}