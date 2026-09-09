import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "./app.js";


// RUTA PRINCIPAL //

test("GET / debe responder que la API funciona", async () => {
    const response = await request(app).get("/");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(
        response.body.message,
        "MiniBlog API funcionando"
    );
});


//  AUTORES  //

test("GET /authors debe devolver una lista de autores", async () => {
    const response = await request(app).get("/authors");

    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body));
});


test("GET /authors/:id debe devolver 404 si el autor no existe", async () => {
    const response = await request(app).get("/authors/999999");

    assert.strictEqual(response.status, 404);
    assert.strictEqual(
        response.body.message,
        "Autor no encontrado"
    );
});


test("POST /authors debe devolver 400 si el email tiene formato inválido", async () => {
    const response = await request(app)
        .post("/authors")
        .send({
            name: "Autor de prueba",
            email: "email-invalido",
            bio: "Bio de prueba"
        });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(
        response.body.message,
        "El formato del email no es válido"
    );
});


//  CRUD COMPLETO  // 


test("CRUD completo de autor y post", async () => {

    // CREAR AUTOR //

    const emailUnico =
        `test-${Date.now()}@miniblog.com`;

    const createAuthorResponse = await request(app)
        .post("/authors")
        .send({
            name: "Autor Test",
            email: emailUnico,
            bio: "Autor creado automáticamente por los tests"
        });

    assert.strictEqual(
        createAuthorResponse.status,
        201
    );

    assert.ok(createAuthorResponse.body.id);

    const authorId =
        createAuthorResponse.body.id;


    // OBTENER AUTOR //

    const getAuthorResponse = await request(app)
        .get(`/authors/${authorId}`);

    assert.strictEqual(
        getAuthorResponse.status,
        200
    );

    assert.strictEqual(
        getAuthorResponse.body.id,
        authorId
    );


    //  ACTUALIZAR AUTOR //

    const updateAuthorResponse = await request(app)
        .put(`/authors/${authorId}`)
        .send({
            name: "Autor Test Actualizado",
            email: emailUnico,
            bio: "Bio actualizada"
        });

    assert.strictEqual(
        updateAuthorResponse.status,
        200
    );

    assert.strictEqual(
        updateAuthorResponse.body.name,
        "Autor Test Actualizado"
    );


    //  AUTOR EXISTE PERO NO TIENE POSTS //

    const emptyPostsResponse = await request(app)
        .get(`/posts/author/${authorId}`);

    assert.strictEqual(
        emptyPostsResponse.status,
        200
    );

    assert.ok(
        Array.isArray(emptyPostsResponse.body)
    );

    assert.strictEqual(
        emptyPostsResponse.body.length,
        0
    );


    // CREAR POST //

    const createPostResponse = await request(app)
        .post("/posts")
        .send({
            author_id: authorId,
            title: "Post creado por test",
            content: "Contenido del post de prueba",
            published: true
        });

    assert.strictEqual(
        createPostResponse.status,
        201
    );

    assert.ok(createPostResponse.body.id);

    const postId =
        createPostResponse.body.id;


    // OBTENER POST //

    const getPostResponse = await request(app)
        .get(`/posts/${postId}`);

    assert.strictEqual(
        getPostResponse.status,
        200
    );

    assert.strictEqual(
        getPostResponse.body.id,
        postId
    );


    // OBTENER POSTS DEL AUTOR // 
    

    const authorPostsResponse = await request(app)
        .get(`/posts/author/${authorId}`);

    assert.strictEqual(
        authorPostsResponse.status,
        200
    );

    assert.ok(
        Array.isArray(authorPostsResponse.body)
    );

    assert.strictEqual(
        authorPostsResponse.body.length,
        1
    );

    assert.strictEqual(
        authorPostsResponse.body[0].author_id,
        authorId
    );


    // ACTUALIZAR POST // 

    const updatePostResponse = await request(app)
        .put(`/posts/${postId}`)
        .send({
            author_id: authorId,
            title: "Post actualizado por test",
            content: "Contenido actualizado",
            published: false
        });

    assert.strictEqual(
        updatePostResponse.status,
        200
    );

    assert.strictEqual(
        updatePostResponse.body.title,
        "Post actualizado por test"
    );

    assert.strictEqual(
        updatePostResponse.body.published,
        false
    );


    // ELIMINAR POST // 

    const deletePostResponse = await request(app)
        .delete(`/posts/${postId}`);

    assert.strictEqual(
        deletePostResponse.status,
        204
    );


    // Verifico que realmente desapareció

    const deletedPostResponse = await request(app)
        .get(`/posts/${postId}`);

    assert.strictEqual(
        deletedPostResponse.status,
        404
    );


    //  ELIMINAR AUTOR // 

    const deleteAuthorResponse = await request(app)
        .delete(`/authors/${authorId}`);

    assert.strictEqual(
        deleteAuthorResponse.status,
        204
    );


    // Verificamos que realmente desapareció

    const deletedAuthorResponse = await request(app)
        .get(`/authors/${authorId}`);

    assert.strictEqual(
        deletedAuthorResponse.status,
        404
    );
});


// POSTS - VALIDACIONES // 

test("POST /posts debe devolver 400 si falta el título", async () => {
    const response = await request(app)
        .post("/posts")
        .send({
            author_id: 1,
            content: "Contenido de prueba",
            published: true
        });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(
        response.body.message,
        "El título es obligatorio"
    );
});


test("POST /posts debe devolver 400 si el autor no existe", async () => {
    const response = await request(app)
        .post("/posts")
        .send({
            author_id: 999999,
            title: "Post imposible",
            content: "Este autor no existe",
            published: false
        });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(
        response.body.message,
        "El autor del post no existe"
    );
});


test("GET /posts/author/:authorId devuelve 404 si el autor no existe", async () => {
    const response = await request(app)
        .get("/posts/author/999999");

    assert.strictEqual(response.status, 404);
    assert.strictEqual(
        response.body.message,
        "Autor no encontrado"
    );
});