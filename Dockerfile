FROM node:21-slim

# Install python
RUN apt update
RUN apt install python3 -y

# Update npm
RUN npm install -g npm

# Copy files
WORKDIR /app
COPY . /app

# Install app
RUN npm i
COPY . .

CMD ["npm", "run", "start"]

EXPOSE 3005