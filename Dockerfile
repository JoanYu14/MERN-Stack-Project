FROM node:18.19.1-bookworm-slim

# 設置Image中的工作目錄
WORKDIR /home/user/Desktop/mern_project


# 將Dockerfile所在目錄下的所有文件複製到Image的工作目錄
COPY . .

RUN cd /home/user/Desktop/mern_project && \
npm install 
# 暴露端口
EXPOSE 8080

# 設置時區為
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 容器啟動指令
CMD echo "" >> /home/user/Desktop/mern_project/.env && \
    echo "PASSPORT_SECRET = \"$PASSPORT_SECRET\"" >> /home/user/Desktop/mern_project/.env && \
    echo "" >> /home/user/Desktop/mern_project/.env && \
    echo "MONGODB_CONNECTION = \"$MONGODB_CONNECTION\"" >> /home/user/Desktop/mern_project/.env && \
    node /home/user/Desktop/mern_project/server.js
