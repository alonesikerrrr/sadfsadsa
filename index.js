const { Modal, TextInputComponent, showModal } = require('discord-modals')
const {Intents, SelectMenuComponent, Client, Collection, MessageActionRow, MessageButton, MessageAttachment, MessageEmbed, Permissions, Constants, ApplicationCommandPermissionsManager } = require("discord.js");
const client = global.bot = new Client({
  fetchAllMembers: true,
  intents: [ 32767 ],
  partials: ["CHANNEL"]
});
const Discord = require('discord.js');
const conf = require("./src/configs/sunucuayar.json");
const config = require("./src/configs/sunucuayar.json");
const isimcek = require("./src/configs/isimcek.json")
const emojis = require("./src/configs/emojis.json")
const fs = require("fs");
const ms = require("ms");
const moment = require("moment");
moment.locale("tr");
client.commands = new Collection();
client.aliases = new Collection();
client.invites = new Collection();
client.cooldown = new Map();

const map = new Map();
const lımıt = 4;
const TIME = 180000;
const DIFF = 2000;

client.ranks = [
{ role: "1221441646932004894", coin: 1500 },
  { role: "1221441647716597760", coin: 2500 },
  { role: "1221441648643407972", coin: 4500 },
  { role: "1221441649167568968", coin: 6700 },
  { role: "1221441650157551698", coin: 8800 },
  { role: "1221441651264852108", coin: 9500 },
  { role: "1221441652049317971", coin: 11500 },
  { role: "1221441652535853147", coin: 12500 },
  { role: "1221441653227782234", coin: 13500 },
  { role: "1221441653621915709", coin: 15500 },
  { role: "1221441654809169970", coin: 20000 },
];

 ///--------------------KOMUT ÇALIŞTIRMA--------------------------------///

fs.readdir('./src/commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`❗️ Toplamda ${files.length} Adet Komut Yüklenecek.`);
  files.forEach(f => {
    fs.readdir("./src/commands/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`./src/commands/${f}/` + file);
        console.log(`✔️ [KOMUT] ${props.conf.name} İsimli Komut Yüklendi!`);
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.conf.name);
        });
      })
    })
  });
});
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(process.env.token)  // Glitchde Çalışması İçin process.env.token
  .then(() => console.log(`✔️ [BOT] Bot Başarıyla ${client.user.tag} Olarak Giriş Yaptı!`))
  .catch(() => console.log("❗️ [HATA] Bot Bağlanamadı!"));

  process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
    process.exit(1);
  });
  
  process.on("unhandledRejection", err => {
    console.error("Promise Hatası: ", err);
  });

  ///// slash commands
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');  
  client.slashcommands = new Collection();
  var slashcommands = [];
  
  fs.readdirSync('./src/Slashcommands/').forEach(async category => {
		const commands = fs.readdirSync(`./src/Slashcommands/${category}/`).filter(cmd => cmd.endsWith('.js'));
		for (const command of commands) {
		const Command = require(`./src/Slashcommands/${category}/${command}`);
    client.slashcommands.set(Command.data.name, Command);
    slashcommands.push(Command.data.toJSON());
		}
	});
  
	const rest = new REST({ version: '9' }).setToken(process.env.token);
  (async () => {
	try {
		console.log('[ASPECT] Slash ve Komutlar yükleniyor.');
		await rest.put(
			Routes.applicationGuildCommands(conf.Main.BotClientID, conf.GuildID),
			{ body: slashcommands },
		).then(() => {
			console.log('[ASPECT] Slash ve Context Komutlar yüklendi.');
		});
	}
	catch (e) {
		console.error(e);
	}
})();

client.on('interactionCreate', (interaction) => {
  if (interaction.isContextMenu() || interaction.isCommand()) {
    const command = client.slashcommands.get(interaction.commandName);
    if (interaction.user.bot) return;
    if (!interaction.inGuild() && interaction.isCommand()) return interaction.editReply({ content: 'Komutları kullanmak için bir sunucuda olmanız gerekir.' });
    if (!command) return interaction.reply({ content: 'Bu komut kullanılamıyor.', ephemeral: true }) && client.slashcommands.delete(interaction.commandName);
    try {
      command.execute(interaction, client);
    }
    catch (e) {
      console.log(e);
      return interaction.reply({ content: `An error has occurred.\n\n**\`${e.message}\`**` });
    }
  }
});

client.setMaxListeners(0)

/////////////------------------- HATA LOG BAŞLANGIÇ -------------------/////////////

