# Wiktionary Etymology API

## About The API

wiktionary-etymology-api is an API that allows you to find the etymology for a word in various languages (if the word exists in multiple languages) by scraping Wiktionary. There are minor bugs here and there.

The API may be slow to respond. Please be patient!


## Usage

API root: https://18c4-205-175-106-123.ngrok-free.app

Endpoints:
- `/` - Nothing. It tells you "AYlmao".
- `/get` - This is what you want to use. Query as follows:
    - `word` - The word you wish to find the etymology for.

Response JSONs are in the following format:
```[
    [], // list of languages the word is found in
    {
        "language1": "etymology1",      // language & etymology in order of list of languages preceding
        "language2": "etymology2",      // if a word has multiple etymologies for one language, only the
        ...                             // first is included in this response
    }
]
```