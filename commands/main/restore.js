const { ChannelType, EmbedBuilder } = require("discord.js");
const localizeBackupDB = require("../../models/localizeBackupDB");

module.exports = {
  name: "restore",
  description: "Use this command to reset the server.",
  async execute(interaction, client) {
    // console.log(channels);

    try {
      const channels = await interaction.guild.channels.fetch();

      if (channels.size === 0) return console.log("Server has no channels");
      const localizeBackupData = await localizeBackupDB.findOne({
        GuildID: interaction.guild.id,
      });
      if (!localizeBackupData) return;

      const allChannelsData = localizeBackupData.BackupData;

      const formattedData = await restoreChannels(
        allChannelsData,
        localizeBackupData,
        interaction
      );

      await interaction.channel.send({
        embeds: [formattedData],
      });
    } catch (error) {
      console.error("Error fetching channels:", error);
    }

    async function restoreChannels(data, localizeBackupData, interaction) {
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
          await restoreChannelsNames(name, object.channelid);
        } else if (type === ChannelType.GuildText) {
          await restoreChannelsNames(name.replace(" ", "-"), object.channelid);
        } else if (type === ChannelType.GuildStageVoice) {
          await restoreChannelsNames(name.replace(" ", "-"), object.channelid);
        } else if (type === ChannelType.GuildForum) {
          await restoreChannelsNames(
            name.replace(" ", "-"),

            object.channelidobject.channelid
          );
        } else if (type === ChannelType.GuildAnnouncement) {
          await restoreChannelsNames(name.replace(" ", "-"), object.channelid);
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
          await restoreChannelsNames(
            object.parentData.name,
            object.parentData.id
          );

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
                await restoreChannelsNames(channel.name, channel.channelid);
              } else if (channel.type === ChannelType.GuildText) {
                await restoreChannelsNames(
                  channel.name.replace(" ", "-"),

                  channel.channelid
                );
              } else if (channel.type === ChannelType.GuildStageVoice) {
                await restoreChannelsNames(channel.name, channel.channelid);
              } else if (channel.type === ChannelType.GuildForum) {
                await restoreChannelsNames(
                  channel.name.replace(" ", "-"),

                  channel.channelid
                );
              } else if (channel.type === ChannelType.GuildAnnouncement) {
                await restoreChannelsNames(channel.name, channel.channelid);
              }
            }
          }
        }
      }

      const embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setTitle("Successsfully restored the server")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .addFields(
          {
            name: "Restored Into:",
            value: `\`${localizeBackupData.Language}\``,
            inline: true,
          },
          {
            name: "Total No. of Channels restored:",
            value: `${localizeBackupData.TotalChannels}`,
          },
          {
            name: "Total No. of Categories restored:",
            value: `${localizeBackupData.TotalCategories}`,
            inline: true,
          }
        );

      return embed;
    }

    async function restoreChannelsNames(
      channeorCateogryName,
      channelorCategoryID
    ) {
      interaction.guild.channels.cache
        .get(channelorCategoryID)
        .setName(channeorCateogryName);
    }
  },
};
