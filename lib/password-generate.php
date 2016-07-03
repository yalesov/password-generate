#!/usr/bin/env php
<?php
require __DIR__ . '/password-generate-src.php';

/* main */

if (isset($argv) && $argv[0] && realpath($argv[0]) === __FILE__) { // run as script

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

  echo \password_generate\PasswordGenerate::generate($mode, $length);
}
