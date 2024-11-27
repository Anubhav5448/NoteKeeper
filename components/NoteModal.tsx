import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Note } from '@/app/page'


interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'pinned'>) => void
  note?: Note | null
}

export default function NoteModal({ isOpen, onClose, onSave, note }: NoteModalProps) {
  const [title, setTitle] = useState('')
  const [tagline, setTagline] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setTagline(note.tagline)
      setBody(note.body)
    } else {
      setTitle('')
      setTagline('')
      setBody('')
    }
  }, [note])

  const handleSave = () => {
    try {
      if (!title.trim()) {
        throw new Error('Title is required')
      }
      onSave({ title, tagline, body })
      setTitle('')
      setTagline('')
      setBody('')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An error occurred while saving the note')
      }
      console.error('Error saving note:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Note' : 'Add Note'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
          <Textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

