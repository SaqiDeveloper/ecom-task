const router = require("express").Router();
const {upload}= require('../../utils/multer');
const fileServices = require("../../services/file/index");

router.post("/file-upload",upload.single('file'), fileServices.upload); 
 
module.exports = router;