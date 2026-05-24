import axios from "axios";

// 백엔드 형들이 말한 HttpOnly 쿠키 방식을 위한 다이렉트 그릇!
const Api = axios.create({
  baseURL: "https://life-lab.shop", // Vercel rewrite 안 거치고 백엔드 직접 타격!
  withCredentials: true, // 보안 쿠키 무조건 실어 보내기!
});

export default Api;
