
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PinIcon, TrashIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Note } from "@/app/page"

interface NoteGridProps {
  notes: Note[]
  onNoteClick: (note: Note) => void
  onPinToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function NoteGrid({ notes, onNoteClick, onPinToggle, onDelete }: NoteGridProps) {
  const handlePinToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      onPinToggle(id)
    } catch (error) {
      toast.error('Failed to toggle pin')
      console.error('Error toggling pin:', error)
    }
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      onDelete(id)
    } catch (error) {
      toast.error('Failed to delete note')
      console.error('Error deleting note:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map(note => (
        <Card key={note.id} className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{note.title}</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handlePinToggle(e, note.id)}
              >
                <PinIcon className={note.pinned ? "text-primary" : "text-muted-foreground"} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleDelete(e, note.id)}
              >
                <TrashIcon className="text-destructive" />
              </Button>
            </div>
          </CardHeader>
          <CardContent onClick={() => onNoteClick(note)}>
            <p className="text-xs text-muted-foreground">{note.tagline}</p>
            <p className="mt-2 text-sm line-clamp-3">{note.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

