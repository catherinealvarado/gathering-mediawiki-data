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

//Read text file
var rdFile = readline.createInterface({
    input: fs.createReadStream('./wikiArt.txt'),
    output: process.stdout,
    terminal: false
});

rdFile.on('line', function(line) {
    urlA = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=" + replaceEmptySpace(line)
    doSetTimeout(identifyValidArticle,urlA,line);
});


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
          .replace(/ *\=.*\= */gi, "") //remove wiki titles
          .replace(/\=/gi, "") //remove remaining =
          .replace(/(\r\n|\n|\r)/gm, '') //remove new lines
          .replace( /([a-z|0-9|\)|\]])\.([A-Z])/g, "$1. $2") //seperates sentences with no space in between
        return str;
       }

      //break down long content string into seperate sentences
      function contentToSentences(str){
       var re = /\b(\w\.\s)|(\.+\s[a-z])|(Mrs.|Lt.|Dr.|St.|Mr.|Sr.)|([.|?|!|.\"|"\.])\s+(?=[A-Za-z])/g;
       var result = str.replace(re, function(m, g1, g2, g3, g4){
         return g1 ? g1 : (g2 ? g2 : (g3 ? g3 : g4 + "\r"))
       });
       var sentencesArr = result.split("\r");
       return sentencesArr;
      }

      //remove sentences with (,),[,],",", and ... ###CHECK IF ' IS BEING REMOVED!!!
      function removeNonValidSentences(arr){
        var regExpOddASCII = /\s\([A-Za-z0-9]|[A-Za-z0-9]\)\s|\s\[[A-Za-z0-9]|[A-Za-z0-9]\]\s|\s\"[A-Za-z0-9]|[A-Za-z0-9]\"\s|.\"|\.\.\./g;
        var regExpNonASCII = /[^ -z]/g;
        var regAbbreviations = / \b[A-Z]{2,}\b/g;
        var j = 0;
        while (j < arr.length) {
          if (arr[j].match(regExpOddASCII) || arr[j].match(regExpNonASCII) !== null || arr[j].match(regAbbreviations)){
            arr.splice(j, 1);
          }
          else if(arr[j].charCodeAt(0) >= 97 && arr[j].charCodeAt(0) <= 122){
            arr.splice(j, 1);
          }
          else{
              j++;
          }
        }
        return arr;
       }

      function printWikiDataTextfile(){
          var content = parseWikiData(data)
          var entireContentAsStr = cleanEntireContentString(content)
          var sentencesList = removeNonValidSentences(contentToSentences(entireContentAsStr))
          //start writing things here
          fs.appendFileSync("sentences.txt", sentencesList.join("\n"), "UTF-8",{'flags': 'a'});
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
