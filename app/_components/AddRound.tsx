import { db } from "../_db/db";
import { useState } from "react";

export default function AddRound() {
  // set all state used for a round and error handling
  const [error, setError] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [courseRating, setCourseRating] = useState<number>(0);
  const [courseSlope, setCourseSlope] = useState<number>(0);
  const [tees, setTees] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const addRound = async () => {
    // attempt to save a round to indexeddb
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const roundId = await db.rounds.add({ courseName, courseRating, courseSlope, tees, date, inProgress: 1 });
    } catch (err) {
      setError(`Could not start round: ${err}`);
    }
  };

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
          value={courseName}
          onChange={(evt) => setCourseName(evt.target.value)}
          required
        />
      </label>
      <label className="mb-2">
        Course Rating:
        <input
          className="ml-2 border rounded p-1 w-50"
          type="number"
          value={courseRating}
          onChange={(evt) => setCourseRating(evt.target.valueAsNumber)}
          required
        />
      </label>
      <label className="mb-2">
        Course Slope:
        <input
          className="ml-2 border rounded p-1 w-50"
          type="number"
          value={courseSlope}
          onChange={(evt) => setCourseSlope(evt.target.valueAsNumber)}
          required
        />
      </label>
            <label className="mb-2">
        Tees:
        <input
          className="ml-2 border rounded p-1 w-50"
          type="text"
          value={tees}
          onChange={(evt) => setTees(evt.target.value)}
          required
        />
      </label>
      <label className="mb-2">
        Date:
        <input
          className="ml-2 border rounded p-1 w-50"
          type="date"
          value={date}
          onChange={(evt) => setDate(evt.target.value)}
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
