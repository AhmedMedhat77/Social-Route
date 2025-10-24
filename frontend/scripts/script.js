const BASE_URL = "http://localhost:3000";
// Logout button
const logoutButton = document.getElementById("logout");
const username = document.getElementById("username");
const friendsList = document.getElementById("friendsList");
const friendsCount = document.getElementById("friendsCount");
const messages = document.getElementById("messages");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");

// Chat mode elements

const currentMode = document.getElementById("currentMode");
const recipientInfo = document.getElementById("recipientInfo");
const recipientName = document.getElementById("recipientName");

// Chat state
let currentChatMode = "public";
let selectedRecipient = null;
let friends = [];
let connectedUsers = [];

const token = window.localStorage.getItem("token");
const currentUser = JSON.parse(window.localStorage.getItem("user"));

const handleLoad = async () => {
  if (!token) {
    window.location.href = "login.html";
  }
  username.textContent = currentUser.fullname;
  const data = await getFriends();
  friends = data;
  displayFriends();
};

// check if user is logged in
window.addEventListener("load", handleLoad);

// logout button
logoutButton.onclick = () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  window.location.href = "login.html";
};

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
  connectedUsers = users;

  displayFriends(); // Update friends display with online status
});

socket.on("user_joined", (user) => {
  addMessage(`${user.fullName} joined the chat`, "system");
});

socket.on("user_left", (user) => {
  addMessage(`${user.fullName} left the chat`, "system");
});

// Handle public messages
socket.on("public_message", (data) => {
  const senderName = data.fullName || data.fullname || "Unknown User";
  addMessage(`${senderName}: ${data.message}`, "public");
});

// Handle private messages
socket.on("private_message", (data) => {
  const isFromMe = data.senderId === currentUser._id;
  const messageType = isFromMe ? "private-sent" : "private-received";
  const senderName = isFromMe ? "You" : data.fullName || data.fullname || "Unknown User";
  addMessage(`${senderName}: ${data.message}`, messageType);
});

// Handle typing indicators
socket.on("user_typing", (data) => {
  if (data.userId !== currentUser._id) {
    const userName = data.fullName || data.fullname || "Unknown User";
    showTypingIndicator(userName, data.isTyping);
  }
});

socket.on("disconnect", () => {
  console.log("disconnected from server");
});

// Select user for private chat
async function selectUserForPrivateChat(user) {
  selectedRecipient = user;
  switchToPrivateMode();
  const displayName =
    user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User";
  recipientName.textContent = displayName;
  recipientInfo.classList.remove("hidden");

  // Load chat history
  await loadChatHistory(user._id);
}

// Load chat history from server
async function loadChatHistory(recipientId) {
  try {
    const token = window.localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/message/${recipientId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        // Clear current messages
        messages.innerHTML = "";

        // Display chat history
        data.data.forEach((message) => {
          const isFromMe = message.senderId === currentUser._id;
          const messageType = isFromMe ? "private-sent" : "private-received";
          const senderName = isFromMe ? "You" : selectedRecipient.fullName;
          addMessage(`${senderName}: ${message.content}`, messageType);
        });
      }
    } else {
      console.error("Failed to load chat history:", response.statusText);
    }
  } catch (error) {
    console.error("Error loading chat history:", error);
  }
}

async function getFriends() {
  const response = await fetch(`${BASE_URL}/friend`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.data;
}

// Display friends with online status
function displayFriends() {
  if (!friendsList) return;

  friendsList.innerHTML = "";
  friendsCount.textContent = friends?.length || 0;

  if (friends?.length === 0) {
    const noFriendsElement = document.createElement("li");
    noFriendsElement.className = "text-center text-gray-500 text-sm py-4";
    noFriendsElement.textContent = "No friends yet";
    friendsList.appendChild(noFriendsElement);
    return;
  }

  friends.forEach((friend) => {
    if (friend && friend.friendId) {
      const friendData = friend.friendId;
      const friendElement = document.createElement("li");
      friendElement.className =
        "flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer";

      // Check if friend is online
      const isOnline = connectedUsers.some((user) => user._id === friendData._id);

      // Get friend's display name
      const displayName =
        friendData.fullName ||
        `${friendData.firstName || ""} ${friendData.lastName || ""}`.trim() ||
        "Unknown User";
      const firstLetter = displayName.charAt(0).toUpperCase();

      friendElement.setAttribute("data-friend-id", friendData._id);
      friendElement.innerHTML = `
        <div class="relative">
          <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
            ${firstLetter}
          </div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 ${isOnline ? "bg-green-500" : "bg-gray-400"} border-2 border-white rounded-full"></div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">${displayName}</p>
          <p class="text-xs ${isOnline ? "text-green-600" : "text-gray-500"}">${isOnline ? "Online" : "Offline"}</p>
        </div>
      `;

      // Add click handler for private messaging
      friendElement.onclick = () => {
        selectUserForPrivateChat({
          _id: friendData._id,
          fullName: displayName,
          firstName: friendData.firstName,
          lastName: friendData.lastName,
        });
      };

      friendsList.appendChild(friendElement);
    }
  });
}

// Switch to private chat mode
function switchToPrivateMode() {
  currentChatMode = "private";
  currentMode.textContent = "Private Chat";
}

// Switch to public chat mode
function switchToPublicMode() {
  currentChatMode = "public";
  currentMode.textContent = "Public Chat";
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

recipientSelect.onchange = async (e) => {
  const recipientId = e.target.value;
  if (recipientId) {
    // Find the user from the current connected users list
    const userElement = Array.from(usersList.children).find((li) => {
      const userId = li.getAttribute("data-user-id");
      return userId === recipientId;
    });

    if (userElement) {
      const displayName = userElement.querySelector("p").textContent;
      const user = { _id: recipientId, fullName: displayName };
      await selectUserForPrivateChat(user);
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
