import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "./app.js";

test("GET / debe responder que la API funciona", async () => {
    const response = await request(app).get("/");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(
        response.body.message,
        "MiniBlog API funcionando"
    );
});

test("GET /authors debe devolver una lista de autores", async () => {
    const response = await request(app).get("/authors");

    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body));
});

test("GET /authors/:id debe devolver un autor existente", async () => {
    const response = await request(app).get("/authors/2");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.id, 2);
});

test("GET /authors/:id debe devolver 404 si el autor no existe", async () => {
    const response = await request(app).get("/authors/999");

    assert.strictEqual(response.status, 404);
    assert.strictEqual(
        response.body.message,
        "Autor no encontrado"
    );
});

test("GET /posts debe devolver una lista de posts", async () => {
    const response = await request(app).get("/posts");

    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body));
});

test("GET /posts/:id debe devolver 404 si el post no existe", async () => {
    const response = await request(app).get("/posts/999");

    assert.strictEqual(response.status, 404);
    assert.strictEqual(
        response.body.message,
        "Post no encontrado"
    );
});

test("POST /posts debe devolver 400 si falta el título", async () => {
    const response = await request(app)
        .post("/posts")
        .send({
            author_id: 2,
            content: "Contenido de prueba",
            published: true
        });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(
        response.body.message,
        "El título es obligatorio"
    );
});