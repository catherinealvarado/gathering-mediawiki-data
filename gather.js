var https = require('https');


var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=&titles=Arrest%20and%20assassination%20of%20Ngo%20Dinh%20Diem";//Stack%20Overflow
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
    // var content = content.replace(/(\r\n|\n|\r)/gm, '')//removing new lines
    // content = content.replace(/ *\=[^)]*\= */g, "")
    var content = content.split('== See also ==')[0]
    var content = content.split('== Notes ==')[0]
    console.log(content)
  });
})
