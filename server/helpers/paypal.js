const paypal = require('paypal-rest-sdk');

paypal.configure({
    mode:'sandbox',
    client_id: "AXZj0zRBemRpqDAL09k7rjd0tZYtTaW-MkqFtAunoy71uV4ANu4xODGMWn72EMyq-rma5RvFCs9eYPEK",

    client_secret:
    "EHD9Naimgftux93QuLUZccNuoyVUD5VABwFVmtR_G8s1JQ9vbkITb7OqdMxtDTUnPYF6dZgFPDnNK065",
})

module.exports = paypal;