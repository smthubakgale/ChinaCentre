
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

    }
})
.catch((error) => {
    console.error(error);
}); 
