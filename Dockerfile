# Bundle Stage
FROM node:18.15.0-buster
WORKDIR /opt/
RUN git clone https://github.com/taotao2008/Rocket.Chat.js.SDK.git
WORKDIR /opt/Rocket.Chat.js.SDK
RUN npm init -y
RUN npm install @rocket.chat/sdk
EXPOSE 3003
COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
