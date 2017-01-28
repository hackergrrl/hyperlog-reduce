var indexer = require('hyperlog-index')

module.exports = function (opts) {
  if (!opts.db) throw new Error('missing: opts.db')
  if (!opts.log) throw new Error('missing: opts.log')
  if (!opts.init) throw new Error('missing: opts.init')
  if (!opts.reduce) throw new Error('missing: opts.reduce')

  var value = opts.init()

  var dex = indexer({
     log: opts.log,
     db: opts.db,
     map: function (row, next) {
       opts.reduce(row, value, function (err, accum) {
         if (err) throw err
         value = accum
         next()
       })
     }
   })

  return {
    get: getValue
  }

  function getValue (done) {
     dex.ready(function () {
       done(null, value)
     })
   }
}

