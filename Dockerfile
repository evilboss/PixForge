# Use Node.js official image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock (if available) to the container
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application files into the container
COPY . .

# Expose the port that the app will run on
EXPOSE 4006

# Set the command to run the app
CMD ["yarn", "start"]
