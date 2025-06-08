const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AuthRouter = require('./routes/Auth_Routes/AuthRoutes')
const adminProductsRouter = require('./routes/admin/productRoutes')
const searchRoutes = require('./routes/user/SearchRoutes')
const adminOrderRoutes = require('./routes/admin/orderRoutesAdmin') 

const UserProductRouter = require('./routes/user/UserProduct')
const CartRouter = require('./routes/user/CartRoutes')
const userAddressRouter = require('./routes/user/AddressRoutes')
const OrderRoutes = require('./routes/user/OrderRoutes')
const routeLogger = require('./middleWare/routeLogger')

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
app.use(routeLogger);
app.use(express.urlencoded({extended:true}))
app.use('/api/auth',AuthRouter)
app.use('/api/admin/products',adminProductsRouter)
app.use('/api/user/products',UserProductRouter)
app.use('/api/user/cart',CartRouter)
app.use('/api/user/address',userAddressRouter)
app.use('/api/user/search',searchRoutes)
app.use('/api/admin/order',adminOrderRoutes)

// In your main server file
app.use('/api/user/order', OrderRoutes);

// Add this after all routes to debug 404s
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

app.use((req, res) => {
  console.log('Route not found:', req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT,()=>console.log(`port is running on ${PORT}`));

