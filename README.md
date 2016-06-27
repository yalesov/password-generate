# password-generate

Password generators.

Based on actual use cases encountered in the wild.

* `mixed`: (alpha) + (num) + (symbol)
* `alphanum`: some systems don't allow symbols
* `num`: primarily those intended for phone usage

## Usage

### Naked

```sh
lib/* mode length
lib/* mode
lib/* length
lib/*

mode = m[ixed]|a[lphanum]|n[um] ; default mixed
length = (integer >= 3) ; default = 12
```

### npm

```sh
npm install password-generate
```

```javascript
let PasswordGenerate = require('password-generate')
console.log(PasswordGenerate.generate(mode, length))
console.log(PasswordGenerate.generate(mode))
console.log(PasswordGenerate.generate(length))
console.log(PasswordGenerate.generate())
```

### gem

```sh
gem install password_generate
```

```ruby
require 'password_generate'
p PasswordGenerate.generate mode, length
p PasswordGenerate.generate mode
p PasswordGenerate.generate length
p PasswordGenerate.generate
```

### composer

```sh
composer require password-generate
```

```ruby
use password_generate;
echo password_generate\PasswordGenerate::generate($mode, $length);
echo password_generate\PasswordGenerate::generate($mode);
echo password_generate\PasswordGenerate::generate($length);
echo password_generate\PasswordGenerate::generate();
```

### bash

```sh
./password-generate.sh mode length
./password-generate.sh mode
./password-generate.sh length
./password-generate.sh
```

### perl

```sh
./password-generate.pl mode length
./password-generate.pl mode
./password-generate.pl length
./password-generate.pl
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
