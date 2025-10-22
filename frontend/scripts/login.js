const MAIN_URL = "http://localhost:3000";
const loginForm = document.querySelector("#loginForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const errorElement = document.querySelector("#error");
const successElement = document.querySelector("#success");

const createError = (errorMessage) => {
  errorElement.classList.remove("hidden");
  errorElement.classList.add("text-red-500", "bg-red-500/10", "p-2", "rounded-md");
  errorElement.textContent = errorMessage;
  loginForm.appendChild(errorElement);
};

const createSuccess = (successMessage) => {
  successElement.classList.remove("hidden");
  successElement.classList.add("text-green-500", "bg-green-500/10", "p-2", "rounded-md");
  successElement.textContent = successMessage;
  loginForm.appendChild(successElement);
};

const removeError = () => {
  if (errorElement) {
    errorElement.remove();
  }
};
const removeSuccess = () => {
  if (successElement) {
    successElement.remove();
  }
};

const validateLogin = async () => {
  if (emailInput.value.trim() === "" || passwordInput.value.trim() === "") {
    return "All fields are required";
  }
  return "";
};

const fetchLogin = async () => {
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    const response = await fetch(`${MAIN_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);
    
    return data;
  } catch (error) {
    return error;
  }
};

const handleLogin = async (e) => {
  e.preventDefault();
  const error = await validateLogin();
  if (error) {
    createError(error);
    return;
  }
  const data = await fetchLogin();
  if (data.data.token) {
    window.localStorage.setItem("token", data.data.token);
    window.localStorage.setItem("refreshToken", data.data.refreshToken);
    window.localStorage.setItem("user", JSON.stringify(data.data.userExists));
    window.location.href = "index.html";
    setTimeout(() => {
      createSuccess("Login successful");
    }, 1000);
  } else {
    createError(data.message);
    return;
  }
};

loginForm.addEventListener("submit", handleLogin);
