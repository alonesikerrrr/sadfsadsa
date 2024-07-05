const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const conf = require("../../configs/sunucuayar.json");
const { voice, mesaj2, star, miniicon } = require("../../configs/emojis.json");
const messageUserChannel = require("../../schemas/messageUserChannel");
const voiceUserChannel = require("../../schemas/voiceUserChannel");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const voiceUserParent = require("../../schemas/voiceUserParent");
const isimler = require("../../schemas/names");
const register = require("../../schemas/registerStats");
const inviterSchema = require("../../schemas/inviter");
const moment = require("moment");
require("moment-duration-format");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  conf: {
    aliases: ["me", "stat"],
    name: "stat",
    help: "stat",
    category: "stat",
  },

  run: async (client, message, args, prefix) => {
 if(!message.channel.name.includes("commands"))
if(!message.channel.name.includes("yönetici-chat")) 
 if(!message.channel.name.includes("register-sorumlusu")) {     
            return message.channel.send(`**Komutlar sadece <#1221439666532646933> <#1221439649537593396> kanalında kullanılabilir.**`)
}
    let kanallar = conf.chatChannel;
    if (
      !message.member.permissions.has(8n) &&
      kanallar.includes(message.channel.id)
    )
      return message
        .reply({
          content: `Bu komutu chatte kullanamazsın, bot komut kanallarını kullanınız`,
          ephemeral: true,
        })
        .then((e) =>
          setTimeout(() => {
            e.delete();
          }, 10000)
        );

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    const inviterData = await inviterSchema.findOne({
      guildID: message.guild.id,
      userID: member.user.id,
    });
    const total = inviterData ? inviterData.total : 0;
    const regular = inviterData ? inviterData.regular : 0;
    const bonus = inviterData ? inviterData.bonus : 0;
    const leave = inviterData ? inviterData.leave : 0;
    const fake = inviterData ? inviterData.fake : 0;

    const category = async (parentsArray) => {
      const data = await voiceUserParent.find({
        guildID: message.guild.id,
        userID: member.id,
      });
      const voiceUserParentData = data.filter((x) =>
        parentsArray.includes(x.parentID)
      );
      let voiceStat = 0;
      for (var i = 0; i <= voiceUserParentData.length; i++) {
        voiceStat += voiceUserParentData[i]
          ? voiceUserParentData[i].parentData
          : 0;
      }
      return moment
        .duration(voiceStat)
        .format("H [saat], m [dakika] s [saniye]");
    };

    const Active1 = await messageUserChannel
      .find({ guildID: message.guild.id, userID: member.id })
      .sort({ channelData: -1 });
    const Active2 = await voiceUserChannel
      .find({ guildID: message.guild.id, userID: member.id })
      .sort({ channelData: -1 });
    let messageTop;
    Active1.length > 0
      ? (messageTop = Active1.splice(0, 5)
          .map(
            (x) =>
              `${miniicon} <#${x.channelID}>: \`${Number(
                x.channelData
              ).toLocaleString()} mesaj\``
          )
          .join("\n"))
      : (messageTop = "Veri bulunmuyor.");

    const messageData = await messageUser.findOne({
      guildID: message.guild.id,
      userID: member.id,
    });
    const voiceData = await voiceUser.findOne({
      guildID: message.guild.id,
      userID: member.id,
    });
    const messageWeekly = messageData ? messageData.weeklyStat : 0;
    const voiceWeekly = moment
      .duration(voiceData ? voiceData.weeklyStat : 0)
      .format("H [saat], m [dakika]");
    const messageDaily = messageData ? messageData.dailyStat : 0;
    const voiceDaily = moment
      .duration(voiceData ? voiceData.dailyStat : 0)
      .format("H [saat], m [dakika]");

    if (member.user.bot) return;

    let nameData = await isimler.findOne({
      guildID: message.guild.id,
      userID: member.id,
    });
    let registerData = await register.findOne({
      guildID: message.guild.id,
      userID: member.id,
    });

    const roles = member.roles.cache
      .filter((role) => role.id !== message.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((role) => `<@&${role.id}>`);
    const rolleri = [];
    if (roles.length > 6) {
      const lent = roles.length - 6;
      let itemler = roles.slice(0, 6);
      itemler.map((x) => rolleri.push(x));
      rolleri.push(`${lent} daha...`);
    } else {
      roles.map((x) => rolleri.push(x));
    }
    const members = [
      ...message.guild.members.cache.filter((x) => !x.user.bot).values(),
    ].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
    const joinPos = members.map((u) => u.id).indexOf(member.id);
    const previous = members[joinPos - 1] ? members[joinPos - 1].user : null;
    const next = members[joinPos + 1] ? members[joinPos + 1].user : null;
    const bilgi = `${previous ? `**${previous.tag}** > ` : ""}<@${member.id}>${
      next ? ` > **${next.tag}**` : ""
    }`;
    let üye = message.guild.members.cache.get(member.id);
    let nickname =
      üye.displayName == member.username
        ? "" + member.username + " [Yok] "
        : member.displayName;

    const yazı = [];
    if (member.user.username.length > 15) {
      let yarrak = member.user.username.slice(0, 15);
      yazı.push(`${yarrak}...`);
    } else {
      yazı.push(`${member.user.tag}`);
    }

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("top")
        .setPlaceholder(`${yazı}'n detaylarını görüntüle`)
        .addOptions([
          {
            label: "🎧 Genel Sıralama",
            description: `${message.guild.name} sunucusunun Top20 istatistik sıralaması`,
            value: "stat1",
          },
          {
            label: "🎧 Ses İstatistik Detay",
            description:
              "Ses istatistiklerinin detaylı bilgilerini görüntülemektedir",
            value: "stat2",
          },
          {
            label: "📝 Mesaj İstatistik Detay",
            description:
              "Mesaj istatistiklerinin detaylı bilgilerini görüntülemektedir",
            value: "stat3",
          },
          {
            label: "👥 Kullanıcı Bilgi",
            description: `${message.guild.name} sunucusunun Top20 istatistik sıralaması`,
            value: "stat4",
          },
          { label: `❌ İşlem İptal`, value: "stat5" },
        ])
    );

    const embed = new MessageEmbed()
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }),
      })
      .setColor("RANDOM")
