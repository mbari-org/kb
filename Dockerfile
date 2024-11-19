FROM node:22-alpine

WORKDIR /app

RUN corepack enable
RUN corepack prepare yarn@4.5.1 --activate 
RUN corepack use yarn

COPY dist ./kbeditor

EXPOSE 5173

# CMD ["yarn", "dlx", "serve", "-s", "dist", "-l", "5173"]

CMD ["yarn", "dlx", "http-server", ".", "-p", "5173"]


