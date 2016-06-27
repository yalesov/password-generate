#!/usr/bin/env bash

## expects bash 4+; TODO add hack for <4

##
# usage:
# ./password-generate.sh mode length
# ./password-generate.sh mode
# ./password-generate.sh length
# ./password-generate.sh
#
# mode = m[ixed]|a[lphanum]|n[um] ; default mixed
# length = (integer >= 3) ; default = 12
##

## setup chars pool

# no Ii Ll Oo 0 1
ALPHA='ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz'
NUM='23456789'
SYMBOL='_'

function generate {
  local mode=$1
  local length=$2

  ## normalize args

  case ${mode:0:1} in
    'm')
      mode='mixed'
      ;;
    'a')
      mode='alphanum'
      ;;
    'n')
      mode='num'
      ;;
    *)
      mode='mixed'
      ;;
  esac

  [[ "$length" == '' ]] && length=12
  [[ "${length//[^0-9]/}" != "$length" ]] && length=12
  [ $length -lt 3 ] && length=3

  local pool
  case $mode in
    'num')
      pool=${NUM}
      ;;
    'alphanum')
      pool=${ALPHA}${NUM}
      ;;
    'mixed')
      pool=${SYMBOL}${ALPHA}${NUM}
      ;;
  esac

  ## fill in password places

  declare -A password
  declare -a spots
  for ((i=0; i < $length; i++)); do
    spots[i]=$i
  done

  local bit
  local key
  local pos

  # first select a random non-first place to put a symbol in
  if [[ $mode == 'mixed' ]]; then
    bit=`pick_pool $SYMBOL`
    key=`pick_spot`
    pos=${spots[$key]}
    [ $pos -eq 0 ] && pos=1
    fill $bit $pos $key
  fi

  # put first as alpha
  if [[ $mode == 'alphanum' ]] || [[ $mode == 'mixed' ]]; then
    bit=`pick_pool $ALPHA`
    fill $bit 0 0
  fi

  # ensure at least one num present
  bit=`pick_pool $NUM`
  key=`pick_spot`
  pos=${spots[$key]}
  fill $bit $pos $key

  # fill remaining
  for pos in "${spots[@]}"; do
    # disallow adjacent same char
    while [ 1 ]; do
      bit=`pick_pool $pool`
      [ $pos -eq 0 ] || [[ $bit != ${password[$(($pos - 1))]} ]] && break
    done

    fill $bit $pos
  done

  # echo the password
  for k in `echo "${!password[@]}" | tr ' ' "\n" | sort -n`; do
    printf ${password[$k]}
  done
}

## helper functions

function pick_pool {
  local pool=$1
  local draw=$(($RANDOM % ${#pool}))
  echo ${pool:$draw:1}
}

function pick_spot {
  # intentionally using parent scope $spots
  echo $(($RANDOM % ${#spots[@]}))
}

function fill {
  # intentionally using parent scope $password and $spots
  local bit=$1
  local pos=$2
  local key=$3

  password[$pos]=$bit
  [[ "$key" != '' ]] && spots=(${spots[@]:0:$key} ${spots[@]:$(($key + 1))})
}

## main

mode=''
length=''

if [ $# -gt 0 ]; then
  if [[ "${1//[^0-9]/}" == "$1" ]]; then # this is a number, parse as [length]
    length=$1
  else # else parse as [mode]
    mode=$1
  fi

  [ $# -gt 1 ] && length=$2 # parse a possible 2nd [length]
fi

echo "$(generate $mode $length)"
