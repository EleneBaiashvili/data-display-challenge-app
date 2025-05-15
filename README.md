
# Deployment Assignment

A simple project with a frontend and backend for the deployment assignment.

## Project Structure

- `/src`: Contains the frontend React application
- `/server`: Contains the backend Express server

## Local Development

### Backend Setup

```bash
cd server
npm install
npm run dev
```

The backend will be available at http://localhost:3001

### Frontend Setup

```bash
npm install
npm run dev
```

The frontend will be available at http://localhost:5173

## Deployment to AWS EC2

Follow these steps to deploy both frontend and backend to an AWS EC2 instance:

1. Create an EC2 instance (t2.micro is sufficient)
2. SSH into your instance
3. Clone this repository
4. Install Node.js and npm
5. Start the backend server:

```bash
cd server
npm install
# Start with PM2 for keeping the server running
npm install -g pm2
pm2 start index.js
```

6. Update the API endpoints in the frontend code:

```bash
# In src/pages/Index.tsx, update these lines:
# Replace localhost:3001 with your EC2 public IP
# const response = await fetch("http://YOUR_EC2_IP:3001/api/get-answer");
# const response = await fetch("http://YOUR_EC2_IP:3001/api/create-answer", {
```

7. Build and serve the frontend:

```bash
npm install
npm run build
# Install serve to host the static files
npm install -g serve
# Use PM2 to keep the frontend server running
pm2 start serve -- -s dist -l 5173
```

8. Configure security groups to allow traffic on ports 3001 and 5173

## Assignment Submission URLs

Once deployed, your submission URLs will be:

- Backend URL: http://54.86.70.179:3001/api/create-answer (for POST) and http://54.86.70.179:3001/api/get-answer (for GET)
- Frontend URL: http://54.86.70.179:5173/

## Testing the Deployment

To test if your deployment works correctly:

1. Send a POST request to your backend:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"data":"test-message"}' http://YOUR_EC2_IP:3001/api/create-answer
```

2. Visit your frontend URL in a browser. You should see "test-message" displayed inside the element with id="answer".
