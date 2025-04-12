const express = require('express');

const {fetchAllAdress
    ,addAddress,
    deleteAddress
    ,editAddress}=require('../../controllers/User/AddressController');

const router = express.Router();
    

 router.post('/add',addAddress)
 router.get('/get/:userId',fetchAllAdress)
 router.put('/update/:userId/:addressId',editAddress)
 router.delete('/delete/:userId/:addressId',deleteAddress)

module.exports =router;