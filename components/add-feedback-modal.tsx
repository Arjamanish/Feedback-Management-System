"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"
import type { FeedbackItem, FeedbackPriority } from "@/lib/types"

interface AddFeedbackModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSubmit: (feedback: Omit<FeedbackItem, "id" | "createdAt" | "status">) => void
  existingCategories: string[]
  initialData?: FeedbackItem | null
}

const priorities: FeedbackPriority[] = ["Low", "Medium", "High"]

export default function AddFeedbackModal({
  isOpen,
  onOpenChange,
  onSubmit,
  existingCategories,
  initialData,
}: AddFeedbackModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [priority, setPriority] = useState<FeedbackPriority>("Medium")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isMobile = useIsMobile()
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus the title input when modal opens
  useEffect(() => {
    if (isOpen && !isMobile && titleInputRef.current) {
      // Small delay to ensure the modal is fully rendered
      const timer = setTimeout(() => {
        titleInputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, isMobile])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape to close
      if (event.key === "Escape") {
        event.preventDefault()
        onOpenChange(false)
      }
      // Cmd/Ctrl + Enter to submit
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        handleSubmit()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description)
      setCategory(initialData.category)
      setPriority(initialData.priority)
      setNewCategory("")
    } else {
      setTitle("")
      setDescription("")
      setCategory(existingCategories.length > 0 ? existingCategories[0] : "NEW")
      setPriority("Medium")
      setNewCategory("")
    }
    setErrors({})
  }, [initialData, isOpen, existingCategories])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    } else if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    const finalCategory = category === "NEW" ? newCategory : category
    if (!finalCategory.trim()) {
      newErrors.category = "Category is required"
    }

    if (!priority) {
      newErrors.priority = "Priority is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const finalCategory = category === "NEW" ? newCategory : category
    onSubmit({ title: title.trim(), description: description.trim(), category: finalCategory.trim(), priority })
    onOpenChange(false)
  }

  const formContent = (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="space-y-6 p-6 md:p-0"
    >
      <div className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Title
          </Label>
          <Input
            ref={titleInputRef}
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (errors.title) {
                setErrors((prev) => ({ ...prev, title: "" }))
              }
            }}
            placeholder="Brief, descriptive title for your feedback"
            className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="text-sm text-red-500" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (errors.description) {
                setErrors((prev) => ({ ...prev, description: "" }))
              }
            }}
            placeholder="Provide detailed context, use cases, and expected impact..."
            className={`min-h-[100px] resize-none ${errors.description ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            aria-describedby={errors.description ? "description-error" : undefined}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isMobile) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          {errors.description && (
            <p id="description-error" className="text-sm text-red-500" role="alert">
              {errors.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground">Tip: Use Shift+Enter for new lines, Enter to submit</p>
        </div>

        {/* Category and Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value)
                if (errors.category) {
                  setErrors((prev) => ({ ...prev, category: "" }))
                }
              }}
            >
              <SelectTrigger className={errors.category ? "border-red-500 focus:ring-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {existingCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="NEW">
                  <span className="flex items-center gap-2">
                    <span>➕</span>
                    Add new category...
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            {category === "NEW" && (
              <Input
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value)
                  if (errors.category) {
                    setErrors((prev) => ({ ...prev, category: "" }))
                  }
                }}
                placeholder="Enter new category name"
                className={`mt-2 ${errors.category ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
              />
            )}
            {errors.category && (
              <p className="text-sm text-red-500" role="alert">
                {errors.category}
              </p>
            )}
          </div>

          {/* Priority Field */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">
              Priority
            </Label>
            <Select
              value={priority}
              onValueChange={(value) => {
                setPriority(value as FeedbackPriority)
                if (errors.priority) {
                  setErrors((prev) => ({ ...prev, priority: "" }))
                }
              }}
            >
              <SelectTrigger className={errors.priority ? "border-red-500 focus:ring-red-500" : ""}>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((p) => (
                  <SelectItem key={p} value={p}>
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          p === "High" ? "bg-red-500" : p === "Medium" ? "bg-yellow-500" : "bg-green-500"
                        }`}
                      />
                      {p}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-red-500" role="alert">
                {errors.priority}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Footer */}
      <DialogFooter className="hidden md:flex pt-6 gap-3">
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6">
          Cancel
        </Button>
        <Button type="submit" className="px-6 bg-primary hover:bg-primary/90">
          {initialData ? "Save Changes" : "Add Feedback"}
        </Button>
      </DialogFooter>
    </form>
  )

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          {/* Mobile Header with Action Buttons */}
          <DrawerHeader className="flex flex-row items-center justify-between p-4 border-b">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-base font-normal">
              Cancel
            </Button>
            <DrawerTitle className="text-lg font-semibold">
              {initialData ? "Edit Feedback" : "New Feedback"}
            </DrawerTitle>
            <Button
              onClick={handleSubmit}
              className="bg-white hover:bg-gray-50 text-black border border-gray-200 px-6 rounded-full"
            >
              {initialData ? "Save" : "Post"}
            </Button>
          </DrawerHeader>
          {formContent}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold">
            {initialData ? "Edit Feedback" : "Add New Feedback"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {initialData
              ? "Update the details for this feedback item."
              : "Share your ideas, report issues, or suggest improvements to help us build better experiences."}
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  )
}
