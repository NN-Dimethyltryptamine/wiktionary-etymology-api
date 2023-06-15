import axios from 'axios';
import cheerio from 'cheerio';

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

// function hasContent(html: string, selector: string): boolean {
//     #mw-content-text
// }

function getLanguages(html: string): RegExpMatchArray {
    const $ = cheerio.load(html);
    const content = $("#toc > ul").text();
    const regexmatch = content.match(/(?<=[0-9]+ )(?<!\.(.*)).*/g);
    if(regexmatch === null){
        return [""];
    }
    return regexmatch;
}

function getEtymologies(html: string, languages: string[]): {[key: string]: string} {
    const $ = cheerio.load(html);
    let etymologies: {[key: string]: string} = {}
    let content = $("#mw-content-text > div.mw-parser-output").text();
    //console.log("heading into loop");
    for(let i = 0; i < languages.length; i++){
        // console.log(languages[i]);
        let languagelookaround = '(?<=' + languages[i] + '\\[edit\\](.|\\n)*)';
        // console.log(languagelookaround + 'Etymology' + (i === languages.length-1?"":`(?=${languages[i+1]})`));
        if(content.match(languagelookaround + 'Etymology' + (i === languages.length-1?"":`(?=(.|\\n)*${languages[i+1]})`)) === null){
            etymologies[languages[i]] = "no etymology on file";
            continue;
        }
        let etymologylookaround = '(?<=Etymology( [0-9]*)*\\[edit\\]\\n).*';
        let re = new RegExp(languagelookaround + etymologylookaround);
        let etymology;
        etymology = content.match(re);
        if(etymology === null){
            etymology = "";
        }
        else{
            etymology = etymology[0];
        }
        etymologies[languages[i]] = etymology;
    }
    return etymologies;
}

(async function () {
    const content = await fetchPage('https://en.wiktionary.org/wiki/pool');
    const content2 = getLanguages(content);
    console.log(content2);
    console.log(getEtymologies(content, content2));
})();