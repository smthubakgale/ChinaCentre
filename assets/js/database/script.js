
console.log(window.queryParam); 

//: 
let param = window.queryParam;

const url = d_config.url + `database/table?session=${encodeURIComponent(session)}&table=${param.table}`;
console.log(url);
    
fetch(url)
.then((response) => response.json())
.then((data) => 
{
    console.log(data);  
})
.catch((error) => {
  console.error(error);
});
