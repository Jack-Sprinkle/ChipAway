"use client";
import { Round } from "../_shared/interfaces";
import { db } from "../_db/db";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

// Components
import AddRound from "../_components/AddRound";

export default function CurrentRound() {
  // initialize current round to NULL
  const [currentRound, setCurrentRound] = useState<Round | null>(null);

  // get rounds outside of useEffect, indexeddb cannot be called in useEffect
  const rounds: Round[] | undefined = useLiveQuery(() =>
    // just get rounds where they're in progress
    db.rounds.where("inProgress").equals(1).toArray()
  );

  // useEffect must be dependent on rounds getting updated from indexeddb
  useEffect(() => {
    // if we have rounds, set the current round
    if (rounds) {
      setCurrentRound(rounds[0])
    }
  }, [rounds]);

  if (!currentRound) {
    return (
      <div className="container-sm flex flex-col gap-5 md: items-center">
        <AddRound />
      </div>
    );
  } else {
    return (
      <div className="container-sm flex flex-col gap-5 md: items-center">
        <div className="container-sm flex flex-col gap-2 md: items-center">
          <h1 className="text-3xl underline">Current Round</h1>
          <h2 className="text-2xl">Course: {currentRound.courseName}</h2>
          <button className="rounded-lg bg-red-500 text-white px-2 py-1 text-xs self-start">
            Discard Round
          </button>
        </div>
      </div>
    );
  }
}
