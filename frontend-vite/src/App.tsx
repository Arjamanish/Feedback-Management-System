"use client"

import { useEffect, useMemo, useState } from "react"
import { createFeedback, deleteFeedback, listFeedback, updateFeedback } from "./api"
import type { FeedbackItem, FeedbackPriority } from "./types"
import FeedbackList from "./components/FeedbackList"
import AddFeedbackModal from "./components/AddFeedbackModal"

export default function App() {
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("All")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<FeedbackItem | null>(null)

  useEffect(() => {
    listFeedback()
      .then(setItems)
      .catch((e) => console.error("[v0] load error:", e))
  }, [])

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category))
    return Array.from(set).sort()
  }, [items])

  const filtered = useMemo(() => {
    return items
      .filter((i) => category === "All" || i.category === category)
      .filter((i) => [i.title, i.description, i.category].some((f) => f.toLowerCase().includes(search.toLowerCase())))
  }, [items, search, category])

  const onSubmit = async (data: {
    title: string
    description: string
    category: string
    priority: FeedbackPriority
  }) => {
    if (editing) {
      const updated = await updateFeedback(editing.id, data)
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
      setEditing(null)
    } else {
      const created = await createFeedback(data)
      setItems((prev) => [created, ...prev])
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm("Delete this feedback item?")) return
    await deleteFeedback(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <main className="container">
      <header className="header">
        <h1 className="title" style={{ letterSpacing: "-0.02em" }}>
          v0 Feedback (Vite)
        </h1>
        <button
          className="button"
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          Add Feedback
        </button>
      </header>

      <section className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
        <div className="toolbar">
          <input
            className="input"
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search feedback"
            style={{ maxWidth: 360 }}
          />
          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div style={{ color: "var(--muted)", fontSize: 14 }}>
          Showing {filtered.length} of {items.length} items
        </div>

        <FeedbackList
          items={filtered}
          onEdit={(it) => {
            setEditing(it)
            setOpen(true)
          }}
          onDelete={onDelete}
        />
      </section>

      <AddFeedbackModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        initial={editing}
        existingCategories={categories}
      />
    </main>
  )
}
