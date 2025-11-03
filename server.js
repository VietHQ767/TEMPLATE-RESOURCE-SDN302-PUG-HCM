const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const httpErrors = require("http-errors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");
const db = require("./models");
const ApiRouter = require("./routes/api.route");
const AuthRouter = require("./routes/auth.route");
const ViewsRouter = require("./routes/views.route");

const app = express();
// bodyParser là middleware để parse body request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// cookieParser là middleware để parse cookie request
app.use(cookieParser());

app.use(morgan("dev"));
app.set("views engine", "pug"); // Set view engine to pug
// views engine là template engine để render view

app.set("views", "./views"); // Set views directory

app.get("/", async (req, res, next) => {
    res.status(200).send({ message: "Welcome to Restful API server" });
});


app.use("/api", ApiRouter);
app.use('/auth', AuthRouter);
app.use('/views', ViewsRouter);

app.use(async (req, res, next) => {
    next(httpErrors.BadRequest("Bad request"));
});

app.use(async (err, req, res, next) => {
    res.status = err.status || 500,
        res.send({
            "error": {
                "status": err.status || 500,
                "message": err.message
            }
        });
})

const HOST_NAME = process.env.HOST_NAME;
const PORT = process.env.PORT;

app.listen(PORT, HOST_NAME, () => {
    console.log(`Server running at: http://${HOST_NAME}:${PORT}`);
    //Connect database 
    connectDB();
});