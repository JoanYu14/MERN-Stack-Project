// 跟驗證有關的函式會放在這裡
import axios from "axios";
const API = "https://shy-lime-bandicoot-sari.cyclic.app/api/user"; // 後端伺服器的處理user的URL

class AuthService {
  login(email, password) {
    console.log(axios);
    return axios.post(API + "/login", { email, password });
  }
  logout() {
    localStorage.removeItem("user"); // 把存在使用者的LocalStorage中的key為user的資料刪掉
  }
  register(username, email, password, role) {
    // axios.post到這個URL，就是在server製作的負責處理註冊的route
    // axio.post會return一個Promise物件，所以register這個method被執行也會return一個Promise物件
    return axios.post(API + "/register", {
      username,
      email,
      password,
      role,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user")); // 把存在Local Storage中key為user的資料回傳
  }
}

// 別的檔案import會得到一個用AuthService製作的物件，這個物件有三個method
export default new AuthService();
