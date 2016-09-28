var https = require('https');


var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=1960%20South%20Vietnamese%20coup%20attempt";//Stack%20Overflow
//https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=1689%20Boston%20revolt

//might want to remove this:
/*
Arrest%20and%20assassination%20of%20Ngo%20Dinh%20Diem

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
      str = str.replace(/ *\([^)]*\) */g, "") //remove all sentences with parenthesis [FUTURE]
              .replace(/ *\[[^)]*\] */g, " ") //remove all sentences with [] [FUTURE]
              .split('== See also ==')[0]
              .split('== Notes ==')[0]
              .replace(/ *\=.*\= */gi, "")
              // .replace(/(\r\n|\n|\r)/gm, '') //remove single words ////

              //do this once everything cleaned
              // var content = content.replace(/(\r\n|\n|\r)/gm, '')//removing new lines
      return str;
    }
    content = cleanString(content)
    console.log(content)
  });
})


// git status
// stage for commit: git add . (or specific names)
//  git commit -m ""
//  git push




// new RegExp("\\n")
//
// or simply:
//
// /\n/
