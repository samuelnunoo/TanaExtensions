FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install the D2 Library to Path
ADD https://d2lang.com/install.sh /usr/src/app/

RUN cat /usr/src/app/install.sh | sh -s --

# Copy over the package.json
COPY package*.json ./

COPY .. .

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "dev"]