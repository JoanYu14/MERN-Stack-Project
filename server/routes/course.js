// 任何跟course有關的route會由這個router處理
const express = require("express");
const router = express.Router();
const Course = require("../models").course; // 取得model
const { courseValidation } = require("../validation");

router.use((req, res, next) => {
  console.log("course route正在接受一個request...");
  next();
});

// 創建新課程
router.post("/", async (req, res) => {
  // 驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // 經過passport的JwtStrategy驗證後，會把users collection中的這個會員的document存在req.user裡面
  // 每個users collection中的document在創建的時候就有isStudent這個method
  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("只有講師才能發布新課程。若您已經是講師，請透過講師帳號登入。");
  }

  try {
    let { title, description, price } = req.body;
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let saveCourse = await newCourse.save();
    return res.send({
      message: "新課程已經保存",
      saveCourse,
    });
  } catch (e) {
    res.status(500).send("無法創建課程");
  }
});

// 更改課程
router.patch("/:_id", async (req, res) => {
  // 驗證資料符合規範
  let { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let { _id } = req.params;

  try {
    // 確認課程存在
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法編輯課程內容。");
    }

    // 確認使用者是否為此課程的講師，是的話才能更新課程
    // courseFound.instructor是創建課程的講師的那個doucment的_id
    // .equals(req.user._id)就是看這個登入的人的_id是否與courseFound.instructor相同
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "課程已經被更新成功",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有此課程的講師才能編輯課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 刪除課程
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;

  try {
    // 確認課程存在
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法刪除課程。");
    }

    // 確認使用者是否為此課程的講師，是的話才能刪除課程
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      res.send("成功刪除課程");
    } else {
      return res.status(403).send("只有此課程的講師才能刪除課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 獲得系統中的所有課程
router.get("/", async (req, res) => {
  try {
    // 當初設定courseSchema的時候就有把instructor的type設定為mongoose.Schema.Types.ObjectId，並且ref是User
    // 所以.populate會去找到instructor屬性(_id)在users collection所對應的document，然後取得那個document的username與email屬性
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec(); // populate是Query物件才能用的，所以要等他執行完再用.exec()換成promise物件
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用講師id來尋找課程(找這個講師有哪些課程)
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  try {
    // .populate可以讓取得的陣列中的物件(document)的instructor屬性的值從創建此課程的會員的_id變成一個物件
    // 物件內除了有_id屬性外還有這個_id所對應的users collection(這是在創建courseSchema時設定的)的document的username屬性和eamil屬性
    let coursesFound = await Course.find({ instructor: _instructor_id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(coursesFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用學生id來尋找該學生註冊過的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  try {
    let courseFound = await Course.find({ students: _student_id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {}
});

// 用課程id尋找課程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
