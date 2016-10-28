var https = require('https');
var fs = require('fs');
var readline = require('readline')
var async = require('async');

function replaceEmptySpace(str){
  var replaced = str.replace(/ /g, '%20');
  return replaced;
}

function identifyValidArticle(u,aName){
  https.get(u, (res) => {
    var data="";
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      var dataObj = JSON.parse(data)
      var htmlContent = dataObj.parse.text['*']

      function checkforDialogueOrLists(s){
        if (s.search("<blockquote") >= 0 || s.search("<dl") >= 0){
          return true;
        }
        else{
          return false;
        }
       }

      if (checkforDialogueOrLists(htmlContent) === false){
        fs.appendFileSync("validWiki.txt", aName + "\n", "UTF-8",{'flags': 'a'});
      }
     })
    res.on('error', (e) => {
    console.log("There was an error with:" + aName);
  });
})
}

function doSetTimeout(callback,u,i){
  setTimeout(function(){callback(u,i)},700)
}

//this initially goes through article list and writes the titles to articles that have no quote content
// var rdFile = readline.createInterface({
//     input: fs.createReadStream('./wikiArt.txt'),
//     output: process.stdout,
//     terminal: false
// });
//
// rdFile.on('line', function(line) {
//     urlA = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=" + replaceEmptySpace(line)
//     doSetTimeout(identifyValidArticle,urlA,line);
// });

