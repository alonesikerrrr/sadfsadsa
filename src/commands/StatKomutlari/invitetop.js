const { MessageEmbed } = require("discord.js");
const db = require("../../schemas/inviter");
const conf = require("../../configs/sunucuayar.json")
const moment = require("moment");
require("moment-duration-format");
module.exports = {
  conf: {
    aliases: ["invtop", "invite-top", "davet-top", "topdavet"],
    name: "topinvite",
    help: "topdavet",
    category: "stat",
  },

  run: async (client, message, args, embed) => {
if(!message.channel.name.includes("commands"))
if(!message.channel.name.includes("yönetici-chat")) 
 if(!message.channel.name.includes("register-sorumlusu")) {     
            return message.channel.send(`**Komutlar sadece <#1221439666532646933> <#1221439649537593396> kanalında kullanılabilir.**`)
}
    let data = await db.find({ guildID: message.guild.id }).sort({ total: -1 });
    if (!data.length) return message.channel.send({ embeds: [new MessageEmbed().setDescription("Herhangi bir davet verisi bulunamadı!")] });
    let arr = [];
    data.forEach((x) => arr.push({ id: x.userID, total: x.total }));
    let index = arr.findIndex((x) => x.id == message.author.id) + 1;
  
    let list = data
      .filter((x) => message.guild.members.cache.has(x.userID))
      .splice(0, 20)
      .map((x, index) => `${x.userID === message.author.id ? `\` ${index + 1} \` <@${x.userID}> - **${x.total} davet** \`(${x.regular} ✅, ${x.bonus} 🔍, ${x.fake} ⛔, ${x.leave} ❌)\` **(Sen)**` : `\` ${index + 1} \` <@${x.userID}> - **${x.total}** davet \`(${x.regular} ✅, ${x.bonus} 🔍, ${x.fake} ⛔, ${x.leave} ❌)\``}`)
      .join("\n");
  
  const veri = await db.findOne({ guildID: message.guild.id, userID: message.author.id });
  if (index < 20) {
  const embeds = new MessageEmbed()
  .setDescription(`
  <a:bitt:1217922298271502448> Aşağıda **${message.guild.name}** sunucusunun genel davet sıralaması listelenmektedir.
                  
  ${list}
                  
  <a:kirmiziok:1217922896194830406> Genel Davet sıralaması \`${moment(Date.now()).format("LLL")}\` tarihinde otomatik olarak güncellenmiştir.
  **Not:** \`✅ Gerçek / 🔍 Bonus / ⛔ Fake / ❌ Ayrılmış\``)
  .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
  .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
  message.channel.send({ embeds: [embeds] })
  } else {
  const embeds2 = new MessageEmbed()
  .setDescription(`
  <a:bitt:1217922298271502448> Aşağıda **${message.guild.name}** sunucusunun genel davet sıralaması listelenmektedir.
                  
  ${list} \n \n\` ${index} \` ${message.author} **${veri.total} davet** \`(${veri.regular} ✅, ${veri.bonus} 🔍, ${veri.fake} ⛔, ${veri.leave} ❌)\` **(Sen)**
                  
  <a:kirmiziok:1217922896194830406> Genel Davet sıralaması \`${moment(Date.now()).format("LLL")}\` tarihinde otomatik olarak güncellenmiştir.
  **Not:** \`✅ Gerçek / 🔍 Bonus / ⛔ Fake / ❌ Ayrılmış\``)
  .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
  .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
  message.channel.send({ embeds: [embeds2] })
  }
  }
};