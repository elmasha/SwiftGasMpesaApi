const express = require('express')
const request = require('request')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const apiCallFromRequest = require('./Request')
const apiCallFromNode = require('./nodeCalls');
const Ofirebase = require("./firebase/setData");
var flash = require('connect-flash');
var session = require('express-session')
const db = require("./firebase/firebase_connect");



// with ES Modules (if using client-side JS, like React)


const port = app.listen(process.env.PORT || 4334);
const _urlencoded = express.urlencoded({ extended: false })
app.use(cors())
app.use(express.json())
app.use(express.static('public'));
app.use(flash());

//----Order Variable----/////
    var userName = '';
    let _checkoutRequestId2;
    let order_ID;
    let _category,_customer_no,_customer_name,_item_desc ,_item_image,_name,_order_status,_payment_method,_price,_quantity,_rated,_shop_name,_shop_no,_user_id,_user_image,_vendor_id,_vendor_name,_time_stamp,_lat,_lng;

///-----Wallet variable ----////

let _username ,_phoneNumber, _accountno,_transactiontype,_transactiondesc,_amount ,_previousamout,_currentbalance,_paymentid,_userid,_checkoutRequestId5,_balance,_deposit;


///-----Activate variable ----////

let _userActivateID,_phoneNumberActivate,_amountActivate,_usernameActivate,_checkoutRequestId6;




////---------Allow Access origin -----///
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://gasmpesa.herokuapp.com");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    res.locals.top = order_ID;
    next();
  });

//routes
app.get('/', (req, res,next)=>{

res.send("Hello welcome to SwiftGas Mpesa API")


})



///----Access Token ---//
app.get('/access_token',access,(req,res)=>{

    res.status(200).json({access_token: req.access_token})

})



///----Stk Push ---//
app.post('/stk', access, _urlencoded,function(req,res){

    let _phoneNumber = req.body.phone
    let _Amount = req.body.amount
    
    let userID = req.body.user_ID
    userName = req.body.userName
    let _transDec = req.body.transDec;
     _checkoutRequestId2 ="";
    _order_ID = req.body.orderID;
     _lat = req.body.lat;
     _lng = req.body.lng;
     _category = req.body.Category;
     _price = req.body.Price;
     _customer_name = req.body.Customer_name;
     _customer_no = req.body.Customer_No;
     _user_id = req.body.User_id;
     _vendor_name = req.body.Vendor_Name;
     _vendor_id = req.body.Vendor_ID;
     _name = req.body.Name;
     _item_image = req.body.Item_image;
     _item_desc = req.body.Item_desc;
     _order_status = req.body.Order_status;
     _payment_method = req.body.Payment_method;
     _quantity = req.body.Quantity;
     _rated = req.body.Rated;
     _shop_name = req.body.Shop_Name;
     _shop_no = req.body.Shop_No;
     _user_image = req.body.User_image;
     _time_stamp = req.body.timestamp;
     


    let endpoint = " https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    let auth = "Bearer "+ req.access_token

    let _shortCode = '4069571';
    let _passKey = '8e2d5d66120bfb538400be31f2fa885e90ef3acb5bc037454bbf23223fcb394a'
   



    console.log("phone",_phoneNumber)
    console.log("amount",_Amount)
    console.log("userName",userName)
    console.log("orderID",_order_ID)
    console.log("lat",_lat)
    console.log("lng",_lng)
    console.log("UID",_user_id)

    
      
    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = 
    Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64');

    request(
        {
            url:endpoint,
            method:"POST",
            headers:{
                "Authorization": auth
            },
    
        json:{
    
                    "BusinessShortCode": "4069571",
                    "Password": password,
                    "Timestamp": timeStamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": _Amount,
                    "PartyA": _phoneNumber,
                    "PartyB": "4069571", //Till  No.
                    "PhoneNumber": _phoneNumber,
                    "CallBackURL": "https://gasmpesa.herokuapp.com/stk_callback",
                    "AccountReference": "SwiftGas digital Merchants",
                    "TransactionDesc": _transDec

            }

        },
       (error,response,body)=>{

            if(error){

                
                console.log(error);
                res.status(404).json(error);

            }else{
                
                res.status(200).json(body);
                _checkoutRequestId2 = body.CheckoutRequestID;
                console.log(body);
                console.log(_checkoutRequestId2)
                

            }
               

        })

});


