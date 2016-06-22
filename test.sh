#!/usr/bin/env bash

default_ext='js'
default_log='test'

ext=${1-$default_ext}
log=${2-$default_log}

i=0
while [ 1 ]; do
  i=$((i+1))
  echo $i
  output=`./test.js ./password.$ext > >(tee ${log}.stdout.log) 2> >(tee ${log}.stderr.log >&2)`
  count=`echo $output | ag 'failed' | wc -l`
  [ $count -gt 0 ] && break
done
