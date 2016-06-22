#!/usr/bin/env bash

default_ext='js'
default_log='test.log'

ext=${1-$default_ext}
log=${2-$default_log}

i=0
while [ 1 ]; do
  i=$((i+1))
  echo $i
  count=`./test.js lib/password*.$ext | tee $log | grep -i 'failed' | wc -l`
  [ $count -gt 0 ] && break
done
