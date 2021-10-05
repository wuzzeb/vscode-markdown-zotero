import fetch from "node-fetch";

export interface Citation {
  readonly citekey: string;
  readonly title: string;
  readonly abstract: string;
  readonly author: ReadonlyArray<{ readonly family: string; readonly given: string }>;
  // there are more properties such as ID, author, DOI, etc. but we are not using them
}

const url = "http://localhost:23119/better-bibtex";
const style = "american-chemical-society";

async function rpc<T>(method: string, params: ReadonlyArray<unknown>): Promise<T> {
  const body = {
    jsonrpc: "2.0",
    method,
    params,
  };
  const response = await fetch(url + "/json-rpc", {
    method: "POST",
    body: JSON.stringify(body),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    const data = await response.json();
    return (data as any).result;
  } else {
    throw new Error(`Unable to communicate with zotero: ${response.status}`);
  }
}

export function search(query: string): Promise<ReadonlyArray<Citation>> {
  return rpc<ReadonlyArray<Citation>>("items.search", [query]);
}

export function bibliography(citekey: string, format: "html" | "text"): Promise<string> {
  return rpc<string>("items.bibliography", [[citekey], { contentType: format, id: style }]);
}

export async function allLibraryRefs(): Promise<ReadonlyArray<Citation>> {
  const response = await fetch(url + "/export/library?=/library.json");
  if (response.ok) {
    const entries = (await response.json()) as any;
    for (const e of entries) {
      e.citekey = e.id;
    }
    return entries;
  } else {
    throw new Error(`Unable to communicate with zotero: ${response.status}`);
  }
}
