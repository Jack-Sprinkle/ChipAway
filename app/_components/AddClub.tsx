"use client";
import { Club, AddClubInputProps } from "../_shared/interfaces";
import { useState, ChangeEvent, FormEvent } from "react";

export default function AddClub({ saveClub }: AddClubInputProps) {
  const [club, setClub] = useState<Club>({
    name: "",
    loft: 0,
    distance: 0,
  });

  function handleChange(evt: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = evt.target;
    setClub({
      ...club,
      [name] : value,
    });
  };

  function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    saveClub(club);
    setClub({
      name: "",
      loft: 0,
      distance: 0,
    });
  };

  return (
    <div className="container-sm flex justify-center">
      <form className="flex flex-col items-start" onSubmit={handleSubmit}>
        <label className="mb-2">
          Name:
          <input
            type="text"
            name="name"
            value={club.name}
            onChange={handleChange}
            className="ml-2"
          />
        </label>
        <label className="mb-2">
          Loft:
          <input
            type="number"
            step={0.5}
            name="loft"
            value={club.loft}
            onChange={handleChange}
            className="ml-2 border rounded p-1 w-20"
          />
        </label>
        <label className="mb-2">
          Distance:
          <input
            type="number"
            name="distance"
            value={club.distance}
            onChange={handleChange}
            className="ml-2 border rounded p-1 w-20"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-blue-500 text-white px-2 py-1 mt-4"
        >
          Save Club
        </button>
      </form>
    </div>
  );
}
