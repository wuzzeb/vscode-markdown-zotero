import * as vscode from "vscode";
import { bibliography } from "./rpc";

export const refPattern = "(\\[@)([^\\[\\]]+?)(\\])";

function getReferenceAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position
): { range: vscode.Range; citekey: string } | null {
  const range = document.getWordRangeAtPosition(position, new RegExp(refPattern));

  if (!range) {
    return null;
  }

  const citekey = document.getText(range).replace("[@", "").replace("]", "");
  return {
    range,
    citekey,
  };
}

export class RefHoverProvider implements vscode.HoverProvider {
  async provideHover(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover | null> {
    const ref = getReferenceAtPosition(document, position);
    if (!ref) {
      return null;
    }

    const bib = await bibliography(ref.citekey, "text");

    /*
    https://github.com/microsoft/vscode/issues/40607

    const markdown = new vscode.MarkdownString();
    markdown.isTrusted = true;
    markdown.appendMarkdown(bib);
    */

    return new vscode.Hover(bib, ref.range);
  }
}