const middleware = (req, res, next) => {

    req.name = _order_ID;
    req.checkoutID = _checkoutRequestId2;
    req.uid = _user_id;
    req.name2 = _name;
    req.category = _category;
    req.customerNo = _customer_no;
    req.customerName = _customer_name;
    req.itemDesc = _item_desc;
    req.itemImage = _item_image;
    req.orderStatus = _order_status;
    req.paymentMethod = _checkoutRequestId2;
    req.price = _price;
    req.quantiy = _quantity;
    req.rated = _rated;
    req.shopName = _shop_name;
    req.shopNo = _shop_no;
    req.userImage = _user_image;
    req.vendorId = _vendor_id;
    req.vendorName = _vendor_name;
    req.latt = _lat;
    req.lngg = _lng;
    
    next();
  };
  


//-----Callback Url ----///
app.post('/stk_callback',_urlencoded,middleware,function(req,res,next){
    const payarray = [];
    var transID ='';
    var amount = '';
    var transdate = '';
    var transNo = '';
    let id = req.name;
    let Userid = req.uid;
    let _checkoutID = req.checkoutID;
    let _Name = req.name2;
    let _Category = req.category;
    let _CustomerNo = req.customerNo;
    let _CustomerName = req.customerName;
    let _ItemDesc = req.itemDesc;
    let _ItemImage = req.itemImage;
    let _PaymentMethod = req.paymentMethod;
    let _Price = req.price;
    let _Quantity = req.quantiy;
    let _Rated = req.rated;
    let _ShopName = req.shopName;
    let _ShopNo = req.shopNo;
    let _UserImage = req.userImage;
    let _VendorId = req.vendorId;
    let _VendorName = req.vendorName;
    let _Lat = req.latt;
    let _Lng = req.lngg;
    let _OrderStatus =  req.orderStatus;
    

    console.log('.......... STK Callback ..................');
    if(res.status(200)){

        console.log("ID",id)
        console.log("CheckOutId",_checkoutID)

        res.json((req.body.Body.stkCallback.CallbackMetadata))
        console.log(req.body.Body.stkCallback.CallbackMetadata)

        
        amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
        transID = req.body.Body.stkCallback.CallbackMetadata.Item[1].Value;
        transNo = req.body.Body.stkCallback.CallbackMetadata.Item[4].Value;
        transdate = req.body.Body.stkCallback.CallbackMetadata.Item[3].Value;
        
       
        console.log("Amount",amount)
        console.log("Transaction",transID)
        console.log("Transaction",transNo)
        console.log("TransactionTime",transdate)

    

        db.collection("Payments_backup").doc(transID).set({
            mpesaReceipt : transID ,
            paidAmount : amount,
            transNo : transNo ,
            Doc_ID: id,
            checkOutReqID : _checkoutID,
            user_Name: userName,
            timestamp : transdate,
            User_id : Userid,
        }).then((ref) => {
            console.log("Added doc with ID: ", transID);
        });



        db.collection("Order_request").doc(id).set({
            mpesaReceipt : transID,
            doc_id: id,
            User_id : Userid,
            mpesaReceipt : transID ,
            Category: _Category,
            Vendor_ID : _VendorId,
            Item_image : _ItemImage ,
            Price: _Price,
            Name: _Name,
            Item_desc : _ItemDesc,
            Customer_name: _CustomerName,
            Customer_No : _CustomerNo,
            User_image : _UserImage ,
            Quantity: _Quantity,
            lat: _Lat,
            lng: _Lng ,
            Order_status: _OrderStatus,
            Payment_method : _PaymentMethod,
            Rated : _Rated,
            Vendor_Name: _VendorName,
            Shop_Name : _ShopName,
            Shop_No : _ShopNo ,
            timestamp : new Date(),
        }).then((ref) => {

            console.log("Order added doc with ID: ", id);
        });
        
    }else if(res.status(404)){
        res.json((req.body))
        console.log(req.body.Body);
    }

    next()

    })



