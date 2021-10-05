import * as vscode from "vscode";
import { RefCompletions } from "./completion";
import { RefHoverProvider } from "./hover";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider("markdown", new RefCompletions(), "@"),
    vscode.languages.registerHoverProvider("markdown", new RefHoverProvider())
  );
}

export function deactivate() {}
