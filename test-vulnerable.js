// Test file for SecureGuard extension
// Try typing vulnerable code below to see real-time detection

// VULNERABLE: SQL Injection
function getUser(userId) {
    const query = "SELECT * FROM users WHERE id=" + userId;
    return db.query(query);
}

// VULNERABLE: Hardcoded secret
const apiKey = "sk-1234567890abcdef";

// VULNERABLE: XSS
function displayUserInput(element, userInput) {
    element.innerHTML = userInput;
}

// VULNERABLE: Command Injection
function runCommand(userInput) {
    exec("ls " + userInput);
}

// VULNERABLE: eval()
const result = eval(userData);

// VULNERABLE: Weak crypto
const hash = crypto.createHash("md5");

// VULNERABLE: Insecure random
const randomId = Math.random();
