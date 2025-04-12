const { ImageUploadUtils } = require("../../helpers/cloudinaryFile");
const Product = require("../../models/product");

const handleImageUpload = async(req,res)=>{
    try{
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = `data:${req.file.mimetype};base64,${b64}`;
     const result = await ImageUploadUtils(url);

     res.json({
        success:true,
        result
     })

    }catch(err){
          
        console.log(err);
        res.status(400).json({
            success:false,
            message:'error occured'
        })
    }
}

//add a new product
const addProduct =async (req,res)=>{
    try{
 const{ image,author,title,description,bookcondition,language,category,price,totalStock} =req.body;

  const newProductCreated = new Product({
    image,author,title,bookcondition,language,description,category,price,totalStock
  }) ;

  await newProductCreated.save();
  res.status(200).json({
    success:true,
    message:newProductCreated,
  })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"error"
        })
    }
}

//fetch  all product
const fetchAllProduct =async (req,res)=>{
    try{
   const listOfProduct = await Product.find({});
   res.status(200).json({
    success:true,
    data:listOfProduct,
   })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"error"
        })
    }
} 

//edit a product
const editProduct =async (req,res)=>{
    try{
        const {id}=req.params;
        const{ image,author,title,bookcondition,language,description,category,price,totalStock} =req.body;

        const findProduct = await Product.findById(id);
        if(!findProduct) return res.status(404).json({
            success:false,
            message:"product not found"
        })

        findProduct.title = title || findProduct.title;
        findProduct.author = author || findProduct.author;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.price = price || findProduct.price;
        findProduct.bookcondition = bookcondition || findProduct.bookcondition;
        findProduct.language = language || findProduct.language;
        findProduct.totalStock = totalStock || findProduct.totalStock;
         
        await findProduct.save();
             
        res.status(200).json({
            success:true,
            data:findProduct
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"error"
        })
    }
}

//delete a product
const deleteProduct =async (req,res)=>{
    try{
        const {id} =req.params;
        const product = await Product.findByIdAndDelete(id);

        if(!product) return res.status(404).json({
            success:false,
            message:"product not found"
        })

        res.status(200).json({
             success:true,
            message:"Product Deleted successfully"
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"error"
        })
    }
}


module.exports ={ handleImageUpload,addProduct,fetchAllProduct,editProduct,deleteProduct};