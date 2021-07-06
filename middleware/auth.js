module.exports = {
  ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('errors', 'Please log in or sign up to continue.');
    res.redirect('/');
  },
  ensureGuest(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  },
};
