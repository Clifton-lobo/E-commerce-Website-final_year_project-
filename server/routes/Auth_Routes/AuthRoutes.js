const express= require('express');
const { registerUser
    ,loginUserController
    ,logoutController
    ,authMiddleware 
} = require('../../controllers/auth/AuthController');

const router =express.Router();


router.post('/register',registerUser);
router.post('/login',loginUserController);
router.post('/logout',logoutController);
router.get('/checkauth',authMiddleware,(req,res)=>{
    const user = req.user;
    res.status(200).json({
        success:true,
        message:'user authenticated !',
        user
    })
});

module.exports = router;
