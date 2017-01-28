# hyperlog-reduce

> Implement an async reduce function over a
> [hyperlog](https://github.com/mafintosh/hyperlog/).

This was inspired by @dominictarr's
[flumedb](https://github.com/flumedb/flumedb) and clean approach to materialized
views. This module implements something akin to a
[flumeview-reduce](https://github.com/flumedb/flumeview-reduce) over a
[hyperlog](https://github.com/mafintosh/hyperlog/).

## Usage

Create a *sum* reduce function over a hyperlog of numbers:

```js
var reduce = require('hyperlog-reduce')
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
```

This will output

```
sum is 10
```

## API

```js
var reduce = require('hyperlog-reduce')
```

### var reducer = reduce(opts)

Create an async reducer over a hyperlog. `opts` is required and must have the
following key/values:

- `db`: a levelup instance that the reducer's index will be stored in
- `log`: a hyperlog instance
- `init`: a function that returns the initial value of the reducer
- `reduce`: a function of the form `function (node, accum, next)`, where `node` is
  a hyperlog node, `accum` is the current value of the reduce function, and
  `next` is a function to be called when the reduce function has completed. It
  expects arguments of the form `next(err, newAccumValue)`.

### reducer.get(done)

Asynchronously retrieves the current value of the reduce function. If nodes are
still being processed, `done` isn't called until the index catches up.

`done` is a callback of the form `function (err, value) { ... }`.

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install hyperlog-reduce
```

## License

ISC