///----STK QUERY ---
app.post('/stk/query',access,_urlencoded,function(req,res,next){

    let _checkoutRequestId = req.body.checkoutRequestId

    auth = "Bearer "+ req.access_token

    let endpoint =' https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
    const _shortCode = '4069571'
    const _passKey = '8e2d5d66120bfb538400be31f2fa885e90ef3acb5bc037454bbf23223fcb394a'
    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)
    const password = Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64')
    

    request(
        {
            url:endpoint,
            method:"POST",
            headers:{
                "Authorization": auth
            },
           
        json:{
    
            'BusinessShortCode': _shortCode,
            'Password': password,
            'Timestamp': timeStamp,
            'CheckoutRequestID': _checkoutRequestId

            }

        },
        function(error,response,body){

            if(error){

                console.log(error);
                res.status(404).json(body);

            }else{
                res.status(200).json(body)
                console.log(body)
                next()
            }

        })

})












/////------Remit MPESA STK --------///

let _payname,_paycash,_payphone,_paytype,_paytrips,_payid,_checkoutRequestId7,_payuserid,
_payusername;

///----Stk Push ---//
app.post('/stkRemit', access, _urlencoded,function(req,res){

    _payphone = req.body.phone;
    _paycash = req.body.amount;
    _payuserid = req.body.User_ID;
   _username = req.body.User_name;
   let _transDec = req.body.transDec;
    _payid = req.body.Payment_ID;
    _paytype = req.body.Type;
    _payusername= req.body.User_name;
    _paytrips = req.body.Trips;
    _payname = req.body.Name;

   let endpoint = " https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
   let auth = "Bearer "+ req.access_token

   let _shortCode = '4069571';
   let _passKey = '8e2d5d66120bfb538400be31f2fa885e90ef3acb5bc037454bbf23223fcb394a'
  

   console.log("phone",_payphone)
   console.log("amount",_paycash)
   console.log("userName",_payusername)
   console.log("RemitID",_payid)
   console.log("UID",_payuserid)

   
     
   const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
   const password = 
   Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64');

   request(
       {
           url:endpoint,
           method:"POST",
           headers:{
               "Authorization": auth
           },
   
       json:{
   
                   "BusinessShortCode": "4069571",
                   "Password": password,
                   "Timestamp": timeStamp,
                   "TransactionType": "CustomerPayBillOnline",
                   "Amount": _paycash,
                   "PartyA": _payphone,
                   "PartyB": "4069571", //Till  No.
                   "PhoneNumber": _payphone,
                   "CallBackURL": "https://gasmpesa.herokuapp.com/stk_callbackRemit",
                   "AccountReference": "SwiftGas digital Merchants",
                   "TransactionDesc": _transDec

           }

       },
      (error,response,body)=>{

           if(error){

               console.log(error);
               res.status(404).json(error);

           }else{
               
               res.status(200).json(body);
               _checkoutRequestId7 = body.CheckoutRequestID;
               console.log(body);
               console.log(_checkoutRequestId7)
               

           }
              

       })

});

const middleware4 = (req, res, next) => {
   req.payidd = _payid;
   req.paycheckoutid = _checkoutRequestId7;
   req.payusername = _payusername;
   req.payname = _payname;
   req.payUserid = _payuserid;
   req.payamount = _paycash;
   req.paytype = _paytype;
   req.payno = _payphone;
   req.paytrips = _paytrips;
   next();
 };
 
