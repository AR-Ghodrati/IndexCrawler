var fs = require('fs')

fs.readFile("List.txt",'utf-8',(err,data) => {
    let list = JSON.parse(data)
    console.log(list)

})