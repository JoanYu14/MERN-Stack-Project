const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"], // 身分只能是學生或講師
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

// instance methods(每個document都會繼承)
// isStudent確認這個document的身分是不是學生
userSchema.methods.isStudent = function () {
  return this.role == "student";
};

// isInstructor確認這個document的身分是不是講師
userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

// 確認密碼是否正確
// 參數password傳入的是使用者輸入的密碼(req.body.password)，this.password是存在資料庫中的密碼(document的password屬性)
userSchema.methods.comparePassword = async function (password, func) {
  let result;
  try {
    // 如果bcrypt.compare執行發現password算出的雜湊值與this.password相同的話就會return ture，不同的話就會return false
    result = await bcrypt.compare(password, this.password);
    return func(null, result); // 如果bcrypt.compare是fulfilled就會執行第二個參數func所帶入的函式，那個函式第一個參數(err)放null，第二個參數(isMatch)放bcrypt.compare的結果(ture or false)
  } catch (e) {
    return func(e, result); // 如果bcrypt.compare失敗了(rejected)就會執行第二個個參數所放的function，那個函式第一個參數(err)放e錯誤訊息，第二個參數(isMatch)放result，這個result是undefined，因為執行沒成功
  }
};

// mongoose middlewares
// 若使用者為新用戶，或是正在更改密碼，那我們就要將密碼進行bcrypt雜湊處理，這裡不用箭頭函式是因為箭頭函示中this無法綁定這個物件
userSchema.pre("save", async function (next) {
  // 這個this代表mongoDB中的document
  // 如果這個document是用model剛製作出來，並且還沒.save()過的，那document.isNew屬性就會是true
  // this.isModified("password")會去檢查這個document的password有沒有被改過
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

// 這個model連結database的users這個collection
module.exports = mongoose.model("User", userSchema);
