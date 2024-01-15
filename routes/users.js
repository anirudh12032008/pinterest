const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

mongoose.connect(process.env.MONGODB_URI);


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
