<?php
namespace password_generate;

/**
 * usage:
 * ./password-generate.php mode length
 * ./password-generate.php mode
 * ./password-generate.php length
 * ./password-generate.php
 *
 * mode = m[ixed]|a[lphanum]|n[um] ; default mixed
 * length = (integer >= 3) ; default = 12
 *
 * ----- as package -----
 * require_once 'password-generate.php';
 * echo \password_generate\PasswordGenerate.generate($mode, $length);
 * echo \password_generate\PasswordGenerate.generate($mode);
 * echo \password_generate\PasswordGenerate.generate($length);
 * echo \password_generate\PasswordGenerate.generate();
 */

class PasswordGenerate {

  /* setup chars pool */

  // no Ii Ll Oo 0 1
  const ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  const NUM = '23456789';
  const SYMBOL = '_';

  public static function generate ($mode, $length) {

    /* normalize args */

    switch (substr($mode, 0, 1)) {
      case 'm':
        $mode = 'mixed';
        break;
      case 'a':
        $mode = 'alphanum';
        break;
      case 'n':
        $mode = 'num';
        break;
      default:
        $mode = 'mixed';
    }

    if (!is_numeric($length)) { $length = 12; }
    if ((int)$length < 3) { $length = 3; }
    $length = (int)$length;

    $pool = null;
    switch ($mode) {
      case 'num':
        $pool = self::NUM;
        break;
      case 'alphanum':
        $pool = self::ALPHA . self::NUM;
        break;
      case 'mixed':
        $pool = self::SYMBOL . self::ALPHA . self::NUM;
        break;
    }

    /* fill in password places */

    $password = [];

    $spots = [];
    for ($i = 0; $i < $length; $i++) { $spots[$i] = $i; }

    $bit = null;
    $key = null;
    $pos = null;

    // first select a random non-first place to put a symbol in
    if ($mode === 'mixed') {
      $bit = self::pick(self::SYMBOL);
      $key = self::pick($spots);
      $pos = $spots[$key];
      if ($pos === 0) { $pos = 1; }
      self::fill($password, $bit, $spots, $pos, $key);
    }

    // put first as alpha
    if ($mode === 'alphanum' || $mode === 'mixed') {
      $bit = self::pick(self::ALPHA);
      self::fill($password, $bit, $spots, 0, 0);
    }

    // ensure at least one num present
    $bit = self::pick(self::NUM);
    $key = self::pick($spots);
    $pos = $spots[$key];
    self::fill($password, $bit, $spots, $pos, $key);

    // fill remaining
    foreach ($spots as $pos) {
      // disallow adjacent same char
      do {
        $bit = self::pick($pool);
      } while ($pos !== 0 && $bit === $password[(string)($pos - 1)]);

      self::fill($password, $bit, $spots, $pos);
    }

    /* format password into a string */

    ksort($password, SORT_NUMERIC);

    return implode($password);
  }

  /* helper functions */

  public static function pick ($pool) {
    $draw = rand(0, (is_string($pool) ? strlen($pool) : count($pool))-1);
    return is_string($pool) ? substr($pool, $draw, 1) : $draw;
  }

  public static function fill (&$password, $bit, &$spots, $pos, $key = null) {
    $password[(string)$pos] = $bit;
    if (isset($key)) { array_splice($spots, $key, 1); }
  }
}

/* main */

if ($argv && $argv[0] && realpath($argv[0]) === __FILE__) { // run as script

  $mode = '';
  $length = '';

  if (count($argv) > 1) {
    $arg = $argv[1];
    if (is_numeric($arg)) { // this is a number, parse as [length]
      $length = $arg;
    } else { // else parse as [mode]
      $mode = $arg;
    }

    if (count($argv) > 2) { // parse a possible 2nd [length]
      $length = $argv[2];
    }
  }

  echo PasswordGenerate::generate($mode, $length);
}
