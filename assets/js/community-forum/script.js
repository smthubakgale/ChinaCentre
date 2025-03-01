// Get the modal
var modal = document.getElementById("new-thread-modal");

// Get the button that opens the modal
var btn = document.getElementById("new-thread-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Add sample thread posts
var threadPosts = [
  {
    threadId: "thread-1",
    posts: [
      {
        username: "JohnDoe",
        content: "I love the new sofa collection! The designs are so modern and sleek.",
        timestamp: "2 hours ago"
      },
      {
        username: "JaneDoe",
        content: "I completely agree! I just bought the new sectional sofa and it's amazing.",
        timestamp: "1 hour ago"
      }
    ]
  },
  {
    threadId: "thread-2",
    posts: [
      {
        username: "BobSmith",
        content: "Has anyone had issues with the delivery of their furniture? I'm still waiting for my coffee table.",
        timestamp: "3 days ago"
      },
      {
        username: "Admin",
        content: "Sorry to hear that Bob. Please DM us and we'll look into it.",
        timestamp: "2 days ago"
      }
    ]
  },
  {
    threadId: "thread-3",
    posts: [
      {
        username: "AliceJohnson",
        content: "Who's excited for the upcoming furniture sale? I need a new desk!",
        timestamp: "1 day ago"
      }
    ]
  }
];

// Display thread posts
threadPosts.forEach(function(thread) {
  console.log("thread-posts-" + thread.threadId);
  
  var threadElement = document.getElementById("thread-posts-" + thread.threadId);
  thread.posts.forEach(function(post) {
    var postHTML = `
      <div class="thread-post">
        <h3>${post.username}</h3>
        <p>${post.content}</p>
        <p class="timestamp">${post.timestamp}</p>
        <button class="respond-btn">Respond</button>
      </div>
    `;
    threadElement.innerHTML += postHTML;
  });
});

// Display recent thread
var recentThread = threadPosts[0];
var recentThreadElement = document.getElementById("thread-posts-" + recentThread.threadId);
recentThreadElement.style.display = "block";

// Add event listeners to respond buttons
var respondBtns = document.querySelectorAll(".respond-btn");

respondBtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    var respondInput = document.createElement("input");
    respondInput.type = "text";
    respondInput.placeholder = "Respond to this post...";
    btn.parentNode.appendChild(respondInput);
    var respondBtn = btn;
    respondInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        var respondContent = respondInput.value;
        var postHTML = `
          <div class="thread-post">
            <h3>You</h3>
            <p>${respondContent}</p>
            <p class="timestamp">just now</p>
          </div>
        `;
        respondBtn.parentNode.parentNode.innerHTML += postHTML;
        respondInput.remove();
      }
    });
  });
});

// Add event listener to thread titles
var threadTitles = document.querySelectorAll(".threads-list h2");

threadTitles.forEach(function(title) {
  title.addEventListener("click", function() {
    var threadId = title.id;
    var threadPosts = document.getElementById("thread-posts-" + threadId);
    
    // Toggle the display of thread posts
    if (threadPosts.style.display === "block") {
      threadPosts.style.display = "none";
    } else {
      threadPosts.style.display = "block";
    }
  });
});
