// UploadThing API 라우트 핸들러
// 파일 업로드 요청을 처리합니다

import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "@/lib/uploadthing"

// UploadThing 라우트 핸들러 생성
const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})

export { GET, POST }