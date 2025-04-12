const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name:'dbgldur3y',
    api_key:'469196274927369',
    api_secret:'W-oNp8alsGqDnAv-NlRfBnLpDrc'
})

const storage = new multer.memoryStorage();
      
async function ImageUploadUtils(file) {
    const result = await cloudinary.uploader.upload(file,{
        resource_type:'auto'
    })

    return result;
}

const upload = multer({storage});

module.exports={upload,ImageUploadUtils};