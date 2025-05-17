const { Router } = require('express');
const verifyToken = require("../middlewares/verify-token")
const { getNewToken, loginPro } = require("../middlewares/authenticate")
const UserController = require("../controllers/user-controller")
const LoanController = require("../controllers/loan-controller")
const EmployeeController = require("../controllers/employee-controller")
const KantorUnitController = require("../controllers/kantor-unit-controller")
const IncomeController = require("../controllers/income-controller")
const PaymentController = require("../controllers/payment-controller")


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
router.post("/employee", EmployeeController.addEmployee);
router.get("/employees", EmployeeController.getAllEmployees);
router.get("/employee/:id", EmployeeController.getEmployeeById);
router.put("/employee/:id", EmployeeController.updateEmployee);
router.delete("/employee/:id", EmployeeController.deleteEmployee);

// kantor units
router.post("/kantor-units", KantorUnitController.addKantorUnit);
router.get("/kantor-units", KantorUnitController.getAllKantorUnits);
router.get("/kantor-units/:id", KantorUnitController.getKantorUnitById);
router.put("/kantor-units/:id", KantorUnitController.updateKantorUnit);
router.delete("/kantor-units/:id", KantorUnitController.deleteKantorUnit);

// Income
router.post("/income", IncomeController.addIncome);
router.get("/incomes", IncomeController.getAllIncome);
router.get("/income/:id", IncomeController.getIncomeById);
router.put("/income/:id", IncomeController.updateIncome);
router.delete("/income/:id", IncomeController.deleteIncome);

// Payments
router.post("/payment", PaymentController.addPayment);
router.get("/payments", PaymentController.getAllPayments);
router.get("/payment/:id", PaymentController.getPaymentById);
router.put("/payment/:id", PaymentController.updatePayment);
router.delete("/payment/:id", PaymentController.deletePayment);





module.exports = router;