//-----Callback Url ----///
app.post('/stk_callbackRemit',_urlencoded,middleware4,function(req,res,next){
   const payarray = [];
   var transID ='';
   var amount = '';
   var transdate = '';
   var transNo = '';
   let _PayUserId = req.payUserid;
   let _PayCheckoutID = req.paycheckoutid;
   let _PayUsername = req.payusername;
   let _PayID = req.payidd;
   let _PayType = req.paytype;
   let _PaymentName = req.payname;
   let _PayAmount = req.payamount;
   let _PayTrips = req.paytrips;
   let _PayPhone = req.payno;


   console.log('.......... STK Remit callback ..................');
   if(res.status(200)){

       console.log("ID",_PayUserId)
       console.log("CheckOutRequestID",_PayCheckoutID)

       res.json((req.body.Body.stkCallback.CallbackMetadata))
       console.log(req.body.Body.stkCallback.CallbackMetadata)

       
       amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
       transID = req.body.Body.stkCallback.CallbackMetadata.Item[1].Value;
       transNo = req.body.Body.stkCallback.CallbackMetadata.Item[4].Value;
       transdate = req.body.Body.stkCallback.CallbackMetadata.Item[3].Value;
       
      
       console.log("Amount",_PayAmount)
       console.log("Transaction",transID)
       console.log("Transaction",transNo)
       console.log("TransactionTime",transdate)

   
      
       var batch = db.batch();
       var batch2 = db.batch();

       var boost = db.collection("Gas_Vendor").doc(_PayUserId);
       var boost2 = db.collection("Payment_History").doc(_PayID);

       batch.update(boost,{"Activation_fee":150});
       batch.update(boost,{"Cash_Trips":0});
       batch.update(boost,{"Earnings":0});

       batch.commit().then((ref) =>{
           console.log("Batch complete: ", transID);

           batch2.set(boost2,{
            Name:  _PaymentName,
            Amount: _PayAmount,
            PhoneNo: _PayPhone,
            Type: _PayType,
            User_ID: _PayUserId,
            timestamp: new Date(),
            User_name: _PayUsername,
            Payment_ID: _PayID,
            MpesaCheckout_ID: _PayCheckoutID,
            mpesaReceipt: transID,
            Trips:_PayTrips,
       });
   
           batch2.commit().then((ref) =>{
               console.log("Printed successfully: ", _PayID);

               db.collection("Notifications").doc(_PayID).set({
                Name : _PaymentName,
                User_ID : _PayUserId,
                type : _PayType,
                Order_iD: _PayID,
                to : _PayUserId,
                from: _PayUserId,
                timestamp : new Date(),
            }).then((ref) => {
                console.log("Notification set with ID: ", _PayID);
            });

            
               db.collection("Payments_backup").doc(transID).set({
                   mpesaReceipt : transID ,
                   paidAmount : _PayAmount,
                   transNo : _PayPhone ,
                   Doc_ID: _PayID,
                   checkOutReqID : _PayCheckoutID,
                   user_Name: _PayUsername,
                   timestamp : transdate,
                   User_id : _PayUserId,
               }).then((ref) => {
                   console.log("Payment BackUP with ID: ", transID);
               });
   
           });
   

       });

     
       }else if(res.status(404)){
       res.json((req.body))
       console.log(req.body.Body);
   }

   next()

   })


///----STK QUERY ---
app.post('/stkRemit/query',access,_urlencoded,function(req,res,next){

   let _checkoutRequestId = req.body.checkoutRequestId

   auth = "Bearer "+ req.access_token

   let endpoint =' https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
   const _shortCode = '4069571'
   const _passKey = '8e2d5d66120bfb538400be31f2fa885e90ef3acb5bc037454bbf23223fcb394a'
   const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)
   const password = Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64')
   

   request(
       {
           url:endpoint,
           method:"POST",
           headers:{
               "Authorization": auth
           },
          
       json:{
   
           'BusinessShortCode': _shortCode,
           'Password': password,
           'Timestamp': timeStamp,
           'CheckoutRequestID': _checkoutRequestId

           }

       },
       function(error,response,body){

           if(error){

               console.log(error);
               res.status(404).json(body);

           }else{
               res.status(200).json(body)
               console.log(body)
               next()
           }

       })

})







/////------DEPOSIT MPESA STK --------///

