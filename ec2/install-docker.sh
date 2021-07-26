#!/bin/sh

sudo yum update -y

sudo amazon-linux-extras install -y docker
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

echo "You will need to exit this shell and reload a new shell"
echo "For SSH, exist and reconnect"
echo 

