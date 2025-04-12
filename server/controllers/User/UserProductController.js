
const Product = require("../../models/product");


const getFilteredProducts = async (req, res) => {
    try{

        const {bookcondition ="", author ="", language ="", sortBy="price-lowtohigh",category=''} = req.query;

        let filter = {};
        if (bookcondition.length > 0) {
            filter.bookcondition = {$in: bookcondition.split(',') };
        }
        
        if (author.length > 0) {
            filter.author = {$in: author.split(',') };
        }
        
        if (language.length > 0) {
            filter.language = { $in: language.split(',') };  // Fix typo here from 'lan
        }

        if (category.length > 0) {
            filter.category = { $in: category.split(',') };  // ✅ Add category filtering
        }
        
        // console.log("Received Query Params:", req.query);
        // console.log("Generated Filter:", filter);


        let sort = {};

        switch(sortBy){
            case "price-lowtohigh":
                sort.price = 1;
                break;
            case "price-hightolow":
                sort.price = -1;
                break;
             case "newest":
                    sort.createdAt = -1;
                    break;
            case "oldest":
                    sort.createdAt = 1;
                    break;
                
            default:
                sort.price = 1;
                break;
        }

     

        const products = await Product.find(filter).sort(sort);

        res.status(200).json({
            success: true,
            message: products,
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
             success: false,
             message: "Internal server error"});
    }
}

const getProductDetail = async (req,res)=>{
try{

    const {id}=req.params;
    const product  = await Product.findById(id);

    if(!product) return res.status(400).json({
        message:'product not found',
        success:false,
    })

    res.status(200).json({
        success:true,
        data:product,
    })

}catch(err){
    console.log(err);
    res.status(500).json({
         success: false,
         message: "Internal server error"});
}
}

module.exports ={getFilteredProducts,getProductDetail};