let hatalog = client.channels.cache.find(x => x.name.includes(isimcek.kanalcek.hatalog));
process.on("unhandledRejection", error => { 
if(hatalog) hatalog.send(`<@${conf.botowner}> Kodumda hata çıktı : \`\`\`${error}\`\`\``) 
   console.log(error)
})
process.on("uncaughtException", error => { 
if(hatalog) hatalog.send(`<@${conf.botowner}> Kodumda hata çıktı : \`\`\`${error}\`\`\``) 
  console.log(error)
})
process.on("uncaughtExceptionMonitor", error => { 
if(hatalog) hatalog.send(`<@${conf.botowner}> Kodumda hata çıktı : \`\`\`${error}\`\`\``) 
  console.log(error)
})

/////////////------------------- HATA LOG BİTİŞ -------------------/////////////
/////////////------------------- BOT DM LOG -------------------/////////////
  client.on('messageCreate', (message) => {
let dmog = client.channels.cache.find(x => x.name.includes(isimcek.kanalcek.dmlog));
if (message.author.bot) return;

  if (message.channel.type === "DM") {
    let embedLogs = new Discord.MessageEmbed()
.setAuthor("DM-LOG Sistemi")
.setDescription(`
${message.author} İsimli Kullanıcı Bir Mesaj Gönderdi.

\`•\` **Mesaj Gönderen :** ${message.author} - (\`${message.author.tag}\`)
\`•\` **Gönderildiği Tarih :** <t:${Math.floor(Date.now() / 1000)}>

\`•\` **Kullanıcının Mesajı :** ${message.content || "Yok"}

`)
      .setColor("RED")
      .setTimestamp();

    if (message.attachments.size > 0)
      embedLogs.addField(
        `\`•\` **Mesajdaki Ek Dosyalar : **`,
        `${message.attachments.first()?.url}`,
        false
      );
    return dmog.send({
      embeds: [embedLogs],
    });
  }
  });
/////////////------------------- BOT DM LOG BİTİŞ -------------------/////////////
/////////////------------------- LEVEL SİSTEMİ -------------------/////////////
let stats = require("./src/schemas/level");
 
let arr = [{
  Chat: "💬🥉",
  Voice: "🔊🥉",
  ChatColor: "#fa795b",
  VoiceColor: "#fa795b",
  sLevel: 3,
  cLevel: 2
}, {
  Chat: "💬🥈",
  Voice: "🔊🥈",
  ChatColor: "#cfcbcb",
  VoiceColor: "#cfcbcb",
  sLevel: 8,
  cLevel: 5
}, {
  Chat: "💬🥇",
  Voice: "🔊🥇",
  ChatColor: "#fffb00",
  VoiceColor: "#fffb00",
  sLevel: 20,
  cLevel: 35
}, {
  Chat: "💬🏆",
  Voice: "🔊🏆",
  ChatColor: "#23fafa",
  VoiceColor: "#23fafa",
  sLevel: 50,
  cLevel: 70
}]
client.checkLevel = async function (userID, guildID, type) {
  if (conf.Main.LevelSystem == false) return;
  let sunucu = client.guilds.cache.get(guildID);
  if (!sunucu) return;
  let kontrol = await stats.findOne({
    userID: userID,
    guildID: guildID
  });
  if (!kontrol) return;
  const channel = client.channels.cache.get("1221439767452061696");
  arr.map(async data => {
    if (type === "mesaj") {
      if (kontrol.messageLevel >= data.cLevel) {
        if (kontrol.autoRankup.includes(data.Chat)) return;
        stats.updateOne({userID: userID, guildID: guildID}, {$push: {autoRankup: data.Chat}}, {upsert: true}).exec()
        channel.send({ content: `:tada: <@${userID}> tebrikler! Mesaj istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **"${data.Chat}"** rolüne terfi edildin!`})
      };
    };
    if (type === "ses") {
      if (kontrol.voiceLevel >= data.sLevel) {
        if (kontrol.autoRankup.includes(data.Voice)) return;
        stats.updateOne({userID: userID, guildID: guildID}, {$push: {autoRankup: data.Voice}}, {upsert: true}).exec()
        channel.send({ content: `:tada: <@${userID}> tebrikler! Ses istatistiklerin bir sonraki seviyeye atlaman için yeterli oldu. **"${data.Voice}"** rolüne terfi edildin!`})
      };
    };
  });
};
/////////////------------------- LEVEL SİSTEMİ BİTİŞ -------------------/////////////


client.on("message", msg => {
       let InviteGuardReg = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;  
         if (InviteGuardReg.test(msg.content)) {
           try {
             if (!msg.member.permissions.has(8n)) {
                   msg.delete();
                   msg.delete();
                   msg.delete();
                     return msg.reply('Reklam yapman yasak!').then(ozixd => ozixd.delete({ timeout: 3000 }));
    
             }              
           } catch(err) {
             console.log(err);
           }
         }
     });

     