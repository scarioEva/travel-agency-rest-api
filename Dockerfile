FROM node:21

COPY . .

RUN npm ci

ENV CUR_CONV_URL="https://curconvapi.azurewebsites.net/CurConvRS/webresources"

CMD ["npm", "start"]