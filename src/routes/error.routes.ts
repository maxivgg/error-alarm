import { Router } from "express";
const router = Router();

import * as errorController from "../services/error.services";

router.get("/", errorController.home);

export default router;
