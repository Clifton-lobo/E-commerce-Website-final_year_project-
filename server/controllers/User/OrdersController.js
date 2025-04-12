const paypal = require('../../helpers/paypal');
const Order = require('../../models/Order');

const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId
        } = req.body;

        const create_payment_json = {
            intent: "sale", // ✅ Fixed issue
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: "http://localhost:5173/user/paypal-return",
                cancel_url: "http://localhost:5173/user/paypal-cancel"
            },
            transactions: [ // ✅ Fixed key name
                {
                    item_list: {
                        items: cartItems.map(item => ({
                            name: item.title,
                            sku: item.productId,
                            price: item.price.toFixed(2),
                            currency: "USD",
                            quantity: item.quantity
                        }))
                    },
                    amount: {
                        currency: "USD",
                        total: totalAmount.toFixed(2)
                    },
                    description: "description"
                }
            ]
        };

        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: "Error while creating PayPal payment"
                });
            }

            // ✅ Order instance should be created outside callback
            const newlyCreated = new Order({
                userId,
                cartItems,
                addressInfo,
                orderStatus,
                paymentMethod,
                paymentStatus,
                totalAmount,
                orderDate,
                orderUpdateDate,
                paymentId,
                payerId
            });

            await newlyCreated.save();

            // ✅ Check if approval URL exists before using it
            const approvalURL = paymentInfo?.links?.find(link => link.rel === "approval_url")?.href;
            if (!approvalURL) {
                return res.status(500).json({
                    success: false,
                    message: "Approval URL not found"
                });
            }

            res.status(201).json({
                success: true,
                approvalURL,
                orderId: newlyCreated._id
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Some error occurred",
            success: false
        });
    }
};

const capturePayment = async (req, res) => {
    try {
        // Capture payment logic here
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Some error occurred",
            success: false
        });
    }
};

module.exports = { capturePayment, createOrder }; // ✅ Fixed typo
