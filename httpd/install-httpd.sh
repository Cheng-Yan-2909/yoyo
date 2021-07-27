#!/bin/sh

source script_lib.sh

echo "Do you want to install appache2 + SSL ? (y/N): "
read ans

if [ "$ans" = "y" -o "$ans" = "Y" ]
then
    #
    # setup apache2
    #
    sudo yum update -y
    sudo yum install -y httpd
    sudo systemctl start httpd
    sudo systemctl enable httpd
    
    #
    # setup ssl
    #
    sudo yum install -y mod_ssl
    cd /etc/pki/tls/certs
    sudo ./make-dummy-cert localhost.crt
    
    #
    # copy content
    #
    
    sudo cp -r $script_dir/etc/httpd/*  /etc/httpd/
    sudo cp -r $script_dir/var/www/* /var/www/
    
    sudo systemctl restart httpd
    
fi
