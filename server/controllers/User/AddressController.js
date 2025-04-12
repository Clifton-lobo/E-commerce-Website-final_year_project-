const  Address= require('../../models/Address')

const addAddress =async(req,res)=>{
    try{
    const {userId,address,city,pincode,phone,notes}=req.body;

    if(!userId || !address || !city || !pincode || !phone || !notes ){
        return res.status(200).json({
            success:false,
            message:'invalid data provided'
        })
    }

    const newlyCreatedAddress = new Address({
        userId,address,city,pincode,phone,notes
    })

    newlyCreatedAddress.save();

    return res.status(200).json({
        success:true,
        data:newlyCreatedAddress
    })
    }catch(err){
        console.log(err)
        res.status(500).json({
            success:false,
            message:'error'
        })
    }
}

const fetchAllAdress =async(req,res)=>{
    try{
        const {userId} =req.params;

        if(!userId){
            res.status(400).json({
                success:false,
                nessage:'user id is required',
            })
        }

        const addressList = await Address.find({userId})
        res.status(200).json({
            success:true,
            data:addressList
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            success:false,
            message:'error'
        })
    }
}


const editAddress =async(req,res)=>{
    try{

        const {userId,addressId} =req.params; 
        const formData = req.body;

        if(!userId || !addressId ){
            return res.status(400).json({
                success:true,
                message:'user and address id id requried'
            })
        }

        const address = await Address.findOneAndUpdate({
            _id:addressId,
            userId
        },formData, {new:true})

        if(!address){
            return res.status(404).json({
                success:true,
                message:' address not foun'
    
            })
        }
        res.status(200).json({
            success:true,
            message:"error"
        })
    
    }catch(err){
        console.log(err)
        res.status(500).json({
            success:false,
            message:'error'
        })
    }
}


const deleteAddress =async(req,res)=>{
    try{

        const {userId,addressId} =req.params; 

        if(!userId || !addressId ){
            return res.status(400).json({
                success:true,
                message:'user and address id id requried'
            })
        }

        const address = await Address.findOneAndDelete({
            _id:addressId ,userId
        });

        if(!addressId ){
            return res.status(400).json({
                success:true,
                message:'address not found'
            })
        }
        res.status(200).json({
            success:true,
            message:'address deleted '
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            success:false,
            message:'error'
        })
    }
}


module.exports ={fetchAllAdress,addAddress,deleteAddress,editAddress}