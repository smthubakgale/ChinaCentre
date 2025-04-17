
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

         let query2 = `
            SELECT pc.*, p.product_name, p.price, COALESCE(c.category_name, '') AS category_name
            FROM Product_Cart pc
            JOIN Products p ON pc.product_no = p.idx
            LEFT JOIN Categories c ON p.category_no = c.idx
            WHERE pc.checkout_key = '${res.checkout_key}';
         `;

         fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query2)}`)
          .then((response) => { 
              return response.json();
          })
          .then((data) => {
              console.log(data); 
              if(data.success && data.results)
              {
                let total = 0.0;

                data.results.recordset.forEach((item)=>{
                     total += parseFloat(item.price)*parseFloat(item.quantity);
                      let product = new DOMParser().parseFromString(`
                      <li class="order-item">
                          <span class="item-name"> ${item.product_name}</span> 
                          <span class="item-price">R ${item.price}</span>
                      </li>
                       `, 
                       "text/html").body.firstChild;

                     document.querySelector(".order-list.final").appendChild(product);
                });

                document.querySelector(".c_total").innerHTML = addSpaces(total.toFixed(2));
                document.querySelector(".c_total").style.opacity = 1;
                
              }
          })
          .catch((error) => {
              console.error(error);
          }); 

         if(res.checkout_status == "Awaiting Collection")
         {
             document.querySelector(".delivery-details .del_addr").innerHTML = 'Status : Awaiting Collection';
             document.querySelector(".delivery-details .est_date").innerHTML = `
               <a class="nav-link" href="#about" > Store Location : 18 Greenstone Place <br/> Modderfontein JHB </div>`;
           
             document.querySelector(".delivery-details .modes").innerHTML = 'Collection'; 
           
             document.querySelector(".delivery-details").style.display = "block";
         } 
         else if(res.checkout_status == "Awaiting Driver"){
            let query3 = `
               SELECT address, region, apartment, province, city, phone_number, postal_code
               FROM Checkout_Addresses
               WHERE checkout_key = '${res.checkout_key}';
           `;
  
           fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query3)}`)
            .then((response) => { 
                return response.json();
            })
            .then((data) => {
                console.log(data); 
                if(data.success && data.results)
                {
                  if(data.results.recordset.length > 0)
                  { 
                       let res = data.results.recordset[0];
                    
                       document.querySelector(".delivery-details .del_addr").innerHTML = 
                         `Delivery Address: ${res.address} , ${res.city} , ${res.postal_code}`;
  
                      
                       document.querySelector(".delivery-details .modes").innerHTML = 'Delivery'; 
   
                       document.querySelector(".delivery-details").style.display = "block";  
                       document.querySelector(".track-button").style.display = "block"; 
                  } 
                }
            })
            .catch((error) => {
                console.error(error);
            });  
         }
           
       }
    }
})
.catch((error) => {
    console.error(error);
}); 
