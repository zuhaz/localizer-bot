const mongoose = require("mongoose");

module.exports = mongoose.model(
  "localizeBackupDB",
  new mongoose.Schema({
    GuildID: String,
    BackupData: Array,
    TotalChannels: String,
    TotalCategories: String,
    Language: String,
  })
);
