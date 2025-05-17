const { Router } = require('express');
const verifyToken = require("../middlewares/verify-token")
const { getNewToken, loginPro } = require("../middlewares/authenticate")
const UserController = require("../controllers/user-controller")
const LoanController = require("../controllers/loan-controller")
const EmployeeController = require("../controllers/employee-controller")


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

// Loan 
router.post("/loans", LoanController.addLoan);
router.get("/loans", LoanController.getAllLoans);
router.get("/loans/:id", LoanController.getLoanById);
router.put("/loans/:id", LoanController.updateLoan);
router.delete("/loans/:id", LoanController.deleteLoan);

// Employee

router.post("/employees", EmployeeController.addEmployee);
router.get("/employees", EmployeeController.getAllEmployees);
router.get("/employees/:id", EmployeeController.getEmployeeById);
router.put("/employees/:id", EmployeeController.updateEmployee);
router.delete("/employees/:id", EmployeeController.deleteEmployee);



module.exports = router;
