#!/usr/bin/env bash

echo "#################################"
echo "##      Quickstart Script      ##"
echo "#################################"

started_at=$(date +"%s")

echo "-----> Postgresql stop"
sudo service postgresql stop
echo ""

echo "-----> Provisioning containers"
docker-compose --file docker-compose.yaml up
echo ""

ended_at=$(date +"%s")

minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "-----> Postgresql start"
sudo service postgresql start
echo ""

echo "-----> Done in ${minutes}m${seconds}s"
