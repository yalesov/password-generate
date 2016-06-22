#!/usr/bin/env node

/**
 * usage:
 * ./password.js mode length
 * ./password.js mode
 * ./password.js length
 * ./password.js
 *
 * mode = m[ixed]|a[lphanum]|n[um] ; default mixed
 * length = (integer >= 3) ; default = 12
 */

/* setup chars pool */

// no Ii Ll Oo 0 1
const ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'
const NUM = '23456789'
const SYMBOL = '_'

function generate (mode, length) {

  /* normalize args */

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

  if (Number.isNaN(+length) || length === '') length = 12
  if (+length < 3) length = 3
  length = +length

  let pool
  switch (mode) {
    case 'num':
      pool = NUM
      break
    case 'alphanum':
      pool = ALPHA + NUM
      break
    case 'mixed':
      pool = SYMBOL + ALPHA + NUM
      break
  }

  /* fill in password places */

  let password = {}

  let spots = {}
  for (let i = 0; i < length; i++) { spots[i] = i }

  let bit, pos

  // first select a random non-first place to put a symbol in
  if (mode === 'mixed') {
    bit = pick(SYMBOL)
    pos = pick(spots)
    if (pos === 0) pos = 1
    fill(password, bit, pos, spots)
  }

  // put first as alpha
  if (mode === 'alphanum' || mode === 'mixed') {
    bit = pick(ALPHA)
    pos = 0
    fill(password, bit, pos, spots)
  }

  // ensure at least one num present
  bit = pick(NUM)
  pos = pick(spots)
  fill(password, bit, pos, spots)

  // fill remaining
  for (var i in spots) {
    if (typeof spots[i] === 'undefined') continue

    // disallow adjacent same char
    do {
      bit = pick(pool)
    } while (spots[i] !== 0 && bit === password[spots[i] - 1])

    pos = spots[i]
    fill(password, bit, pos, spots)
  }

  /* format password into a string */

  let sortedKeys = Object.keys(password).sort(function (a, b) {
    return a - b
  })
  let values = []

  for (let i = 0; i < sortedKeys.length; i++) {
    values.push(password[sortedKeys[i]])
  }

  return values.join('')
}

/* helper functions */

function pick (pool) {
  let draw
  if (typeof pool === 'string') {
    draw = Math.ceil(Math.random() * pool.length) - 1
    if (draw < 0) draw = 0
    return pool.charAt(draw)
  } else { // object
    draw = Math.ceil(Math.random() * Object.keys(pool).length) - 1
    if (draw < 0) draw = 0
    return pool[draw]
  }
}

function fill (password, bit, pos, spots) {
  password[pos] = bit
  delete spots[pos]
}

/* main */

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
