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
