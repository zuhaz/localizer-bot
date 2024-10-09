module.exports = {
  name: "testing",
  description: "Test command",
  async execute(interaction, client) {
    const channels = await interaction.guild.channels.fetch();
    // console.log(channels);
    // interaction.reply({ content: `${JSON.stringify(channels, null, 0)}` });
  },
};
