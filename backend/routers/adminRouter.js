import express from "express"
import * as adminController from "../controllers/adminController.js"
const router = express.Router()

router.route("/signUp")
    .post(adminController.createAdmin)
router.route("/signIn")
    .post(adminController.adminSignIn)
router.route("/logOut")
    .post(adminController.adminLogOut)
router.get("/checkAuth", adminController.checkAdminAuth); 

export default router