const express = require("express");
require("dotenv").config();
require("./db/DbConnection");
const server = express();
const productRouter = require("./routes/Products");
const brandsRouter = require("./routes/Brand");
const categoriesRouter = require("./routes/Category");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const contactRouter = require("./routes/contact");
const subCategoriesRouter = require("./routes/SubCategory");
const attributeRoutes = require("./routes/Attributes");
const tagsRoutes = require("./routes/Tags");

const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { User } = require("./modle/User");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
// Ensure cookieExtractor is imported correctly here or defined in this file
const { isAuth, sanitizaUser, cookieExtractor } = require("./server/Common");
const JwtStrategy = require("passport-jwt").Strategy;
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const bodyParser = require("body-parser");

// Stripe setup
const stripe = require("stripe")(process.env.STRIPE_SERVER_KRY);

// 1. TRUST PROXY (Important for Vercel/Secure Cookies)
server.set("trust proxy", 1);

// Middleware configurations
server.use(express.json({ limit: "10mb" }));
server.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// 2. COOKIE PARSER (Must be before CORS and Routes)
server.use(cookieParser());

// 3. FIXED CORS SETTINGS (Sabse Important Change)
server.use(
  cors({
    origin: [
      "https://e-commerence-store-lemon.vercel.app", // Aapka Frontend Domain
      "http://localhost:3000", // Localhost React
      "http://localhost:5173", // Localhost Vite (agar use kar rahe ho)
    ],
    credentials: true, // <--- YE MISSING THA (Iske bina cookie extractor tak nahi pahunchegi)
    exposedHeaders: ["X-Total-Count"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Session setup
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport initialization
server.use(passport.initialize());
server.use(passport.session());

// Static file serving
server.use(express.static(path.resolve(__dirname, "dist")));

// API routes
server.use("/users", isAuth(), userRouter.router);
server.use("/auth", authRouter.router);
server.use("/carts", cartRouter.router);
server.use("/orders", isAuth(), ordersRouter.router);
server.use("/contact", isAuth(), contactRouter.router);
server.use("/products", productRouter.router);
server.use("/categories", categoriesRouter.router);
server.use("/sub-categories", subCategoriesRouter.router);
server.use("/brands", brandsRouter.router);
server.use("/attributes", attributeRoutes.router);
server.use("/tag", tagsRoutes.router);

// ... (Payment routes same rahenge) ...
server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount, orderId } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId },
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});

// ... (Webhook route same rahega) ...

// Passport Local Strategy
passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
          return done(null, false, { message: "invalid credentials" });
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async (err, hashedPassword) => {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "invalid credentials" });
            }
            const token = jwt.sign(
              sanitizaUser(user),
              process.env.JWT_SECRET_KEY
            );
            done(null, { id: user.id, role: user.role, token });
          }
        );
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 4. JWT STRATEGY (Debugging ke saath)
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, { id: user.id, role: user.role });
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// ... (Serializer/Deserializer same rahenge) ...
passport.serializeUser((user, cb) => {
  process.nextTick(() => cb(null, { id: user.id, role: user.role }));
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, sanitizaUser(user)));
});

server.get("*", (req, res) => res.sendFile(path.resolve("dist", "index.html")));

server.listen(process.env.PORT, () => {
  console.log("Server started on port " + process.env.PORT);
});
