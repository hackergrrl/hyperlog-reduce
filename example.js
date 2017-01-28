var reduce = require('./')
var memdb = require('memdb')
var hyperlog = require('hyperlog')

var log = hyperlog(memdb(), {valueEncoding: 'json'})

var sum = reduce({
  db: memdb(),
  log: log,

  // create the materialized view default value
  init: function () {
    return 0
  },

  // runs on each node in the hyperlog
  reduce: function (node, sum, next) {
    sum += node.value.amount
    next(null, sum)
  }
})

log.append({amount: 3}, function () {
  log.append({amount: 6}, function () {
    log.append({amount: 1}, function () {
    })
  })
})

// blocks until the index is caught up
sum.get(function (err, value) {
  console.log('sum is', value)
})

