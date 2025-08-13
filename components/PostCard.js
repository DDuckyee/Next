// 개별 게시글을 카드 형태로 보여주는 컴포넌트 (좋아요/댓글 기능 추가)
// Next.js Image를 사용해서 이미지를 최적화하고 게시글 정보를 표시합니다

"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Image from 'next/image'
import LikeButton from './LikeButton'
import CommentSection from './CommentSection'
import CommentForm from './CommentForm'

export default function PostCard({ post }) {
  const { data: session } = useSession()
  const [showComments, setShowComments] = useState(false)

  // 상대 시간 계산
  const getRelativeTime = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
    
    if (diffInSeconds < 60) return '방금 전'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`
    
    return new Date(date).toLocaleDateString('ko-KR')
  }

  // 현재 사용자가 이 게시글에 좋아요를 눌렀는지 확인
  const isLikedByUser = session ? 
    post.likes.some(like => like.userId === session.user.id) : false

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 프로필 헤더 */}
      <div className="flex items-center p-4">
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={post.author.image || '/default-avatar.png'}
            alt={post.author.name || '사용자'}
            fill
            className="object-cover"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold text-gray-900">
            {post.author.name || '익명 사용자'}
          </p>
          <p className="text-xs text-gray-500">
            {getRelativeTime(post.createdAt)}
          </p>
        </div>
      </div>

      {/* 게시글 이미지 */}
      <div className="relative aspect-square">
        <Image
          src={post.imageUrl}
          alt={post.caption || '게시글 이미지'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      {/* 액션 버튼들과 좋아요 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <LikeButton
              postId={post.id}
              initialLikesCount={post.likes.length}
              isLikedByUser={isLikedByUser}
            />
            <button 
              onClick={() => setShowComments(!showComments)}
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 캡션 */}
        {post.caption && (
          <p className="text-sm text-gray-900 mb-2">
            <span className="font-semibold">{post.author.name}</span>{' '}
            {post.caption}
          </p>
        )}

        {/* 댓글 개수 및 토글 버튼 */}
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-500 hover:text-gray-700 mb-3 block"
          >
            댓글 {post.comments.length}개 {showComments ? '숨기기' : '보기'}
          </button>
        )}

        {/* 댓글 섹션 (토글) */}
        {showComments && (
          <div className="space-y-3">
            <CommentSection comments={post.comments} />
            <CommentForm postId={post.id} />
          </div>
        )}

        {/* 댓글이 없고 숨겨진 상태일 때만 댓글 작성 폼 표시 */}
        {!showComments && post.comments.length === 0 && (
          <CommentForm postId={post.id} />
        )}
      </div>
    </div>
  )
}