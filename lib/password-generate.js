#!/usr/bin/env node

/**
 * usage:
 * ./password-generate.js mode length
 * ./password-generate.js mode
 * ./password-generate.js length
 * ./password-generate.js
 *
 * mode = m[ixed]|a[lphanum]|n[um] ; default mixed
 * length = (integer >= 3) ; default = 12
 *
 * ----- as package -----
 * let PasswordGenerate = require('password-generate')
 * console.log(PasswordGenerate.generate(mode, length))
 * console.log(PasswordGenerate.generate(mode))
 * console.log(PasswordGenerate.generate(length))
 * console.log(PasswordGenerate.generate())
 */

/* setup chars pool */

// no Ii Ll Oo 0 1
const ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'
const NUM = '23456789'
const SYMBOL = '_'

function generate (mode, length) {

  /* normalize args */

  switch ((''+mode || '').charAt(0)) {
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

  let spots = []
  for (let i = 0; i < length; i++) { spots[i] = i }

  let bit, key, pos

  // first select a random non-first place to put a symbol in
  if (mode === 'mixed') {
    bit = pick(SYMBOL)
    key = pick(spots)
    pos = spots[key]
    if (pos === 0) pos = 1
    fill(password, bit, spots, pos, key)
  }

  // put first as alpha
  if (mode === 'alphanum' || mode === 'mixed') {
    bit = pick(ALPHA)
    fill(password, bit, spots, 0, 0)
  }

  // ensure at least one num present
  bit = pick(NUM)
  key = pick(spots)
  pos = spots[key]
  fill(password, bit, spots, pos, key)

  // fill remaining
  for (let k = 0; k < spots.length; k++) {
    pos = spots[k]
    if (typeof pos === 'undefined') continue

    // disallow adjacent same char
    do {
      bit = pick(pool)
    } while (pos !== 0 && bit === password[pos - 1])

    fill(password, bit, spots, pos)
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
  let draw = Math.ceil(Math.random() * pool.length) - 1
  if (draw < 0) draw = 0
  if (typeof pool === 'string') {
    return pool.charAt(draw)
  } else { // array
    return draw
  }
}

function fill (password, bit, spots, pos, key) {
  password[pos] = bit
  if (typeof key !== 'undefined') spots.splice(key, 1)
}

/* main */

if (require.main === module) { // run as script

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

} else { // imported

  module.exports = { generate: generate }

}
