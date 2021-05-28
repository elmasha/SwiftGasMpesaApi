const firebase = require("./firebase_connect");
var transID ='';
var amount = '';
var transdate = '';
var transNo = '';
var userName = '';
module.exports ={
    stk_callback: function(req,callback){
        
        amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
        transID = req.body.Body.stkCallback.CallbackMetadata.Item[1].Value;
        transNo = req.body.Body.stkCallback.CallbackMetadata.Item[4].Value;
        transdate = req.body.Body.stkCallback.CallbackMetadata.Item[3].Value;
       
        firebase.collection("Payments_backup").add({
            TransID : transID ,
            TransAmount : amount ,
            TransNo : transNo ,
            CheckoutRequestID : _checkoutRequestId2,
            Timestamp : transdate
        }).then((ref) => {
            console.log("Added doc with ID: ", ref.id);
        });
    }
}
