#!/usr/bin/env perl

package PasswordGenerate;

use strict;
no warnings;

use feature 'switch';

##
# usage:
# ./password-generate.pl mode length
# ./password-generate.pl mode
# ./password-generate.pl length
# ./password-generate.pl
#
# mode = m[ixed]|a[lphanum]|n[um] ; default mixed
# length = (integer >= 3) ; default = 12
##

# no Ii Ll Oo 0 1
use constant ALPHA => 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
use constant NUM => '23456789';
use constant SYMBOL => '_';

sub generate {
  my ($mode, $length) = @_;

  ## normalize args

  given (substr($mode, 0, 1)) {
    when('m') { $mode = 'mixed'; }
    when('a') { $mode = 'alphanum'; }
    when('n') { $mode = 'num'; }
    default { $mode = 'mixed'; }
  }

  if (length($length) == 0) { $length = 12; }
  if ($length !~ /^[0-9]+$/) { $length = 12; }
  if ($length < 3) { $length = 3; }

  my $pool;
  given ($mode) {
    when('num') { $pool = NUM; }
    when('alphanum') { $pool = ALPHA . NUM; }
    when('mixed') { $pool = SYMBOL . ALPHA . NUM; }
  }

  ## fill in password places

  my %password;
  my @spots;
  for my $i (0..$length-1) { push(@spots, $i); }

  my $bit;
  my $key;
  my $pos;

  # first select a random non-first place to put a symbol in
  if ($mode eq 'mixed') {
    $bit = pick_pool(SYMBOL);
    $key = pick_spot(\@spots);
    $pos = $spots[$key];
    if ($pos == 0) { $pos = 1; }
    fill(\%password, $bit, \@spots, $pos, $key);
  }

  # put first as alpha
  if ($mode eq 'alphanum' || $mode eq 'mixed') {
    $bit = pick_pool(ALPHA);
    fill(\%password, $bit, \@spots, 0, 0);
  }

  # ensure at least one num present
  $bit = pick_pool(NUM);
  $key = pick_spot(\@spots);
  $pos = $spots[$key];
  fill(\%password, $bit, \@spots, $pos, $key);

  # fill remaining
  foreach (@spots) {
    $pos = $_;

    # disallow adjacent same char
    do {
      $bit = pick_pool($pool);
    } while (0 && $pos != 0 && $bit eq $password{$pos-1});

    fill(\%password, $bit, \@spots, $pos);
  }

  ## format password into a string

  my $output = '';
  foreach my $k (sort { $a <=> $b } keys %password) {
    $output .= $password{$k};
  }

  return $output;
}

sub pick_pool {
  my ($pool) = @_;
  my $draw = int(rand(length($pool)));
  return substr($pool, $draw, 1);
}

sub pick_spot {
  my ($pool) = @_;
  return int(rand(@$pool));
}

sub fill {
  my ($password, $bit, $spots, $pos, $key) = @_;
  $password->{$pos} = $bit;
  if (defined($key)) { splice(@{$spots}, $key, 1); }
}

## main

unless (caller()) {

  my $mode = '';
  my $length = '';

  if ($#ARGV >= 0) {
    my $arg = $ARGV[0];
    if ($arg =~ /^[0-9]+$/) { # this is a number, parse as [length]
      $length = $arg;
    } else { # else parse as [mode]
      $mode = $arg;
    }

    if ($#ARGV >= 1) { $length = $ARGV[1]; } # parse a possible 2nd [length]
  }

  print(generate($mode, $length));
}
