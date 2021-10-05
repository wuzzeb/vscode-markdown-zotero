# vscode-markdown-zotero

A vscode extension to support including references to
[zotero](https://www.zotero.org/) (specifically
[better-bibtex](https://retorque.re/zotero-better-bibtex/)) when editing
markdown.

Zotero must be running for the extension to work

## Features

- Completion when entering pandoc references. Typing `[@` will bring up
  a completion window of everything in your library, and when selected
  will enter the better-bibtex citekey to produce `[@citekey]`. The popup
  will show the title, authors, and abstract.

- Bibliography information on hover. When you hover the mouse over a citation
  such as `[@somesitekey]`, zotero and better-bibtex render a bibliography entry
  (currently in the american-chemical-society style) which contains the authors,
  title, journal, etc. and shows that in a hover tooltip.
