const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req, res, next) {
  // Check if the session contains a valid access token
  if (req.session && req.session.accessToken) {
    // Verify the access token
    jwt.verify(req.session.accessToken, "fingerprint_customer", (err, decoded) => {
      if (err) {
        // Token is invalid or expired
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
      } else {
        // Token is valid, attach the decoded user information to the request
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
      }
    });
  } else {
    // No access token found in the session
    return res.status(401).json({ message: "Unauthorized: No access token provided" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));