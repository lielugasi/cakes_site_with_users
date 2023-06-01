const indexR=require("./index");
const userR=require("./users");
const cakeR=require("./cakes");

exports.routesInit=(app)=>{
    app.use("/", indexR);
    app.use("/users", userR);
    app.use("/cakes", cakeR);
}