function getWikipediaContent(i){
  https.get(i, (res) => {
    var data="";
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
     function parseWikiData(dataInfo){
      dataInfo = JSON.parse(dataInfo)
      var pageid = Object.keys(dataInfo.query.pages)[0];
      return dataInfo.query.pages[pageid].extract
     }

     function cleanEntireContentString(str){
      str = str.split('= Notes =')[0]
          .split('= See also =')[0]
          .split('= References =')[0]
          .split('= Notes and references =')[0]
          .split('= Farthest South records =')[0]
          .split('= Reburial and commemorations =')[0]
          .split('= See alsoEdit =')[0]
          .split('= Bibliography =')[0]
          .split('= Modern editions =')[0]
          .split('= List of works =')[0]
          .replace(/ *\=.*\= */gi, "") //remove wiki titles
          .replace(/\=/gi, "") //remove remaining =
          .replace(/(\r\n|\n|\r)/gm, '') //remove new lines
          .replace( /([a-z|0-9|\)|\]])\.([A-Z])/g, "$1. $2") //seperates sentences with no space in between
        return str;
       }

      //break down long content string into seperate sentences
      function contentToSentences(str){
       var re = /\b(\w\.\s)|(\.+\s[a-z])|(Mrs\.|Lt\. Col\.|Fr\.|Vol\.|Nos\.|Ch\.|\sal\.\s|Sgt\.|Sen\.|c\.|\sCol\.\s[A-Z]|Gens\.|Repr\.|Lt\.|Dr\.|St\.|Mr\.|Ms\.|Cpt\.|\svs\.|\sed\.|Gov\.|\sviz\.|Adm\.|Exe\.|Rev\.|Cpl\.|Sr\.|\sv\.|Jr\.|Co\.|Trans\.|Maj\.|Gen\.|Brig\.|Capt\.|Ph\.D\.|Prof\.|Ltd\.|No\.\s|Kfz\.|Sd\.)|([\.|?|!|\.\"|"\.])\s+(?=[A-Za-z0-9])/g;
       var result = str.replace(re, function(m, g1, g2, g3, g4){
         return g1 ? g1 : (g2 ? g2 : (g3 ? g3 : g4 + "\r"))
       });
       var sentencesArr = result.split("\r");
       return sentencesArr;
      }

      function removeOrFurtherCleanSentences(arr){
        var regExpOddASCII = /\([A-Za-z0-9]|[A-Za-z0-9]\)|\s\[[A-Za-z0-9]|[A-Za-z0-9]\]\s|\s\"[A-Za-z0-9]|[A-Za-z0-9]\"\s|.\"|\.\.\./g;
        var regExpNonASCII = /[^ -z]/g;
        var regAbbreviations = /([A-Z]{2,}|[A-Z]\.[A-Z])/g;
        var regCitations = /(London:|Paris:|New York:|Antananarivo:|London,|Hansard Vol.|Oxford:|Oxford,|Dunedin:|Harlow:|Auckland:|Poetry:|Collections,|Maine:|\sed\.\s|Cambridge:|Retrieved\s[0-1]|,\spp\.|Bonn:|Accessed\s|et\sal\.)/g;
        var j = 0;
        while (j < arr.length) {
          if (arr[j].match(regExpOddASCII) !== null || arr[j].match(regExpNonASCII) !== null || arr[j].match(regAbbreviations) !== null || arr[j].match(regCitations) !== null){
            arr.splice(j, 1);
          }
          else if(arr[j].charCodeAt(0) >= 97 && arr[j].charCodeAt(0) <= 122){
            arr.splice(j, 1);
          }
          else{
              j++;
          }
        }
        var finalFutherClean = []
        arr.forEach((sentence)=>{
          return cleanSentenceStuckTogether(sentence,finalFutherClean)
        })
        return finalFutherClean;
       }

      function cleanSentenceStuckTogether(str,arr){
         var noReggi = /(Mrs\.|Vol\.|Nos\.|Ch\.|\sc\.\s|Fr\.|\sal\.\s|Sgt\.|Sen\.|\sCol\.\s[A-Z]|Gens\.|Repr\.|Lt\.|Dr\.|St\.|Mr\.|Ms\.|Cpt\.|\svs\.|\sed\.|Gov\.|\sviz\.|Adm\.|Exe\.|Rev\.|Cpl\.|Sr\.|\sv\.|Jr\.|Co\.|Trans\.|Maj\.|Gen\.|Brig\.|Capt\.|Ph\.D\.|Prof\.|Ltd\.|No\.\s)/g
         var reggi = /(([a-z0-9]|\%)\.\s[A-Z0-9]|[0-9|\%]+\.[A-Z]+|[a-z]{1,}\.[A-Z]+)/g
         var regMatch = str.match(reggi)
         var regMatchIgnore = str.match(noReggi)
         if (regMatch && regMatchIgnore === null){
           regMatch.forEach((match)=>{
             var matchIndex = str.indexOf(match)
             var sentenceMatch = str.substring(0,matchIndex) + match;
             var periodIndex = sentenceMatch.lastIndexOf('.')
             var sentence = str.substring(0,periodIndex) + '.'
             arr.push(sentence)
             str = str.slice(periodIndex+1)
           })
           if (str[0] === " "){
             arr.push(str.substring(1,str.length))
           }
           else{
             arr.push(str)
           }
         }
         else {
           arr.push(str)
         }
         return arr
       }
      function printWikiDataTextfile(){
          var content = parseWikiData(data)
          var entireContentAsStr = cleanEntireContentString(content)
          var sentencesList = removeOrFurtherCleanSentences(contentToSentences(entireContentAsStr))
          //start writing things here
          fs.appendFileSync("cleanedFinal.txt", sentencesList.join("\n"), "UTF-8",{'flags': 'a'});
          fs.appendFileSync("cleanedFinal.txt", "\n", "UTF-8",{'flags': 'a'});
      }
      printWikiDataTextfile();
    });
  });
}
console.log("**************************************************************************************************")

//THIS INCLUDES READING DATA FROM TEXTFILES
var rd = readline.createInterface({
    input: fs.createReadStream('./validWiki.txt'),
    output: process.stdout,
    terminal: false
});

rd.on('line', function(line) {
    var updS = replaceEmptySpace(line)
    var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=" + updS;
    doSetTimeout(getWikipediaContent,url);
});


// git status
// stage for commit: git add . (or specific names)
//  git commit -m ""
//  git push
//$$('a').map(a=> a.text) to pull data from chrome page
