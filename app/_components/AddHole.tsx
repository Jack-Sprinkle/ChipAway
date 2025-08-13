// interfaces
import { AddHoleProps, Hole } from "../_shared/interfaces";
// hooks
import { useState, useEffect, FormEvent } from "react";
// db
import { db } from "../_db/db";
import { useLiveQuery } from "dexie-react-hooks";
// components

export default function AddHole({ roundNumber, saveRound }: AddHoleProps) {
  const holes: Hole[] | undefined = useLiveQuery(() =>
    db.holes.where("roundNumber").equals(roundNumber).toArray()
  );

  // initialize currentHole to 1 for start of round
  const [currentHole, setCurrentHole] = useState<Hole>({
    roundNumber: roundNumber,
    id: 1,
    par: 0,
    strokes: 0,
    score: 0,
    fairway: 0,
    green: 0,
    putts: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");

  // dependent on a new round number, or a new hole added
  useEffect(() => {
    // if holes exists AND has length, it will exist in indexeddb but it won't have a length on initial load
    if (holes && holes.length > 0) {
      const sortedHoles = holes.sort((a, b) => b.id - a.id);
      const mostRecentHole = sortedHoles[0];
      setCurrentHole({
        ...mostRecentHole,
        roundNumber: roundNumber,
        id: mostRecentHole.id + 1,
        par: 0,
        strokes: 0,
        score: 0,
        fairway: 0,
        green: 0,
        putts: 0,
      });
    }
  }, [holes, roundNumber]);

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setCurrentHole({
      ...currentHole,
      [name]: value,
    });
  }

  function handleSelectChange(evt: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = evt.target;
    setCurrentHole({
      ...currentHole,
      [name]: value,
    });
  }

  async function addHole(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    try {
      // update user score for hole before adding
      const updatedHole = {
        ...currentHole,
        score: (currentHole.strokes ?? 0) - (currentHole.par ?? 0),
      };
      // add updated hole to indexeddb
      const id = await db.holes.add(updatedHole);
      // update current hole to next hole
      setCurrentHole({
        roundNumber: roundNumber,
        id: id + 1,
        par: 0,
        strokes: 0,
        score: 0,
        fairway: 0,
        green: 0,
        putts: 0,
      });
    } catch {}
  }

  // if we don't have a hole, there is an issue display loading
  if (!currentHole) {
    return <p>Loading your current hole.</p>;
  } else {
    return (
      <div className="container-sm flex flex-col gap-4">
        <h3 className="text-xl underline text-center">
          Hole: {currentHole.id}
        </h3>
        {error ? <p className="text-red-700">{error}</p> : null}
        <form className="flex flex-col items-start" onSubmit={addHole}>
          {currentHole.id === 19 ? (
            <p>Please save your round.</p>
          ) : (
            <>
            <label className="mb-2">
            Par:
            <input
              type="number"
              name="par"
              value={currentHole.par ?? 0}
              onChange={handleChange}
              className="ml-2 border rounded p-1 w-20"
              required
            />
          </label>
          <label className="mb-2">
            Strokes:
            <input
              type="number"
              name="strokes"
              value={currentHole.strokes ?? 0}
              onChange={handleChange}
              className="ml-2 border rounded p-1 w-20"
              required
            />
          </label>
          <label className="mb-2">
            FIR
            <select
              name="fairway"
              value={currentHole.fairway ?? 0}
              onChange={handleSelectChange}
              className="ml-2"
              required
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </label>
          <label className="mb-2">
            GIR?
            <select
              name="green"
              value={currentHole.green ?? 0}
              onChange={handleSelectChange}
              className="ml-2"
              required
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </label>
          <label className="mb-2">
            Putts:
            <input
              type="number"
              name="putts"
              value={currentHole.putts ?? 0}
              onChange={handleChange}
              className="ml-2 border rounded p-1 w-20"
              required
            />
          </label>
            </>
          )}
          
          <div className="flex w-full">
            {currentHole.id === 19 ? (
              <button
                type="button"
                onClick={saveRound}
                className="rounded-lg bg-green-500 text-white px-2 py-1 mt-4"
              >
                Save Round
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-lg bg-blue-500 text-white px-2 py-1 mt-4"
              >
                Add Hole
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }
}
