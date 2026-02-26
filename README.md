# SecureGuard - Real-Time Security Code Analyzer

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=secureguard.secureguard">
    <img src="https://img.shields.io/badge/VS%20Code-Marketplace-green?style=for-the-badge" alt="VS Code Marketplace">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=secureguard.secureguard">
    <img src="https://img.shields.io/visual-studio-marketplace/v/secureguard.secureguard?style=for-the-badge" alt="Version">
  </a>
</p>

SecureGuard is a powerful VS Code extension that provides real-time security analysis for JavaScript and TypeScript code. It detects security vulnerabilities as you type and provides instant fixes.

## Features

### Real-Time Detection
- Analyzes code instantly as you type (300ms debounce)
- No need to save or run any commands
- Works with JavaScript (.js, .jsx) and TypeScript (.ts, .tsx) files

### Inline Diagnostics
- Red/yellow underlines highlight vulnerable code
- Severity levels: Errors (red) and Warnings (yellow)
- Shows exact location of security issues

### Interactive Fixes
- **Hover** over vulnerable code to see detailed explanation
- **Click the lightbulb** to see quick fix options
- **Apply fix** with one click to automatically replace vulnerable code

### Vulnerability Coverage

| Category | Vulnerabilities Detected |
|----------|------------------------|
| **Injection** | SQL Injection, Command Injection, eval() usage |
| **XSS** | innerHTML usage, DOM-based XSS |
| **Secrets** | Hardcoded passwords, API keys, tokens |
| **Crypto** | Weak hashing (MD5, SHA1), insecure randomness |
| **SSL/TLS** | Disabled certificate verification |

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "SecureGuard"
4. Click Install

### From VSIX File
```bash
code --install-extension secureguard-0.0.1.vsix
```

### From Source
```bash
# Clone the repository
git clone https://github.com/Ravandevil25/secureguard.git
cd secureguard

# Install dependencies
npm install

# Build the extension
npm run compile

# Package it
npx @vscode/vsce package

# Install locally
code --install-extension secureguard-0.0.1.vsix
```

## Usage

### Automatic Detection
Simply open any JavaScript or TypeScript file and start coding. SecureGuard will automatically analyze your code in real-time.

### Manual Analysis
You can also trigger analysis manually:
1. Open Command Palette (Ctrl+Shift+P)
2. Type "SecureGuard" to see available commands

### Viewing Vulnerabilities

1. **Problems Panel**: View all issues in the Problems panel (Ctrl+Shift+M)
2. **Hover**: Hover over underlined code for details
3. **Quick Fix**: Click the lightbulb icon or press Ctrl+. to apply fixes

## Detected Vulnerabilities

### SQL Injection (Error)
```javascript
// ❌ Vulnerable
const query = "SELECT * FROM users WHERE id=" + userId;

// ✅ Fixed
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);
```

### XSS - innerHTML (Error)
```javascript
// ❌ Vulnerable
element.innerHTML = userInput;

// ✅ Fixed
element.textContent = userInput;
```

### Command Injection (Error)
```javascript
// ❌ Vulnerable
exec("ls " + userInput);

// ✅ Fixed
exec("ls", [userInput]); // Use arguments array
```

### Hardcoded Secrets (Warning)
```javascript
// ❌ Vulnerable
const apiKey = "sk-1234567890abcdef";

// ✅ Fixed
const apiKey = process.env.API_KEY || '';
```

### eval() Usage (Error)
```javascript
// ❌ Vulnerable
const result = eval(userData);

// ✅ Fixed
const result = JSON.parse(userData); // For JSON parsing
```

### Weak Cryptography (Warning)
```javascript
// ❌ Vulnerable
const hash = crypto.createHash("md5");

// ✅ Fixed
const hash = crypto.createHash("sha256");
```

### Insecure Random (Warning)
```javascript
// ❌ Vulnerable
const randomId = Math.random();

// ✅ Fixed
const randomId = crypto.getRandomValues(new Uint32Array(1))[0];
```

## Extension Settings

SecureGuard works out of the box with default settings. No configuration required!

## Supported Languages

- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- JavaScript React (.jsx)
- TypeScript React (.tsx)

## Requirements

- VS Code version 1.85.0 or higher
- Node.js 18+ (for development)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by OWASP Top 10
- Built with VS Code Extension API
- Thanks to all contributors!

---

**Happy Secure Coding!** 🔒
