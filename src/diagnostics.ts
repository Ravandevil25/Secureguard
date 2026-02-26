import * as vscode from 'vscode';
import { SecurityAnalyzer } from './analyzer';

let analyzerInstance: SecurityAnalyzer;
let diagnosticCollection: vscode.DiagnosticCollection;

export function registerHoverProvider(diagnostics: vscode.DiagnosticCollection) {
    diagnosticCollection = diagnostics;
    
    vscode.languages.registerHoverProvider(
        ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
        {
            provideHover(document, position) {
                const diagnostics = diagnosticCollection?.get(document.uri);
                
                if (!diagnostics) {
                    return null;
                }

                for (const diagnostic of diagnostics) {
                    if (diagnostic.range.contains(position)) {
                        const rule = (diagnostic as any).rule;
                        const match = (diagnostic as any).match;

                        if (rule) {
                            const markdown = new vscode.MarkdownString();
                            markdown.appendMarkdown(`## ⚠️ ${rule.name}\n\n`);
                            markdown.appendMarkdown(`**Severity:** ${getSeverityIcon(diagnostic.severity)} ${vscode.DiagnosticSeverity[diagnostic.severity]}\n\n`);
                            markdown.appendMarkdown(`**Problem:** ${rule.description}\n\n`);
                            
                            if (rule.fix) {
                                markdown.appendMarkdown(`---\n\n`);
                                markdown.appendMarkdown(`### Recommended Fix:\n`);
                                markdown.appendCodeblock(rule.fix, 'javascript');
                            }

                            return new vscode.Hover(markdown, diagnostic.range);
                        }
                    }
                }

                return null;
            }
        }
    );
}

export function registerCodeActionsProvider(
    analyzer: SecurityAnalyzer,
    diagnostics: vscode.DiagnosticCollection
) {
    analyzerInstance = analyzer;
    diagnosticCollection = diagnostics;

    vscode.languages.registerCodeActionsProvider(
        ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
        {
            provideCodeActions(document, range, context) {
                const codeActions: vscode.CodeAction[] = [];

                for (const diagnostic of context.diagnostics) {
                    if (diagnostic.source !== 'SecureGuard') {
                        continue;
                    }

                    const rule = (diagnostic as any).rule as any;
                    
                    if (rule && rule.fix) {
                        const fixAction = new vscode.CodeAction(
                            `Fix: Apply secure code`,
                            vscode.CodeActionKind.QuickFix
                        );
                        
                        fixAction.edit = new vscode.WorkspaceEdit();
                        fixAction.edit.replace(
                            document.uri,
                            diagnostic.range,
                            generateFixedCode(diagnostic, rule, document)
                        );
                        
                        fixAction.isPreferred = true;
                        codeActions.push(fixAction);

                        const learnMoreAction = new vscode.CodeAction(
                            `Learn more about ${rule.name}`,
                            vscode.CodeActionKind.Source
                        );
                        learnMoreAction.command = {
                            command: 'secureguard.learnMore',
                            title: 'Learn more',
                            arguments: [rule]
                        };
                        codeActions.push(learnMoreAction);
                    }
                }

                return codeActions;
            }
        }
    );
}

function generateFixedCode(
    diagnostic: vscode.Diagnostic,
    rule: any,
    document: vscode.TextDocument
): string {
    const originalCode = document.getText(diagnostic.range);
    
    switch (rule.id) {
        case 'innerHTML-xss':
            return 'element.textContent = userInput';
            
        case 'hardcoded-secret':
            const varName = originalCode.split('=')[0].trim();
            return `${varName} = process.env.${varName.toUpperCase().replace(' ', '_')} || ''`;
            
        case 'eval-usage':
            if (originalCode.includes('JSON')) {
                return originalCode;
            }
            return '/* Use a safer alternative */';
            
        case 'insecure-random':
            return 'crypto.getRandomValues(new Uint32Array(1))[0]';
            
        case 'weak-crypto':
            return originalCode.replace(/md5|sha1/gi, 'sha256');
            
        default:
            return rule.fix || originalCode;
    }
}

function getSeverityIcon(severity: vscode.DiagnosticSeverity): string {
    switch (severity) {
        case vscode.DiagnosticSeverity.Error:
            return '🔴';
        case vscode.DiagnosticSeverity.Warning:
            return '🟡';
        case vscode.DiagnosticSeverity.Information:
            return '🔵';
        case vscode.DiagnosticSeverity.Hint:
            return '⚪';
        default:
            return '⚠️';
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('secureguard.learnMore', (rule) => {
            if (rule && rule.description) {
                vscode.window.showInformationMessage(
                    `${rule.name}: ${rule.description}`
                );
            }
        })
    );
}
