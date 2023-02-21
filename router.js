const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')


const path = require('path');

router.use((req,res,next)=>{
    console.log(`Time: ${Date.now()}`)
    next()
})

router.get('/',userController.home)
router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/logout',userController.logout)
router.post('/addStaircase', userController.addStaircase)
router.post('/incrementStairTraversal', userController.incrementStairTraversal)
router.post('/decrementStairTraversal', userController.decrementStairTraversal)
router.post('/getFrontEndData', userController.getFrontEndData)

router.post('/deleteStaircase',userController.deleteStaircase)
router.post('/editStaircaseName', userController.editStaircaseName)
router.post('/editStaircaseCount', userController.editStaircaseCount)

module.exports = router