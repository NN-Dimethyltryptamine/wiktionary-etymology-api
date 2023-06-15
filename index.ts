import axios from 'axios';
import cheerio from 'cheerio';
import { getegid } from 'process';

function fetchPage(url: string): Promise<string> {
    const HTMLData = axios
        .get(url)
        .then(res => res.data)
        .catch((error) => {
            // do nothing lmao
            return ""
        });

    return HTMLData;
}

function hasEnglish(html: string): boolean {
    const $ = cheerio.load(html);
    const contents = $("#toc > ul").text();
    return (contents.indexOf("English") > -1);
}

function getLanguages(html: string): RegExpMatchArray {
    const $ = cheerio.load(html);
    const content = $("#toc > ul").text();
    const regexmatch = content.match(/(?<=[0-9]+ )(?<!\.(.*)).*/g);
    if(regexmatch === null){
        return [""];
    }
    return regexmatch;
}

function getEtymology(html: string, language: string): string {
    const $ = cheerio.load(html);
    const content = $("#mw-content-text > div.mw-parser-output").text();
    let restring = '(?<=' + language + '\\[edit\\](.|\\n)*)(?<=Etymology\\[edit\\]\\n).*';
    let re = new RegExp(restring)
    let etymology;
    etymology = content.match(re);
    if(etymology === null){
        etymology = "";
    }
    else{
        etymology = etymology[0];
    }
    return etymology;
}

(async function () {
    const content = await fetchPage('https://en.wiktionary.org/wiki/octopus');
    const content2 = getLanguages(content);
    console.log(content2);
    content2.forEach((element) => {
        console.log(getEtymology(content, element));
    })
})();