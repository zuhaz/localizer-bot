const { ChannelType } = require("discord.js");

const localizeBackupDB = require("../../models/localizeBackupDB");
module.exports = {
  name: "reset",
  description: "Use this command to reset the server.",
  async execute(interaction, client) {
    // console.log(channels);

    async function saveChannelsAndCategories() {
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
                  permissionOverwrites: childChannel.permissionOverwrites.cache,
                };

                if (childChannel.type === ChannelType.GuildVoice) {
                  childChannelData.bitrate = childChannel.bitrate;
                  childChannelData.userLimit = childChannel.userLimit;
                  childChannelData.rtcRegion = childChannel.rtcRegion;
                  childChannelData.videoQualityMode =
                    childChannel.videoQualityMode;
                } else if (childChannel.type === ChannelType.GuildText) {
                  childChannelData.topic = childChannel.topic;
                  childChannelData.lastMessageId = childChannel.lastMessageId;
                  childChannelData.nsfw = childChannel.nsfw;
                  childChannelData.rateLimitPerUser =
                    childChannel.rateLimitPerUser;
                } else if (childChannel.type === ChannelType.GuildForum) {
                  childChannelData.topic = childChannel.topic;
                  childChannelData.lastMessageId = childChannel.lastMessageId;
                  childChannelData.nsfw = childChannel.nsfw;
                  childChannelData.rateLimitPerUser =
                    childChannel.rateLimitPerUser;
                  childChannelData.availableTags = childChannel.availableTags;
                  childChannelData.defaultReactionEmoji =
                    childChannel.defaultReactionEmoji;
                  childChannelData.defaultThreadRateLimitPerUser =
                    childChannel.defaultThreadRateLimitPerUser;
                  childChannelData.defaultAutoArchiveDuration =
                    childChannelData.defaultAutoArchiveDuration;
                } else if (
                  childChannel.type === ChannelType.GuildAnnouncement
                ) {
                  childChannelData.topic = childChannel.topic;
                  childChannelData.lastMessageId = childChannel.lastMessageId;
                  childChannelData.nsfw = childChannel.nsfw;
                  childChannelData.rateLimitPerUser =
                    childChannel.rateLimitPerUser;
                } else if (childChannel.type === ChannelType.GuildStageVoice) {
                  childChannelData.bitrate = childChannel.bitrate;
                  childChannelData.userLimit = childChannel.userLimit;
                  childChannelData.rtcRegion = childChannel.rtcRegion;
                  childChannelData.topic = childChannel.topic;
                }
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
              permissionOverwrites: channel.permissionOverwrites.cache,
            };

            if (channel.type === ChannelType.GuildVoice) {
              channelData.bitrate = channel.bitrate;
              channelData.userLimit = channel.userLimit;
              channelData.rtcRegion = channel.rtcRegion;
              channelData.videoQualityMode = channel.videoQualityMode;
            } else if (channel.type === ChannelType.GuildText) {
              channelData.topic = channel.topic;
              channelData.lastMessageId = channel.lastMessageId;
              channelData.nsfw = channel.nsfw;
              channelData.rateLimitPerUser = channel.rateLimitPerUser;
            } else if (channel.type === ChannelType.GuildForum) {
              channelData.topic = channel.topic;
              channelData.lastMessageId = channel.lastMessageId;
              channelData.nsfw = channel.nsfw;
              channelData.rateLimitPerUser = channel.rateLimitPerUser;
              channelData.availableTags = channel.availableTags;
              channelData.defaultReactionEmoji = channel.defaultReactionEmoji;
              channelData.defaultThreadRateLimitPerUser =
                channel.defaultThreadRateLimitPerUser;
              channelData.defaultAutoArchiveDuration =
                channel.defaultAutoArchiveDuration;
            } else if (channel.type === ChannelType.GuildAnnouncement) {
              channelData.topic = channel.topic;
              channelData.lastMessageId = channel.lastMessageId;
              channelData.nsfw = channel.nsfw;
              channelData.rateLimitPerUser = channel.rateLimitPerUser;
            } else if (channel.type === ChannelType.GuildStageVoice) {
              channelData.bitrate = channel.bitrate;
              channelData.userLimit = channel.userLimit;
              channelData.rtcRegion = channel.rtcRegion;
              channelData.topic = channel.topic;
            }
            allChannelsData.push(channelData);
          }
        });
        interaction.guild.channels.cache.forEach((channel) => {
          if (
            channel.name === "rules" ||
            channel.name === "moderator-only" ||
            channel.name === "general"
          )
            console.log("skipping");
          else channel.delete();
        });
        await localizeBackupDB.findOneAndUpdate(
          { GuildID: interaction.guild.id },
          { Backup: allChannelsData }
        );
        await createChannelsFromData(interaction, allChannelsData);
        const formattedData = JSON.stringify(allChannelsData, null, 2);

        await interaction.channel.send({
          content: formattedData.slice(0, 2000),
        });

        await interaction.channel.send({
          content: formattedData.slice(2000, 4000),
        });
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    }

    await saveChannelsAndCategories();
    async function createChannelsFromData(interaction, data) {
      try {
        for (const item of data) {
          if (
            item.name === "rules" ||
            item.name === "moderator-only" ||
            item.name === "general"
          )
            continue;

          if (item.parentData) {
            const parent = await interaction.guild.channels.create({
              name: item.parentData.name,
              type: ChannelType.GuildCategory,
              position: item.parentData.position,
              permissionOverwrites: item.parentData.permissionOverwrites,
            });

            for (const channel of item.channels) {
              if (channel.type === ChannelType.GuildVoice) {
                await interaction.guild.channels.create({
                  name: channel.name,
                  type: channel.type,
                  parent: parent,
                  position: channel.position,
                  bitrate: channel.bitrate,
                  userLimit: channel.userLimit,
                  rtcRegion: channel.rtcRegion,
                  videoQualityMode: channel.videoQualityMode,
                  permissionOverwrites: channel.permissionOverwrites,
                });
              } else if (channel.type === ChannelType.GuildText) {
                await interaction.guild.channels.create({
                  name: channel.name,
                  type: channel.type,
                  parent: parent,
                  position: channel.position,
                  nsfw: channel.isNsfw,
                  topic: channel.topic,
                  rateLimitPerUser: channel.rateLimitPerUser,
                  permissionOverwrites: channel.permissionOverwrites,
                });
              } else if (channel.type === ChannelType.GuildForum) {
                await interaction.guild.channels.create({
                  name: channel.name,
                  type: channel.type,
                  parent: parent,
                  position: channel.position,
                  topic: channel.topic,
                  lastMessageId: channel.lastMessageId,
                  nsfw: channel.nsfw,
                  rateLimitPerUser: channel.rateLimitPerUser,
                  availableTags: channel.availableTags,
                  defaultReactionEmoji: channel.defaultReactionEmoji,
                  defaultThreadRateLimitPerUser:
                    channel.defaultThreadRateLimitPerUser,
                  defaultAutoArchiveDuration:
                    channel.defaultAutoArchiveDuration,
                  permissionOverwrites: channel.permissionOverwrites,
                });
              } else if (channel.type === ChannelType.GuildAnnouncement) {
                await interaction.guild.channels.create({
                  name: channel.name,
                  type: channel.type,
                  parent: parent,
                  position: channel.position,
                  topic: channel.topic,
                  lastMessageId: channel.lastMessageId,
                  nsfw: channel.nsfw,
                  rateLimitPerUser: channel.rateLimitPerUser,
                  permissionOverwrites: channel.permissionOverwrites,
                });
              } else if (channel.type == ChannelType.GuildStageVoice) {
                await interaction.guild.channels.create({
                  name: channel.name,
                  type: ChannelType.GuildStageVoice,
                  parent: parent,
                  position: channel.position,
                  bitrate: channel.bitrate,
                  videoQualityMode: channel.videoQualityMode,
                  userLimit: 0,
                  rtcRegion: channel.rtcRegion,
                  topic: channel.topic,
                  rateLimitPerUser: channel.rateLimitPerUser,
                  permissionOverwrites: channel.permissionOverwrites,
                });
              }
            }
          } else {
            if (item.parent) continue;
            if (item.type === ChannelType.GuildVoice) {
              await interaction.guild.channels.create({
                name: item.name,
                type: item.type,
                position: item.position,
                bitrate: item.bitrate,
                userLimit: item.userLimit,
                rtcRegion: item.rtcRegion,
                videoQualityMode: item.videoQualityMode,
                permissionOverwrites: item.permissionOverwrites,
              });
            } else if (item.type === ChannelType.GuildText) {
              await interaction.guild.channels.create({
                name: item.name,
                type: item.type,
                position: item.position,
                nsfw: item.isNsfw,
                topic: item.topic,
                rateLimitPerUser: item.rateLimitPerUser,
                permissionOverwrites: item.permissionOverwrites,
              });
            } else if (item.type === ChannelType.GuildForum) {
              await interaction.guild.channels.create({
                name: item.name,
                type: item.type,
                position: item.position,
                topic: item.topic,
                lastMessageId: item.lastMessageId,
                nsfw: item.nsfw,
                rateLimitPerUser: item.rateLimitPerUser,
                availableTags: item.availableTags,
                defaultReactionEmoji: item.defaultReactionEmoji,
                defaultThreadRateLimitPerUser:
                  item.defaultThreadRateLimitPerUser,
                defaultAutoArchiveDuration: item.defaultAutoArchiveDuration,
                permissionOverwrites: item.permissionOverwrites,
              });
            } else if (item.type === ChannelType.GuildAnnouncement) {
              await interaction.guild.channels.create({
                name: item.name,
                type: item.type,
                position: item.position,
                topic: item.topic,
                lastMessageId: item.lastMessageId,
                nsfw: item.nsfw,
                rateLimitPerUser: item.rateLimitPerUser,
                permissionOverwrites: item.permissionOverwrites,
              });
            } else if (item.type == ChannelType.GuildStageVoice) {
              await interaction.guild.channels.create({
                name: item.name,
                type: item.type,
                position: item.position,
                bitrate: item.bitrate,
                userLimit: 0,
                rtcRegion: item.rtcRegion,
                topic: item.topic,
                permissionOverwrites: item.permissionOverwrites,
              });
            }
          }
        }
      } catch (error) {
        console.error("Error creating channels:", error);
      }
    }
  },
};
