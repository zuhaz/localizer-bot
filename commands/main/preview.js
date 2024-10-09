const {
  ChannelType,
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const translate = require("@iamtraction/google-translate");
module.exports = {
  name: "preview",
  description: "Use this command to see the preview of localization.",
  options: [
    {
      name: "language",
      description: "Choose a language to see the preview in.",
      autocomplete: true,
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],
  async execute(interaction, client) {
    const language = interaction.options.getString("language");
    await interaction.deferReply({ ephemeral: false });
    let code = "en";
    let totalChannels = 0;
    let totalCategories = 0;
    const languages = [
      {
        code: "en",
        name: "English",
      },
      {
        code: "es",
        name: "Spanish",
      },
      {
        code: "fr",
        name: "French",
      },
      {
        code: "hr",
        name: "Croatian",
      },
      {
        code: "ar",
        name: "Arabic",
      },
      {
        code: "ru",
        name: "Russian",
      },
      {
        code: "de",
        name: "German",
      },
      {
        code: "pt",
        name: "Portuguese",
      },
      {
        code: "ja",
        name: "Japanese",
      },
      {
        code: "it",
        name: "Italian",
      },
      {
        code: "nl",
        name: "Dutch",
      },
      {
        code: "ko",
        name: "Korean",
      },
      {
        code: "el",
        name: "Greek",
      },
      {
        code: "pl",
        name: "Polish",
      },
      {
        code: "tr",
        name: "Turkish",
      },
      {
        code: "sv",
        name: "Swedish",
      },
      {
        code: "da",
        name: "Danish",
      },
      {
        code: "hi",
        name: "Hindi",
      },
      {
        code: "fi",
        name: "Finnish",
      },
      {
        code: "cs",
        name: "Czech",
      },
      {
        code: "sk",
        name: "Slovak",
      },
      {
        code: "hu",
        name: "Hungarian",
      },
      {
        code: "th",
        name: "Thai",
      },
      {
        code: "ro",
        name: "Romanian",
      },
      {
        code: "ur",
        name: "Urdu",
      },
      {
        code: "af",
        name: "Afrikaans",
      },
      {
        code: "sq",
        name: "Albanian",
      },
      {
        code: "am",
        name: "Amharic",
      },
      {
        code: "hy",
        name: "Armenian",
      },
      {
        code: "az",
        name: "Azerbaijani",
      },
      {
        code: "eu",
        name: "Basque",
      },
      {
        code: "be",
        name: "Belarusian",
      },
      {
        code: "bn",
        name: "Bengali",
      },
      {
        code: "bs",
        name: "Bosnian",
      },
      {
        code: "bg",
        name: "Bulgarian",
      },
      {
        code: "ca",
        name: "Catalan",
      },
      {
        code: "ceb",
        name: "Cebuano",
      },
      {
        code: "ny",
        name: "Chichewa",
      },
      {
        code: "zh-cn",
        name: "Chinese Simplified",
      },
      {
        code: "zh-tw",
        name: "Chinese Traditional",
      },
      {
        code: "co",
        name: "Corsican",
      },
      {
        code: "eo",
        name: "Esperanto",
      },
      {
        code: "et",
        name: "Estonian",
      },
      {
        code: "tl",
        name: "Filipino",
      },
      {
        code: "fy",
        name: "Frisian",
      },
      {
        code: "gl",
        name: "Galician",
      },
      {
        code: "ka",
        name: "Georgian",
      },
      {
        code: "gu",
        name: "Gujarati",
      },
      {
        code: "ht",
        name: "Haitian Creole",
      },
      {
        code: "ha",
        name: "Hausa",
      },
      {
        code: "haw",
        name: "Hawaiian",
      },
      {
        code: "iw",
        name: "Hebrew",
      },
      {
        code: "hmn",
        name: "Hmong",
      },
      {
        code: "is",
        name: "Icelandic",
      },
      {
        code: "ig",
        name: "Igbo",
      },
      {
        code: "id",
        name: "Indonesian",
      },
      {
        code: "ga",
        name: "Irish",
      },
      {
        code: "jw",
        name: "Javanese",
      },
      {
        code: "kn",
        name: "Kannada",
      },
      {
        code: "kk",
        name: "Kazakh",
      },
      {
        code: "km",
        name: "Khmer",
      },
      {
        code: "ku",
        name: "Kurdish (Kurmanji)",
      },
      {
        code: "ky",
        name: "Kyrgyz",
      },
      {
        code: "lo",
        name: "Lao",
      },
      {
        code: "la",
        name: "Latin",
      },
      {
        code: "lv",
        name: "Latvian",
      },
      {
        code: "lt",
        name: "Lithuanian",
      },
      {
        code: "lb",
        name: "Luxembourgish",
      },
      {
        code: "mk",
        name: "Macedonian",
      },
      {
        code: "mg",
        name: "Malagasy",
      },
      {
        code: "ms",
        name: "Malay",
      },
      {
        code: "ml",
        name: "Malayalam",
      },
      {
        code: "mt",
        name: "Maltese",
      },
      {
        code: "mi",
        name: "Maori",
      },
      {
        code: "mr",
        name: "Marathi",
      },
      {
        code: "mn",
        name: "Mongolian",
      },
      {
        code: "my",
        name: "Myanmar (Burmese)",
      },
      {
        code: "ne",
        name: "Nepali",
      },
      {
        code: "no",
        name: "Norwegian",
      },
      {
        code: "ps",
        name: "Pashto",
      },
      {
        code: "fa",
        name: "Persian",
      },
      {
        code: "pa",
        name: "Punjabi",
      },
      {
        code: "sm",
        name: "Samoan",
      },
      {
        code: "gd",
        name: "Scots Gaelic",
      },
      {
        code: "sr",
        name: "Serbian",
      },
      {
        code: "st",
        name: "Sesotho",
      },
      {
        code: "sn",
        name: "Shona",
      },
      {
        code: "sd",
        name: "Sindhi",
      },
      {
        code: "si",
        name: "Sinhala",
      },
      {
        code: "sl",
        name: "Slovenian",
      },
      {
        code: "so",
        name: "Somali",
      },
      {
        code: "su",
        name: "Sundanese",
      },
      {
        code: "sw",
        name: "Swahili",
      },
      {
        code: "tg",
        name: "Tajik",
      },
      {
        code: "ta",
        name: "Tamil",
      },
      {
        code: "te",
        name: "Telugu",
      },
      {
        code: "uk",
        name: "Ukrainian",
      },
      {
        code: "uz",
        name: "Uzbek",
      },
      {
        code: "vi",
        name: "Vietnamese",
      },
      {
        code: "cy",
        name: "Welsh",
      },
      {
        code: "xh",
        name: "Xhosa",
      },
      {
        code: "yi",
        name: "Yiddish",
      },
      {
        code: "yo",
        name: "Yoruba",
      },
      {
        code: "zu",
        name: "Zulu",
      },
    ];

    if (language) {
      languages.find((element) => {
        if (element.name === language) code = element.code;
      });
    }
    async function previewData() {
      try {
        const channels = await interaction.guild.channels.fetch();

        if (channels.size === 0) return console.log("Server has no channels");

        const allChannelsData = [];

        channels.each((channel) => {
          if (channel.type === ChannelType.GuildCategory) {
            const categoryId = channel.id;

            const categoryData = {
              parentData: {
                id: categoryId,
                name: channel.name,
                position: channel.position,
                type: channel.type,
                permissionOverwrites: channel.permissionOverwrites.cache,
              },
              channels: [],
            };
            totalCategories++;

            channels.each((childChannel) => {
              if (
                childChannel.parent &&
                childChannel.parent.id === categoryId
              ) {
                const childChannelData = {
                  channelid: childChannel.id,
                  parent: childChannel.parent.name,
                  type: childChannel.type,
                  name: childChannel.name,
                  position: childChannel.position,
                };
                totalChannels++;
                categoryData.channels.push(childChannelData);
              }
            });

            allChannelsData.push(categoryData);
          } else if (!channel.parent) {
            const channelData = {
              channelid: channel.id,
              type: channel.type,
              name: channel.name,
              position: channel.position,
            };
            totalChannels++;
            allChannelsData.push(channelData);
          }
        });
        const formattedData = await formatChannels(
          allChannelsData,
          interaction
        );
        await interaction.editReply({
          embeds: [formattedData],
        });
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    }
    async function formatChannels(data, interaction) {
      let result = "";
      if (data.length !== 0)
        data.sort((a, b) => {
          const typeDiff =
            (a.type === ChannelType.GuildVoice ||
              a.type === ChannelType.GuildStageVoice) -
            (b.type === ChannelType.GuildVoice ||
              b.type === ChannelType.GuildStageVoice);

          return typeDiff === 0 ? a.position - b.position : typeDiff;
        });
      for (const object of data) {
        const name = object.name;
        const type = object.type;
        if (object.parentData) continue;

        if (type === ChannelType.GuildVoice) {
          result += `> ${await translatePreview(name, code)}\n`;
        } else if (type === ChannelType.GuildText) {
          result += `# ${await translatePreview(
            name.replace(" ", "-"),
            code
          )}\n`;
        } else if (type === ChannelType.GuildStageVoice) {
          result += `) ${await translatePreview(name, code)}\n`;
        } else if (type === ChannelType.GuildForum) {
          result += `] ${await translatePreview(
            name.replace(" ", "-"),
            code
          )}\n`;
        } else if (type === ChannelType.GuildAnnouncement) {
          result += `! ${await translatePreview(name, code)}\n`;
        }
      }
      data.sort((a, b) => {
        const positionA = a.parentData
          ? a.parentData.position
          : Number.MAX_SAFE_INTEGER;
        const positionB = b.parentData
          ? b.parentData.position
          : Number.MAX_SAFE_INTEGER;
        return positionA - positionB;
      });
      for (const object of data) {
        if (object.parentData) {
          result += `\n˅ ${await translatePreview(
            object.parentData.name,
            code
          )}:\n`;

          if (object.channels) {
            const sortedChannels = object.channels.sort((a, b) => {
              const typeDiff =
                (a.type === ChannelType.GuildVoice ||
                  a.type === ChannelType.GuildStageVoice) -
                (b.type === ChannelType.GuildVoice ||
                  b.type === ChannelType.GuildStageVoice);

              return typeDiff === 0 ? a.position - b.position : typeDiff;
            });

            for (const channel of sortedChannels) {
              if (channel.type === ChannelType.GuildVoice) {
                result += `> ${await translatePreview(channel.name, code)}\n`;
              } else if (channel.type === ChannelType.GuildText) {
                result += `# ${await translatePreview(
                  channel.name.replace(" ", "-"),
                  code
                )}\n`;
              } else if (channel.type === ChannelType.GuildStageVoice) {
                result += `) ${await translatePreview(channel.name, code)}\n`;
              } else if (channel.type === ChannelType.GuildForum) {
                result += `] ${await translatePreview(
                  channel.name.replace(" ", "-"),
                  code
                )}\n`;
              } else if (channel.type === ChannelType.GuildAnnouncement) {
                result += `! ${await translatePreview(channel.name, code)}\n`;
              }
            }
          }
        }
      }

      result = `\`\`\`${result}\`\`\``;
      console.log(result.length);

      const embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("Preview of the Localization")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          { name: "Language Chosen:", value: `\`${language}\``, inline: true },
          {
            name: "Total No. of Categories:",
            value: `${totalCategories}`,
            inline: true,
          },
          { name: "Total No. of Channels:", value: `${totalChannels}` },
          { name: "Channels:", value: `${result}` }
        );

      return embed;
    }

    async function translatePreview(channeorCateogryName, code) {
      const res = await translate(channeorCateogryName, {
        to: code,
      });
      return res.text;
    }

    await previewData();
  },
};
