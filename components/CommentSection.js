// 댓글 섹션 컴포넌트
// 댓글 목록과 삭제 기능을 제공합니다

"use client"

import { useTransition } from "react"
import { useSession } from "next-auth/react"
import { deleteComment } from "@/actions/comments"

export default function CommentSection({ comments }) {
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()

  const getRelativeTime = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
    
    if (diffInSeconds < 60) return '방금 전'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`
    
    return new Date(date).toLocaleDateString('ko-KR')
  }

  const handleDeleteComment = (commentId) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) {
      return
    }

    startTransition(async () => {
      try {
        const result = await deleteComment(commentId)
        
        if (result.error) {
          alert("댓글 삭제에 실패했습니다: " + result.error)
        }
      } catch (error) {
        console.error("댓글 삭제 오류:", error)
        alert("댓글 삭제 중 오류가 발생했습니다")
      }
    })
  }

  if (comments.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-3">
        첫 번째 댓글을 작성해보세요!
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-3">
          <img
            src={comment.user.image || '/default-avatar.png'}
            alt={comment.user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {comment.user.name}
                </span>
                {session?.user.id === comment.userId && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={isPending}
                    className="text-xs text-gray-500 hover:text-red-600 disabled:opacity-50"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-800 mt-1">
                {comment.content}
              </p>
            </div>
            <span className="text-xs text-gray-500 mt-1 block">
              {getRelativeTime(comment.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}