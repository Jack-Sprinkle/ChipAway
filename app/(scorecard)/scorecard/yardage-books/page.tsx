"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getAllYardageBooks, normalizeCourseName, saveYardageBookHoleNote } from "@/lib/db";
import type { YardageBook } from "@/lib/types";

function getBookNotes(book?: YardageBook): Record<number, string> {
    const notes: Record<number, string> = {};
    for (let holeNumber = 1; holeNumber <= 18; holeNumber++) {
        notes[holeNumber] = book?.holes.find((hole) => hole.holeNumber === holeNumber)?.note ?? "";
    }
    return notes;
}

function sortYardageBooks(books: YardageBook[]) {
    return [...books].sort((a, b) => b.updatedAt - a.updatedAt);
}

export default function YardageBooksPage() {
    const [yardageBooks, setYardageBooks] = useState<YardageBook[]>([]);
    const [selectedCourseKey, setSelectedCourseKey] = useState<string | null>(null);
    const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);
    const [courseNameInput, setCourseNameInput] = useState("");
    const [notes, setNotes] = useState<Record<number, string>>({});
    const [savedNotes, setSavedNotes] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    useEffect(() => {
        async function loadYardageBooks() {
            try {
                setYardageBooks(await getAllYardageBooks());
            } catch (loadError) {
                console.error(loadError);
                setError("Could not load yardage books from this device.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadYardageBooks();
    }, []);

    const changedHoleNumbers = selectedCourseName
        ? Array.from({ length: 18 }, (_, index) => index + 1).filter(
              (holeNumber) => (notes[holeNumber] ?? "") !== (savedNotes[holeNumber] ?? ""),
          )
        : [];

    function selectBook(book: YardageBook) {
        if (
            book.courseKey !== selectedCourseKey &&
            changedHoleNumbers.length > 0 &&
            !window.confirm("Discard unsaved changes to this yardage book?")
        ) {
            return;
        }

        const bookNotes = getBookNotes(book);
        setSelectedCourseKey(book.courseKey);
        setSelectedCourseName(book.courseName);
        setNotes(bookNotes);
        setSavedNotes(bookNotes);
        setError(null);
        setNotice(null);
    }

    function handleOpenCourse(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setNotice(null);

        try {
            const courseKey = normalizeCourseName(courseNameInput);
            if (
                courseKey !== selectedCourseKey &&
                changedHoleNumbers.length > 0 &&
                !window.confirm("Discard unsaved changes to this yardage book?")
            ) {
                return;
            }

            const existingBook = yardageBooks.find((book) => book.courseKey === courseKey);
            if (existingBook) {
                selectBook(existingBook);
            } else {
                setSelectedCourseKey(courseKey);
                setSelectedCourseName(courseNameInput.trim().replace(/\s+/g, " "));
                setNotes({});
                setSavedNotes({});
            }
            setCourseNameInput("");
        } catch (openError) {
            setError(openError instanceof Error ? openError.message : "Could not open that course.");
        }
    }

    function handleNoteChange(holeNumber: number, note: string) {
        setNotes((currentNotes) => ({ ...currentNotes, [holeNumber]: note }));
        setError(null);
        setNotice(null);
    }

    async function handleSaveChanges() {
        if (!selectedCourseName || changedHoleNumbers.length === 0) return;

        setIsSaving(true);
        setError(null);
        setNotice(null);

        try {
            for (const holeNumber of changedHoleNumbers) {
                const note = notes[holeNumber] ?? "";
                const updatedBook = await saveYardageBookHoleNote(selectedCourseName, holeNumber, note);
                setYardageBooks((currentBooks) =>
                    sortYardageBooks([
                        ...currentBooks.filter((book) => book.courseKey !== updatedBook.courseKey),
                        updatedBook,
                    ]),
                );
                setSelectedCourseKey(updatedBook.courseKey);
                setSelectedCourseName(updatedBook.courseName);
                setSavedNotes((currentNotes) => ({ ...currentNotes, [holeNumber]: note }));
            }
            setNotice("Yardage book saved.");
        } catch (saveError) {
            console.error(saveError);
            setError(saveError instanceof Error ? saveError.message : "Could not save your yardage book.");
        } finally {
            setIsSaving(false);
        }
    }

    const selectedBookExists = yardageBooks.some((book) => book.courseKey === selectedCourseKey);

    return (
        <main className="min-h-screen bg-white px-6 py-12">
            <div className="mx-auto max-w-6xl">
                <Link href="/scorecard" className="font-semibold text-vibrant-green hover:underline">
                    ← Back to Scorecard
                </Link>
                <div className="mt-4">
                    <h1 className="text-4xl font-bold text-fairway-green">Yardage Books</h1>
                    <p className="mt-2 max-w-2xl text-text-dark">
                        Keep course-specific notes for each hole. Your yardage books are saved on this device.
                    </p>
                </div>

                {error && (
                    <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                        {error}
                    </p>
                )}
                {notice && (
                    <p role="status" className="mt-6 rounded-lg border border-green-200 bg-green-50 p-3 text-green-800">
                        {notice}
                    </p>
                )}

                <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.8fr)]">
                    <aside className="h-fit rounded-2xl border border-light-sand bg-cream p-5">
                        <h2 className="text-xl font-semibold text-fairway-green">Your courses</h2>
                        <form onSubmit={handleOpenCourse} className="mt-4 space-y-3">
                            <label htmlFor="courseName" className="block text-sm font-semibold text-fairway-green">
                                Open or add a course
                            </label>
                            <input
                                id="courseName"
                                type="text"
                                value={courseNameInput}
                                onChange={(event) => setCourseNameInput(event.target.value)}
                                placeholder="Course name"
                                disabled={isLoading || isSaving}
                                className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 focus:border-vibrant-green focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || isSaving || !courseNameInput.trim()}
                                className="w-full rounded-lg bg-vibrant-green px-4 py-3 font-semibold text-white transition-colors hover:bg-fairway-green disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Open Course
                            </button>
                        </form>

                        <div className="mt-6 border-t border-light-sand pt-5">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-fairway-green">Saved yardage books</h3>
                            {isLoading ? (
                                <p className="mt-3 text-sm text-text-dark">Loading yardage books...</p>
                            ) : yardageBooks.length === 0 ? (
                                <p className="mt-3 text-sm text-text-dark">No saved yardage books yet. Open a course and add a hole note to create one.</p>
                            ) : (
                                <ul className="mt-3 space-y-2">
                                    {yardageBooks.map((book) => (
                                        <li key={book.courseKey}>
                                            <button
                                                type="button"
                                                onClick={() => selectBook(book)}
                                                aria-pressed={selectedCourseKey === book.courseKey}
                                                disabled={isSaving}
                                                className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                                                    selectedCourseKey === book.courseKey
                                                        ? "border-vibrant-green bg-white"
                                                        : "border-transparent bg-white/70 hover:border-vibrant-green/40"
                                                }`}
                                            >
                                                <span className="block font-semibold text-fairway-green">{book.courseName}</span>
                                                <span className="mt-1 block text-xs text-text-dark/70">
                                                    Updated {new Date(book.updatedAt).toLocaleDateString()}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </aside>

                    <section className="min-w-0">
                        {selectedCourseName ? (
                            <>
                                <div className="mb-5">
                                    <h2 className="text-2xl font-bold text-fairway-green">{selectedCourseName}</h2>
                                    <p className="mt-1 text-sm text-text-dark">
                                        {selectedBookExists
                                            ? "Edit the notes for each hole. Save your changes when you're done."
                                            : "This course is not saved yet. Add a note to create its yardage book."}
                                    </p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {Array.from({ length: 18 }, (_, index) => index + 1).map((holeNumber) => (
                                        <div key={holeNumber} className="rounded-xl border border-light-sand p-4">
                                            <label
                                                htmlFor={`hole-note-${holeNumber}`}
                                                className="block font-semibold text-fairway-green"
                                            >
                                                Hole {holeNumber}
                                            </label>
                                            <textarea
                                                id={`hole-note-${holeNumber}`}
                                                rows={3}
                                                value={notes[holeNumber] ?? ""}
                                                onChange={(event) => handleNoteChange(holeNumber, event.target.value)}
                                                placeholder={`Course notes for hole ${holeNumber}`}
                                                disabled={isSaving}
                                                className="mt-2 w-full resize-y rounded-lg border-2 border-gray-300 px-3 py-2 text-text-dark focus:border-vibrant-green focus:outline-none disabled:bg-gray-100"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => void handleSaveChanges()}
                                    disabled={isSaving || changedHoleNumbers.length === 0}
                                    className="mt-6 w-full rounded-lg bg-vibrant-green px-5 py-3 font-semibold text-white transition-colors hover:bg-fairway-green disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    {isSaving
                                        ? "Saving..."
                                        : `Save ${changedHoleNumbers.length === 1 ? "change" : "changes"}`}
                                </button>
                            </>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                                <h2 className="text-xl font-semibold text-fairway-green">Choose a course</h2>
                                <p className="mt-2 text-text-dark">
                                    Select a saved yardage book or open a course above to start adding hole notes.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}
