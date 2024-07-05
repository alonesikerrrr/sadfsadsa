const { MessageEmbed } = require('discord.js');
const regstats = require("../../schemas/registerStats");
const ayar = require("../../configs/sunucuayar.json")
const { red, green, miniicon } = require("../../configs/emojis.json")
const moment = require("moment");
require("moment-duration-format");
module.exports = {
  conf: {
    aliases: [],
    name: "teyitler",
    help: "teyitler (top @adonis/ID)",
    category: "stat",
  },

  run: async (client, message, args, embed, prefix) => { 
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has('ADMINISTRATOR')) 
    {
    message.react(red)
    message.reply({ content: `Yetkin bulunmamakta.\Yetkili olmak istersen başvurabilirsin.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (args[0] === "top") {
      let data = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

      if (!data.length) return message.reply({ embeds: [new MessageEmbed().setDescription("Herhangi bir teyit verisi bulunamadı!")] });
      let arr = [];
      data.forEach((x) => arr.push({ id: x.userID, erkek: x.erkek, kız: x.kız }));
      let index = arr.findIndex((x) => x.id == message.author.id) + 1;
    
      let list = data
        .filter((x) => message.guild.members.cache.has(x.userID))
        .splice(0, 20)
        .map((x, i) => `${x.userID === message.author.id ? `\` ${i + 1} \` **<@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__ (Sen)**` : `\` ${i + 1} \` <@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__`}`)
        .join("\n");
    
    const veri = await regstats.findOne({ guildID: message.guild.id, userID: message.author.id });
    if (index < 20) {
    const embeds = new MessageEmbed()
.setDescription(`
<a:bitt:1217922298271502448> Aşağıda **${message.guild.name}** sunucusunun genel kayıt sıralaması listelenmektedir.
                        
${list}
                        
<a:kirmiziok:1217922896194830406 Genel Kayıt sıralaması \`${moment(Date.now()).format("LLL")}\` tarihinde otomatik olarak güncellenmiştir.
    `)
    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
    .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
    message.reply({ embeds: [embeds] })
    } else {
    const embeds2 = new MessageEmbed()
.setDescription(`
<a:bitt:1217922298271502448> Aşağıda **${message.guild.name}** sunucusunun genel kayıt sıralaması listelenmektedir.
                        
${list} \n... \n\` ${index} \` ${message.author} **Erkek __${veri.erkek}__ Kadın __${veri.kız}__ (Sen)**
                        
<a:kirmiziok:1217922896194830406 Genel Kayıt sıralaması \`${moment(Date.now()).format("LLL")}\` tarihinde otomatik olarak güncellenmiştir.
    `)
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
        .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
        message.reply({ embeds: [embeds2] })
      }
    } else if (!args[0]) {
      const data = await regstats.findOne({ guildID: message.guild.id, userID: member.id });
      message.react(green)
message.reply({ embeds: [embed.setDescription(`  
<a:bitt:1217922298271502448> Toplam kayıt bilgisi: \`${data ? data.top : 0}\`
${miniicon} Toplam erkek kayıt bilgisi: \`${data ? data.erkek : 0}\`
${miniicon} Toplam kız kayıt bilgisi: \`${data ? data.kız : 0}\`
	`)] });
    }
  },
};
