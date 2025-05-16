const { Router } = require('express');
const verifyToken = require("../middlewares/verify-token")
const { getNewToken, loginPro } = require("../middlewares/authenticate")
const UserController = require("../controllers/user-controller")


const { uploadImageSingle, uploadImageMultiple, resizeImageSingle, resizeImageMultiple } = require('../helpers/upload-images');

// Initialize router
const router = Router();
const Helper = require('../helpers/upload-images');

router.get('/', (req, res) => {
    return res.json({ code: 0, message: 'success', description: 'api endPoint Bank Cabang Sister' });
});

// User
router.post('/auth/sign-in', loginPro)
router.post('/auth/sign-up', UserController.addUser)
router.post('/auth/refresh-token', getNewToken)
router.get('/users', verifyToken, UserController.getAllUsers)


module.exports = router;
