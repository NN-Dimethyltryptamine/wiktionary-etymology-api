"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const express = require('express');
const app = express();
const port = 3000;
function fetchPage(url) {
    const HTMLData = axios_1.default
        .get(url)
        .then(res => res.data)
        .catch((error) => {
        // do nothing lmao
        return "";
    });
    return HTMLData;
}
function hasContent(html) {
    const $ = cheerio_1.default.load(html);
    const content = $("#toc > ul");
    return content.length > 0;
}
function getLanguages(html) {
    const $ = cheerio_1.default.load(html);
    const content = $("#toc > ul").text();
    const regexmatch = content.match(/(?<=[0-9]+ )(?<!\.(.*)).*/g);
    if (regexmatch === null) {
        return [""];
    }
    return regexmatch;
}
function getEtymologies(html, languages) {
    const $ = cheerio_1.default.load(html);
    let etymologies = {};
    let content = $("#mw-content-text > div.mw-parser-output").text();
    //console.log("heading into loop");
    for (let i = 0; i < languages.length; i++) {
        // console.log(languages[i]);
        let languagelookaround = '(?<=' + languages[i] + '\\[edit\\](.|\\n)*)';
        // console.log(languagelookaround + 'Etymology' + (i === languages.length-1?"":`(?=${languages[i+1]})`));
        if (content.match(languagelookaround + 'Etymology' + (i === languages.length - 1 ? "" : `(?=(.|\\n)*${languages[i + 1]})`)) === null) {
            etymologies[languages[i]] = "no etymology on file";
            continue;
        }
        let etymologylookaround = '(?<=Etymology( [0-9]*)*\\[edit\\]\\n).*';
        let re = new RegExp(languagelookaround + etymologylookaround);
        let etymology;
        etymology = content.match(re);
        if (etymology === null) {
            etymology = "";
        }
        else {
            etymology = etymology[0];
        }
        etymologies[languages[i]] = etymology;
    }
    return etymologies;
}
app.get("/", (req, res) => {
    console.log(`Request received: ${req.url}`);
    console.dir(req.query);
    res.send("AYlmao");
});
app.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let word = req.query.word;
    const content = yield fetchPage(`https://en.wiktionary.org/wiki/${word}`);
    if (!hasContent(content)) {
        res.send({});
    }
    else {
        const content2 = getLanguages(content);
        const etymologies = getEtymologies(content, content2);
        res.send([content2, etymologies]);
    }
}));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// (async function () {
//     const content = await fetchPage('https://en.wiktionary.org/wiki/pool');
//     const content2 = getLanguages(content);
//     console.log(content2);
//     console.log(getEtymologies(content, content2));
// })();
