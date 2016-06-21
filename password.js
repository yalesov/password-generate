#!/usr/bin/env node

/**
 * usage:
 * ./password.js mode length
 * ./password.js mode
 * ./password.js length
 * ./password.js
 *
 * mode = m[ixed]|a[lphanum]|n[um] ; default mixed
 * length = (integer >= 2) ; default = 12
 */

function generate (mode, length) {
  switch ((mode || '').charAt(0)) {
    case 'm':
      mode = 'mixed'
      break
    case 'a':
      mode = 'alphanum'
      break
    case 'n':
      mode = 'num'
      break
    default:
      mode = 'mixed'
  }

  if (!+length) length = 12
  if (length < 2) length = 2

  // no Ii Ll Oo 0 1
  let alpha = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'
  let num = '23456789'
  let symbol = '_'

  let pool
  switch (mode) {
    case 'num':
      pool = num
      break
    case 'alphanum':
      pool = alpha + num
      break
    case 'mixed':
      pool = symbol + alpha + num
      break
  }

  let password = {}

  let spots = {}
  for (let i = 0; i < length; i++) { spots[i] = i }

  let bit, pos

  // first select a random non-first place to put a symbol in
  if (mode === 'mixed') {
    bit = pick(symbol)
    pos = pick(spots)
    if (pos === 0) pos = 1
    fill(password, bit, pos, spots)
  }

  // put first as alpha
  if (mode === 'alphanum' || mode === 'mixed') {
    bit = pick(alpha)
    pos = 0
    fill(password, bit, pos, spots)
  }

  // there is at least a number
  bit = pick(num)
  pos = pick(spots)
  fill(password, bit, pos, spots)

  // fill remaining
  for (var i in spots) {
    if (!spots[i]) continue

    // disallow adjacent same chars
    do {
      bit = pick(pool)
    } while (spots[i] !== 0 && bit === password[spots[i] - 1])

    pos = spots[i]
    fill(password, bit, pos, spots)
  }

  let sortedKeys = Object.keys(password).sort(function (a, b) {
    return a - b
  })
  let values = []

  for (let i = 0; i < sortedKeys.length; i++) {
    values.push(password[sortedKeys[i]])
  }

  return values.join('')
}

function pick (pool) {
  if (typeof pool === 'string') {
    return pool.charAt(Math.floor(Math.random() * pool.length))
  } else { // object
    return Math.floor(Math.random() * Object.keys(pool).length)
  }
}

function fill (password, bit, pos, spots) {
  password[pos] = bit
  delete spots[pos]
}

//====================

let mode, length

if (process.argv.length > 2) {
  let arg = process.argv[2]
  if (+arg) { // this is a number, parse as [length]
    length = arg
  } else { // else parse as [mode]
    mode = arg
  }

  if (process.argv.length > 3) { // parse a possible 2nd [length]
    length = process.argv[3]
  }
}

console.log(generate(mode, length))
