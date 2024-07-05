const { green, red} = require("../../configs/emojis.json")
const Stat = require("../../schemas/level");
const { Client, MessageEmbed, MessageAttachment } = require('discord.js');
const { Canvas } = require('canvas-constructor');
const { loadImage } = require('canvas');
const client = global.bot;
const { registerFont } = require("canvas");
registerFont('./MarlinGeo-Black.otf', { family: 'Marlin Geo Black' })

module.exports = {
    conf: {
      aliases: ["level","seviye"],
      name: "level",
      help: "level",
      category: "stat",
    },
  
run: async (client, message, args, prefix) => {
      if (!message.channel.name.includes("commands")) {
            return message.channel.send(`Komutlar sadece <#1221439666532646933> kanalında kullanılabilir.`)
}
    if (!message.guild) return;
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
		let data = await Stat.findOne({ guildID: message.guild.id, userID: target.id });
        if (!data || data && !data.messageLevel) {
            return message.reply({ content: "Herhangi Bir Seviye veriniz bulunmamaktadır." });
        }
        const yazı = [] 
        if(target.user.username.length > 12) {
        let yarrak = target.user.username.slice(0, 12)
          yazı.push(`${yarrak}..`)  
        } else {
          yazı.push(`${target.user.tag}`)
        }

        let loading = await message.channel.send({ content: `<a:xp:1218277059667693579> Seviye Verileri Yükleniyor...`})
        const background = await loadImage("https://cdn.discordapp.com/attachments/1217893158076289065/1217910693794283680/vendora.png?ex=660ef939&is=65fc8439&hm=666510584154e15fb541790a8d5f606562ffe6ac1c5bead5f09d0158697d6ebc&")
		const avatar = await loadImage(target.user.displayAvatarURL({ format: 'png' }));
        const image = new Canvas(478, 180)
        image.printImage(background, 0, 0, 478, 180)
		image.printCircularImage(avatar, 100.5, 64.5, 58.5, 58.5, 5)
        image.setColor("#fff")
		image.setTextFont('36px "Marlin Geo Black"')
        image.printText(`${yazı}`, 8, 170, 150)
        image.setColor("#fff")
		image.setTextFont('14px "Marlin Geo Black"')
        image.printText(`${data.messageLevel} Level`, 380, 110, 150)
        image.setColor("#fff")
		image.setTextFont('14px "Marlin Geo Black"')
        image.printText(`${data.voiceLevel} Level`, 380, 150, 150)
		image.save()
		image.createRoundedClip(214.5, 114, getProgressBarWidth(data.messageXP, data.messageLevel*643, 232), 17, 25)
        image.setColor("#fffa00")
        image.fill()
        image.restore()
		image.setColor("#5238fc")
		image.setTextFont('12px LEMON MILK Bold')
        image.printText(`${data.messageXP}/${data.messageLevel*643} XP`, 220, 128, 150)
		image.createRoundedClip(214.5, 153.5, getProgressBarWidth(data.voiceXP, data.voiceLevel*643, 232), 17, 25)
        image.setColor("#fffa00")
		image.fill()
		image.restore()
        image.setColor("#5238fc")
		image.setTextFont('12px LEMON MILK Bold')
        image.printText(`${data.voiceXP}/${data.voiceLevel*643} XP`, 220.5, 168, 150)
        loading.delete();
        const attachment = new MessageAttachment(image.toBuffer(), 'ozi.png');
        message.channel.send({ content: `<a:bitt:1217922298271502448> **[** \`${target.user.tag}\` **]** kullanıcısının sunucu level kartı!`, files:  [attachment] });
}
};
  
function getProgressBarWidth(currentXP, requiredXP, maxWidth) {
    if ((currentXP+0.1) > requiredXP) return maxWidth;
    let width = currentXP <= 0 ? 0 : ((currentXP+0.1) * maxWidth) / requiredXP;
    if (width > maxWidth) width = maxWidth;
    return width;
}