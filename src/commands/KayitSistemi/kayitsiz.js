const ayar = require("../../configs/sunucuayar.json")
const conf = require("../../configs/sunucuayar.json")
const settings = require("../../configs/settings.json")
const { red, green } = require("../../configs/emojis.json")
const moment = require("moment");
const kayisizLimit = new Map();
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["kayıtsız","ks","kayitsiz"],
    name: "kayitsiz",
    help: "kayitsiz  <Shadow/ID>",
    category: "kayıt",
  },
  
  run: async (client, message, args, embed, prefix) => {
              if(!message.channel.name.includes("welcome-to-vendora"))
if(!message.channel.name.includes("commands"))
if(!message.channel.name.includes("şüpheli-chat")){
            return message.channel.send(`Komutlar sadece <#1221439666532646933> <#1221439648413253794>kanalında kullanılabilir.`)
}
    if (!client.kayıtsızLimit) {
    client.kayıtsızLimit = new Map();
}
let banNum = client.kayıtsızLimit.get(message.author.id) || 0;
client.kayıtsızLimit.set(message.author.id, banNum + 1);
if (banNum == 5) {
    return message.channel.send(`Gün içerisinde çok fazla Kayıtsız işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.`);
}
    if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has('ADMINISTRATOR')) 
    {
    message.react(red)
    message.reply({ content:`Yetkin bulunmamakta.\Yetkili olmak istersen başvurabilirsin.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) 
    {
  
    message.react(red)
    message.reply({ content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (!message.member.permissions.has(8n) && member.roles.highest.position >= message.member.roles.highest.position) 
    {
    message.react(red) 
    message.reply({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini kayıtsıza atamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (!member.manageable) 
    {
    message.react(red)
    message.reply({ content: "Bu üyeyi kayıtsıza atamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    message.react(green)
    member.roles.set(conf.unregRoles);
    member.setNickname(`${member.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} İsim | Yaş`)
    message.reply({ content:`${member} üyesi, ${message.author} tarafından, kayıtsıza atıldı! ${green}`}).then((e) => setTimeout(() => { e.delete(); }, 5000));
  

    
  },
};