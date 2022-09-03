//Current Date module

exports.getDate = function (){
  let days = new Date();
  let option = {
    year: "numeric",
    day: "numeric",
    month: "long",
    //weekday: "long"
  }
  return days.toLocaleDateString("en-Us", option);
}
//console.log(module.exports);


exports.getToday = function (){
  let days = new Date();
  let option = {

    weekday: "long"
  }
  return days.toLocaleDateString("en-Us", option);
}

//console.log(module);
