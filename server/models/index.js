// 有人require這個js的話就會得到這個物件
// 物件user屬性是連接到users這個collection的Model
// 物件course屬性是連接到courses這個collection的Model
module.exports = {
  user: require("./user-model"),
  course: require("./course-model"),
};
