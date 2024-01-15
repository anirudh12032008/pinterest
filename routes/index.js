var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const upload = require('./multer')
const passport = require('passport');
const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()));



/* Render Routes */
router.get('/',  async function(req, res, next) {
  if (req.isAuthenticated()){
    const posts = await postModel.find()
    .populate('user')
    .sort({ createdAt: -1 });
    const user = await userModel.findOne({username: req.session.passport.user})
    res.render('feed', {log: true, user: user, id: 1, posts})
  }
  res.render('index', { log: false, id: 1});
});

router.get('/profile', isLoggedIn, async function(req, res, next){
  const user = 
  await userModel
    .findOne({username: req.session.passport.user})
    .populate('posts')
  res.render('profile', {user: user, log: true, id: false})
})
router.get('/users/:user', async function(req, res, next){
  const user = 
  await userModel
    .findOne({username: req.params.user})
    .populate({
      path: 'posts',
      options: { sort: { createdAt: -1 } } 
    })

  res.render('users/show', {user: user, log: req.isAuthenticated(), id: 2})
})
router.get('/create', isLoggedIn, async function(req, res, next){
  const user = await userModel.findOne({username: req.session.passport.user})
  res.render('create', {user: user, log: true, id: 3})
})
router.get('/feed', async function(req, res, next){
  const posts = await postModel.find()
    .populate('user')
    .sort({ createdAt: -1 });
  if (req.isAuthenticated()){
    const user = await userModel.findOne({username: req.session.passport.user})
    res.render('feed', {log: req.isAuthenticated(), id: 2,user , posts})
  } 
  res.render('feed', {log: false, id: 2,posts})
})
router.get('/pins/:pin', async function(req, res, next){
  const post = await postModel.findOne({_id: req.params.pin})
    .populate('user')
  if (req.isAuthenticated()){
    const user = await userModel.findOne({username: req.session.passport.user})
    res.render('pins/show', {log: req.isAuthenticated(), id: 2,user , post})
  } 
  res.render('pins/show', {log: false, id: 2, post})
})

router.get('/register', function(req, res){
  if (req.isAuthenticated()){
    res.redirect('/profile')
  }
  res.render('register',{log: req.isAuthenticated(), id: 1})
})




// multer
// --- pfpupload
router.post('/pfpupload', isLoggedIn, upload.single('image'), async function (req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  user.profilePicture = req.file.filename;
  await user.save()
  res.redirect('/profile')
})

// --- post
router.post('/createpost', isLoggedIn, upload.single('image'), async function (req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  const post = await postModel.create({
    title: req.body.title,
    user: user._id,
    description: req.body.description,
    image: req.file.filename
  })
  user.posts.push(post._id);
  await user.save()
  res.redirect('/profile')
})



// registeration
router.post('/register', function(req, res){
  const { username, email, fullname } = req.body;
  const userdata = new userModel({username, email, fullname})

  userModel.register(userdata, req.body.password)
  .then(function(registereduser){
    passport.authenticate('local')(req, res, function(){
      res.redirect('/profile')
    })
  })
})

// Login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}), function(req, res){})



// LogOut
router.get('/logout', function(req, res, next){
  req.logout(function(err){
    if (err) {return next(err); }
    res.redirect('/');
  });
});

// Check if logged in 
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next()
  }
  res.redirect('/')
}

module.exports = router;
