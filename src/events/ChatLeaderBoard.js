const allah = require("../configs/sunucuayar.json")
const messageUser = require("../schemas/messageUser");
const { xp, gulucuk, mesaj2, altin, altin2 ,rewards, voice ,star , fill, empty, fillStart, emptyEnd, fillEnd, red, miniicon } = require("../configs/emojis.json");
const sex = require("../schemas/leaderboard");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");
const client = global.bot;

module.exports = async () => {
   const messageUsersData = await messageUser.find({ guildID: allah.GuildID }).sort({ topStat: -1 });
   const messageUsers = messageUsersData.splice(0, 10).map((x, index) => `\` ${index+1} \` <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``).join(`\n`);
   
   let data = await sex.findOne({ guildID: allah.GuildID })
   if (!data || data && !data.messageListID.length) return

const sunucuisim = client.guilds.cache.get(allah.GuildID).name
 let LeaderBoard = await client.channels.cache.find(x => x.name == "leaderboard").messages.fetch(data.messageListID);
  setInterval(() => {
  ChatLeaderBoard()
  }, 900000);
  function ChatLeaderBoard() {  

  const msgList = (`${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}`)

  let MessageEdit = new MessageEmbed()
  .setColor("BLACK")
  .setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({dynamic:true})})
  .setDescription(`${mesaj2} Aşağıda \`${sunucuisim}\` sunucusunun **Genel Mesaj** sıralaması listelenmektedir.\n\n${msgList}\n\nGüncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>`)
  LeaderBoard.edit({ embeds: [MessageEdit]})

}
}
module.exports.conf = {
  name: "ready",
};