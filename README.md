# Purpose of the app
A productivity app that can run on the browser with additional features such as:
- a Database
- Authentication
- Payment

# How to run the app
You need to intgerade an environment with a
- run **npm install**
- run **cd server && npm install**  
- Stripe secret key
- Firebase-Admin file and adress
- port (optionally)

# Commands
**npm run server** --> will start the NodeJS backend and use the frontend folder to run the frontend 

**npm start** --> will start the Angular application and at the same time the NodeJS backend.
For that to work correctly:
- comment out the lines 342-347 in customServer.ts
- set config({path:"server/.env"}); in line 4 in customServer.ts

