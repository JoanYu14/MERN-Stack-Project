// 任何跟認證有關的route會由這個router處理
const express = require("express");
const router = express.Router();
// 取得三個用來驗證資料的function，funciton內部是用joi語法製作的schema驗證資料是否符合規格
const {
  registerValidation,
  loginValidation,
  courseValidation,
} = require("../validation");
const User = require("../models").user; // 取得可以操作users這個collection的model
const jwt = require("jsonwebtoken");

// 設定傳入這個router時會用的middleware
router.use((req, res, next) => {
  console.log("正在接收一個跟auth有關的Request");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("成功連結auth route..");
});

// 處理註冊使用者的route
router.post("/register", async (req, res) => {
  // 確認註冊數據是否符合規範，符合的話error就會是undefined，是falsy value，所以這個if就不會執行
  let { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // 確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email }); // 沒有找到的話就會return null，是falsy value
  if (emailExist) {
    return res.status(400).send("此信箱已經被註冊過了");
  }

  // 製作新用戶
  let { email, username, password, role } = req.body; // 能執行到這裡代表這些資料符合規範，email也沒有重複
  let newUser = new User({ email, username, password, role }); // 使用User model當作constructor製作新的document
  // 將新用戶儲存至資料庫
  try {
    // 在save的時候，當初在userSchema設定的middleware就會將newUser這個document的password屬性改成雜湊處理過的值，在把newUser存入資料庫中
    let saveUser = await newUser.save();
    return res.send({
      msg: "使用者成功儲存",
      saveUser, // saveUser : saveUser
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("無法儲存使用者");
  }
});

// 處理登入使用者的route
// 驗證使用者，驗證成功就製作一個JSON web token
router.post("/login", async (req, res) => {
  // 確認使用者輸入的登入資料是否符合規範
  let { error } = loginValidation(req.body); // 如果有不符合規範的話，loginValidation(req.body)回傳的物件內會有error屬性
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // 確認這個信箱的使用者是否存在
  const foundUser = await User.findOne({ email: req.body.email }); // 沒有找到的話就會return null，是falsy value
  if (!foundUser) {
    return res.status(401).send("無法找到使用者，請確認信箱是否正確");
  }

  // 每個document都會有comparePasswor這個method。第一個參數是客戶傳來的password，第二個參數是callbackFn
  // 這個method會去執行bcrypt.compare(req.body.password,this.password)
  // 如果bcrypt.compare出問題的話就會把e帶入error，如果沒有問題的話就會把null帶入err
  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) {
      // bcrypt.compare沒有問題的話err就會是null，null是falsy value
      return res.status(500).send(err);
    }
    if (isMatch) {
      // 製作json web token
      const tokenObject = { _id: foundUser._id, email: foundUser.email }; // 這個物件就是JWT的第二個部分(內容)，第一個部分(header) jsonwebtoken套件會做好
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET); // 把header、內容與secret做HMAC算出第三部分，再把這三個部分用.串在一起就是一個json web token
      return res.send({
        message: "成功登入",
        token: "JWT " + token, // JWT後面要有空白，不然會有bug
        user: foundUser,
      });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

module.exports = router;
