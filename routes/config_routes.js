const indexR=require("./index");
const userR=require("./users");
const cakeR=require("./cakes");
const countryR=require("./countries");

exports.routesInit=(app)=>{
    app.use("/", indexR);
    app.use("/users", userR);
    app.use("/cakes", cakeR);
    app.use("/countries", countryR);
}