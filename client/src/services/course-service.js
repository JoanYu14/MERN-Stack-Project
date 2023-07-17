import axios from "axios";
const API = "https://shy-lime-bandicoot-sari.cyclic.app/api/course"; // 後端伺服器的處理course的URL

class CourseService {
  // post這個method用來對server發出創建課程的Request
  post(title, description, price) {
    let token; // server的/course相關的route是收到passport-jwt的middleware保護的，必須要有JWT才能驗證成功

    // LocalStorage中如果沒有key為user的資料的話就會是null
    if (localStorage.getItem("user")) {
      // 在登入成功時有把從server取得的user資料(物件)存進Local Storage裡
      // 裡面的.token就是server給的JWT
      console.log(localStorage.getItem("user").token);
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = ""; // 如果token是空字串的話，在server端的驗證就不會通過
    }
    // 這個CourseService.post這個method會return axios.post所回傳的Promise物件
    return axios.post(
      API,
      { title, description, price },
      {
        headers: {
          Authorization: token, // axios會把JWT放在headers的Authorization內，這樣server端的JWT Strategy內的jwt_payload就能取得這個會員相關的資料(jwt的第二部分，username,email)
        },
      }
    );
  }

  // 使用學生id來找到該學生註冊的課程
  getEnrolledCourses(_id) {
    let token;

    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API + "/student/" + _id, {
      headers: {
        Authorization: token, // axios會把JWT放在headers的Authorization內，這樣server端的JWT Strategy內的jwt_payload就能取得這個會員相關的資料(jwt的第二部分，username,email)
      },
    });
  }

  // 根據instructor的id來找到該講師擁有的課程
  get(_id) {
    let token;

    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API + "/instructor/" + _id, {
      headers: {
        Authorization: token, // axios會把JWT放在headers的Authorization內，這樣server端的JWT Strategy內的jwt_payload就能取得這個會員相關的資料(jwt的第二部分，username,email)
      },
    });
  }

  // 根據課程名稱找到課程
  getCourseByName(name) {
    let token;

    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(API + "/findByName/" + name, {
      headers: {
        Authorization: token, // axios會把JWT放在headers的Authorization內，這樣server端的JWT Strategy內的jwt_payload就能取得這個會員相關的資料(jwt的第二部分，username,email)
      },
    });
  }

  // 讓學生根據課程id註冊課程
  enroll(_id) {
    let token;

    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    // 第二個參數放空物件是因為這是一個POST Request，但我們沒有要給任何資料到server
    return axios.post(
      API + "/enroll/" + _id,
      {},
      {
        headers: {
          Authorization: token, // axios會把JWT放在headers的Authorization內，這樣server端的JWT Strategy內的jwt_payload就能取得這個會員相關的資料(jwt的第二部分，username,email)
        },
      }
    );
  }
}

// import這個檔案就會得到這個Class製作的物件，物件內就有method
export default new CourseService();
