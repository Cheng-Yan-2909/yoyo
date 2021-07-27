#!/bin/sh

pwd=`pwd`
script_dir=`dirname $0`

if [ "$script_dir" = "." ]
then
    script_dir=$pwd
else
    script_dir="$pwd/$script_dir"
fi


