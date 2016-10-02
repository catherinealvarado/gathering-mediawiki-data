var https = require('https');


var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=" + "Assassination%20of%20Spencer%20Perceval";//Stack%20Overflow
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
      str = str
              // .split('== Notes ==')[0]
              //
              .split('= Notes =')[0]
              .split('= See also =')[0] // IS THIS NECESSARY?
              .split('= References =')[0]
              .split('= Farthest South records =')[0]

              //more specific for articles:
              .split('= U.S. reaction =')[0]
              .split('= Postwar politics =')[0]
              .replace(/ *\=.*\= */gi, "")

              // .replace(/ *\([^)]*\) */g, "") //remove all sentences with parenthesis [FUTURE]
              // .replace(/ *\[[^)]*\] */g, " ") //remove all sentences with [] [FUTURE]

              //DO THIS WHEN DONE CLEANING!!! this once everything cleaned
              // .replace(/(\r\n|\n|\r)/gm, '') //remove new lines
              // var content = content.replace(/(\r\n|\n|\r)/gm, '')//removing new lines
      return str;
    }

    //need to figure out how to break down paragraph into sentences 
    function paragraphsToSentences(str){
      /*
       /a-z. /gi need the length of a-z to be greater than one
       /". /
       /a-z." /
       /?. /
       /!. /
       /'. /

       There once was a fellow called H. J. Hawkin was a poop.
      */

    }
    content = cleanString(content)
    console.log(content)
  });
})

console.log("**************************************************************************************************")
console.log("**************************************************************************************************")
console.log("**************************************************************************************************")

// git status
// stage for commit: git add . (or specific names)
//  git commit -m ""
//  git push
