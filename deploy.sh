#!/bin/bash
set -e

cd /var/www/pathwise-backend

echo "Pulling latest code..."
git pull --ff-only

echo "Installing dependencies..."
npm ci

echo "Building application..."
npm run build

echo "Restarting backend..."
sudo /usr/local/sbin/pathwise-deploy-restart

echo "Deployment completed successfully."
