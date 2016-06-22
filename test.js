#!/usr/bin/env node

const script = process.argv[2]
const exec = require('child_process').exec
const spawn = require('child_process').spawn

let tests = {}

function test (args, run) {
  tests[args] = { completed: false, errors: [], stdout: '', stderr: '' }

  let thread = spawn(script, args.split(' '))

  let stdout = ''
  let stderr = ''
  thread.stdout.on('data', data => stdout += data)
  thread.stderr.on('data', data => stderr += data)

  thread.on('close', code => {
    tests[args].stdout = stdout.trim()
    tests[args].stderr = stderr

    if (code || stderr) {
      if (code) fail(args, `[${script} ${args}] Non-zero exit code: ${code}`)
      if (stderr) fail(args, `[${script} ${args}] Non-empty stderr: ${stderr}`)
      done(args)
      return
    }

    run(suite => {
      for (let i = 0; i < suite.length; i++) {
        suite[i](tests[args].stdout)
      }

      done(args)
    }, (desc, result) => {
      if (!result) fail(args, `[${script} ${args}] Test case failed: ${desc}`)
    })
  })
}

function fail (args, desc) {
  tests[args].errors.push(desc)
}

function done (_args) {
  tests[_args].completed = true

  for (let args in tests) {
    if (!tests[args].completed) return
  }

  let pass = true

  for (let args in tests) {
    if (tests[args].errors.length > 0) {
      pass = false
      console.log(`[x] [${script} ${args}] Failed`)
      console.log(`    [stdout] ${tests[args].stdout}`)
      for (let i = 0; i < tests[args].errors.length; i++) {
        console.log('    ' + tests[args].errors[i])
      }
    } else {
      console.log(`[o] [${script} ${args}] Passed`)
    }
  }

  console.log('====================')
  if (pass) {
    console.log('[o] All Passed')
  } else {
    console.log('[x] Some Failed')
  }
}

const alpha = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'
const num = '23456789'
const symbol = '_'

function has (data, haystack) {
  for (let i = 0; i < data.length; i++) {
    if (~haystack.indexOf(data.charAt(i))) return true
  }
  return false
}

function hasAlpha (data) { return has(data, alpha) }
function hasNum (data) { return has(data, num) }
function hasSymbol (data) { return has(data, symbol) }

//====================

test('', (suite, assert) => { suite([
  data => assert('has alpha', hasAlpha(data)),
  data => assert('has number', hasNum(data)),
  data => assert('has symbol', hasSymbol(data)),
  data => assert('first char is alpha', has(data.charAt(0), alpha)),
])})

test('mixed', (suite, assert) => { suite([
  data => assert('has alpha', hasAlpha(data)),
  data => assert('has number', hasNum(data)),
  data => assert('has symbol', hasSymbol(data)),
  data => assert('first char is alpha', has(data.charAt(0), alpha)),
])})

test('m', (suite, assert) => { suite([
  data => assert('has alpha', hasAlpha(data)),
  data => assert('has number', hasNum(data)),
  data => assert('has symbol', hasSymbol(data)),
  data => assert('first char is alpha', has(data.charAt(0), alpha)),
])})

test('alphanum', (suite, assert) => { suite([
  data => assert('has alpha', hasAlpha(data)),
  data => assert('has number', hasNum(data)),
  data => assert('does not have symbol', !hasSymbol(data)),
  data => assert('first char is alpha', has(data.charAt(0), alpha)),
])})

test('a', (suite, assert) => { suite([
  data => assert('has alpha', hasAlpha(data)),
  data => assert('has number', hasNum(data)),
  data => assert('does not have symbol', !hasSymbol(data)),
  data => assert('first char is alpha', has(data.charAt(0), alpha)),
])})

test('num', (suite, assert) => { suite([
  data => assert('does not have alpha', !hasAlpha(data)),
  data => assert('has number', hasNum(data)),
  data => assert('does not have symbol', !hasSymbol(data)),
])})

test('n', (suite, assert) => { suite([
  data => assert('does not have alpha', !hasAlpha(data)),
  data => assert('has number', hasNum(data)),
  data => assert('does not have symbol', !hasSymbol(data)),
])})

test('num foo', (suite, assert) => { suite([
  data => assert('does not have alpha', !hasAlpha(data)),
  data => assert('has number', hasNum(data)),
  data => assert('does not have symbol', !hasSymbol(data)),
  data => assert('corrected to 12 length', data.length === 12),
])})

test('num 0', (suite, assert) => { suite([
  data => assert('does not have alpha', !hasAlpha(data)),
  data => assert('has number', hasNum(data)),
  data => assert('does not have symbol', !hasSymbol(data)),
  data => assert('corrected to 3 length', data.length === 3),
])})

test('num 1', (suite, assert) => { suite([
  data => assert('does not have alpha', !hasAlpha(data)),
  data => assert('has number', hasNum(data)),
  data => assert('does not have symbol', !hasSymbol(data)),
  data => assert('corrected to 3 length', data.length === 3),
])})

test('num 20', (suite, assert) => { suite([
  data => assert('does not have alpha', !hasAlpha(data)),
  data => assert('has number', hasNum(data)),
  data => assert('does not have symbol', !hasSymbol(data)),
  data => assert('has 20 length', data.length === 20),
])})
