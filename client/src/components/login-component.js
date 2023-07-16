import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth-service";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  // 設定State
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  const handleEmail = function (e) {
    setEmail(e.target.value);
  };

  const handlePassword = function (e) {
    setPassword(e.target.value);
  };

  const handleLogin = async function () {
    try {
      let response = await authService.login(email, password);
      localStorage.setItem("user", JSON.stringify(response.data)); // 登入成功後把得到的資料(一個物件，裡面有JWT)存到使用者的local Storage裡面
      window.alert("登入成功，您現在將被重新導向到個人資料頁面");
      setCurrentUser(authService.getCurrentUser()); // 登入成功的話就把存在local storagy的資料設為App component的currentUser這個State的值
      navigate("/profile");
    } catch (e) {
      console.log(e);
      setMessage(e.response.data); // 如果axios收到的response的status code不是2XX的話，就會rejected
    }
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      {message && <div className="alert alert-danger">{message}</div>}
      <div>
        <div className="form-group">
          <label htmlFor="username">電子信箱：</label>
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
          />
        </div>
        <br />
        <div className="form-group">
          <button onClick={handleLogin} className="btn btn-primary btn-block">
            <span>登入系統</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
