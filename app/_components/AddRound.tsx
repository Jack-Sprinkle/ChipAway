// interfaces
import { Round } from "../_shared/interfaces";
// hooks
import { useState, FormEvent } from "react";
// db
import { db } from "../_db/db";

export default function AddRound() {
  // set all state used for a round and error handling
  const [error, setError] = useState<string>("");

  // initialize round to start
  const [newRound, setNewRound] = useState<Round>({
    courseName: "",
    courseRating: 0,
    courseSlope: 0,
    tees: "",
    date: "",
    inProgress: 0,
  });

  // update round values from user input
  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setNewRound({
      ...newRound,
      [name]: value,
    });
  }

  async function addRound(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    // attempt to save a round to indexeddb
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newRoundId = await db.rounds.add({
        ...newRound,
        inProgress: 1,
      });
    } catch (err) {
      console.error(err)
      setError(`Could not start round: ${err}`);
    }
  }

  return (
    <form
      onSubmit={addRound}
      className="container-sm flex flex-col items-start gap-4"
    >
      <h1 className="text-3xl">Start a new round</h1>
      {error ? <p className="text-red-700">{error}</p> : null}
      <label className="mb-2">
        Course Name:
        <input
          className="ml-2 border rounded p-1 w-50"
          type="text"
          name="courseName"
          value={newRound.courseName}
          onChange={handleChange}
          required
        />
      </label>
      <label className="mb-2">
        Course Rating:
        <input
          className="ml-2 border rounded p-1 w-50"
          type="number"
          name="courseRating"
          value={newRound.courseRating ?? 0}
          onChange={handleChange}
          required
        />
      </label>
      <label className="mb-2">
        Course Slope:
        <input
          className="ml-2 border rounded p-1 w-50"
          type="number"
          name="courseSlope"
          value={newRound.courseSlope ?? 0}
          onChange={handleChange}
          required
        />
      </label>
      <label className="mb-2">
        Tees:
        <input
          className="ml-2 border rounded p-1 w-50"
          type="text"
          name="tees"
          value={newRound.tees}
          onChange={handleChange}
          required
        />
      </label>
      <label className="mb-2">
        Date:
        <input
          className="ml-2 border rounded p-1 w-50"
          type="date"
          name="date"
          value={newRound.date}
          onChange={handleChange}
          required
        />
      </label>
      <button
        type="submit"
        className="rounded-lg bg-green-500 text-white px-2 py-1 mt-4 w-30"
      >
        Start Round
      </button>
    </form>
  );
}
