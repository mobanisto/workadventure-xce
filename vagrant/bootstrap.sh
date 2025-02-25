#!/bin/bash

export DEBIAN_FRONTEND=noninteractive

apt-get update -y
apt-get install -y git
apt-get install -y apt-transport-https
apt-get install -y ca-certificates
apt-get install -y curl
apt-get install -y gnupg-agent
apt-get install -y software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
apt-key fingerprint 0EBFCD88
add-apt-repository \
"deb [arch=amd64] https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) \
stable"
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io
curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
usermod -aG docker vagrant
newgrp docker
echo "cd ${VM_GUEST_PATH}" >> /home/vagrant/.bashrc