///----Stk Push ---//
app.post('/stkDeposit', access, _urlencoded,function(req,res){

     _phoneNumber = req.body.phone;
     _amount = req.body.amount;
     _userid = req.body.user_ID;
    _username = req.body.User_name;
    let _transDec = req.body.transDec;
     _checkoutRequestId5 = req.body.checkReqId;
     _paymentid = req.body.Payment_ID;
     _accountno = req.body.accountNO;
     _transactiontype = req.body.transaction_type;
     _transactiondesc = req.body.transaction_desc;
     _previousamout = req.body.previousAmount;
     _balance = req.body.balance;
     _deposit = req.body.deposit;



    let endpoint = " https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    let auth = "Bearer "+ req.access_token

    let _shortCode = '4069571';
    let _passKey = '8e2d5d66120bfb538400be31f2fa885e90ef3acb5bc037454bbf23223fcb394a'
   



    console.log("phone",_phoneNumber)
    console.log("amount",_amount)
    console.log("userName",_username)
    console.log("orderID",_paymentid)

    
      
    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = 
    Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64');

    request(
        {
            url:endpoint,
            method:"POST",
            headers:{
                "Authorization": auth
            },
    
        json:{
    
                    "BusinessShortCode": "4069571",
                    "Password": password,
                    "Timestamp": timeStamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": _amount,
                    "PartyA": _phoneNumber,
                    "PartyB": "4069571", //Till  No.
                    "PhoneNumber": _phoneNumber,
                    "CallBackURL": "https://gasmpesa.herokuapp.com/stk_callbackDeposit",
                    "AccountReference": "SwiftGas digital Merchants",
                    "TransactionDesc": _transDec

            }

        },
       (error,response,body)=>{

            if(error){

                
                console.log(error);
                res.status(404).json(error);

            }else{
                
                res.status(200).json(body);
                _checkoutRequestId5 = body.CheckoutRequestID;
                console.log(body);
                console.log(_checkoutRequestId5)
                

            }
               

        })

});

const middleware2 = (req, res, next) => {
    req.payid = _paymentid;
    req.checkoutid = _checkoutRequestId5;
    req.username = _username;
    req.accountno = _accountno;
    req.transactiontype = _transactiontype;
    req.transactiondesc = _transactiondesc
    req.amounT = _amount;
    req.previousamount = _previousamout;
    req.userid = _userid;
    req.depositt = _deposit;
    req.number = _phoneNumber;  
    next();
  };
  
//-----Callback Url ----///
app.post('/stk_callbackDeposit',_urlencoded,middleware2,function(req,res,next){
    const payarray = [];
    var transID ='';
    var amount = '';
    var transdate = '';
    var transNo = '';
    let id = req.userid;
    let _CheckoutID = req.checkoutid;
    let _Username = req.username;
    let _AccountNo = req.accountno;
    let _Transtype = req.transactiontype;
    let _Transadesc = req.transactiondesc;
    let _amountt = req.amounT;
    let _Paymentid = req.payid;
    let _Deposit = req.depositt;
    let _Number = req.number;



    console.log('.......... STK deposit callback ..................');
    if(res.status(200)){

        console.log("ID",id)
        console.log("CheckOutRequestID",_CheckoutID)

        res.json((req.body.Body.stkCallback.CallbackMetadata))
        console.log(req.body.Body.stkCallback.CallbackMetadata)

        
        amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
        transID = req.body.Body.stkCallback.CallbackMetadata.Item[1].Value;
        transNo = req.body.Body.stkCallback.CallbackMetadata.Item[4].Value;
        transdate = req.body.Body.stkCallback.CallbackMetadata.Item[3].Value;
        
       
        console.log("Amount",amount)
        console.log("Transaction",transID)
        console.log("Transaction",transNo)
        console.log("TransactionTime",transdate)

    
        let totalamount = _balance + _Deposit;
        let previous = totalamount;
        var currentbalance = _balance;
        var batch = db.batch();
        var batch2 = db.batch();

        var boost = db.collection("MGas_Client").doc(id);
        var boost2 = db.collection("Wallet_Transaction").doc(_Paymentid);

        batch.update(boost,{"Swift_wallet":totalamount});

        batch.commit().then((ref) =>{
            console.log("Batch complete: ", transID);


            batch2.set(boost2,{ accountNO: _AccountNo,
            transaction_type:_Transtype,
            transaction_desc:_Transadesc,
            amount:_amountt,
            previousAmount:previous.toString(),
            currentBalance:currentbalance.toString(),
            timestamp: new Date(),
            Payment_ID:_Paymentid,
            User_Id:id,
            mpesaReceipt:transID,
            User_name:_Username,
        });
    
            batch2.commit().then((ref) =>{
                console.log("Printed successfully: ", _Paymentid);



                db.collection("Payments_backup").doc(transID).set({
                    mpesaReceipt : transID ,
                    paidAmount : _amount,
                    transNo : _Number ,
                    Doc_ID: _Paymentid,
                    checkOutReqID : _CheckoutID,
                    user_Name: _Username,
                    timestamp : transdate,
                    User_id : id,
                }).then((ref) => {
                    console.log("Payment BackUP with ID: ", transID);
                });
    
            });
    


            

        });

      
        }else if(res.status(404)){
        res.json((req.body))
        console.log(req.body.Body);
    }

    next()

    })


