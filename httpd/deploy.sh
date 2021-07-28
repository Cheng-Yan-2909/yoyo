#!/bin/sh

source "`dirname $0`/script_lib.sh"

sudo cp -r $script_dir/var/www/* /var/www/

sudo chmod -R 755 /var/www/*

