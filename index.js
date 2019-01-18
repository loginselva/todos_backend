const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = process.env.PORT;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb://test:test@ds151014.mlab.com:51014/nodetodosample";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// this is our get method
// this method fetches all available data in our database
 router.get("/getData", (req, res) => {
  Data.find({}, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
}); 

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { item } = req.body;

  if (!item) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.item = item;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});


router.delete("/deleteData", (req, res) => {
  const { item } = req.body;
  Data.findOneAndDelete(item, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

router.post("/updateData", (req, res) => {
  const { item, update } = req.body;
  Data.update(item, update, err => {  console.log(err)
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
