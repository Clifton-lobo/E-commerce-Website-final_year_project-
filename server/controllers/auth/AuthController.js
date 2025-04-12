const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../.././models/User')


//register

const registerUser =async(req,res)=>{
    const {username,email,password}=req.body;

    try{
       
       const checkUser = await User.findOne({email});

       if(checkUser){
        return res.json( {success:false,message:'user already exists'})
       }
        const hashPassword =await bcrypt.hash(password,12);
        const newUser = new User({
            username,
            email,
            password:hashPassword,
        })

         await newUser.save();
         res.status(200).json({
            success:true,
            message:'Registraion Successful!!!',
         })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:'some error occured',
        })
    }
}



//login

const loginUserController =async(req,res)=>{
    const {username,email,password}=req.body;

    try{
        const checkUser = await User.findOne({ email });
        if (!checkUser)
          return res.json({
            success: false,
            message: "User doesn't exists! Please register first",
          });
    
        const checkPasswordMatch = await bcrypt.compare(
          password,
          checkUser.password
        );
        if (!checkPasswordMatch)
          return res.json({
            success: false,
            message: "Incorrect password! Please try again",
          });
       
        const token = jwt.sign({
          id:checkUser._id,
          role:checkUser.role,
          email:checkUser.email,
          username:checkUser.username,

        },'CLIENT_SECRET_KEY',{expiresIn :'1d'});

        res.cookie('token',token,{httpOnly:true,secure:false}).json({
          success:true,
          message:'logged in successfully',
          user:{
            email:checkUser.email,
            role:checkUser.role,
            id:checkUser._id,
            username:checkUser.username,
          }
        })
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:'some error occured',
        });
    };

    
}

//logout

const logoutController =(req,res)=>{
  res.clearCookie('token').json({
    success:true,
    message:"logout successfully!"
  });
};



//auth middleware
const authMiddleware = async(req,res,next)=>{
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({
      success:false,
      message:'unauthorized access'
    })
  }

  try{
    const decode = jwt.verify(token,'CLIENT_SECRET_KEY');
    req.user=decode;
    next();
  }catch(error){
    res.status(401).json({
      success:false,
      message:'unauthorized access'
      });
};

}


module.exports ={registerUser,loginUserController,logoutController,authMiddleware}; 