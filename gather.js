var https = require('https');


var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=" + "1960%20South%20Vietnamese%20coup%20attempt";//Stack%20Overflow
//https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=1689%20Boston%20revolt

//might want to remove this:
/* use a regex function that outputs any special characters used except ' , - ! ...(figure out better way to parse this)
1964%20Brinks%20Hotel%20bombing think about accronyms

Arrest%20and%20assassination%20of%20Ngo%20Dinh%20Diem
1981%20Irish%20hunger%20strike ///// look at the end //look into:the right not to wear a prison uniform;
*/



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
              .split('= See also =')[0] // IS THIS NECESSARY?
              .split('= References =')[0]
              .split('= Farthest South records =')[0]
              //more specific for certain articles:
              .split('= U.S. reaction =')[0]
              .split('= Postwar politics =')[0]
              .replace(/ *\=.*\= */gi, "") //remove wiki titles
              .replace(/\=/gi, "") //remove remaining =
              .replace(/(\r\n|\n|\r)/gm, '') //remove new lines
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
      // var sentencesArr = str.match(/[A-Z](?:[^\.!\?]|\.(?=\d+)|\.(?:\.+\s[a-z]))*[\.!\?]/g);
      // return sentencesArr;

      /* Match for the following cases
       /a-z. /gi need the length of a-z to be greater than one like Mr. Mrs. Jr.
      */
    }

    var regExp = /\s\([A-Za-z0-9]|[A-Za-z0-9]\)\s|\s\[[A-Za-z0-9]|[A-Za-z0-9]\]\s|\s\"[A-Za-z0-9]|[A-Za-z0-9]\"\s|.\"/g;
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
*/
