import { Router } from "express";

import {
    listAuthors,
    showAuthor,
    addAuthor,
    editAuthor,
    removeAuthor
} from "../controllers/authors.controller.js";

const router = Router();

router.get("/", listAuthors);
router.get("/:id", showAuthor);
router.post("/", addAuthor);
router.put("/:id", editAuthor);
router.delete("/:id", removeAuthor);

export default router;