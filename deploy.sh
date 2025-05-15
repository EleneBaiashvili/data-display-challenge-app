
#!/bin/bash

# Exit on error
set -e

# Define variables
EC2_IP=$1

if [ -z "$EC2_IP" ]; then
  echo "Usage: ./deploy.sh [EC2_IP_ADDRESS]"
  echo "Example: ./deploy.sh 12.34.56.78"
  exit 1
fi

echo "Preparing deployment to EC2 instance at $EC2_IP..."

# Update frontend API endpoints
echo "Updating API endpoints in frontend code..."
sed -i "s|http://localhost:3001|http://$EC2_IP:3001|g" src/pages/Index.tsx

# Build frontend
echo "Building frontend..."
npm run build

echo "Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Transfer files to your EC2 instance:"
echo "   scp -r ./server ./dist package.json ./deploy.sh ec2-user@$EC2_IP:~/deployment-assignment"
echo ""
echo "2. SSH into your instance:"
echo "   ssh ec2-user@$EC2_IP"
echo ""
echo "3. Start the backend server:"
echo "   cd ~/deployment-assignment/server"
echo "   npm install"
echo "   npm install -g pm2"
echo "   pm2 start index.js"
echo ""
echo "4. Serve the frontend:"
echo "   cd ~/deployment-assignment"
echo "   npm install -g serve"
echo "   pm2 start serve -- -s dist -l 5173"
echo ""
echo "Your application should now be accessible at:"
echo "- Backend API: http://$EC2_IP:3001/api/create-answer"
echo "- Frontend: http://$EC2_IP:5173"
echo ""
echo "Make sure your EC2 security groups allow traffic on ports 3001 and 5173!"
