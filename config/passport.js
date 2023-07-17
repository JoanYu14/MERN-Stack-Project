let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt; // 這個東西可以把JWT拿出來
const User = require("../models").user; // 取得model

// 讓passport.js的module.exports為一個function
module.exports = (passport) => {
  let opts = {}; // 設定opts為一個空物件，裡面設定的屬性名字要用passport-jwt裡面規定的
  // 把JWT從request的header中拿出來並存入opts的jwtFromRequest屬性中
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET; // 我們當初對要發出的jwt做簽名的secret key

  passport.use(
    // 當初給的JWT的tokenObj(內容)就會帶入jwt_payload裡面
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();

        if (foundUser) {
          return done(null, foundUser); // 把req.user的值設定成foundUser
        } else {
          // 如果用jwt_payload._id作為_id的值去尋找user沒找到的話就會得到null或_id不符合規範(catch)也就是JWT被篡改過了，因為我們當初發出去的JWT的內容裡的_id是用登入的會員的_id的值
          return done(null, false); // 如果沒有找到document的話代這個JWT被篡改過了
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
