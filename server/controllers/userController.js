const userModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  userModel.findUserByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    userModel.createUser(
      { name, email, password: hashedPassword, role },
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: "User registered successfully" });
      },
    );
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  userModel.findUserByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const user = result[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const payload = { id: user.id, role: user.role };

    const token = generateToken(payload);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Google token is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name } = payload;

    userModel.findUserByEmail(email, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length > 0) {
        const user = result[0];

        const jwtToken = generateToken({
          id: user.id,
          role: user.role,
        });

        return res.json({
          token: jwtToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }

      userModel.createGoogleUser(
        {
          name,
          email,
          role: "user",
        },
        (err, result) => {
          if (err) {
            return res.status(500).json(err);
          }

          const jwtToken = generateToken({
            id: result.insertId,
            role: "user",
          });

          res.status(201).json({
            token: jwtToken,
            user: {
              id: result.insertId,
              name,
              email,
              role: "user",
            },
          });
        },
      );
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({
      message: "Invalid Google token",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
};