///----STK QUERY ---
app.post('/stkDeposit/query',access,_urlencoded,function(req,res,next){

    let _checkoutRequestId = req.body.checkoutRequestId

    auth = "Bearer "+ req.access_token

    let endpoint =' https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
    const _shortCode = '4069571'
    const _passKey = '8e2d5d66120bfb538400be31f2fa885e90ef3acb5bc037454bbf23223fcb394a'
    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)
    const password = Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64')
    

    request(
        {
            url:endpoint,
            method:"POST",
            headers:{
                "Authorization": auth
            },
           
        json:{
    
            'BusinessShortCode': _shortCode,
            'Password': password,
            'Timestamp': timeStamp,
            'CheckoutRequestID': _checkoutRequestId

            }

        },
        function(error,response,body){

            if(error){

                console.log(error);
                res.status(404).json(body);

            }else{
                res.status(200).json(body)
                console.log(body)
                next()
            }

        })

})





/////------ACTIVATE MPESA STK --------///

///----Stk Push ---//
app.post('/stkActivate', access, _urlencoded,function(req,res){

    _phoneNumberActivate = req.body.phone;
    _amountActivate = req.body.amount;
    _userActivateID = req.body.Uid;
   _usernameActivate = req.body.User_name;
   let _transDec = req.body.transDec;



  
  


   let endpoint = " https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
   let auth = "Bearer "+ req.access_token

   let _shortCode = '4069571';
   let _passKey = '8e2d5d66120bfb538400be31f2fa885e90ef3acb5bc037454bbf23223fcb394a'
  



   console.log("phone",_phoneNumberActivate)
   console.log("amount",_amountActivate)
   console.log("userName",_usernameActivate)
   console.log("orderID",_userActivateID)

   
     
   const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
   const password = 
   Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64');

   request(
       {
           url:endpoint,
           method:"POST",
           headers:{
               "Authorization": auth
           },
   
       json:{
   
                   "BusinessShortCode": "4069571",
                   "Password": password,
                   "Timestamp": timeStamp,
                   "TransactionType": "CustomerPayBillOnline",
                   "Amount": _amountActivate,
                   "PartyA": _phoneNumberActivate,
                   "PartyB": "4069571", //Till  No.
                   "PhoneNumber": _phoneNumberActivate,
                   "CallBackURL": "https://gasmpesa.herokuapp.com/stk_callbackActivate",
                   "AccountReference": "SwiftGas digital Merchants",
                   "TransactionDesc": _transDec

           }

       },
      (error,response,body)=>{

           if(error){

               
               console.log(error);
               res.status(404).json(error);

           }else{
               
               res.status(200).json(body);
               _checkoutRequestId6 = body.CheckoutRequestID;
               console.log(body);
               console.log(_checkoutRequestId6)
               

           }
              

       })

});


const middleware3 = (req, res, next) => {
   req.checkoutid = _checkoutRequestId6;
   req.username = _usernameActivate;
   req.amounT = _amountActivate;
   req.userid = _userActivateID;
   req.number = _phoneNumberActivate;  
   next();
 };
 


