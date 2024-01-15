const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

mongoose.connect('mongodb+srv://anirudh:anirudh_12@cluster0.2m6jmwb.mongodb.net/pinterest?retryWrites=true&w=majority');


const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  fullname: { type: String, required: true },
  followers: { type: Number, default: 0 },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  boards: {type: Array, default: []}
});

userSchema.plugin(plm);

const User = mongoose.model('User', userSchema);

module.exports = User;
