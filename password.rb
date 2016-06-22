#!/usr/bin/env ruby

##
# usage:
# ./password.rb mode length
# ./password.rb mode
# ./password.rb length
# ./password.rb
#
# mode = m[ixed]|a[lphanum]|n[um] ; default mixed
# length = (integer >= 2) ; default = 12
##

## setup chars pool

# no Ii Ll Oo 0 1
ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'
NUM = '23456789'
SYMBOL = '_'

class Object
  def is_number?
    self.to_f.to_s == self.to_s || self.to_i.to_s == self.to_s
  end
end

def generate mode, length

  ## normalize args

  mode = case mode.to_s[0]
         when 'm' then 'mixed'
         when 'a' then 'alphanum'
         when 'n' then 'num'
         else 'mixed'
         end

  length = 12 unless length.is_number?
  length = 3 if length.to_i < 3
  length = length.to_i

  pool = case mode
         when 'num' then NUM
         when 'alphanum' then ALPHA + NUM
         when 'mixed' then SYMBOL + ALPHA + NUM
         end

  ## fill in password places

  password = {}
  spots = (0..length-1).to_a

  # first select a random non-first place to put a symbol in
  if mode == 'mixed'
    bit = pick SYMBOL
    key = pick (0..spots.size-1).to_a
    pos = spots[key]
    pos = 1 if pos == 0
    fill password, bit, spots, pos, key
  end

  # put first as alpha
  if mode == 'alphanum' || mode == 'mixed'
    bit = pick ALPHA
    fill password, bit, spots, 0, 0
  end

  # ensure at least one num present
  bit = pick NUM
  key = pick (0..spots.size-1).to_a
  pos = spots[key]
  fill password, bit, spots, pos, key

  # fill remaining
  spots.clone.each_with_index do |v, k|
    # disallow adjacent same char
    loop do
      bit = pick pool
      break if v == 0 || bit != password[v-1]
    end

    fill password, bit, spots, v, k
  end

  ## format password into a string

  password.sort.map { |v| v[1] }.join('')
end

def pick pool
  v = nil
  v = pool.split('').sample if pool.respond_to? :split
  v = pool.sample if pool.respond_to? :sample
  v
end

def fill password, bit, spots, pos, key
  password[pos] = bit
  spots.delete_at key
end

## main

mode = nil
length = nil

if ARGV.size > 0
  arg = ARGV[0]
  if arg.is_number? # this is a number, parse as [length]
    length = arg
  else # else parse as [mode]
    mode = arg
  end

  length = ARGV[1] if ARGV.size > 1 # parse a possible 2nd [length]
end

puts generate mode, length
