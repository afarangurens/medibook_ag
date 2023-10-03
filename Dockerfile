FROM node:carbon-slim

# Create app directory
WORKDIR /swarch2023i_ag

# Install app dependencies
COPY package.json /swarch2023i_ag/
RUN npm install

# Bundle app source
COPY . /swarch2023i_ag/
RUN npm run prepublish

EXPOSE 5000

CMD [ "npm", "run", "runServer" ]
