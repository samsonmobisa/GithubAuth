const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const app = express();

// Use session to track login state
app.use(session({ secret: '0ac5708a76eb031ade2383cb83801714437d6518', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth credentials
const GITHUB_CLIENT_ID = '38ed65bdea49d983588e';
const GITHUB_CLIENT_SECRET = '0ac5708a76eb031ade2383cb83801714437d6518';

// Passport session setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Use the GitHubStrategy within Passport
passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Store user data in session or database
  const user = {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null,
        avatarUrl: profile.photos ? profile.photos[0].value : null,
  };

  return done(null, user);
}));


// Routes
app.get('/', (req, res) => {
  res.send('<h1>Hello, Guest!</h1><a href="/auth/github">Login with GitHub</a>');
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
