// 현재 nodejs실행되는 경로(readdir 위치 기준임)
var testFolder = './data/';
var fs = require('fs');

fs.readdir(testFolder, function (err, filelist) {
  console.log(filelist);
})