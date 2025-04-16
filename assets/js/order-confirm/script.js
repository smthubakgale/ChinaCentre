
let query = `
  SELECT TOP 1 *
  FROM User_Payments
  ORDER BY CONVERT(DATETIME, checkout_date + ':00', 126) DESC
`;

fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
.then((response) => { 
    return response.json();
})
.then((data) => {
    console.log(data); 
    if(data.success && data.results)
    {
       if(data.results.recordset.length > 0){
          var res = data.results.recordset[0];

          document.querySelector(".c_idx").innerHTML = encryptNumberString(`${res.idx}`).toLowerCase();
          document.querySelector(".c_idx").style.opacity = 1;

          document.querySelector(".c_date").innerHTML = res.checkout_date.substring(0 , res.checkout_date.indexOf("T"));
          document.querySelector(".c_date").style.opacity = 1;
       }
    }
})
.catch((error) => {
    console.error(error);
}); 
