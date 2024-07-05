const { MessageEmbed } = require('discord.js');
const ayar = require("../../configs/sunucuayar.json")
const Ayarlar = require("../../configs/sunucuayar.json");
const { red , green } = require("../../configs/emojis.json")
const isimler = require("../../schemas/names");
const settings = require("../../configs/settings.json")
const moment = require("moment");
const vipLimit = new Map();
moment.locale("tr");


module.exports = {
  conf: {
    aliases: ["v", "vip"],
    name: "vip",
    help: "vip <@Shadow/ID>",
    category: "kayıt",
  },

  run: async (client, message, args, perm, prefix) => {
            if(!message.channel.name.includes("welcome-to-vendora"))
if(!message.channel.name.includes("commands")) {
            return message.channel.send(`Komutlar sadece <#1221439666532646933> <#1221439648413253794>kanalında kullanılabilir.`)
}

  
       let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
       if(!Ayarlar.teyitciRolleri.some(oku => message.member.roles.cache.has(oku)) && !Ayarlar.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) 
    {
    message.react(red)
    message.reply({ content:`Yetkin bulunmamakta.\Yetkili olmak istersen başvurabilirsin.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
  
    if (!member) return message.channel.send(`${message.member}, Geçerli bir üye belirtmelisin. ${red}`)
    if (member.id === message.author.id) return message.channel.send(`${message.member}, Kendine vip veremezsin! ${red}`)
    if (member.user.bot) return message.channel.send(`${message.member}, belirttiğin üye bir bot olamaz! ${red}`)
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(`${message.member}, Belirttiğin üye senden üst/aynı pozisyonda! ${red}`)
   if (!client.isimLimit) {
    client.isimLimit = new Map();
}
let banNum = client.isimLimit.get(message.author.id) || 0;
client.isimLimit.set(message.author.id, banNum + 1);
if (banNum == 3) {
    return message.channel.send(`Gün içerisinde çok fazla Vip işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.`);
}
    if (member.roles.cache.has(ayar.vipRole)) {
        await member.roles.remove(ayar.vipRole).catch(err => {});
        message.channel.send(`${member}, üyesinden **VİP** rolü alındı. ${green}`)

    } else {

        await member.roles.add(ayar.vipRole).catch(err => {});
        message.channel.send(`${member}, üyesine **VİP** rolü verildi. ${green}`)
    }
   
    
if (settings.kayisizLimit > 0) {
      if (!vipLimit.has(message.author.id)) vipLimit.set(message.author.id, 1);
      else vipLimit.set(message.author.id, vipLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (vipLimit.has(message.author.id)) vipLimit.delete(message.author.id);
        }, 1000 * 60 * 60);
    }
  },
};