# 師生課程網站

## <a href="https://teacher-student-platform.onrender.com" target="blank">師生課程網站連結(若一段時間未使用，可能需要 1-2 分鐘)</a>

由於部署使用 Render 免費方案，若一段時間未使用，伺服器可能需要 1-2 分鐘 來啟動，還請見諒

### 使用 MERN 架構製作一個專案，此網站是一個課程網站，講師可以創建課程，學生可以選擇要學習的課程。

- 使用 Node.js 製作後端伺服器、使用 Express.js 伺服器框架、使用 React 前端框架、使用 MongoDB 資料庫
- 使用 passport.js 做 JWT 認證，登入後 JWT 會存在客戶端的 Local Storage 中，按下登出則會清除 Local Storage
- 使用 express-rate-limit 限制每個 IP 每分鐘最多請求 50 次
- 使用 helmet 設定 HTTP 標頭，防範應用程式出現已知的 Web 漏洞
- 部屬在 Render
- 如果您註冊的是學生的話，請在註冊課程頁面點擊搜尋會出現當前所有課程，或者輸入課程名稱，會回傳模糊搜尋的結果。
- 如果您註冊的是講師的話，可以在新增課程頁面創建課程。
  <hr>

### Docker 部署

> docker comopse 包含兩個 image:
>
> - 1.mongo:8.0
> - 2.mern_web_code_docker: 該 image 首次啟動時會用 Dockerfile 去 build 的 web image

> 請直接使用 docker compose up -d 啟動 web

```bash
docker compose up -d
```

  <hr>

![網站圖片1](/img1.jpg)
![網站圖片2](/img2.jpg)
![網站圖片3](/img3.jpg)
