const { MessageEmbed } = require("discord.js");
const allah = require("../../configs/sunucuayar.json");
const { xp, gulucuk, mesaj2, altin, altin2 ,rewards, voice ,star , fill, empty, fillStart, emptyEnd, fillEnd, red, miniicon } = require("../../configs/emojis.json");
const messageUser = require("../../schemas/messageUser");
const emojis = require("../../configs/emojis.json")
const voiceUser = require("../../schemas/voiceUser");
const sex = require("../../schemas/leaderboard");
const moment = require("moment");
const client = global.bot;

module.exports = {
  conf: {
    aliases: [],
    name: "leaderboard",
    help: "leaderboard",
    category: "sahip",
    owner: true,
  },

  run: async (client, message, args) => {

    const messageUsersData = await messageUser.find({ guildID: allah.GuildID }).sort({ topStat: -1 });
    const messageUsers = messageUsersData.splice(0, 10).map((x, index) => `\` ${index+1} \` <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``).join(`\n`);
    const voiceUsersData = await voiceUser.find({ guildID: allah.GuildID }).sort({ topStat: -1 });
    const voiceUsers = voiceUsersData.splice(0, 10).map((x, index) => `\` ${index+1} \` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\``).join(`\n`);

    const sunucuisim = client.guilds.cache.get(allah.GuildID).name
    let LeaderBoard = await client.channels.cache.find(x => x.name == "leaderboard")
  
    const msgList = (`${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}`)
    const voiceList = (`${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}`)


   let Chat = new MessageEmbed()
   .setColor("BLACK")
   .setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({dynamic:true})})
   .setDescription(`${mesaj2} Aşağıda \`${sunucuisim}\` sunucusunun **Genel Mesaj** sıralaması listelenmektedir.\n\n${msgList}\n\nGüncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>`)
   LeaderBoard.send({ embeds: [Chat]}).then(async (tmsg) => {
    await sex.findOneAndUpdate({ guildID: message.guild.id }, { $set: { messageListID: tmsg.id } }, { upsert: true });
  })

   let Voice = new MessageEmbed()
   .setColor("BLACK")
   .setAuthor({ name: client.guilds.cache.get(allah.GuildID).name, iconURL: client.guilds.cache.get(allah.GuildID).iconURL({dynamic:true})})
   .setDescription(`${voice} Aşağıda \`${sunucuisim}\` sunucusunun **Genel Ses** sıralaması listelenmektedir.\n\n${voiceList}\n\nGüncellenme Tarihi: <t:${Math.floor(Date.now() / 1000)}:R>`)
   LeaderBoard.send({ embeds: [Voice]}).then(async (vmsg) => {
    await sex.findOneAndUpdate({ guildID: message.guild.id }, { $set: { voiceListID: vmsg.id } }, { upsert: true });
  }).then(async () => {
    await process.exit(0)
  })

  },
};