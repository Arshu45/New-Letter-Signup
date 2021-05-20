const express = require("express");
const app = express();
const request = require("request");
const https = require("https");
const { stringify } = require("querystring");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.HTML");
});

app.post("/", function (req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const Email = req.body.emailAddress;

  const data = {
    members: [
      {
        email_address: Email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = `https://us6.api.mailchimp.com/3.0/lists/6bb558b98d`;
  const options = {
    method: "POST",
    auth: "arshu:b6457dac0da95c21928053e5c9dbda49-us6",
  };
  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.HTML");
      } else {
        res.sendFile(__dirname + "/failure.HTML");
      }
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});

// API key
// => b6457dac0da95c21928053e5c9dbda49-us6

// Unique List-id
// => 6bb558b98d
