"use client";
import { Club, EditClubInputProps } from "../_shared/interfaces";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { db } from "../_db/db";
import { useLiveQuery } from "dexie-react-hooks";

export default function EditClub({ editClub, clubId }: EditClubInputProps) {
  const clubToEdit: Club | undefined = useLiveQuery(() =>
    db.clubs.where("id").equals(clubId).first()
  );

  const [club, setClub] = useState<Club>({
    name: "",
    loft: 0,
    distance: 0,
  });

  useEffect(() => {
    if (clubToEdit) {
      setClub(clubToEdit);
    } else {
      setClub({
        name: "",
        loft: 0,
        distance: 0,
      });
    }
  }, [clubId, clubToEdit]);

  function handleChange(
    evt: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    evt.preventDefault();
    const { name, value } = evt.target;
    setClub({
      ...club,
      [name]: value,
    });
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    editClub(club);
  };
  
  if (!club) {
    return <p>Please select club to edit.</p>;
  } else {
    return (
      <div className="container-sm flex justify-center">
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
          <label className="mb-2">
            Name:
            <input
              type="text"
              name="name"
              value={club.name || ""}
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
              value={club.loft || 0}
              onChange={handleChange}
              className="ml-2 border rounded p-1 w-20"
            />
          </label>
          <label className="mb-2">
            Distance:
            <input
              type="number"
              name="distance"
              value={club.distance || 0}
              onChange={handleChange}
              className="ml-2 border rounded p-1 w-20"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-yellow-500 text-white px-2 py-1 mt-4"
          >
            Save Edit
          </button>
        </form>
      </div>
    );
  }
}
