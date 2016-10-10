var https = require('https');
var fs = require('fs');
var wikiArticles = require('./wikiArticles.js');


function replaceEmptySpace(arr){
  var updatedArr = arr.map((s)=>{
    return s.replace(/ /g, '%20')
  })
  return updatedArr;
}


var getWikipediaContent = function(i){
  https.get(i, (res) => {
    var data="";
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      data = JSON.parse(data)
      var pageid = Object.keys(data.query.pages)[0];
      var content = data.query.pages[pageid].extract

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
      var regExp = /\s\([A-Za-z0-9]|[A-Za-z0-9]\)\s|\s\[[A-Za-z0-9]|[A-Za-z0-9]\]\s|\s\"[A-Za-z0-9]|[A-Za-z0-9]\"\s|.\"|\.\.\./g;
      function removeNonValidSentences(arr,regex){
        var j = 0;
        while (j < arr.length) {
          if (arr[j].match(regex) || (arr[j].charCodeAt(0) >= 97 && arr[j].charCodeAt(0) <= 122)){
              arr.splice(j, 1);
          }
          else{
              j++;
          }
        }
        return arr;
      }

      var entireContentAsStr = cleanEntireContentString(content)
      var sentencesList = removeNonValidSentences(contentToSentences(entireContentAsStr),regExp)
      //start writing things here
      fs.appendFileSync("sentences.txt", sentencesList.join("\n"), "UTF-8",{'flags': 'a'});
    });
  })
}

console.log("**************************************************************************************************")
console.log("**************************************************************************************************")
console.log("**************************************************************************************************")

var wikipediaArticleTitles = replaceEmptySpace(wikiArticles.articles);
for (var i = 0; i < wikipediaArticleTitles.length; i++){
  var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=" + wikipediaArticleTitles[i];
  console.log(wikipediaArticleTitles[i])
  getWikipediaContent(url);
}

// git status
// stage for commit: git add . (or specific names)
//  git commit -m ""
//  git push
