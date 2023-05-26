import { Request, Response, Router } from "express";
import {
  saveFileShowCases,
  saveFileShowcase,
  getComments,
  addComment,
  getAllSaveFileShowCaseOfUser,
  removeSaveFileShowCase,
  updateSaveFileShowCase,
  addSaveFileToShowCase
} from "../../controller/controller";
import { generateToken, createUser } from "../../services/authenticate";
import { isAuth } from "../../middleware/isAuth";

const router = Router();

router.post(`/auth/login`, generateToken);
router.post(`/auth/signup`, createUser);

// public api
router.get(`/api/get-specific-savefile-showcase`, saveFileShowcase);
router.get(`/api/get-all-savefile-showcase`, saveFileShowCases);
router.get(`/api/get-comments`, getComments);

router.post(`/api/add-comment`, isAuth, addComment);
router.get(
  `/api/get-all-savefile-showcase-of-user`,
  isAuth,
  getAllSaveFileShowCaseOfUser
);
router.delete(`/api/remove-savefile-showcase`, isAuth, removeSaveFileShowCase);
router.put(`/api/update-savefile-showcase`, isAuth, updateSaveFileShowCase);
router.post(`/api/add-savefile-showcase`, isAuth, addSaveFileToShowCase);

export default router;
