const MAIN_URL = "http://localhost:3000";
const registerForm = document.getElementById("registerForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const errorElement = document.getElementById("error");
const successElement = document.getElementById("success");

const createError = (errorMessage) => {
  errorElement.classList.remove("hidden");
  errorElement.classList.add("text-red-500", "bg-red-500/10", "p-2", "rounded-md");
  errorElement.textContent = errorMessage;
  registerForm.appendChild(errorElement);
};

const createSuccess = (successMessage) => {
  successElement.classList.remove("hidden");
  successElement.classList.add("text-green-500", "bg-green-500/10", "p-2", "rounded-md");
  successElement.textContent = successMessage;
  registerForm.appendChild(successElement);
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

const validateRegister = async () => {
  if (
    usernameInput.value.trim() === "" ||
    emailInput.value.trim() === "" ||
    passwordInput.value.trim() === ""
  ) {
    return "All fields are required";
  }
  return "";
};

const fetchRegister = async () => {
  const username = registerForm.username.value;
  const email = registerForm.email.value;
  const password = registerForm.password.value;

  try {
    const response = await fetch(`${MAIN_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ fullName: username, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

const handleRegister = async (e) => {
  e.preventDefault();
  const error = await validateRegister();
  if (error) {
    createError(error);
    return;
  }
  const data = await fetchRegister();
  if (data.user) {
    window.location.href = "login.html";
    setTimeout(() => {
      createSuccess("Register successful");
    }, 1000);
  } else {
    createError(data.message);
    return;
  }
};

const handleLoad = () => {
  removeError();
  removeSuccess();
};

registerForm.addEventListener("submit", handleRegister);
window.addEventListener("load", handleLoad);
