const fruits = ['a','b','p','m'];
fruits.forEach(function(fruit){
  console.log('I want to eat,', fruit);
});
var mascots = [
  { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
  { name: 'Tux', organization: "Linux", birth_year: 1996},
  { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
];
mascots.forEach(function(mascot) { 
  
    console.log(mascot.name);
    console.log(mascot.organization);
    console.log(mascot.birth_year);
});
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
// app.get('/urls',(req,res)=>{
//   const templateVars = {urls: urlDatabase};
//   res.render("url_index",templateVars)
// });

urls =  {'x':"http",
      "y":"fttp"
    };

    for (let url in urls){
      console.log(urls[url]);
    }
    // console.log(Math.random().toString(36).slice(-6));
    // //console.log(Math.random().toString(36));
    // console.log(Math.random().toString(36).substr(2, 6));