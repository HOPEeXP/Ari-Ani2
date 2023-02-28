const axios = require("axios");
const fs = require("fs");
const { unlink } = require("fs").promises;
const child_process = require("child_process");
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
const { fetchJson, GIFBufferToVideoBuffer } = require("../../../lib/Function");

module.exports = {
  name: "hug",
  alias: ["animehug"],
  desc: "To hug any user",
  category: "Reaction",
  usage: `hug @user`,
  react: "🫂",
  start: async (client, m, { text, prefix, args,mentionByTag }) => {
    var pat = await fetchJson(`https://api.waifu.pics/sfw/hug`);
    try {
      let user1 = m.sender;
      let recp = ``;
      try {
        if(!args[0]&&!m.quoted){
            user2 = "none";
        }
        else if(m.quoted){
            user2 = m.quoted.sender;
        }else if(mentionByTag){
        user2 = mentionByTag[0];
        }
        else{
             user2 = m.quoted ? m.quoted.sender : m.mentionedJid[0] ? m.mentionedJid[0] : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net';
        }
      
        ment = [user1, user2];
      } catch {
        user2 = "none";
        ment = [user1, m.sender];
      }
      if (user2 == "none") {
        recp = `@${m.sender.split("@")[0]} is huging themselves`;
        console.log(recp);
      } else {
        var rcpp = `@${user2.split("@"[0])}`;
        recp = `@${m.sender.split("@")[0]} is huging @${user2.split("@")[0]} `;

        console.log(recp);
      }

      const response = await axios.get(pat.url, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(response.data, "utf-8");
      var sgif = await GIFBufferToVideoBuffer(buffer);

      await client.sendMessage(
        m.from,
        {
          video: sgif,
          gifPlayback: true,
          mentions: ment,
          caption: recp,
        },
        { quoted: m }
      );
    } catch (error) {
      console.log(error);
    }
  },
};
