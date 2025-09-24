"use client"

import { useEffect, useState } from "react"
import type { FeedbackItem, FeedbackPriority } from "../types"

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    description: string
    category: string
    priority: FeedbackPriority
  }) => Promise<void>
  initial?: FeedbackItem | null
  existingCategories: string[]
}

const priorities: FeedbackPriority[] = ["HIGH", "MEDIUM", "LOW"]

export default function AddFeedbackModal({ open, onClose, onSubmit, initial, existingCategories }: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState<FeedbackPriority>("MEDIUM")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initial) {
      setTitle(initial.title)
      setDescription(initial.description)
      setCategory(initial.category)
      setPriority(initial.priority)
    } else {
      setTitle("")
      setDescription("")
      setCategory("")
      setPriority("MEDIUM")
    }
  }, [initial, open])

  if (!open) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Add feedback">
      <div className="modal">
        <div className="header" style={{ marginBottom: 8 }}>
          <div className="title">{initial ? "Edit feedback" : "Add feedback"}</div>
        </div>
        <div className="form-grid">
          <div className="form-row">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short title"
            />
          </div>
          <div className="form-row">
            <label htmlFor="desc">Description</label>
            <textarea
              id="desc"
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the request"
            />
          </div>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-row">
              <label htmlFor="category">Category</label>
              <input
                list="categories"
                id="category"
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., UI"
              />
              <datalist id="categories">
                {existingCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div className="form-row">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                className="select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as FeedbackPriority)}
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="header" style={{ marginTop: 12 }}>
          <button className="button ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="button"
            onClick={async () => {
              setLoading(true)
              try {
                await onSubmit({ title, description, category, priority })
                onClose()
              } finally {
                setLoading(false)
              }
            }}
            disabled={!title || !description || !category || loading}
          >
            {loading ? "Saving..." : initial ? "Save changes" : "Add feedback"}
          </button>
        </div>
      </div>
    </div>
  )
}
