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
function hasEnglish(html) {
    const $ = cheerio_1.default.load(html);
    const contents = $("#toc > ul").text();
    return (contents.indexOf("English") > -1);
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
function getEtymology(html, language) {
    const $ = cheerio_1.default.load(html);
    const content = $("#mw-content-text > div.mw-parser-output").text();
    let restring = '(?<=' + language + '\\[edit\\](.|\\n)*)(?<=Etymology\\[edit\\]\\n).*';
    let re = new RegExp(restring);
    let etymology;
    etymology = content.match(re);
    if (etymology === null) {
        etymology = "";
    }
    else {
        etymology = etymology[0];
    }
    return etymology;
}
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fetchPage('https://en.wiktionary.org/wiki/octopus');
        const content2 = getLanguages(content);
        console.log(content2);
        content2.forEach((element) => {
            console.log(getEtymology(content, element));
        });
    });
})();
