// Core types for ChipAway golf scoring app

export interface Hole {
    holeNumber: number; // 1-18
    parValue?: number; // Par value (entered by user during scoring)
    score?: number; // Strokes taken (entered by user during scoring)
    putts?: number; // Number of putts (entered by user during scoring)
	fairway?: number; // unfortunately can't calculate fairways hit w/out user input...sad
    isComplete: boolean; // Marker for hole being complete to track ongoing round
}

export interface Round {
    id: string; // Unique identifier (timestamp-based)
    courseName: string; // Name of the course
    courseRating: number; // Rating of the course
    courseSlope: number; // Slope of the course
    date: number; // Timestamp when round was started
    holes: Hole[]; // Array of 18 holes
    completed: boolean; // Whether the full 18 holes have been scored
}

export type PracticeContact = "fat" | "thin" | "good";
export type PracticeDirection = "left" | "right" | "straight";

export interface PracticeShot {
    id: string;
    club: string;
    contact: PracticeContact;
    startDirection: PracticeDirection;
    curve: PracticeDirection;
    recordedAt: number;
}

export interface PracticeSession {
    id: string;
    startedAt: number;
    endedAt?: number;
    shots: PracticeShot[];
}

export interface ScoringStats {
    threePuttPercentage: number | null;
    GIRPercentage: number | null;
	scramblingPercentage: number | null;
	fairwayPercentage: number | null;
    threePuttHoles: number;
    GIRHoles: number;
	scramblingHoles: number;
    eligibleHoles: number;
	scramblingEligibleHoles: number;
	fairwayEligibleHoles: number;
	fairwaysHit: number | null;
}
