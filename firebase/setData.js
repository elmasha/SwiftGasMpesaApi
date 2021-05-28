const firebase = require("./firebase_connect");
var transID ='';
var amount = '';
var transdate = '';
var transNo = '';
module.exports ={
    stk_callback: function(req,callback){

        amount = req.Body.stkCallback.CallbackMetadata.Item[0].Value;
        transID = req.Body.stkCallback.CallbackMetadata.Item[1].Value;
        transNo = req.Body.stkCallback.CallbackMetadata.Item[4].Value;
        transdate = req.Body.stkCallback.CallbackMetadata.Item[3].Value;
        let username = req.userName;
      
        firebase.collection("Payments_backup").add({
            TransID : transID ,
            TransAmount : amount ,
            TransNo : transNo ,
            Timestamp : transdate
        }).then((ref) => {
            console.log("Added doc with ID: ", transID);
        });
    }
}
