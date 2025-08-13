// 댓글 작성 폼 컴포넌트
// 댓글 입력과 제출을 처리합니다

"use client"

import { useRef, useTransition } from "react"
import { useSession } from "next-auth/react"
import { createComment } from "@/actions/comments"

export default function CommentForm({ postId }) {
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef(null)

  if (!session) {
    return (
      <div className="text-sm text-gray-500 text-center py-3">
        댓글을 작성하려면 로그인해주세요
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const content = inputRef.current.value.trim()
    if (!content) {
      alert("댓글을 입력해주세요")
      return
    }

    startTransition(async () => {
      try {
        const result = await createComment({ postId, content })
        
        if (result.success) {
          // 성공 시 입력창 초기화
          inputRef.current.value = ""
        } else {
          alert("댓글 작성에 실패했습니다: " + result.error)
        }
      } catch (error) {
        console.error("댓글 작성 오류:", error)
        alert("댓글 작성 중 오류가 발생했습니다")
      }
    })
  }

  return (
    <div className="border-t border-gray-200 pt-3">
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <img
          src={session.user.image}
          alt={session.user.name}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1 flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="댓글을 입력하세요..."
            disabled={isPending}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:bg-gray-400"
          >
            {isPending ? "작성 중..." : "댓글"}
          </button>
        </div>
      </form>
    </div>
  )
}