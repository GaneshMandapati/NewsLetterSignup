const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { json } = require("body-parser");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  var f = req.body.FirstName;
  var l = req.body.LastName;
  var e = req.body.Email;

  var data = {
    members: [
      {
        email_address: e,
        status: "subscribed",
        merge_fields: {
          FNAME: f,
          LNAME: l,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us2.api.mailchimp.com/3.0/lists/5c4cc7afd8";
  const options = {
    method: "POST",
    auth: "mandapatiganesh:00aa3b1a6a5d1673f38a0dbfbb3d79b3-us2",
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname+"/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
})
app.listen(process.env.PORT||3000, function (req, res) {
  console.log("Server Running on port 3000");
});
