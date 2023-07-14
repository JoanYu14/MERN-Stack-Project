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
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
