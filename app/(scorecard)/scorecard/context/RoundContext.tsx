"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Round, Hole } from "@/lib/types";
import { saveRound } from "@/lib/db";

interface SaveRoundOptions {
    holeIndex?: number;
    holeData?: Partial<Hole>;
}

// RoundContext - Manages in-memory round state during scoring
// Provides methods to update holes and persist to IndexedDB
interface RoundContextType {
    currentRound: Round | null;
    setCurrentRound: (round: Round | null) => void;
    updateHole: (holeIndex: number, holeData: Partial<Hole>) => void;
    saveToDatabase: (options?: SaveRoundOptions) => Promise<void>;
    resetRound: () => void;
}

const RoundContext = createContext<RoundContextType | undefined>(undefined);

// RoundProvider - Wraps the app to provide round state
export function RoundProvider({ children }: { children: React.ReactNode }) {
    const [currentRound, setCurrentRound] = useState<Round | null>(null);

    // Update a specific hole's data
    // Merges new data with existing hole data
    const updateHole = useCallback((holeIndex: number, holeData: Partial<Hole>) => {
        setCurrentRound((prevRound) => {
            if (!prevRound) return null;

            const updatedHoles = [...prevRound.holes];
            updatedHoles[holeIndex] = {
                ...updatedHoles[holeIndex],
                ...holeData,
            };

            return {
                ...prevRound,
                holes: updatedHoles,
            };
        });
    }, []);

    // Save current round to IndexedDB, optionally applying one last hole update first.
    const saveToDatabase = useCallback(async (options?: SaveRoundOptions) => {
        if (!currentRound) {
            throw new Error("No round to save");
        }

        const updatedHoles = [...currentRound.holes];

        if (options?.holeIndex !== undefined && options.holeData) {
            updatedHoles[options.holeIndex] = {
                ...updatedHoles[options.holeIndex],
                ...options.holeData,
            };
        }

        const roundToSave: Round = {
            ...currentRound,
            holes: updatedHoles,
            completed: updatedHoles.every((hole) => hole.isComplete),
        };

        try {
            await saveRound(roundToSave);
            setCurrentRound(roundToSave);
        } catch (error) {
            console.error("Failed to save round:", error);
            throw error;
        }
    }, [currentRound]);

    // Reset current round (clears context)
    const resetRound = useCallback(() => {
        setCurrentRound(null);
    }, []);

    const value: RoundContextType = {
        currentRound,
        setCurrentRound,
        updateHole,
        saveToDatabase,
        resetRound,
    };

    return <RoundContext.Provider value={value}>{children}</RoundContext.Provider>;
}

// Custom hook to use RoundContext
// Must be called within RoundProvider
export function useRound(): RoundContextType {
    const context = useContext(RoundContext);

    if (!context) {
        throw new Error("useRound must be used within RoundProvider");
    }

    return context;
}
