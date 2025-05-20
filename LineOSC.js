'use strict';
const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '/config/.env') });

const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const { Client: OscClient } = require('node-osc');

const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const lineClient = new Client(lineConfig);
const app = express();

// Resolume OSC 客戶端（IP 與 Port 須與 Resolume 設定一致）
const oscClient = new OscClient('127.0.0.1', 7000); // Resolume 預設 OSC 接收是 7000 port

app.post('/webhook', middleware(lineConfig), async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const userMsg = event.message.text;

      // EX: 傳送一個 OSC 訊號 "/trigger/clip1" 整數值 1
        if(userMsg === '第1列')
        {
            oscClient.send('/composition/columns/1/connect', 1);
        }
        if(userMsg === '第2列')
        {
            oscClient.send('/composition/columns/2/connect', 1);
        }       


      await lineClient.replyMessage(event.replyToken, {
        type: 'text',
        text: `已收到：${userMsg}，並發送到 Resolume 🎬`,
      });
    }
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('LINE webhook + OSC server running on port 3000');
});
