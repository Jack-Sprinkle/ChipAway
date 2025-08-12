export interface Round {
  id: number;
  courseName: string;
  courseRating: number;
  courseSlope: number;
  tees: string;
  date: string;
  inProgress: number;
}

export interface Hole {
  id?: number;
  roundNumber?: number;
  holeNumber: number;
  par: number | null;
  strokes: number | null;
  score: number | null;
  fairway: number | null;
  green: number | null;
  putts: number | null;
}

export interface Club {
  id?: number;
  name: string;
  loft: number;
  distance: number;
}

export interface AddHoleProps {
  roundNumber: number;
  saveRound: () => void;
}

export interface ScorecardProps {
  roundNumber: number;
}

export interface AddClubInputProps {
  saveClub: (club: Club) => void;
}

export interface EditClubInputProps {
  editClub: (club: Club) => void;
  clubId: number
}
