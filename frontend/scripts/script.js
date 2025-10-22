const BASE_URL = "http://localhost:3000";
// Logout button
const logoutButton = document.getElementById("logout");
const username = document.getElementById("username");
const usersList = document.getElementById("usersList");
const userCount = document.getElementById("userCount");
const messages = document.getElementById("messages");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");

// Chat mode elements
const publicChatBtn = document.getElementById("publicChatBtn");
const privateChatBtn = document.getElementById("privateChatBtn");
const currentMode = document.getElementById("currentMode");
const recipientInfo = document.getElementById("recipientInfo");
const recipientName = document.getElementById("recipientName");
const recipientSelector = document.getElementById("recipientSelector");
const recipientSelect = document.getElementById("recipientSelect");

// Chat state
let currentChatMode = "public";
let selectedRecipient = null;

const token = window.localStorage.getItem("token");
const currentUser = JSON.parse(window.localStorage.getItem("user"));

const handleLoad = () => {
  if (!token) {
    window.location.href = "login.html";
  }
  username.textContent = currentUser.fullname;
};

// check if user is logged in
window.addEventListener("load", handleLoad);

// logout button
logoutButton.onclick = () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  window.location.href = "login.html";
};

console.log("Connecting with token:", token);

const socket = io(BASE_URL, {
  auth: {
    token: token,
  },
});

// Socket event handlers
socket.on("connect", () => {
  console.log("connected to server");
  socket.emit("get_connected_users");
});

socket.on("connected_users", (users) => {
  console.log("Received connected users:", users);
  displayActiveUsers(users);
  updateRecipientSelector(users);
});

socket.on("user_joined", (user) => {
  addMessage(`${user.fullName} joined the chat`, "system");
});

socket.on("user_left", (user) => {
  addMessage(`${user.fullName} left the chat`, "system");
});

// Handle public messages
socket.on("public_message", (data) => {
  const senderName = data.fullName || data.fullname || 'Unknown User';
  addMessage(`${senderName}: ${data.message}`, "public");
});

// Handle private messages
socket.on("private_message", (data) => {
  const isFromMe = data.senderId === currentUser._id;
  const messageType = isFromMe ? "private-sent" : "private-received";
  const senderName = isFromMe ? "You" : (data.fullName || data.fullname || 'Unknown User');
  addMessage(`${senderName}: ${data.message}`, messageType);
});

// Handle typing indicators
socket.on("user_typing", (data) => {
  if (data.userId !== currentUser._id) {
    const userName = data.fullName || data.fullname || 'Unknown User';
    showTypingIndicator(userName, data.isTyping);
  }
});

socket.on("disconnect", () => {
  console.log("disconnected from server");
});

// Display active users
function displayActiveUsers(users) {
  usersList.innerHTML = "";
  userCount.textContent = users.length;

  if (users.length === 0) {
    const noUsersElement = document.createElement("li");
    noUsersElement.className = "text-center text-gray-500 text-sm py-4";
    noUsersElement.textContent = "No active users";
    usersList.appendChild(noUsersElement);
    return;
  }

  users.forEach((user) => {
    if (user && user._id && user._id !== currentUser._id) {
      const userElement = document.createElement("li");
      userElement.className =
        "flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer";

      // Get user's first name or full name for display
      const displayName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
      const firstLetter = displayName.charAt(0).toUpperCase();

      userElement.setAttribute('data-user-id', user._id);
      userElement.innerHTML = `
        <div class="relative">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            ${firstLetter}
          </div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">${displayName}</p>
          <p class="text-xs text-gray-500">Online</p>
        </div>
      `;

      // Add click handler for private messaging
      userElement.onclick = () => {
        selectUserForPrivateChat(user);
      };

      usersList.appendChild(userElement);
    }
  });
}

// Update recipient selector dropdown
function updateRecipientSelector(users) {
  recipientSelect.innerHTML = '<option value="">Select a user to message...</option>';

  users.forEach((user) => {
    if (user && user._id && user._id !== currentUser._id) {
      const option = document.createElement("option");
      option.value = user._id;
      const displayName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
      option.textContent = displayName;
      recipientSelect.appendChild(option);
    }
  });
}

// Select user for private chat
function selectUserForPrivateChat(user) {
  selectedRecipient = user;
  switchToPrivateMode();
  const displayName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
  recipientName.textContent = displayName;
  recipientInfo.classList.remove("hidden");
}

// Switch to private chat mode
function switchToPrivateMode() {
  currentChatMode = "private";
  publicChatBtn.className =
    "flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium";
  privateChatBtn.className =
    "flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium";
  currentMode.textContent = "Private Chat";
  recipientSelector.classList.remove("hidden");
}

// Switch to public chat mode
function switchToPublicMode() {
  currentChatMode = "public";
  publicChatBtn.className =
    "flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium";
  privateChatBtn.className =
    "flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium";
  currentMode.textContent = "Public Chat";
  recipientSelector.classList.add("hidden");
  recipientInfo.classList.add("hidden");
  selectedRecipient = null;
}

// Add message to chat
function addMessage(text, type) {
  const messageElement = document.createElement("div");

  if (type === "system") {
    messageElement.className = "text-center text-gray-500 text-sm italic";
  } else if (type === "public") {
    messageElement.className = "bg-white p-3 rounded-lg shadow-sm border border-gray-200";
  } else if (type === "private-sent") {
    messageElement.className = "bg-blue-100 p-3 rounded-lg shadow-sm border border-blue-200 ml-8";
  } else if (type === "private-received") {
    messageElement.className = "bg-green-100 p-3 rounded-lg shadow-sm border border-green-200 mr-8";
  } else {
    messageElement.className = "bg-white p-3 rounded-lg shadow-sm border border-gray-200";
  }

  messageElement.textContent = text;
  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator(username, isTyping) {
  let indicator = document.getElementById("typing-indicator");

  if (isTyping) {
    if (!indicator) {
      indicator = document.createElement("div");
      indicator.id = "typing-indicator";
      indicator.className = "text-gray-500 text-sm italic";
      messages.appendChild(indicator);
    }
    indicator.textContent = `${username} is typing...`;
  } else {
    if (indicator) {
      indicator.remove();
    }
  }
}

// Send message
function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  if (currentChatMode === "public") {
    socket.emit("public_message", {
      message: message,
      fullName: currentUser.fullname,
      senderId: currentUser._id,
    });
  } else if (currentChatMode === "private") {
    if (!selectedRecipient) {
      alert("Please select a recipient for private message");
      return;
    }

    socket.emit("private_message", {
      message: message,
      fullName: currentUser.fullname,
      senderId: currentUser._id,
      recipientId: selectedRecipient._id,
    });
  }

  messageInput.value = "";
}

// Event listeners
sendButton.onclick = sendMessage;

publicChatBtn.onclick = switchToPublicMode;
privateChatBtn.onclick = switchToPrivateMode;

recipientSelect.onchange = (e) => {
  const recipientId = e.target.value;
  if (recipientId) {
    // Find the user from the current connected users list
    const userElement = Array.from(usersList.children).find((li) => {
      const userId = li.getAttribute('data-user-id');
      return userId === recipientId;
    });
    
    if (userElement) {
      const displayName = userElement.querySelector("p").textContent;
      const user = { _id: recipientId, fullName: displayName };
      selectUserForPrivateChat(user);
    }
  }
};

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Typing indicator
let typingTimeout;
messageInput.addEventListener("input", () => {
  socket.emit("typing", { isTyping: true });

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("typing", { isTyping: false });
  }, 1000);
});
