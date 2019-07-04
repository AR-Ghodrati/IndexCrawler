var request = require('request')
var cheerio = require('cheerio')
var delay = require('delay')
var fs = require('fs')
var readline = require('readline-sync')

main()


 function main(){
  //https://dl.musicbazz.ir/
   if(!fs.existsSync('WebSites')) fs.mkdirSync('WebSites')

  var link = readline.question("Enter Your Site Index : ");
  var domain = readline.question('Enter Domain : ')

  if(!fs.existsSync('WebSites/' + domain)) fs.mkdirSync('WebSites/' + domain)

  GetAllLinks(link,'WebSites/' + domain + '/')
  console.log('Crawler is Running...')
}

function GetAllLinks(url,base){

    request(url, function(error, response, body) {
        if(error) {
          console.log("Error: " + error);
        }
        
        if(!error && response.statusCode === 200) {
          var $ = cheerio.load(body);

          $('a').each(function(i,e){
            
          let element = e.firstChild.data
              if(!element.startsWith('.')){

                if(element.endsWith('/') || element.endsWith('.') || element.endsWith('>')){
                 delay(500)
                 GetAllLinks(encodeURI(url + element),base)
                 delay(500)
                }
                else{       
                     if(fs.existsSync(base + element.split('.').pop() + '.json')){
                     
                      let data = fs.readFileSync(base + element.split('.').pop() + '.json','utf-8')
                      
                      let list = JSON.parse(data.toString())
                      //console.log(list)

                            
                      list.Links.push({"element":url + element})

                     fs.writeFileSync(base + element.split('.').pop() + '.json',JSON.stringify(list))
                      
                     }
                     else
                     fs.writeFileSync(base + element.split('.').pop() + '.json'
                        ,JSON.stringify({"Type":element.split('.').pop()
                          ,"Links":[{"element":url + element}]}))           
                }
              }
          })
        }
     });
}