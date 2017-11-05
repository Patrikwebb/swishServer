FROM node:4.5.0

WORKDIR /var/app/swish/
VOLUME /var/app/swish/
COPY package.json /var/app/swish/
RUN npm install
COPY / /var/app/swish/
EXPOSE 443 443
CMD [ "npm" , "start" ]
