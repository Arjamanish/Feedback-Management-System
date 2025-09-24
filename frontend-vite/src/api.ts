import type { FeedbackItem, FeedbackPriority, FeedbackStatus } from "./types"

const base = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8080/api"

export async function listFeedback(): Promise<FeedbackItem[]> {
  const res = await fetch(`${base}/feedback`)
  if (!res.ok) throw new Error("Failed to load feedback")
  return res.json()
}

export async function createFeedback(input: {
  title: string
  description: string
  category: string
  priority: FeedbackPriority
}): Promise<FeedbackItem> {
  const res = await fetch(`${base}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("Failed to create feedback")
  return res.json()
}

export async function updateFeedback(
  id: string,
  input: {
    title: string
    description: string
    category: string
    priority: FeedbackPriority
  },
): Promise<FeedbackItem> {
  const res = await fetch(`${base}/feedback/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error("Failed to update feedback")
  return res.json()
}

export async function updateStatus(id: string, status: FeedbackStatus): Promise<FeedbackItem> {
  const res = await fetch(`${base}/feedback/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error("Failed to update status")
  return res.json()
}

export async function deleteFeedback(id: string): Promise<void> {
  const res = await fetch(`${base}/feedback/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete feedback")
}
