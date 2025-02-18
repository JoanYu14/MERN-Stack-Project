const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth; // 資料夾不存在package.json，則預設會自動尋找檔名為 index.js的檔案。
const courseRoute = require("./routes").course;
const Joi = require("joi"); // 使用joi這個package來驗證使用者POST給我們的資料符不符合規定
const passport = require("passport");
require("./config/passport")(passport); // require的是一個function，馬上執行這個function且把passport套件帶入參數中
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// 連接到本機的MongoDB的exampleDB這個database
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("已成功連結到MongoDB，並且連結到mongoDB了");
  })
  .catch((e) => {
    console.log(e);
  });
// 啟用 trust proxy
app.set("trust proxy", 1); // 在Render，所以設為1
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// 使用helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // 禁用CSP如果前端有Inline Script可能需要關閉）
    frameguard: { action: "sameorigin" }, // 防止點擊劫持（Clickjacking）
    hidePoweredBy: true, // 隱藏Express預設的X-Powered-By頭
    noSniff: true, // 防止MIME類型嗅探攻擊
    xssFilter: true, // 啟用XSS防護
    hsts: process.env.NODE_ENV === "production", // 在生產環境中啟用HSTS，否則允許 HTTP 連線
    referrerPolicy: { policy: "no-referrer" }, // 限制 Referrer 資訊外洩
  })
);
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1分鐘
  max: 50, // 限制每個IP在1分鐘內最多50次請求
  message: "Too many requests, please try again later.", // 超出限制時的回應訊息
  headers: true, // 在回應中加上Rate Limit相關資訊
});
app.use(limiter);
app.use(express.static(path.join(__dirname, "./client/build")));

app.use("/api/user", authRoute);

// courseRoute是要被保護的，只有登入系統的人，才能夠去新增課程或是註冊課程
// 如果request header內部沒有JWT，則就會被視為是unauthorized
app.use(
  "/api/course",
  // 每一個要寄到與/api/course有關的Route的Request都要經過passport.authenticate這個middleware，使用的是我們在passport.js設定的JwtStrategy
  passport.authenticate("jwt", { session: false }), // session設定為false就不會執行passport.serializeUser()與dpassport.eserializeUser()，所以就不會在Session物件設定passport屬性與把session id cookie給使用者
  courseRoute
);

// 網站首頁只有URL/而已，所以沒有被前面的route接收的話就會被這個route接收
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html")); // send client資料夾的build資料夾內的index.html檔案
});

const port = process.env.PORT || 8080; // cyclic.sh會自動設定process.env.PORT的值，且是動態設定的。如果沒有process.env.PORT就運行在port 8080
// 3000是React預設的port
app.listen(8080, () => {
  console.log("後端伺服器正在運行");
});
