type AssignedExercise = {
    num_sets: number;
    num_reps: number; 
    distance?: number;
    note?: string;
    exercise: Exercise;
    frequency: string;

};

type Exercise = {
    name: string;
    video_id: string;
};
