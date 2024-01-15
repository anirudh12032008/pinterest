const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

mongoose.connect('mongodb+srv://anirudh:anirudh_12@cluster0.2m6jmwb.mongodb.net/pinterest?retryWrites=true&w=majority');


const postSchema = new mongoose.Schema({
    image: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false},
    title: {type: String},
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    board: {type: String},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const options = {
    usernameUnique: false,
};
postSchema.plugin(plm, options);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;