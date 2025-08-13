import Dexie, { type EntityTable } from "dexie";
import { Round, Hole, Club } from "../_shared/interfaces";

const db = new Dexie("myScorecardDB") as Dexie & {
  rounds: EntityTable<Round, "id">;
  holes: EntityTable<Hole, "id">;
  clubs: EntityTable<Club, "id">;
};

db.version(1).stores({
  rounds: "++id, courseName, courseRating, courseSlope, tees, date, inProgress",
  holes:
    "id, roundNumber, par, strokes, score, fairway, green, putts",
  clubs: "++id, name, loft, distance",
});

export { db };
