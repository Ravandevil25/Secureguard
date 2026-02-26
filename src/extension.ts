import * as vscode from 'vscode';
import { SecurityAnalyzer } from './analyzer';
import { registerHoverProvider, registerCodeActionsProvider } from './diagnostics';

let analyzer: SecurityAnalyzer;
let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
    analyzer = new SecurityAnalyzer();

    diagnosticCollection = vscode.languages.createDiagnosticCollection('secureguard');

    registerHoverProvider(diagnosticCollection);
    registerCodeActionsProvider(analyzer, diagnosticCollection);

    const runAnalysis = (document: vscode.TextDocument) => {
        if (document.languageId !== 'javascript' && 
            document.languageId !== 'javascriptreact' &&
            document.languageId !== 'typescript' && 
            document.languageId !== 'typescriptreact') {
            return;
        }

        const text = document.getText();
        const uri = document.uri;
        const diagnostics = analyzer.analyze(text, uri);
        
        diagnosticCollection.set(uri, diagnostics);
    };

    const debounceMap = new Map<string, NodeJS.Timeout>();

    const debouncedAnalysis = (document: vscode.TextDocument) => {
        const uriString = document.uri.toString();
        
        if (debounceMap.has(uriString)) {
            clearTimeout(debounceMap.get(uriString)!);
        }

        const timeout = setTimeout(() => {
            runAnalysis(document);
            debounceMap.delete(uriString);
        }, 300);

        debounceMap.set(uriString, timeout);
    };

    vscode.workspace.onDidOpenTextDocument((document) => {
        debouncedAnalysis(document);
    });

    vscode.workspace.onDidChangeTextDocument((event) => {
        debouncedAnalysis(event.document);
    });

    vscode.workspace.textDocuments.forEach((document) => {
        debouncedAnalysis(document);
    });

    vscode.window.showInformationMessage('SecureGuard activated - Real-time security analysis enabled');
}

export function deactivate() {}
