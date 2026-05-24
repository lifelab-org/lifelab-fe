import axios from "axios";

// 백엔드가 준 명세서 그대로! 주소 뒤에 /api 까지 완벽하게 다이렉트로 박아버리기!
const Api = axios.create({
  baseURL: "https://life-lab.shop/api",
  withCredentials: true, // 백엔드가 수정한 allow-credentials: true랑 맞물리는 핵심 설정!
});

export default Api;