//-----Callback Url ----///
app.post('/stk_callbackActivate',_urlencoded,middleware3,function(req,res,next){
   const payarray = [];
   var transID ='';
   var amount = '';
   var transdate = '';
   var transNo = '';
   let id = req.userid;
   let _CheckoutID = req.checkoutid;
   let _Username = req.username;
   let _amountt = req.amounT;
   let _Number = req.number;



   console.log('.......... STK activate callback ..................');
   if(res.status(200)){

       console.log("ID",id)
       console.log("CheckOutRequestID",_CheckoutID)

       res.json((req.body.Body.stkCallback.CallbackMetadata))
       console.log(req.body.Body.stkCallback.CallbackMetadata)

       
       amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
       transID = req.body.Body.stkCallback.CallbackMetadata.Item[1].Value;
       transNo = req.body.Body.stkCallback.CallbackMetadata.Item[4].Value;
       transdate = req.body.Body.stkCallback.CallbackMetadata.Item[3].Value;
       
      
       console.log("Amount",_amountt)
       console.log("Transaction",transID)
       console.log("Transaction",_Number)
       console.log("TransactionTime",transdate)

       var batch = db.batch();
       var boost = db.collection("Gas_Vendor").doc(id);

       batch.update(boost,{"Activation_fee":150});

       batch.commit().then((ref) =>{
           console.log("Batch complete: ", transID);

               db.collection("Payments_backup").doc(transID).set({
                   mpesaReceipt : transID ,
                   paidAmount : _amountt,
                   transNo : _Number ,
                   Doc_ID: id,
                   checkOutReqID : _CheckoutID,
                   user_Name: _Username,
                   timestamp : transdate,
                   User_id : id,
               }).then((ref) => {
                   console.log("Payment BackUP with ID: ", transID);
               });
   
        

       });

     
       }else if(res.status(404)){
       res.json((req.body))
       console.log(req.body.Body);
   }

   next()

   })





///----STK QUERY ---
app.post('/stkActivate/query',access,_urlencoded,function(req,res,next){

   let _checkoutRequestId = req.body.checkoutRequestId

   auth = "Bearer "+ req.access_token

   let endpoint =' https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
   const _shortCode = '4069571'
   const _passKey = '8e2d5d66120bfb538400be31f2fa885e90ef3acb5bc037454bbf23223fcb394a'
   const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3)
   const password = Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64')
   

   request(
       {
           url:endpoint,
           method:"POST",
           headers:{
               "Authorization": auth
           },
          
       json:{
   
           'BusinessShortCode': _shortCode,
           'Password': password,
           'Timestamp': timeStamp,
           'CheckoutRequestID': _checkoutRequestId

           }

       },
       function(error,response,body){

           if(error){

               console.log(error);
               res.status(404).json(body);

           }else{
               res.status(200).json(body)
               console.log(body)
               next()
           }

       })

})








///-----B2c -----///
app.post('/b2c', access,_urlencoded, function(req,res,next){

    let endpoint = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest"

    let auth = "Bearer "+ req.access_token,

     _securityCredetilas = "M2u8U9vXuDaG/aahaOl5vEf1YU0zLvOMX3PxhzS+oqhx/YTm0VFCpjzC+z1fZPbtD2RmbvsWhCoU/uDC2GE1V8lyaLuokRXBZkDYqSF/hkp87vYWLI/lhaazLiCuIrLfV3SxIg/afEmKawLmgSRPw61AJJupvcvR3KVpdgfLBDCvBwifbPetDyHHg3HeQrkiNSEXZbgHuk+VEy0TXhOmG6aPhGvFsHOy/szbBh8xeaU7S/ZuC56n9ZHFMHA1Eime2C9qNIkNU7n2EW6hrEfIFquPJl8co5jcq8PKvWhT3xhPqBbLwLeY8vqyYyVS0T6pMaRgepkvmQdYdVnbh/aeUw=="
    
     let _phoneNumber = req.body.phone
     let _Amount = req.body.amount
     


    console.log("phone",req.body.user_ID)
    console.log("amount",req.body.user_ID)

    request(
        {
            url:endpoint,
            method :"POST",
            headers:{
            "Authorization": auth
                
            },
            json:{
        
                "InitiatorName":"testapi481",
                "SecurityCredential":_securityCredetilas,
                "CommandID":"BusinessPayment",
                "Amount":_Amount,
                "PartyA":"600481",
                "PartyB":_phoneNumber,
                "Remarks":"Salary Payment",
                "QueueTimeOutURL":"http://gasmpesa.herokuapp.com/timeout_url",
                "ResultURL":"http://gasmpesa.herokuapp.com/result_url",
                "Occasion":"MpesaApi001 "

            }
        
        },
        function(error,response,body){
            if(error){
                console.log(error);
                res.status(404);
            }

                res.status(200).json(body)
                console.log(body)

        }
    )


})


