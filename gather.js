var https = require('https');
var fs = require('fs');
var readline = require('readline')
var wikiArticles = require('./wikiArticles.js');
var async = require('async');
var allArticlesReadingFrom;

function replaceEmptySpace(arr){
  var updatedArr = arr.map((s)=>{
    return s.replace(/ /g, '%20')
  })
  return updatedArr;
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
  setTimeout(function(){callback(u,i)},500)
}

function finalCleaner(){
 var e = wikiArticles.articles;
  for (var i = 0; i<e.length ; i++){
    var nameOfArticle = e[i];
    urlA = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=" + replaceEmptySpace([e[i]])[0]
    doSetTimeout(identifyValidArticle,urlA,nameOfArticle);
  }
}

//writes to seperate text file
//finalCleaner()

var getWikipediaContent = function(i){
  https.get(i, (res) => {
    var data="";
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
     function parseWikiData(dataInfo){
      dataInfo = JSON.parse(dataInfo)
      var pageid = Object.keys(dataInfo.query.pages)[0];
      return dataInfo.query.pages[pageid].extract  //var content
     }

     function cleanEntireContentString(str){
      str = str.split('= Notes =')[0]
          .split('= See also =')[0]
          .split('= References =')[0]
          .split('= Notes and references =')[0]
          .split('= Farthest South records =')[0]
          .split('= Reburial and commemorations =')[0]
          .split('= See alsoEdit =')[0]
            //more specific for certain articles:
            // .split('= U.S. reaction =')[0]
            // .split('= Postwar politics =')[0]
            // .split('= Trials of Kamo =')[0]
            // .split('In What If the Gunpowder Plot Had Succeeded?')[0]
            // .split('BBC correspondent Ben Bradshaw described')[0]
            // .split('The first iron-cased and metal-cylinder rocket')[0]
            // .split('On handing over control to the Atomic Energy Commission')[0]
            // .split('Three counties were composed of the following')[0]
            // .split('Although frontality in portraiture was')[0]

          //further cleans content string
          .replace(/ *\=.*\= */gi, "") //remove wiki titles
          .replace(/\=/gi, "") //remove remaining =
          .replace(/(\r\n|\n|\r)/gm, '') //remove new lines
          .replace( /([a-z|0-9|\)|\]])\.([A-Z])/g, "$1. $2") //seperates sentences with no space in between
        return str;
       }
      //break down long content string into seperate sentences
      function contentToSentences(str){
       var re = /\b(\w\.\s)|(\.+\s[a-z])|(Mrs.|Lt.|Dr.|St.|Mr.)|([.|?|!|.\"|"\.])\s+(?=[A-Za-z])/g;
       var result = str.replace(re, function(m, g1, g2, g3, g4){
         return g1 ? g1 : (g2 ? g2 : (g3 ? g3 : g4 + "\r"))
       });
       var sentencesArr = result.split("\r");
       return sentencesArr;
      }
      //remove sentences with (,),[,],",", and ... ###CHECK IF ' IS BEING REMOVED!!!
      function removeNonValidSentences(arr){
        var regExpOddASCII = /\s\([A-Za-z0-9]|[A-Za-z0-9]\)\s|\s\[[A-Za-z0-9]|[A-Za-z0-9]\]\s|\s\"[A-Za-z0-9]|[A-Za-z0-9]\"\s|.\"|\.\.\./g;
        var regExpNonASCII = /[^ -z]/g
        var j = 0;
        while (j < arr.length) {
          if (arr[j].match(regExpOddASCII) || arr[j].match(regExpNonASCII) !== null){
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
console.log("**************************************************************************************************")
console.log("**************************************************************************************************")

//CONTINUE HERE!!
//next step: get alot of wiki articles and put into list in wikiArticles.js
//create a function for everything below, now note that you need to account for two different links
//continue testing to make sure all functions work the way you want!! ex) correctly identify dialouge boxes

function pullAllData(arrTitles){
  for (var i = 0; i < arrTitles.length; i++){
    console.log(arrTitles[i])
    var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=" + arrTitles[i];
    console.log(url)
    var ht = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=" + arrTitles[i];
    getWikipediaContent(url,ht);
  }
}
var allArticleTitles = replaceEmptySpace(wikiArticles.articles);
//pullAllData(allArticleTitles);

///THIS INCLUDES READING DATA FROM TEXTFILES
//write function to read information from textfile
var rd = readline.createInterface({
    input: fs.createReadStream('./validWiki.txt'),
    output: process.stdout,
    terminal: false
});

allArticlesReadingFrom = []
rd.on('line', function(line) {
    console.log(typeof line);
});

// git status
// stage for commit: git add . (or specific names)
//  git commit -m ""
//  git push
