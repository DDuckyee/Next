// UploadThing 설정 파일 (JavaScript 버전)
// 서버와 클라이언트 설정을 모두 포함합니다

import { createUploadthing } from "uploadthing/next"
import { generateReactHelpers } from "@uploadthing/react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const f = createUploadthing()

// 서버 설정: 업로드 허용 조건과 설정을 정의
export const ourFileRouter = {
  imageUploader: f({ 
    image: { 
      maxFileSize: "4MB",
      maxFileCount: 1 
    } 
  })
    .middleware(async () => {
      // 업로드 전 인증 확인
      const session = await getServerSession(authOptions)
      
      if (!session) {
        throw new Error("로그인이 필요합니다")
      }

      // 업로드한 파일에 사용자 정보 첨부
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // 업로드 완료 후 실행되는 콜백
      console.log("업로드 완료:", file.url)
      console.log("업로드한 사용자:", metadata.userId)
      
      return { uploadedBy: metadata.userId, url: file.url }
    }),
}

// 클라이언트 설정: React 훅 생성
export const { useUploadThing } = generateReactHelpers({
  router: ourFileRouter,
})

// TypeScript 타입 정의 제거 (JavaScript에서는 불필요)
// export type OurFileRouter = typeof ourFileRouter  ← 이 줄 삭제됨