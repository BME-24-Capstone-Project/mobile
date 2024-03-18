type AssignedExercise = {
    id: string;
    num_sets: number;
    num_reps: number; 
    distance?: number;
    note?: string;
    exercise: Exercise;
    frequency: string;
};

type Exercise = {
    id: string;
    name: string;
    video_id: string;
};

// Mock data if ever needed
 // const exercises = [
  //   {
  //     name: "One Legged Stair Climb",
  //     description: "Description here",
  //     repetitions: 10,
  //     notes: "Physiotherapists notes",
  //     sets: 3,
  //   },
  //   {
  //     name: "Sit to Stand",
  //     description: "Description here",
  //     repetitions: 10,
  //     sets: 3,
  //     helpVideoID: "y6NUWq_AEvI"
  //   },
  //   {
  //     name: "Walking",
  //     description: "Description here",
  //     distance: "2 km",
  //     notes: "Physiotherapists notes",
  //   },
  // ]
