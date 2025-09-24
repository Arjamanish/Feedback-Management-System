"use client"

import type { FeedbackItem } from "../types"

type Props = {
  items: FeedbackItem[]
  onEdit: (item: FeedbackItem) => void
  onDelete: (id: string) => void
}

function priorityBadgeClass(p: string) {
  if (p === "HIGH") return "badge red"
  if (p === "MEDIUM") return "badge yellow"
  return "badge green"
}

export default function FeedbackList({ items, onEdit, onDelete }: Props) {
  if (!items.length) {
    return <div style={{ padding: "24px 0", color: "var(--muted)" }}>No feedback yet. Click “Add Feedback”.</div>
  }

  return (
    <div className="grid">
      <div className="table" role="table" aria-label="Feedback items">
        <div role="rowgroup">
          <div role="row" style={{ display: "grid", gridTemplateColumns: "2fr 3fr 120px 160px 140px", gap: 0 }}>
            <div role="columnheader" className="table th">
              Title
            </div>
            <div role="columnheader" className="table th">
              Description
            </div>
            <div role="columnheader" className="table th">
              Priority
            </div>
            <div role="columnheader" className="table th">
              Category
            </div>
            <div role="columnheader" className="table th">
              Actions
            </div>
          </div>
        </div>
        <div role="rowgroup">
          {items.map((item) => (
            <div key={item.id} role="row" style={{ display: "grid", gridTemplateColumns: "2fr 3fr 120px 160px 140px" }}>
              <div role="cell" className="table td">
                <div style={{ fontWeight: 600 }}>{item.title}</div>
              </div>
              <div role="cell" className="table td">
                <div style={{ color: "var(--muted)" }}>{item.description}</div>
              </div>
              <div role="cell" className="table td">
                <span className={priorityBadgeClass(item.priority)}>{item.priority}</span>
              </div>
              <div role="cell" className="table td">
                <span className="badge">{item.category}</span>
              </div>
              <div role="cell" className="table td" style={{ display: "flex", gap: 8 }}>
                <button className="button secondary" onClick={() => onEdit(item)}>
                  Edit
                </button>
                <button className="button danger" onClick={() => onDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
