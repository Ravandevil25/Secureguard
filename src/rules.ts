import * as vscode from 'vscode';
import { SecurityRule } from './types';

export const securityRules: SecurityRule[] = [
    {
        id: 'sql-injection',
        name: 'SQL Injection',
        description: 'Potential SQL injection vulnerability detected. User input is directly concatenated into SQL queries.',
        severity: vscode.DiagnosticSeverity.Error,
        pattern: /query\s*=\s*['"].*\+\s*\w+|sql\s*=\s*['"].*\+\s*\w+/gi,
        messageBuilder: (match) => `SQL Injection: Direct string concatenation in SQL query. Use parameterized queries instead.`,
        fix: 'Use parameterized queries: db.query("SELECT * FROM users WHERE id = ?", [userId])'
    },
    {
        id: 'eval-usage',
        name: 'Dangerous eval()',
        description: 'eval() function executes arbitrary code. This is extremely dangerous and can lead to code injection attacks.',
        severity: vscode.DiagnosticSeverity.Error,
        pattern: /\beval\s*\(\s*[\w\d"'`]+/g,
        messageBuilder: (match) => `Dangerous eval(): Using eval() allows arbitrary code execution. Use safer alternatives like JSON.parse().`,
        fix: 'Use JSON.parse() for parsing JSON, or a sandbox for code execution'
    },
    {
        id: 'hardcoded-secret',
        name: 'Hardcoded Secret',
        description: 'Potential hardcoded password, API key, or secret detected in the code.',
        severity: vscode.DiagnosticSeverity.Warning,
        pattern: /(password\s*=\s*['"][^'"`]+['"]|apiKey\s*=\s*['"][^'"`]+['"]|api_key\s*=\s*['"][^'"`]+['"]|secret\s*=\s*['"][^'"`]+['"]|token\s*=\s*['"][^'"`]+['"]|privateKey\s*=\s*['"][^'"`]+['"]|accessToken\s*=\s*['"][^'"`]+['"])/gi,
        messageBuilder: (match) => `Hardcoded Secret: Found hardcoded sensitive data. Use environment variables or a secrets manager.`,
        fix: 'Use process.env.API_KEY or a secrets manager'
    },
    {
        id: 'innerHTML-xss',
        name: 'Cross-Site Scripting (XSS)',
        description: 'Potential XSS vulnerability. User input is being assigned to innerHTML without sanitization.',
        severity: vscode.DiagnosticSeverity.Error,
        pattern: /\.innerHTML\s*=\s*[\w\d"'`]+/g,
        messageBuilder: (match) => `XSS Vulnerability: Using innerHTML with unsanitized input can lead to cross-site scripting attacks.`,
        fix: 'Use textContent instead of innerHTML, or sanitize with DOMPurify'
    },
    {
        id: 'command-injection',
        name: 'Command Injection',
        description: 'Potential command injection vulnerability. User input is being passed to shell commands.',
        severity: vscode.DiagnosticSeverity.Error,
        pattern: /(exec\s*\(\s*[\w\d"'`\+\.]+|spawn\s*\(\s*[\w\d"'`]+|system\s*\(\s*[\w\d"'`]+|child_process.*execSync\s*\(\s*[\w\d"'`\+\.]+)/g,
        messageBuilder: (match) => `Command Injection: Passing unsanitized input to shell commands is dangerous.`,
        fix: 'Use execFile with arguments array, or validate/sanitize input thoroughly'
    },
    {
        id: 'weak-crypto',
        name: 'Weak Cryptography',
        description: 'Weak cryptographic algorithm detected. MD5 and SHA1 are considered insecure.',
        severity: vscode.DiagnosticSeverity.Warning,
        pattern: /(crypto\.createHash\s*\(\s*['"]md5['"]\)|crypto\.createHash\s*\(\s*['"]sha1['"]\)|MD5\(|SHA1\(|md5\(|sha1\()/gi,
        messageBuilder: (match) => `Weak Cryptography: MD5/SHA1 are insecure. Use SHA-256 or stronger.`,
        fix: 'Use crypto.createHash("sha256") or stronger algorithms'
    },
    {
        id: 'insecure-random',
        name: 'Insecure Random',
        description: 'Math.random() is not cryptographically secure. Use crypto.getRandomValues() instead.',
        severity: vscode.DiagnosticSeverity.Warning,
        pattern: /Math\.random\s*\(\s*\)/g,
        messageBuilder: (match) => `Insecure Random: Math.random() is predictable. Use crypto.getRandomValues() for security.`,
        fix: 'Use crypto.getRandomValues() or the uuid package'
    },
    {
        id: 'disabled-ssl',
        name: 'Disabled SSL Verification',
        description: 'SSL/TLS certificate verification is being disabled. This is dangerous for security.',
        severity: vscode.DiagnosticSeverity.Error,
        pattern: /(rejectUnauthorized\s*:\s*false|secure\s*:\s*false|ssl_verify\s*:\s*false|verify\s*:\s*false)/gi,
        messageBuilder: (match) => `Disabled SSL: Disabling SSL verification exposes you to man-in-the-middle attacks.`,
        fix: 'Enable SSL verification or use proper certificates'
    },
    {
        id: 'dangerous-import',
        name: 'Dangerous Import',
        description: 'Importing dangerous modules that can execute arbitrary code.',
        severity: vscode.DiagnosticSeverity.Warning,
        pattern: /(require\s*\(\s*['"]child_process['"]\)|import\s+.*\s+from\s+['"]child_process['"])/g,
        messageBuilder: (match) => `Dangerous Import: child_process can be exploited. Ensure proper input validation.`,
        fix: 'Validate all inputs and use safe alternatives when possible'
    },
    {
        id: 'cookie-no-secure',
        name: 'Insecure Cookie',
        description: 'Cookie being set without secure flag. This can expose sensitive data.',
        severity: vscode.DiagnosticSeverity.Warning,
        pattern: /(Set-Cookie\s*:.*[^\s]secure[^s]|cookie\s*=\s*['"][^'"]*['"][^;]*;\s*secure)/gi,
        messageBuilder: (match) => `Insecure Cookie: Add 'Secure' flag to cookies containing sensitive data.`,
        fix: 'Add "; Secure" to cookie string'
    }
];