.setDescription(`
${member.toString()}, (${member.roles.highest}) üyesinin \` ${message.guild.name} \` sunucusundaki <t:${Math.floor(Date.now() / 1000)}> tarihinden itibaren Tüm zamanlar ve haftalık istatistik verileri belirtilmiştir.`)
.addFields({
name: `<a:bitt:1217922298271502448> __**Toplam Ses**__`,
value: `\`\`\`cs\n${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\n\`\`\``,
          inline: true,
        },
        {
          name: `<a:bitt:1217922298271502448> __**Toplam Mesaj**__`,
          value: `\`\`\`cs\n${messageData ? messageData.topStat : 0} mesaj\n\`\`\``,
          inline: true,
        },
        {
          name: `<a:bitt:1217922298271502448> __**Toplam Davet**__`,
          value: `\`\`\`cs\n${inviterData ? `${total} regular` : "Veri bulunmuyor."} \n\`\`\``,
          inline: true,
        }
      )
.addField(`
${voice} **Sesli İstatistiği**`,
        `
${miniicon} Haftalık Ses Aktifliği: \` ${moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [saat], m [dakika]")} \`
${miniicon} Günlük Ses Aktifliği: \` ${moment
.duration(voiceData ? voiceData.dailyStat : 0)
.format("H [saat], m [dakika]")} \``,
        false
      )
    
