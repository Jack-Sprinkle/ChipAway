"use client";
import { Round } from "../_shared/interfaces";
import { useState } from "react";
import AddRound from "../_components/AddRound";

export default function CurrentRound() {
  const [currentRound, setCurrentRound] = useState<Round | null>(null);

  if (!currentRound) {
    return (
      <div className="container-sm flex flex-col gap-5 md: items-center">
        <AddRound />
      </div>
    );
  }

  return (
    <div className="container-sm flex flex-col gap-5 md: items-center">
      <div className="container-sm flex flex-col gap-2 md: items-center">
        <h1 className="text-3xl">Current Round</h1>
        <h2 className="text-2xl">Course: {currentRound.courseName}</h2>
        <button className="rounded-lg bg-red-500 text-white px-2 py-1 text-xs self-start"
        >
          Discard Round
        </button>
      </div>
    </div>
  );
}
