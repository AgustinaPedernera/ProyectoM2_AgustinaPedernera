export function errorHandler(error, req, res, next) {
    if (error.code === "23505") {
        return res.status(400).json({
            message: "El email ya está registrado"
        });
    }

    if (error.code === "23503") {
        return res.status(400).json({
            message: "El autor del post no existe"
        });
    }

    console.error(error);

    return res.status(500).json({
        message: "Error interno del servidor"
    });
}