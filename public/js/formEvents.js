export const declareEvents=(_doApi)=>{
    let id_form=document.querySelector("#id_form");
    id_form.addEventListener("submit",(e)=>{
        e.preventDefault();
        let dataBody={
            name:document.querySelector("#id_name").value,
            capital:document.querySelector("#id_capital").value,
            pop:document.querySelector("#id_pop").value,
            img:document.querySelector("#id_img").value
        }
        console.log(dataBody);
        addNewCountry(dataBody, _doApi);
    })
}
const addNewCountry=async(_bodyData,_doApi)=>{
    let myUrl="http://localhost:3000/countries"
    try{
        let resp=await axios({
            url:myUrl,
            method:"POST",
            data:JSON.stringify(_bodyData),
            headers:{
                'content-type':"application/json"
            }
        })
        if(resp.data._id){
            alert("Country added");
            _doApi();
        }
        else{
            alert("There is a problem, try again")
        }
    }
    catch(err){
        console.log(err);
        alert("There is a problem, come back laters")
    }

}