import { Router } from "express";

import books from "./books.route";
import cycv from "./cycv.router";

const router = Router();

router.use("/", cycv);

export default router;
