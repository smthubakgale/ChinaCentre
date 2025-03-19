
const url = api_url + `database/tables?session=${encodeURIComponent(session)}`;
console.log(url);
    
fetch(url)
.then((response) => response.json())
.then((data) => {
    console.log(data);
})
.catch((error) => {

});
//:
