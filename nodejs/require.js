console.log('require가 가장 위에 오지 않아도 됩니다')

module.exports = '찾아보자'

require('./var')

console.log('require cache')
console.log(require.cache)

console.log('require main')
console.log(require.main === module)
console.log(require.main.filename)

