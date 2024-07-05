const coin = require("../../schemas/coin");
const moment = require("moment");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const banLimit = new Map();
moment.locale("tr");
const conf = require("../../configs/sunucuayar.json")
const isimcek = require("../../configs/isimcek.json")
const emojis = require("../../configs/emojis.json")
const {miniicon} = require("../../configs/emojis.json")

module.exports = {
  conf: {
    aliases: ["ban","yargı","sg"],
    name: "ban",
    help: "ban <Shadow/ID> <Sebep>",
    category: "cezalandırma",
  },

  run: async (client, message, args, embed) => {
          if(!message.channel.name.includes("welcome-to-vendora"))
if(!message.channel.name.includes("commands"))
if(!message.channel.name.includes("jail-chat"))
if(!message.channel.name.includes("şüpheli-chat")){
            return message.channel.send(`Komutlar sadece <#1221439666532646933> <#1221439648413253794>kanalında kullanılabilir.`)
}
    if (!message.member.permissions.has("BAN_MEMBERS") &&  !conf.banHammer.some(x => message.member.roles.cache.has(x))) { message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    return }
    if (!args[0]) { message.channel.send({ content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    return }
    const user = message.mentions.users.first() || await client.fetchUser(args[0]);
    if (!user) { message.channel.send({ content:"Böyle bir kullanıcı bulunamadı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    return }
    const ban = await client.fetchBan(message.guild, args[0]);
    if (ban) { message.channel.send({ content:"Bu üye zaten banlı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    return }
    const reason = args.slice(1).join(" ") || "Belirtilmedi!";
    const member = message.guild.members.cache.get(user.id);

    if (message.guild.members.cache.has(user.id) && message.guild.members.cache.get(user.id).permissions.has("VIEW_AUDIT_LOG")) return message.channel.send({ content:"Üst yetkiye sahip kişileri yasaklayamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    if (message.guild.members.cache.has(user.id) && message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return message.channel.send({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini banlayamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    if (member && !member.bannable) return message.channel.send({ content:"Bu üyeyi banlayamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    if (conf.Main.banlimit > 0 && banLimit.has(message.author.id) && banLimit.get(message.author.id) == conf.Main.banlimit) return message.channel.send({ content:"Saatlik ban sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));

    if (conf.Main.dmMessages) user.send({ content:`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **${reason}** sebebiyle banlandınız!`}).catch(() => {});
    message.guild.members.ban(user.id, { reason: `${reason} | Yetkili: ${message.author.tag}` , days:1}).catch(() => {});
    const penal = await client.penalize(message.guild.id, user.id, "BAN", true, message.author.id, reason);

    const messageEmbed = embed
    .setColor("RANDOM")
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
    .setDescription(`**${member ? member.toString() : user.username}** Üyesi Sunucudan **${reason}** Sebebiyle \n${message.author} Tarafından banlandı! Ceza Numarası: (\`#${penal.id}\`)`)


    message.reply({ embeds: [messageEmbed]});

    const log = embed
.setDescription(`
<a:bitt:1214235957679886337> **${member ? member.toString() : user.username}** \`${user.id}\` Adlı Kişiye Ban Atıldı

\n${miniicon} Banlayan Yetkili: ${message.author} \`${message.author.id}\`         
\n${miniicon} Ban Tarihi: <t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)
\n${miniicon} Ban Sebebi: \`${reason}\``)
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    (Ceza ID: #${penal.id})` })
      message.guild.channels.cache.get(conf.banLogChannel).send({ embeds: [log]});

    await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { coin: -100 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { BanAmount: 1 } }, {upsert: true});
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 100 } }, { upsert: true });

    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(conf.cezapuanlog) message.guild.channels.cache.get(conf.cezapuanlog).send({ content:`${member} üyesi ban cezası alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});

    if (conf.Main.banlimit > 0) {
      if (!banLimit.has(message.author.id)) banLimit.set(message.author.id, 1);
      else banLimit.set(message.author.id, banLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (banLimit.has(message.author.id)) banLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};

