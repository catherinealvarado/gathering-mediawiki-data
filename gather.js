var https = require('https');


var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=" + "Imperial%20Trans-Antarctic%20Expedition";

https.get(url, (res) => {
  var data="";
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    data = JSON.parse(data)
    var pageid = Object.keys(data.query.pages)[0];
    var content = data.query.pages[pageid].extract

    function cleanString(str){
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
              .replace(/ *\=.*\= */gi, "") //remove wiki titles ----
              .replace(/\=/gi, "") //remove remaining = -----
              .replace(/(\r\n|\n|\r)/gm, '') //remove new lines ------
              .replace( /([a-z|0-9|\)|\]])\.([A-Z])/g, "$1. $2") //seperates sentences with no space in between
      return str;
     }

    //break down complex paragraph into sentences
     function paragraphsToSentences(str){
      var re = /\b(\w\.\s)|(\.+\s[a-z])|([.|?|!|.\"|"\.])\s+(?=[A-Za-z])/g;
      var result = str.replace(re, function(m, g1, g2, g3){
        return g1 ? g1 : (g2 ? g2 : g3 + "\r")
      });
      var sentencesArr = result.split("\r");
      return sentencesArr;
     }
     /* Match for the following cases
      /a-z. /gi need the length of a-z to be greater than one like Mr. -- Mrs.
     */

//need to account for ...
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

    contents = cleanString(content)
    var sentences = removeNonValidSentences(paragraphsToSentences(contents),regExp)
    console.log(contents)
    for (var i = 0;i < sentences.length;i++){
      console.log("**"+i+":  ",sentences[i]);
    }
  });
})

console.log("**************************************************************************************************")
console.log("**************************************************************************************************")
console.log("**************************************************************************************************")

// git status
// stage for commit: git add . (or specific names)
//  git commit -m ""
//  git push

/*
Peter questions remove:
:
time
better to have sentences without abbreaviations
*/
