require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOvrride = require("method-override");
const flash = require('connect-flash');
const session = require('express-session');
const connectDB = require("./server/config/db");

const app = express();
const port = 8080 || process.env.PORT;

//Connect DB
connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOvrride("_method"));


//static folder
app.use(express.static("public"));
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        }
    })
)

app.use(flash({ sessionKeyName : "flashMessage" }));

//Template engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

//Home
app.use("/", require("./server/routes/customer"));

app.get("*", (req, res) => {
    res.status(404).render("404");
});

app.listen(port, () => {
    console.log("App listen", );
})
