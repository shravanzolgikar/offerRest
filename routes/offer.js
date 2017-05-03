var express = require('express');
var router = express.Router();
var User = require('../models/offer');

router.get('/1', function(req,res) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    var token = 'US_AFF_0_201236_212556_0';
        client.get("https://partner-api.groupon.com/deals.json?tsToken="+token+"&division_id=Chicago&filters=category:retail&limit=1", function (data, response) {
        // parsed response body as js object
        //console.log(data.deals[0].id);
        //console.log(data.deals[0].title);
        //var arr = new User;
        for(var i =0 ; i<data.deals.length;i++){
         var arr = [];
           // console.log('title-'+data.deals[i].title);
            User.create([{title:data.deals[i].title,
                            ids:data.deals[i].id,
                            division_lat:data.deals[i].division.lat,
                            division_lng:data.deals[i].division.lng,
                            ImageUrl:data.deals[i].grid4ImageUrl}],
                                function (err,data) {
                if (err){
                    throw err;
                }
             Data = data;
            });

            // arr.push(data.deals[i].title);
            //    // res.json(data.deals[i].title);
            // User.create(arr,function (err,data) {
            //     if (err){
            //         throw err;
            //     }
            //         res.json(data);
            // });
        }
            return res.json({succes:'true'});
    });

});

module.exports = router;
