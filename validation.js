const Joi = require("joi");

// 如果有人要註冊的話就要通過這個registerValidation
const registerValidation = (data) => {
  // 這個schema存入的Joi.object就描述了data應該要是怎樣的
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().required().valid("student", "instructor"), // valid代表這個role的值只能是這兩個之一
  });

  // 用這個shema去對傳入的data(req.body)做驗證，會return驗證結果
  return schema.validate(data);
};

// 如果有人要登入，就要通過這個loginValidation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

// 如果有人要創建課程，就要通過這個courseValidation
const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(50).required(),
    price: Joi.number().min(10).max(9999).required(),
  });
  return schema.validate(data);
};

// 別人require就會得到一個裡面有三個屬性的物件
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.courseValidation = courseValidation;
