const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  id: { type: String },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  instructor: {
    // 設定instuctor的type是mongoose給的primary key(_id)
    type: mongoose.Schema.Types.ObjectId,
    // ref是指會連結到User這邊，這樣就能像關聯式資料庫一樣連結到users collection的資料
    ref: "User",
  },
  students: {
    // sudents的type是一個陣列，陣列中都是String型別
    type: [String],
    // 預設是空陣列，因為剛創建的課程不會有學生
    default: [],
  },
});

// 這個model會連接到database的courses這個collection
module.exports = mongoose.model("Course", courseSchema);
