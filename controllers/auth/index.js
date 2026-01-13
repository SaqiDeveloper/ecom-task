const router = require("express").Router();
const authService = require("../../services/auth");


router.post("/login", authService.login);
router.post("/admin/login", authService.adminLogin);



module.exports = router;
