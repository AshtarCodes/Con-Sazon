const express = require("express");
const passport = require("passport");

const Router = express.Router();
const { ensureGuest, ensureAuth } = require("../middleware/auth");

const authController = require("../controllers/auth");

// @desc Login page
// @route GET /
Router.get("/", ensureGuest, authController.getLogin);
Router.get("/login", ensureGuest, authController.getLogin);
Router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  authController.postLogin
);
Router.get(
  "/login/demo",
  authController.getDemoLogin
);

Router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
Router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc Sign up page

// @route GET /signup
Router.get("/sign-up", ensureGuest, authController.getSignUp);
// @route POST /signup
Router.post("/sign-up", authController.postSignUp);

// @desc Log out page
// @route GET /logout
Router.get("/logout", authController.logout);

module.exports = Router;