.addField(`
${mesaj2} **Yazı İstatistiği**`,`
${miniicon} Haftalık Atılan Mesaj: \` ${Number( messageWeekly).toLocaleString()} mesaj \`
${miniicon} Günlük Atılan Mesaj: \` ${Number(messageDaily).toLocaleString()} mesaj \`

${star} **Davetleri:** **${total}** (**${regular}** gerçek, **${bonus}** bonus, **${leave}** ayrılmış, **${fake}** fake)`,
        false
      );

    let msg = await message.channel.send({
      embeds: [embed],
      components: [row],
    });

    var filter = (xd) => xd.user.id === message.author.id;
    let collector = msg.createMessageComponentCollector({
      filter,
      componentType: "SELECT_MENU",
      time: 99999999,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.values[0] === "stat1") {
        await interaction.deferUpdate();

        const voiceUsersData = await voiceUser
          .find({ guildID: message.guild.id })
          .sort({ topStat: -1 });
        let list = voiceUsersData
          .filter((x) => message.guild.members.cache.has(x.userID))
          .splice(0, 10)
          .map(
            (x, index) =>
              `${
                x.userID === member.id
                  ? `\` ${index + 1} \` <@${x.userID}> \`${moment
                      .duration(x.topStat)
                      .format("H [saat], m [dakika]")}\` **(Sen)**`
                  : `\` ${index + 1} \` <@${x.userID}> \`${moment
                      .duration(x.topStat)
                      .format("H [saat], m [dakika]")}\``
              }`
          )
          .join("\n");

        const embeds = new MessageEmbed()
.setDescription(`
🎉 Aşağıda **${message.guild.name}** sunucusunun genel sohbet( \`ses\` ) sıralaması listelenmektedir.

${list.length > 0 ? list : "Veri Bulunmuyor."}

Genel sohbet( \`ses\` ) sıralaması <t:${Math.floor(Date.now() / 1000)}> tarihinde otomatik olarak güncellenmiştir.`)
.setAuthor({
            name: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }),
          })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

        interaction.followUp({ embeds: [embeds], ephemeral: true });
        /////
        const messageUsersData = await messageUser
          .find({ guildID: message.guild.id })
          .sort({ topStat: -1 });
        let list2 = messageUsersData
          .filter((x) => message.guild.members.cache.has(x.userID))
          .splice(0, 10)
          .map(
            (x, index) =>
              `${
                x.userID === member.id
                  ? `\` ${index + 1} \` <@${x.userID}> \`${Number(
                      x.topStat
                    ).toLocaleString()} mesaj\` **(Sen)**`
                  : `\` ${index + 1} \` <@${x.userID}> \`${Number(
                      x.topStat
                    ).toLocaleString()} mesaj\``
              }`
          )
          .join("\n");

        const embeds2 = new MessageEmbed()
.setDescription(`
🎉 Aşağıda **${message.guild.name}** sunucusunun genel sohbet( \`mesaj\` ) sıralaması listelenmektedir.
    
${list2.length > 0 ? list2 : "Veri Bulunmuyor."}
    
<a:kirmiziok:1217922896194830406> Genel sohbet( \`mesaj\` ) sıralaması <t:${Math.floor( Date.now() / 1000)}> tarihinde otomatik olarak güncellenmiştir.`)
          .setAuthor({
            name: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }),
          })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

        interaction.followUp({ embeds: [embeds2], ephemeral: true });
      }

      if (interaction.values[0] === "stat2") {
        await interaction.deferUpdate();
        const embeds = new MessageEmbed()
.setDescription(`🎉 Aşağıda **${message.guild.name}** sunucusunun genel sohbet( \`ses\` ) sıralaması listelenmektedir.`)
.addFields(
{
              name: `<a:bitt:1217922298271502448> __**Toplam Ses**__`,
              value: `\`\`\`cs\n${moment
                .duration(voiceData ? voiceData.topStat : 0)
                .format("H [saat], m [dakika]")}\n\`\`\``,
              inline: true,
            },
            {
              name: `<a:bitt:1217922298271502448> __**Haftalık Ses**__`,
              value: `\`\`\`cs\n${voiceWeekly}\n\`\`\``,
              inline: true,
            },
            {
              name: `<a:bitt:1217922298271502448> __**Günlük Ses**__`,
              value: `\`\`\`cs\n${voiceDaily}\n\`\`\``,
              inline: true,
            }
          )
          .addField(
            `${voice} **Sesli Sohbet İstatistiği**`,
            `
${miniicon} Toplam: \`${moment
              .duration(voiceData ? voiceData.topStat : 0)
              .format("H [saat], m [dakika]")}\`
${miniicon} Public Odalar: \` ${await category(conf.publicParents)} \`
${miniicon} Secret Odalar: \` ${await category(conf.privateParents)} \`
${miniicon} Alone Odalar: \` ${await category(conf.aloneParents)} \`
${miniicon} Yönetim Yetkili Odaları: \` ${await category(conf.funParents)} \`
${miniicon} Kayıt Odaları: \` ${await category(conf.registerParents)} \`

<a:kirmiziok:1214235955947511938> Genel sohbet( \`ses\` ) sıralaması <t:${Math.floor(
              Date.now() / 1000
            )}> tarihinde otomatik olarak güncellenmiştir.
`,
            false
          )
          .setAuthor({
            name: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }),
          })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
        msg.edit({ embeds: [embeds], components: [row] });
      }

      if (interaction.values[0] === "stat3") {
        await interaction.deferUpdate();
        const embeds = new MessageEmbed()
          .setDescription(
            `🎉 Aşağıda **${message.guild.name}** sunucusunun genel sohbet( \`mesaj\` ) sıralaması listelenmektedir.`
          )
          .addFields(
            {
              name: `<a:bitt:1217922298271502448> __**Toplam Mesaj**__`,
              value: `\`\`\`cs\n${
                messageData ? messageData.topStat : 0
              } mesaj\n\`\`\``,
              inline: true,
            },
            {
              name: `<a:bitt:1217922298271502448> __**Haftalık Mesaj**__`,
              value: `\`\`\`cs\n${Number(
                messageWeekly
              ).toLocaleString()} mesaj\n\`\`\``,
              inline: true,
            },
            {
              name: `<a:bitt:1217922298271502448> __**Günlük Mesaj**__`,
              value: `\`\`\`cs\n${Number(
                messageDaily
              ).toLocaleString()} mesaj\n\`\`\``,
              inline: true,
            }
          )
          .addField(
            `${mesaj2} **Mesaj İstatistiği**`,
            `
${messageTop}

<a:kirmiziok:1217922896194830406> Genel sohbet( \`mesaj\` ) sıralaması <t:${Math.floor(
              Date.now() / 1000
            )}> tarihinde otomatik olarak güncellenmiştir.
`,
            false
          )
          .setAuthor({
            name: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }),
          })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));
        msg.edit({ embeds: [embeds], components: [row] });
      }

      if (interaction.values[0] === "stat4") {
        await interaction.deferUpdate();

        const embeds = new MessageEmbed()
          .setDescription(
            `<a:bitt:1217922298271502448> Aşağıda ${member} kullanıcısının kullanıcı bilgisi görüntülenmektedir.`
          )
          .addField(
            `<a:bitt:1217922298271502448> Kullanıcı Bilgisi`,
            `
${miniicon} Hesap: ${member}
${miniicon} Kullanıcı ID: ${member.id}
${miniicon} Kuruluş Tarihi: <t:${Math.floor(
              member.user.createdTimestamp / 1000
            )}:R>
`
          )
          .addField(
            `<a:bitt:1217922298271502448> Sunucu Bilgisi`,
            `
${miniicon} Sunucu İsmi: ${nickname}
${miniicon} Katılım Tarihi: <t:${Math.floor(member.joinedAt / 1000)}:R>
${miniicon} Katılım Sırası: ${message.guild.members.cache
              .filter((a) => a.joinedTimestamp <= member.joinedTimestamp)
              .size.toLocaleString()}/${message.guild.memberCount.toLocaleString()}
${miniicon} Katılım Bilgisi: ${bilgi}

${miniicon} Bazı Rolleri: (${rolleri.length}): ${rolleri.join(", ")}
${miniicon} İsim geçmişi:  **${nameData ? `${nameData.names.length}` : "0"}** 
${
  nameData
    ? nameData.names
        .splice(0, 1)
        .map(
          (x, i) =>
            `\` ${x.name} \` ${x.sebep ? `(${x.sebep})` : ""} ${
              x.rol ? `(${x.rol})` : ""
            }`
        )
        .join("\n")
    : ""
}
`
          );
        if (
          member.permissions.has("ADMINISTRATOR") ||
          conf.teyitciRolleri.some((x) => member.roles.cache.has(x))
        )
          embeds
            .addField(
              `<a:bitt:1217922298271502448> Yetkili Bilgisi`,
              `
${miniicon} Toplam kayıt: ${registerData ? registerData.top : 0} 
${miniicon} Erkek kayıt : ${registerData ? registerData.erkek : 0} 
${miniicon} Kadın kayıt : ${registerData ? registerData.kız : 0}`
            )
            .setAuthor({
              name: message.guild.name,
              iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }),
            })
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 2048 }));

        msg.edit({ embeds: [embeds], components: [row] });
      }

      if (interaction.values[0] === "stat5") {
        await interaction.deferUpdate();
        if (msg) msg.delete();
      }
    });
  },
};
