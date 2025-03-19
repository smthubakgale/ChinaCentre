const user_inherits = [
  { user: "admin", inherits: ["customer"] },
  { user: "customer", inherits: ["default"] },
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
    "page": "home", 
    "users": [] 
  },
  { 
    "page": "home", 
    "users": [] 
  },
  { 
    "page": "collections", 
    "users": [] 
  },
  { 
    "page": "notifications", 
    "users": [] 
  },
  { 
    "page": "register", 
    "users": [] 
  },
  { 
    "page": "profile-settings", 
    "users": [] 
  },
  { 
    "page": "logout", 
    "users": [] 
  },
  { 
    "page": "dashboard", 
    "users": [] 
  },
  { 
    "page": "wishlist", 
    "users": [] 
  },
  { 
    "page": "order-history", 
    "users": [] 
  },
  { 
    "page": "payment-history", 
    "users": [] 
  },
  { 
    "page": "address-book", 
    "users": [] 
  },
  { 
    "page": "knowledge-base", 
    "users": [] 
  },
  { 
    "page": "faqs", 
    "users": [] 
  },
  { 
    "page": "glossary", 
    "users": [] 
  },
  { 
    "page": "sitemap", 
    "users": [] 
  },
  { 
    "page": "terms-of-use", 
    "users": [] 
  },
  { 
    "page": "disclaimer", 
    "users": [] 
  },
  { 
    "page": "privacy-policy", 
    "users": [] 
  },
  { 
    "page": "shipping-policy", 
    "users": [] 
  },
  { 
    "page": "payment-methods", 
    "users": [] 
  },
  { 
    "page": "about", 
    "users": [] 
  },
  { 
    "page": "blogs", 
    "users": [] 
  },
  { 
    "page": "events-calendar", 
    "users": [] 
  },
  { 
    "page": "affiliate-program", 
    "users": [] 
  },
  { 
    "page": "careers", 
    "users": [] 
  },
  { 
    "page": "loyalty-program", 
    "users": [] 
  },
  { 
    "page": "community-forum", 
    "users": [] 
  },
  { 
    "page": "contact", 
    "users": [] 
  },
  { 
    "page": "customer-support", 
    "users": [] 
  },
  { 
    "page": "tax-invoice", 
    "users": ["Manager"] 
  },
  { 
    "page": "cart", 
    "users": [] 
  },
  { 
    "page": "checkout", 
    "users": [] 
  }
];



