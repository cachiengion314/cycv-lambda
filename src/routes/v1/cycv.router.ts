import { Request, Response, Router } from "express";
import {
  saveFileShowCases,
  saveFileShowcase
} from "../../controller/controller";

// const authenticate = require(`../../services/authenticate`);
// const { isAuth } = require(`../../middleware/isAuth`);

const router = Router();

// router.post(`/auth/login`, authenticate.generateToken);
// router.post(`/auth/signup`, authenticate.createUser);

// public api
router.get(`/api/get-specific-savefile-showcase`, saveFileShowcase);
router.get(`/api/get-all-savefile-showcase`, saveFileShowCases);
// router.get(`/api/get-comments`, controller.getComments);

// router.post(`/api/add-comment`, isAuth, controller.addComment);
// router.get(
//   `/api/get-all-savefile-showcase-of-user`,
//   isAuth,
//   controller.getAllSaveFileShowCaseOfUser
// );
// router.delete(
//   `/api/remove-savefile-showcase`,
//   isAuth,
//   controller.removeSaveFileShowCase
// );
// router.put(
//   `/api/update-savefile-showcase`,
//   isAuth,
//   controller.updateSaveFileShowCase
// );
// router.post(
//   `/api/add-savefile-showcase`,
//   isAuth,
//   controller.addSaveFileToShowCase
// );

export default router;
