var textArray = ['日常', '旅行', '班费', '生意'];
var bookType = 0;

var setBookType = function(bookNumber){
  bookType = Number(bookNumber);
  //console.log(bookType.toString() + ":" + textArray[bookType]);
}

var getBookArray = function(){
  return textArray;
}

//输入true返回账本编号，输入false返回账本名称
var getBookType = function(type){
  if(type){
    return bookType;
  }
  else{
    return textArray[bookType];
  }
}

module.exports = {
  getBookType: getBookType,
  setBookType: setBookType,
  getBookArray: getBookArray,
}