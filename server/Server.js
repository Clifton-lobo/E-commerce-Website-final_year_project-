const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AuthRouter = require('./routes/Auth_Routes/AuthRoutes')
const adminProductsRouter = require('./routes/admin/productRoutes')
const UserProductRouter = require('./routes/user/UserProduct')
const CartRouter = require('./routes/user/CartRoutes')
const userAddressRouter = require('./routes/user/AddressRoutes')
const OrderRoutes = require('./routes/user/OrderRoutes')
const searchRoutes = require('./routes/user/SearchRoutes')

 mongoose.connect('mongodb+srv://cliftonfit2223:cliftonfit2223@cliftoncluster0000.ejhwl.mongodb.net/')
  .then(()=>console.log('Mongo DB connected'))
  .catch((error)=>console.log(error));



 const app =express()
 const PORT =process.env.PORT || 5000;

app.use(
    cors({
        origin:'http://localhost:5173',
        methods:['GET','POST','DELETE','PUT'],
        allowedHeaders:[
            "Content-Type",
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials:true
    })

);
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth',AuthRouter)
app.use('/api/admin/products',adminProductsRouter)
app.use('/api/user/products',UserProductRouter)
app.use('/api/user/cart',CartRouter)
app.use('/api/user/address',userAddressRouter)
app.use('/api/user/order',OrderRoutes)
app.use('/api/user/search',searchRoutes)

app.listen(PORT,()=>console.log(`port is running on ${PORT}`));

