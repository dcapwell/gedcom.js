#!/bin/bash

for t in `ls test/*test*.js`; do
  echo $t
  node $t
done
