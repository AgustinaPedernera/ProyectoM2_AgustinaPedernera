import { Router } from "express";

import {
    listPosts,
    showPost,
    listPostsByAuthor,
    addPost,
    editPost,
    removePost
} from "../controllers/posts.controller.js";

const router = Router();

router.get("/", listPosts);
router.get("/author/:authorId", listPostsByAuthor);
router.get("/:id", showPost);
router.post("/", addPost);
router.put("/:id", editPost);
router.delete("/:id", removePost);

export default router;