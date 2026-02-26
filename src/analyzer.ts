import * as vscode from 'vscode';
import { VulnerabilityFinding, SecurityRule } from './types';
import { securityRules } from './rules';

export class SecurityAnalyzer {
    private rules: SecurityRule[];

    constructor() {
        this.rules = securityRules;
    }

    analyze(text: string, uri: vscode.Uri): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const lines = text.split('\n');

        for (const rule of this.rules) {
            const matches = this.findMatches(text, rule.pattern);
            
            for (const match of matches) {
                const position = this.findPosition(text, match);
                
                if (position) {
                    const diagnostic = new vscode.Diagnostic(
                        position.range,
                        rule.messageBuilder(match),
                        rule.severity
                    );
                    
                    diagnostic.code = {
                        value: rule.id,
                        target: uri
                    };
                    
                    diagnostic.source = 'SecureGuard';
                    diagnostic.range = position.range;
                    
                    (diagnostic as any).rule = rule;
                    (diagnostic as any).match = match;
                    
                    diagnostics.push(diagnostic);
                }
            }
        }

        return diagnostics;
    }

    private findMatches(text: string, pattern: RegExp): string[] {
        const matches: string[] = [];
        let match: RegExpExecArray | null;
        
        const regex = new RegExp(pattern.source, pattern.flags);
        
        while ((match = regex.exec(text)) !== null) {
            matches.push(match[0]);
            
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }
        }
        
        return matches;
    }

    private findPosition(text: string, match: string): { range: vscode.Range } | null {
        const lines = text.split('\n');
        let currentIndex = 0;

        for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
            const line = lines[lineNumber];
            const matchIndex = line.indexOf(match);

            if (matchIndex !== -1) {
                const startPos = new vscode.Position(lineNumber, matchIndex);
                const endPos = new vscode.Position(lineNumber, matchIndex + match.length);
                
                return {
                    range: new vscode.Range(startPos, endPos)
                };
            }
        }

        return null;
    }

    getRule(id: string): SecurityRule | undefined {
        return this.rules.find(rule => rule.id === id);
    }

    getAllRules(): SecurityRule[] {
        return this.rules;
    }
}
