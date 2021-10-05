import { CompletionItem, CompletionItemKind, CompletionItemProvider, Position, TextDocument } from "vscode";
import { allLibraryRefs } from "./rpc";

function combineAuthors(authors: ReadonlyArray<{ readonly family: string; readonly given: string }>): string {
  return authors.map((a) => `${a.given} ${a.family}`).join(", ");
}

export class RefCompletions implements CompletionItemProvider {
  async provideCompletionItems(document: TextDocument, position: Position): Promise<CompletionItem[] | undefined> {
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    const isRefAutocomplete = linePrefix.match(/\[@\w*$/);

    if (!isRefAutocomplete) {
      return undefined;
    }

    return (await allLibraryRefs()).map((ref) => {
      const c = new CompletionItem({
        label: ref.title,
        detail: ref.citekey,
      });
      c.kind = CompletionItemKind.Reference;
      c.filterText = `${ref.citekey} ${ref.title} ${combineAuthors(ref.author)}`;
      c.documentation = `${ref.title}\n\n${combineAuthors(ref.author)}\n\n${ref.abstract}`;
      c.insertText = ref.citekey;
      return c;
    });
  }
}
