const conf = require("../configs/sunucuayar.json")
const isimcek = require("../configs/isimcek.json")
const emojis = require("../configs/emojis.json")

module.exports = async (message) => {
  if (message.content.toLowerCase() === "tag" || message.content.toLowerCase() === "!tag" || message.content.toLowerCase() === ".tag") {
    message.reply({ content: `${conf.tag}`});
  }
  
  if (message.content.toLowerCase() === "sa" || message.content.toLowerCase() === "Selamun Aleyküm" || message.content.toLowerCase() === "selam") {
    message.reply({ content: `Aleyküm Selam Hoş geldin`});
  }
  
};
module.exports.conf = {
  name: "messageCreate"
};