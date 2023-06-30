FROM princemendiratta/Starchat:latest

WORKDIR /

COPY . /Starchat

WORKDIR /Starchat

RUN git init --initial-branch=multi-device

RUN git remote add origin https://github.com/KingSaint23/Starchat.git

RUN git fetch origin multi-device

RUN git reset --hard origin/multi-device

RUN yarn

# RUN cp -r /root/Baileys/lib /Starchat/node_modules/@adiwajshing/baileys/

CMD [ "npm", "start"]