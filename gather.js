var https = require('https');
var fs = require('fs');
var wikiArticles = require('./wikiArticles.js');


function replaceEmptySpace(arr){
  var updatedArr = arr.map((s)=>{
    return s.replace(/ /g, '%20')
  })
  return updatedArr;
}

var getWikipediaContent = function(i,a){
  https.get(i, (res) => {
    var data="";
    res.on('data', (chunk) => {
      data += chunk;
    });
  https.get(a, (res) => {
    var htmldata="";
    res.on('data', (chunk) => {
      htmldata += chunk;
    });
    res.on('end', () => {
      htmldata = JSON.parse(htmldata)
      var htmlContent = htmldata.parse.text['*']

      function checkforDialogueOrLists(s){
        if (s.search("<blockquote") >= 0 || s.search("<dl") >= 0){ ////SHOULD I CHECK FOR DL HERE??
          return true;
        }
        else{
          return false;
        }
       }

       function parseWikiData(){
        data = JSON.parse(data)
        var pageid = Object.keys(data.query.pages)[0];
        return data.query.pages[pageid].extract  //var content
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
            .split('= U.S. reaction =')[0]
            .split('= Postwar politics =')[0]
            .split('= Trials of Kamo =')[0]
            .split('In What If the Gunpowder Plot Had Succeeded?')[0]
            .split('BBC correspondent Ben Bradshaw described')[0]
            .split('The first iron-cased and metal-cylinder rocket')[0]
            .split('On handing over control to the Atomic Energy Commission')[0]
            .split('Three counties were composed of the following')[0]
            .split('Although frontality in portraiture was')[0]
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
        if (checkforDialogueOrLists(htmlContent) === false){
          var content = parseWikiData()
          var entireContentAsStr = cleanEntireContentString(content)
          var sentencesList = removeNonValidSentences(contentToSentences(entireContentAsStr))
          //start writing things here
          fs.appendFileSync("sentences.txt", sentencesList.join("\n"), "UTF-8",{'flags': 'a'});
        }
      }
      printWikiDataTextfile();
    });
  });
})
}

console.log("**************************************************************************************************")
console.log("**************************************************************************************************")
console.log("**************************************************************************************************")

//CONTINUE HERE!!
//next step: get alot of wiki articles and put into list in wikiArticles.js
//create a function for everything below, now note that you need to account for two different links
//continue testing to make sure all functions work the way you want!! ex) correctly identify dialouge boxes, what about dl bullet points

//UNCOMMENT THIS AND TURN INTO FUNCTION
// var wikipediaArticleTitles = replaceEmptySpace(wikiArticles.articles);
// for (var i = 0; i < wikipediaArticleTitles.length; i++){
//   var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=" + wikipediaArticleTitles[i];
//   console.log(wikipediaArticleTitles[i])
//   getWikipediaContent(url);
// }

//NOW NEED TO ACCOUNT FOR TWO URLS!!
var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=1907%20Tiflis%20bank%20robbery"
var ht = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=1907%20Tiflis%20bank%20robbery&prop=text"
getWikipediaContent(url,ht)


// git status
// stage for commit: git add . (or specific names)
//  git commit -m ""
//  git push
