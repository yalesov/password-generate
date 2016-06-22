# password

Password generators.

Based on actual use cases encountered in the wild.

* `mixed`: (alpha) + (num) + (symbol)
* `alphanum`: some systems don't allow symbols
* `num`: primarily those intended for phone usage

## Usage

### Naked

```sh
./password.* mode length
./password.* mode
./password.* length
./password.*

mode = m[ixed]|a[lphanum]|n[um] ; default mixed
length = (integer >= 3) ; default = 12
```

### npm

```sh
npm install password-generate
```

```javascript
let Password = require('password-generate')
console.log(Password.generate(mode, length))
console.log(Password.generate(mode))
console.log(Password.generate(length))
console.log(Password.generate())
```

## Notes

### Symbol

Only using the underscore `_`.

Some don't allow fancier symbols,
but the underscore seems accepted everywhere.

### Alpha

Assuming both uppercase and lowercase allowed.

The only contrary case I have seen is banks,
which uses case-insensitive passwords -
but then it doesn't disallow inputting both upper- and lower- case either.

### Num

Ever-present.

I haven't seen a system that disallow numeric inputs yet.

### First character

Is always an `alpha`.

Systems have various rules disallowing what is or is not allowed,
but the alpha seems accepted everywhere.
