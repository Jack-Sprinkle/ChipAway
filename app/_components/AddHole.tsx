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
<<<<<<< HEAD
      if (mostRecentHole.holeNumber < 18) {
        setCurrentHole({
          ...mostRecentHole,
          roundNumber: roundNumber,
          holeNumber: mostRecentHole.holeNumber + 1,
          par: 0,
          strokes: 0,
          score: 0,
          fairway: 0,
          green: 0,
          putts: 0,
          id: undefined,
        });
      } else {
        // After 18 holes, don't set up a new hole
        setCurrentHole({
          ...mostRecentHole,
          roundNumber: roundNumber,
          // Keep holeNumber at 18, don't increment
        });
      }
    } else {
      setCurrentHole({
        roundNumber: roundNumber,
        holeNumber: 1,
        par: null,
        strokes: null,
        score: null,
        fairway: null,
        green: null,
        putts: null,
=======
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
>>>>>>> develop
      });
    }
  }, [holes, roundNumber]);

  function handleChange(
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = evt.target;
    setCurrentHole({
      ...currentHole,
      [name]: value,
    });
  }

  async function addHole(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    try {
<<<<<<< HEAD
      if (currentHole) {
        // Calculate the score before adding the hole
        const updatedHole = {
          ...currentHole,
          score: (currentHole.strokes ?? 0) - (currentHole.par ?? 0),
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const id = await db.holes.add(updatedHole);
        if (currentHole.holeNumber < 18) {
          setCurrentHole({
            roundNumber: roundNumber,
            holeNumber: currentHole.holeNumber + 1,
            par: null,
            strokes: null,
            score: null,
            fairway: null,
            green: null,
            putts: null,
          });
        }
      } else {
        setError(`Failed to add hole.`);
      }
    } catch (err) {
      setError(`Failed to add hole: ${err}`);
    }
  };

  const editHole = async () => {
    try {
      if (currentHole) {
        // Calculate the score before adding the hole
        const updatedHole = {
          ...currentHole,
          score: (currentHole.strokes ?? 0) - (currentHole.par ?? 0),
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const id = await db.holes.put(updatedHole);
        setCurrentHole({
          roundNumber: roundNumber,
          holeNumber: currentHole.holeNumber + 1,
          par: null,
          strokes: null,
          score: null,
          fairway: null,
          green: null,
          putts: null,
        });
      } else {
        setError(`Failed to add hole.`);
      }
    } catch (err) {
      setError(`Failed to add hole: ${err}`);
    }
  };

  const goPrevHole = () => {
    if (holes && currentHole) {
      const prevHoleNumber = currentHole.holeNumber - 1;
      const prevHoleIndex = holes.findIndex(
        (hole) => hole.holeNumber === prevHoleNumber
      );
      if (prevHoleIndex >= 0) {
        setCurrentHole(holes[prevHoleIndex]); // Update with the previous hole's data
      }
    }
  };

  const goNextHole = () => {
    if (holes && currentHole) {
      const nextHoleNumber = currentHole.holeNumber + 1;
      const nextHoleIndex = holes.findIndex(
        (hole) => hole.holeNumber === nextHoleNumber
      );

      if (nextHoleIndex >= 0) {
        setCurrentHole(holes[nextHoleIndex]); // Update with the previous hole's data
      } else {
        setCurrentHole({
          roundNumber: roundNumber,
          holeNumber: currentHole.holeNumber + 1,
          par: 0,
          strokes: 0,
          score: 0,
          fairway: 0,
          green: 0,
          putts: 0,
        });
      }
    }
  };

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const { name, value } = evt.target;
    setCurrentHole((prevHole) =>
      prevHole
        ? {
            ...prevHole,
            [name]: value,
          }
        : null
    );
  };

  const handleSelectChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    evt.preventDefault();
    const { name, value } = evt.target;
    setCurrentHole((prevHole) =>
      prevHole
        ? {
            ...prevHole,
            [name]: value,
          }
        : null
    );
  };

  if (!currentHole) return <p>Loading your current hole.</p>;

  return (
    <div className="container-sm flex flex-col gap-4">
      <h3 className="text-xl underline text-center">
        {currentHole.holeNumber <= 18 && currentHole.id === undefined
          ? `Hole: ${currentHole.holeNumber}`
          : "Round Complete"}
      </h3>
      <div className="flex justify-center gap-2">
        <button
          onClick={goPrevHole}
          disabled={currentHole.holeNumber === 1}
          className="disabled:opacity-50"
        >
          <LeftArrowIcon />
        </button>
        <button
          onClick={goNextHole}
          disabled={holes && currentHole.holeNumber > holes.length}
          className="disabled:opacity-50"
        >
          <RightArrowIcon />
        </button>
      </div>
      {error ? <p className="text-red-700">{error}</p> : null}
      <form className="flex flex-col items-start" onSubmit={addHole}>
        {currentHole.holeNumber <= 18 && currentHole.id === undefined && (
          <>
            <label className="mb-2">
              Par:
              <input
                type="number"
                name="par"
                value={currentHole?.par ?? ""}
                onChange={handleChange}
                className="ml-2 border rounded p-1 w-20"
              />
            </label>
            <label className="mb-2">
              Strokes:
              <input
                type="number"
                name="strokes"
                value={currentHole?.strokes ?? ""}
                onChange={handleChange}
                className="ml-2 border rounded p-1 w-20"
              />
            </label>
            <label className="mb-2">
              Hit fairway?
              <select
                name="fairway"
                value={currentHole?.fairway ?? 0}
                onChange={handleSelectChange}
                className="ml-2"
              >
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </label>
            <label className="mb-2">
              Green in Regulation?
              <select
                name="green"
                value={currentHole?.green ?? 0}
                onChange={handleSelectChange}
                className="ml-2"
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
                value={currentHole?.putts ?? 0}
                onChange={handleChange}
                className="ml-2 border rounded p-1 w-20"
              />
            </label>
          </>
        )}

        <div className="flex w-full">
          {currentHole.holeNumber <= 18 && currentHole.id === undefined ? (
            <>
              {holes && currentHole.holeNumber > holes.length ? (
                <>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-500 text-white px-2 py-1 mt-4"
                  >
                    Add Hole
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={editHole}
                  className="rounded-lg bg-yellow-500 text-white px-2 py-1 mt-4"
                >
                  Save Edit
                </button>
              )}
            </>
=======
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
        {currentHole.id === 19 ? (
          <h3 className="text-xl underline text-center">Round Finished</h3>
        ) : (
          <h3 className="text-xl underline text-center">
            Hole: {currentHole.id}
          </h3>
        )}

        {error ? <p className="text-red-700">{error}</p> : null}
        <form className="flex flex-col items-start" onSubmit={addHole}>
          {currentHole.id === 19 ? (
            <p>Please save your round.</p>
>>>>>>> develop
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
