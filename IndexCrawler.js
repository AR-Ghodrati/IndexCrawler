var request = require('request')
var cheerio = require('cheerio')
var delay = require('delay')
var fs = require('fs')
var readline = require('readline-sync')

main()


 function main(){
  //https://dl.musicbazz.ir/
   if(!fs.existsSync('Files')) fs.mkdirSync('Files')

  var link = readline.question("Enter Your Site Index : ");
  GetAllLinks(link)
  console.log('Crawler is Running...')
}

function GetAllLinks(url){

    request(url, function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
        if(response.statusCode === 200) {
          var $ = cheerio.load(body);

          $('a').each(function(i,e){
            
          let element = e.firstChild.data
              if(!element.startsWith('.')){

                if(element.endsWith('/') || element.endsWith('.') || element.endsWith('>')){
                 delay(500)
                 GetAllLinks(encodeURI(url + element))
                }
                else{       
                     if(fs.existsSync('Files/' + element.split('.').pop() + '.json')){
                     
                      let data = fs.readFileSync('Files/' + element.split('.').pop() + '.json','utf-8')
                      
                      let list = JSON.parse(data.toString())
                      //console.log(list)

                            
                      list.Links.push({"element":url + element})

                     fs.writeFileSync('Files/'+element.split('.').pop() + '.json',JSON.stringify(list))
                      
                     }
                     else
                     fs.writeFileSync('Files/' + element.split('.').pop() + '.json'
                        ,JSON.stringify({"Type":element.split('.').pop()
                          ,"Links":[{"element":url + element}]}))           
                }
              }
          })
        }
     });
}