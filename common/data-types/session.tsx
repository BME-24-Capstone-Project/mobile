type Session = {
    id: string;
    patient_id: string;
    patient: User;
    start_time: string;
    end_time: string;
    complete: string;
};

type CurrentSetAndSessionData = {
    assigned_exercise: AssignedExercise;
    completed_exercise_sets: number;
    completed_session_sets: number;
    total_session_sets: number;
};

type Feedback = {
    error_mode: string;
    instructions: string;
}