app.post('/timeout_url',_urlencoded, function(req, res) {
    console.log('.......... Timeout ..................')
    var _body = req.body;

    console.log(_body)
    res.status(200).json((req.body))

})

app.post('/result_url', _urlencoded, function(req, res) {
    console.log('.......... Results..................')
    var _body = req.body;

    console.log((req.body))
    res.status(200).json((req.body))
})



///-------Reversals ----///////
app.get('/reverse', access,_urlencoded, function (req, res) {
    const url = 'https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request',
        auth = 'Bearer ' + req.access_token

        request({
            method: "POST",
            url: url,
            headers: {
                "Authorization": auth
            },
            json: {
                "Initiator": "apitest342",
                "SecurityCredential":"Q9KEnwDV/V1LmUrZHNunN40AwAw30jHMfpdTACiV9j+JofwZu0G5qrcPzxul+6nocE++U6ghFEL0E/5z/JNTWZ/pD9oAxCxOik/98IYPp+elSMMO/c/370Joh2XwkYCO5Za9dytVmlapmha5JzanJrqtFX8Vez5nDBC4LEjmgwa/+5MvL+WEBzjV4I6GNeP6hz23J+H43TjTTboeyg8JluL9myaGz68dWM7dCyd5/1QY0BqEiQSQF/W6UrXbOcK9Ac65V0+1+ptQJvreQznAosCjyUjACj35e890toDeq37RFeinM3++VFJqeD5bf5mx5FoJI/Ps0MlydwEeMo/InA==",
                "CommandID":"TransactionReversal",
                "TransactionID":"NLJ11HAY8V",
                "Amount":"100",
                "ReceiverParty":"601342",
                "RecieverIdentifierType":"11",
                "ResultURL":"https://gasmpesa.herokuapp.com/reverse_result_url",
                "QueueTimeOutURL":"https://gasmpesa.herokuapp.com/reverse_timeout_url",
                "Remarks":"Wrong Num",
                "Occasion":"sent wrongly"
            }
        },
            function (error, response, body) {
                if (error) {
                    console.log(error)
                }
                else {
                    res.status(200).json(body)
                }
            }
        )
})




//----Register Url ------///
app.get('/Register_urls',access,(res,req,next)=>{

    let endpoint = "http://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer "+ req.access_token

    request(
        {
            url:endpoint,
            method :"POST",
            headers :{
                "Authorization": auth
            },
            json:{
      "ShortCode":"600481",
      "ResponseType":"Complete",
      "ConfirmationURL":"http://gasmpesa.herokuapp.com/confirmation",
      "ValidationURL":"http://gasmpesa.herokuapp.com/validation_url"
            }
        },
        function(error,response,body){
            if(error) {console.log(error)
            }else{
            res.status(200).json(body)
            }
        }
    )



})

app.post('/confirmation', (req, res) => {
    console.log('....................... confirmation .............')
    console.log(req.body)
})

app.post('/validation', (req, resp) => {
    console.log('....................... validation .............')
    console.log(req.body)
})





function access(res,req,next){

    let endpoint ="https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth = new Buffer.from("VOdUZdGbCRAAWXMHNvANE8cWU1uu0AR9:nSDT7heoT4sizu66").toString('base64');

    request(
    {
        url:endpoint,
        headers:{
            "Authorization": "Basic  " + auth
        }

    },
    (error,response,body)=>{

        if(error){
            console.log(error);
        }else{
        
            res.access_token = JSON.parse(body).access_token
            console.log(body)
            next()
        
        }
            
    }
    )


}



//-- listen
app.listen(port,(error)=>{

if(error){
    


}else{  

    console.log(`Server running on port http://localhost:${port}`)

}


});