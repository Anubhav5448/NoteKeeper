"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import NoteGrid from "@/components/NoteGrid";
import Pagination from "@/components/Pagination";
import NoteModal from "@/components/NoteModal";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Note {
  id: string;
  title: string;
  tagline: string;
  body: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function NotekeeperApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 6;

  const notesCollection = collection(db, "notes");

  // Fetch Notes from Firestore
  const fetchNotes = async () => {
    try {
      const snapshot = await getDocs(notesCollection);
      const fetchedNotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Note[];
      setNotes(fetchedNotes);
    } catch (error) {
      toast.error("Failed to fetch notes");
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "pinned">) => {
    try {
      const newNote = {
        ...note,
        pinned: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(notesCollection, newNote);
      setNotes((prevNotes) => [
        {
          id: docRef.id,
          ...newNote,
          createdAt: newNote.createdAt.toDate(),
          updatedAt: newNote.updatedAt.toDate(),
        },
        ...prevNotes,
      ]);
      toast.success("Note added successfully");
    } catch (error) {
      toast.error("Failed to add note");
      console.error("Error adding note:", error);
    }
  };

  const updateNote = async (updatedNote: Note) => {
    try {
      const noteRef = doc(db, "notes", updatedNote.id);
      await updateDoc(noteRef, {
        ...updatedNote,
        updatedAt: Timestamp.now(),
      });
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.id
            ? {
                ...updatedNote,
                updatedAt: new Date(),
              }
            : note
        )
      );
      toast.success("Note updated successfully");
    } catch (error) {
      toast.error("Failed to update note");
      console.error("Error updating note:", error);
    }
  };

  const togglePin = async (id: string) => {
    try {
      const note = notes.find((note) => note.id === id);
      if (note) {
        const noteRef = doc(db, "notes", id);
        await updateDoc(noteRef, { pinned: !note.pinned });
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === id ? { ...note, pinned: !note.pinned } : note
          )
        );
        toast.success("Note pin toggled");
      }
    } catch (error) {
      toast.error("Failed to toggle pin");
      console.error("Error toggling pin:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const noteRef = doc(db, "notes", id);
      await deleteDoc(noteRef);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Error deleting note:", error);
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned === b.pinned) {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
    return a.pinned ? -1 : 1;
  });

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = sortedNotes.slice(indexOfFirstNote, indexOfLastNote);

  const totalPages = Math.ceil(notes.length / notesPerPage);

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-4">Notekeeper</h1>
      <Button onClick={() => setIsModalOpen(true)} className="mb-4">
        <PlusIcon className="mr-2 h-4 w-4" /> Add Note
      </Button>
      <NoteGrid
        notes={currentNotes}
        onNoteClick={setEditingNote}
        onPinToggle={togglePin}
        onDelete={deleteNote}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <NoteModal
        isOpen={isModalOpen || !!editingNote}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onSave={(note) => {
          if (editingNote) {
            updateNote({ ...editingNote, ...note });
          } else {
            addNote(note);
          }
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        note={editingNote}
      />
    </div>
  );
}
