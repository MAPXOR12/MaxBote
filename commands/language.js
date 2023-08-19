const db = require("../mongoDB");
module.exports = {
  name: "language",
  description: "It allows you to set the language of the bot.",
  permissions: "0x0000000000000020",
  options: [],
  voiceChannel: false,
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);
    try {
      const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
      let buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Kurdish")
          .setCustomId('ku')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('1142204494977957979'), 
        new ButtonBuilder()
          .setLabel("English")
          .setCustomId('en')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🇬🇧'),
   
        new ButtonBuilder()
          .setLabel("العربية")
          .setCustomId('ar')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🇸🇦'),



        

      let embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle("Select a language")
        .setTimestamp()
        .setFooter({ text: `MusicMaker ❤️` })
      interaction?.reply({ embeds: [embed], components: [buttons] }).then(async Message => {

        const filter = i => i.user.id === interaction?.user?.id
        let col = await Message.createMessageComponentCollector({ filter, time: 30000 });

        col.on('collect', async (button) => {
          if (button.user.id !== interaction?.user?.id) return
          switch (button.customId) {
            case 'ku':
              await db?.musicbot?.updateOne({ guildID: interaction?.guild?.id }, {
                $set: {
                  language: 'ku'
                }
              }, { upsert: true }).catch(e => { })
              await interaction?.editReply({ content: `زمانی بۆتەکە بە سەرکەوتوویی گۆڕدراوە بۆ زمانی <:kurdish:1142204494977957979>`, embeds: [], components: [], ephemeral: true }).catch(e => { })
              await button?.deferUpdate().catch(e => { })
              await col?.stop()
              break
              
            case 'en':
              await db?.musicbot?.updateOne({ guildID: interaction?.guild?.id }, {
                $set: {
                  language: 'en'
                }
              }, { upsert: true }).catch(e => { })
              await interaction?.editReply({ content: `Bot language successfully changed to english. :flag_gb:`, embeds: [], components: [], ephemeral: true }).catch(e => { })
              await button?.deferUpdate().catch(e => { })
              await col?.stop()
              break


              case 'ar':
                await db?.musicbot?.updateOne({ guildID: interaction?.guild?.id }, {
                  $set: {
                    language: 'ar'
                  }
                }, { upsert: true }).catch(e => { })
                await interaction?.editReply({ content: `تم تغيير لغة البوت بنجاح إلى اللغة العربية: :flag_ps:`, embeds: [], components: [], ephemeral: true }).catch(e => { })
                await button?.deferUpdate().catch(e => { })
                await col?.stop()
                break
              

          }
        })

        col.on('end', async (button, reason) => {
          if (reason === 'time') {
            buttons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel(lang.msg45)
                .setCustomId("timeend")
                .setDisabled(true))

            embed = new EmbedBuilder()
              .setColor(client.config.embedColor)
              .setTitle("Time ended, please try again.")
              .setTimestamp()
              .setFooter({ text: `MusicMaker ❤️` })

            await interaction?.editReply({ embeds: [embed], components: [buttons] }).catch(e => { })
          }
        })
      }).catch(e => { })

    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
      }
  },
}
