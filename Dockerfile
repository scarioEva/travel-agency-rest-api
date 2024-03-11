FROM node:21

COPY . .

RUN npm ci

ENV CUR_CONV_URL="http://cur-conv:8080/CurConvRS/webresources"

CMD ["npm", "start"]