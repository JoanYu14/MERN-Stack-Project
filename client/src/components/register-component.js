import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 可以讓我們重新導向使用者
import AuthService from "../services/auth-service"; // 獲得一個物件，物件內的register這個method可以幫我們處理註冊

const RegisterComponent = () => {
  const navigate = useNavigate(); // 用useNavigate()製作一個物件存到navigate中

  // 設定State
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [role, setRole] = useState("");
  let [message, setMessage] = useState(""); // 註冊有出現錯誤我們才會set這個State

  const handleUsername = function (e) {
    setUsername(e.target.value);
  };

  const handleEmail = function (e) {
    setEmail(e.target.value);
  };

  const handlePassword = function (e) {
    setPassword(e.target.value);
  };

  const handleRole = function (e) {
    setRole(e.target.value);
  };

  // 按下button後就會執行這個function
  const handleRegister = function () {
    // 傳入的參數就是目前這幾個State的值
    // register內會使用axios.post把這幾個參數POST到後端處理註冊的route，並且register()回傳的是一個Promise物件(axios.post所回傳的那個)
    AuthService.register(username, email, password, role)
      .then(() => {
        window.alert("註冊成功，您現在將被導向到登入頁面");
        navigate("/login"); // 把使用者導到/login這個route
      })
      .catch((e) => {
        // 假如給的資料不符合規範的話，register就會rejected(axios.post的Promise物件變成rejected)，e就會帶入AxiosError物件
        setMessage(e.response.data); // 我們res.send(400).send()所send的東西就在e.response.data這裡
      });
  };

  return (
    // 基本上就是一個form裡面會有的東西，但是這裡不用form去寄出Request
    // message如果註冊沒有錯誤的話就是空字串，是一個falsy value，&&如果左邊是false就會執行左邊，所以不會顯示任何東西
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div>
          <label htmlFor="username">用戶名稱:</label>
          <input
            onChange={handleUsername}
            type="text"
            className="form-control"
            name="username"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="email">電子信箱：</label>
          <input
            onChange={handleEmail}
            type="text"
            className="form-control"
            name="email"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">密碼：</label>
          <input
            onChange={handlePassword}
            type="password"
            className="form-control"
            name="password"
            placeholder="長度至少超過6個英文或數字"
          />
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="role">身份：</label>
          <select
            name="role"
            className="form-select form-select-lg mb-3"
            aria-label=".form-select-lg example"
            onChange={handleRole}
            id="selectRole"
          >
            <option value={""} key={"option-null"}>
              請選擇身份
            </option>
            <option value={"student"} key={"option-student"}>
              學生
            </option>
            <option value={"instructor"} key={"option-instructor"}>
              講師
            </option>
          </select>
        </div>
        <br />
        <button onClick={handleRegister} className="btn btn-primary">
          <span>註冊會員</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;
