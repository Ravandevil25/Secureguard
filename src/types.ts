import * as vscode from 'vscode';

export interface VulnerabilityFinding {
    rule: SecurityRule;
    range: vscode.Range;
    match: string;
    fix?: string;
}

export interface SecurityRule {
    id: string;
    name: string;
    description: string;
    severity: vscode.DiagnosticSeverity;
    pattern: RegExp;
    fix?: string;
    messageBuilder: (match: string) => string;
}

export interface AnalysisResult {
    filePath: string;
    findings: VulnerabilityFinding[];
}
