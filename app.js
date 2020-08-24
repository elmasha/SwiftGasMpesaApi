const express = require('express')
const request = require('request')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const apiCallFromRequest = require('./Request')
const apiCallFromNode = require('./nodeCalls');

const port = app.listen(process.env.PORT || 4334);
const _urlencoded = express.urlencoded({ extended: false })
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://mpesamko.herokuapp.com");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });

//routes
app.get('/', (req, res,next)=>{


res.send("Hello Mkoba App Elmasha Mpesa APi")


})




///----Access Token ---//
app.get('/access_token',access,(req,res)=>{

    res.status(200).json({access_token: req.access_token})

})

///----Stk Push ---//
app.post('/stk', access, _urlencoded,function(req,res,next){

    let endpoint = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    let auth = "Bearer "+ req.access_token

    let _shortCode = '174379';
    let _passKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
   

     let _phoneNumber = req.body.phone
     let _Amount = req.body.amount


    console.log("phone",req.body.phone)
    console.log("amount",req.body.amount)
      
    const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64');

    request(
        {
            url:endpoint,
            method:"POST",
            headers:{
                "Authorization": auth
            },
    
        json:{
    
                    "BusinessShortCode": "174379",
                    "Password": password,
                    "Timestamp": timeStamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": _Amount,
                    "PartyA": "254746291229",
                    "PartyB": "174379",
                    "PhoneNumber": _phoneNumber,
                    "CallBackURL": "http://mpesamko.herokuapp.com/stk_callback",
                    "AccountReference": " Elmasha TEST",
                    "TransactionDesc": "Lipa na Mpesa"

            }

        },
       (error,response,body)=>{

            if(error){

                console.log(error);

            }else{

                res.status(200).json(body)
                console.log(body)

            }
               

        })

});

//-----Callback Url ----///
app.post('/stk_callback',_urlencoded,function(req,res){
    
    console.log('.......... STK Callback ..................');
    
    const _data = (req.body);
    console.log((req.body))
    res.status(200).json((req.body))
    

    })






///----STK QUERY ---
app.post('/stk/query',access,_urlencoded,function(req,res,next){

    let checkoutRequestId = req.body.checkoutRequestId

    auth = "Bearer "+ req.access_token

    let endpoint ='https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query'
    const _shortCode = '174379'
    const _passKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
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
            'CheckoutRequestID': checkoutRequestId

            }

        },
        function(error,response,body){

            if(error){

                console.log(error);
                res.status(404).send();

            }else{
                res.status(200).json(body)
                console.log(body)
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


    console.log("phone",req.body.phone)
    console.log("amount",req.body.amount)

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
                "QueueTimeOutURL":"http://mpesamko.herokuapp.com/timeout_url",
                "ResultURL":"http://mpesamko.herokuapp.com/result_url",
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



///-------REversals ----///////
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
                "ResultURL":"http://197.248.86.122:801/reverse_result_url",
                "QueueTimeOutURL":"http://197.248.86.122:801/reverse_timeout_url",
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
      "ConfirmationURL":"http://mpesamko.herokuapp.com/confirmation",
      "ValidationURL":"http://mpesamko.herokuapp.com/validation_url"
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

    const endpoint ="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    const auth = new Buffer.from('K49Zle6LPHOGv7avuuw61MfIIWzai9gS:FQCGD4QOIFM4j8HJ').toString('base64');

    request(
    {
        url:endpoint,
        headers:{
            "Authorization": "Basic " + auth
        }

    },
    (error,response,body)=>{

        if(error){
            console.log(error);
        }else{
        
            res.access_token = JSON.parse(body).access_token
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