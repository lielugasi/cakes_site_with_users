
import Country from "./countryClass.js";
import { declareEvents } from "./formEvents.js";

const init=()=>{
    doApi();
    declareEvents(doApi);
}

const doApi=async()=>{
    let url="http://localhost:3000/countries?perPage=8&&reverse=yes";
    try{
        let resp= await axios.get(url);
        console.log(resp);
        console.log(resp.data);
        createTable(resp.data);
    }
    catch(err){
        console.log(err);
        alert("There is a problem, come back later");
    }
}

const createTable=(_ar)=>{
    document.querySelector("#tbody").innerHTML="";
    _ar.forEach((item,i) => {
        let tr=new Country("#tbody",item,i,doApi);
        tr.render();
    });
}
init();