// 좋아요 버튼 컴포넌트
// 좋아요 토글과 개수를 실시간으로 업데이트합니다

"use client"

import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { toggleLike } from "@/actions/likes"

export default function LikeButton({ postId, initialLikesCount, isLikedByUser }) {
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLiked, setIsLiked] = useState(isLikedByUser)

  const handleLike = () => {
    if (!session) {
      alert("로그인이 필요합니다")
      return
    }

    // 낙관적 UI 업데이트 (서버 응답 전에 미리 변경)
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)

    startTransition(async () => {
      try {
        const result = await toggleLike(postId)
        
        if (result.error) {
          // 실패 시 원래 상태로 롤백
          setIsLiked(isLiked)
          setLikesCount(initialLikesCount)
          alert("좋아요 처리에 실패했습니다: " + result.error)
        }
      } catch (error) {
        // 에러 시 롤백
        setIsLiked(isLiked)
        setLikesCount(initialLikesCount)
        console.error("좋아요 오류:", error)
        alert("좋아요 처리 중 오류가 발생했습니다")
      }
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleLike}
        disabled={isPending}
        className={`p-2 rounded-full transition-colors ${
          isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
        }`}
      >
        <svg 
          className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          fill={isLiked ? "currentColor" : "none"} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </button>
      
      {likesCount > 0 && (
        <span className="text-sm font-semibold text-gray-900">
          좋아요 {likesCount.toLocaleString()}개
        </span>
      )}
    </div>
  )
}