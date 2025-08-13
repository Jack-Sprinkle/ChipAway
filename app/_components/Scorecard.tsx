// interfaces
import { Hole, ScorecardProps } from "../_shared/interfaces";
// hooks
import { useState, useEffect } from "react";
// db
import { db } from "../_db/db";
import { useLiveQuery } from "dexie-react-hooks";
// components
import { CheckIcon, XIcon } from "../_shared/icons";

export default function Scorecard({ roundNumber }: ScorecardProps) {
  // fetch all holes that are saved for this round, reminder useLiveQuery cannot be used in useEffect
  const holes: Hole[] | undefined = useLiveQuery(() =>
    db.holes.where("roundNumber").equals(roundNumber).toArray()
  );

  // initialize state variables
  const [scorecard, setScorecard] = useState<Hole[] | null>(null);
  const [coursePar, setCoursePar] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [totalStrokes, setTotalStrokes] = useState(0);
  const [error, setError] = useState("");

  // set dependency on roundNumber, to initially get holes, then on holes, so it updates after adding hole
  useEffect(() => {
    if (holes) {
      // sort holes by number to display properly
      const sortedHoles = holes.sort((a, b) => a.id - b.id);
      // get total score for all holes so far
      const score = holes.reduce(
        (total, hole) => total + Number(hole.score),
        0
      );
      // get par for all holes so far
      const par = holes.reduce((total, hole) => total + Number(hole.par), 0);
      // get total strokes for holes so far
      const strokes = holes.reduce(
        (total, hole) => total + Number(hole.strokes),
        0
      );
      // update state variables
      setScorecard(sortedHoles);
      setCoursePar(par);
      setTotalScore(score);
      setTotalStrokes(strokes);
      setError("");
    } else {
      setError("Add a hole to start your scorecard.");
    }
  }, [roundNumber, holes]);

  return (
    <div className="container-xs flex flex-col gap-4">
      {error ? <p className="text-red-700">{error}</p> : null}
      <table className="table-auto mx-auto">
        <thead>
          <tr>
            <th className="px-1">Hole</th>
            <th className="px-1">Par</th>
            <th className="px-1">Strokes</th>
            <th className="px-1">+/-</th>
            <th className="px-1">Fairway</th>
            <th className="px-1">GIR</th>
            <th className="px-1">Putts</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {scorecard?.map((hole, index) => (
            <tr key={index}>
              <td>{hole.id}</td>
              <td>{Number(hole.par)}</td>
              <td>{Number(hole.strokes)}</td>
              <td>{Number(hole.score)}</td>
              <td className="text-center">
                <div className="flex justify-center">
                  {Number(hole.fairway) ? <CheckIcon /> : <XIcon />}
                </div>
              </td>
              <td className="text-center py-2">
                <div className="flex justify-center">
                  {Number(hole.green) ? <CheckIcon /> : <XIcon />}
                </div>
              </td>
              <td
                className={
                  Number(hole.putts) >= 3
                    ? "text-red-600 font-bold py-2"
                    : "py-2"
                }
              >
                {" "}
                {Number(hole.putts)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="container-sm flex flex-col items-start">
        <h2 className="pl-2">Course Par: {coursePar}</h2>
        <h3 className="pl-2">Total Strokes: {totalStrokes}</h3>
        <h4 className="pl-2">Score: {totalScore}</h4>
      </div>
    </div>
  );
}
