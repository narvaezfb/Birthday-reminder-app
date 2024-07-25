FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Install nodemon globally (if necessary)
RUN npm install -g nodemon

# If you are building your code for production
# RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["nodemon", "server.js"]
