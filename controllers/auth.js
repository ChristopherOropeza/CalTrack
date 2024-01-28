const passport = require("passport");
require("dotenv").config({ path: "../config/.env" });
const validator = require("validator");
const User = require("../models/User");

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/tracker");
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  // Validate if either email or username field is empty
  if (validator.isEmpty(req.body.emailOrUsername)) {
    validationErrors.push({ msg: "Username or email cannot be blank." });
  }
  if (validator.isEmpty(req.body.password)) {
    validationErrors.push({ msg: "Password cannot be blank." });
  }

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }

  const { emailOrUsername, password } = req.body;

  User.findOne(
    {
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { userName: emailOrUsername.toLowerCase() },
      ],
    },
    (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("errors", { msg: "Invalid username or email" });
        return res.redirect("/login");
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return next(err);
        }
        if (isMatch) {
          req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
            req.flash("success", { msg: "Success! You are logged in." });
            res.redirect(req.session.returnTo || "/tracker");
          });
        } else {
          req.flash("errors", { msg: "Invalid password" });
          res.redirect("/login");
        }
      });
    },
  );
};

exports.logout = (req, res) => {
  req.logout(() => {
    console.log("User has logged out.");
  });
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/tracker");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  //Add validation for spending goal
  const goalRegex = /^(?:\d+(\.\d{1,2})?|\.\d{1,2})$/;
  if (!goalRegex.test(req.body.goal)) {
    validationErrors.push({ msg: "Caloric goal should contain only numbers" });
  }

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });
};