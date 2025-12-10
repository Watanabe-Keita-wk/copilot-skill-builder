'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LessonCompleteButtonProps {
  lessonId: string
  isCompleted: boolean
}

export function LessonCompleteButton({ lessonId, isCompleted: initialCompleted }: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
      })

      if (response.ok) {
        setIsCompleted(true)
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-semibold">レッスン完了</span>
      </div>
    )
  }

  return (
    <button
      onClick={handleComplete}
      disabled={isLoading}
      className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${
        isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 text-white'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          完了中...
        </span>
      ) : (
        '✓ レッスンを完了する'
      )}
    </button>
  )
}
