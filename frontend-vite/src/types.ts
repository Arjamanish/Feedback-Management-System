export type FeedbackStatus = "OPEN" | "IN_PROGRESS" | "DONE"
export type FeedbackPriority = "HIGH" | "MEDIUM" | "LOW"

export interface FeedbackItem {
  id: string
  title: string
  description: string
  category: string
  status: FeedbackStatus
  priority: FeedbackPriority
  createdAt: number
}
