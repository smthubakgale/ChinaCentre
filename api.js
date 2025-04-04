//
let session = localStorage.getItem('chinacentre');
let session_local = localStorage.getItem('chinacentre_local');

//setTimeout( session_login ,2000);

function cart_add(idx , qty){
  let query = `
    IF NOT EXISTS (SELECT 1 FROM Product_Cart WHERE product_no = '${idx}')
      INSERT INTO Product_Cart (product_no, quantity, checkout_status)
      VALUES ('${idx}', '${qty}', 'Shopping')
    ELSE
      UPDATE Product_Cart
      SET quantity = quantity + 1
      WHERE product_no = '${idx}'`;

  // Send the form data to the server using fetch API
  fetch(d_config.url + `database/query/exec?session='${encodeURIComponent(session)}'&query=${btoa(query)}`)
  .then((response) => { 
      return response.json();
  })
  .then((data) => {
      console.log(data); 
      flashMessage('Added to Cart');
  })
  .catch((error) => {
      console.error(error);
  });
 
}

function flashMessage(message, type = 'success') {
  // Create the container element
  const flashMessageContainer = document.createElement('div');
  flashMessageContainer.id = 'flash-message';
  document.body.appendChild(flashMessageContainer);
  
  // Create the message element
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.className = `flash-message ${type}`;
  
  // Add the message element to the container
  flashMessageContainer.appendChild(messageElement);
  
  // Fade out the message after 2 seconds
  setTimeout(() => {
    messageElement.style.opacity = 1;
    messageElement.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
      messageElement.style.opacity = 0;
      
      setTimeout(() => {
        messageElement.remove();
        flashMessageContainer.remove();
      }, 500);
    }, 2000);
  }, 0);
}

function session_login(count = 0 , callback = ()=>{})
{  
  //console.log(session_local);
  //console.log(session);
  
  if(session_local)
  {
       //console.log(session_local);
       session_local = (typeof session_local === 'object' && session_local !== null)?session_local : JSON.parse(session_local);
       //console.log(session_local);
    
       const expirationTime = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
       const sessionTimestamp = new Date(session_local.timestamp).getTime();
       const currentTime = new Date().getTime();

       if (currentTime - sessionTimestamp > expirationTime)
       {
         logout();
       }
       else 
       {
         login(session_local.usertype , callback);
       }
  }
  else if(session) 
  {
    const url = d_config.url + `session?session=${encodeURIComponent(session)}`;
    //console.log(url);
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
          //console.log(data);

        if(data.usertype){
            localStorage.setItem('chinacentre_local' , JSON.stringify({
              usertype: data.usertype ,
              timestamp: new Date().toISOString()
            })); 
          
            login(data.usertype , callback);
        }
        else {
          logout();
        } 
      })
      .catch((error) => {

        if(count < 10){
           //console.log(error);
           setTimeout(()=>{ session_login(count + 1 , callback); } , 500);
        }
        else {
          logout();
        }
      });
     //:
  } 
  else{
    login("default" , callback);
  } 
}

function login(usertype , callback = ()=>{}){ 
  //console.log(usertype);

  const inheritedUsers = getInheritedUsers(usertype);
  inheritedUsers.push(usertype); // include the user itself

  //console.log(inheritedUsers);

  const filteredPages = user_management.filter(page => page.users.some(user => (page.inherit == false ? [usertype].includes(user) : inheritedUsers.includes(user))));

  //console.log(filteredPages);
  
  // Remove unauthorized elements from the DOM
  const navLinks = document.querySelectorAll('.nav-link');
  Array.from(navLinks).forEach((link) => {
    const page = link.getAttribute('href').replace('#', '');
    if (!filteredPages.find(p => p.page === page)) {
      link.remove();
    }
  });

  document.body.style.opacity = 1;
  callback();
}

function logout(){

  if(!session && !session_local){
    localStorage.setItem('chinacentre_local' , JSON.stringify({
      usertype: 'default' ,
      timestamp: new Date().toISOString()
    }));
  }
  localStorage.removeItem('chinacentre');  

  login('default');
}


const user_inherits = [
  { user: "Developer", inherits: ["Admin"] },
  { user: "Admin", inherits: ["Customer"] },
  { user: "Customer", inherits: ["default"] },
];

function getInheritedUsers(user) {
  const inheritedUsers = [];
  const inherits = user_inherits.find(u => u.user === user);
  if (inherits) {
    inheritedUsers.push(...inherits.inherits);
    inherits.inherits.forEach(inheritedUser => {
      inheritedUsers.push(...getInheritedUsers(inheritedUser));
    });
  }
  return inheritedUsers;
}

const user_management = [
  { 
    "page": "more", 
    "users": ["default"] 
  }, 
  { 
    "page": "database", 
    "users": ["default"] 
  }, 
  { 
    "page": "home", 
    "users": ["default"] 
  }, 
  { 
    "page": "collections", 
    "users": ["default"] 
  },
  { 
    "page": "notifications", 
    "users": ["default"] 
  },
  { 
    "page": "register", 
    "users": ["default"] ,
    "inherit" : false
  },
  { 
    "page": "login", 
    "users": ["default"] ,
    "inherit" : false
  },
  { 
    "page": "profile-settings", 
    "users": ["Customer"] 
  },
  { 
    "page": "logout", 
    "users": ["Customer"] 
  },
  { 
    "page": "dashboard", 
    "users": ["Customer"] 
  },
  { 
    "page": "wishlist", 
    "users": ["Customer"] 
  },
  { 
    "page": "order-history", 
    "users": ["Customer"] 
  },
  { 
    "page": "payment-history", 
    "users": ["Customer"] 
  },
  { 
    "page": "address-book", 
    "users": ["Customer"] 
  },
  { 
    "page": "knowledge-base", 
    "users": ["default"] 
  },
  { 
    "page": "faqs", 
    "users": ["default"] 
  },
  { 
    "page": "glossary", 
    "users": ["default"] 
  },
  { 
    "page": "sitemap", 
    "users": ["default"] 
  },
  { 
    "page": "terms-of-use", 
    "users": ["default"] 
  },
  { 
    "page": "disclaimer", 
    "users": ["default"] 
  },
  { 
    "page": "privacy-policy", 
    "users": ["default"] 
  },
  { 
    "page": "shipping-policy", 
    "users": ["default"] 
  },
  { 
    "page": "payment-methods", 
    "users": ["default"] 
  },
  { 
    "page": "about", 
    "users": ["default"] 
  },
  { 
    "page": "blogs", 
    "users": ["default"] 
  },
  { 
    "page": "events-calendar", 
    "users": ["default"] 
  },
  { 
    "page": "affiliate-program", 
    "users": ["default"] 
  },
  { 
    "page": "careers", 
    "users": ["default"] 
  },
  { 
    "page": "loyalty-program", 
    "users": ["default"] 
  },
  { 
    "page": "community-forum", 
    "users": ["Customer"] 
  },
  { 
    "page": "contact", 
    "users": ["default"] 
  },
  { 
    "page": "customer-support", 
    "users": ["Customer"] 
  },
  { 
    "page": "tax-invoice", 
    "users": ["Customer"] 
  },
  { 
    "page": "cart", 
    "users": ["default"] 
  },
  { 
    "page": "checkout", 
    "users": ["default"] 
  },
  { 
    "page": "account", 
    "users": ["default"] 
  }
];



