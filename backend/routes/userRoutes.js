const express = require('express')
const verifyToken = require('../middleware/authMiddleware')
const router = express.Router();
const authorizeRoles = require('../middleware/roleMiddleware')

//Admin routes
router.get("/admin",verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({msg: "Hello Admin!"})
})

//Manager routes
router.get("/manager", verifyToken,authorizeRoles("admin", "manager"), (req, res) => {
    res.json({msg: "Hello Manager!"})
})

//Users routes
router.get("/user", verifyToken, authorizeRoles("admin", "manager", "user"), (req, res) => {
    res.json({msg: "Hello User!"})
})

module.exports = router;