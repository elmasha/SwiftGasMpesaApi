const firebase = require("./firebase_connect");
var transID ='';
var amount = '';
var transdate = '';
var transNo = '';
var userName = '';
module.exports ={
    stk_callback: function(req,userName,callback){

        amount = req.Body.stkCallback.CallbackMetadata.Item[0].Value;
        transID = req.Body.stkCallback.CallbackMetadata.Item[1].Value;
        transNo = req.Body.stkCallback.CallbackMetadata.Item[3].Value;
        transdate = req.Body.stkCallback.CallbackMetadata.Item[2].Value;
      
        firebase.collection("Payments_backup").add({
            TransID : transID ,
            TransAmount : amount ,
            TransNo : transNo ,
            User_name: userName,
            Timestamp : transdate
        }).then((ref) => {
            console.log("Added doc with ID: ", ref.id);
        });
    }
}
