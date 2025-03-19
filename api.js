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
    "users": ["register"] 
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
    "users": ["Manager"] 
  },
  { 
    "page": "cart", 
    "users": ["default"] 
  },
  { 
    "page": "checkout", 
    "users": ["default"] 
  }
];



