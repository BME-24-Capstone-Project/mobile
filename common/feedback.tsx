export type Feedback = {
    feedback: number;
    error_mode: string;
    instructions: string;
    video_id: string;
}

export const FeedbackMappings: Feedback[] = [
    {
        feedback: 1,
        error_mode: "Great form!",
        instructions: "Keep up the good work.",
        video_id: "none"
    },
    {
        feedback: 2,
        error_mode: "Weight bearing asymmetry during sit-to-standb",
        instructions: "Keep your leg a little closer to your body while flexing your knee more during each sit-to-stand!",
        video_id: "none"
    },
    {
        feedback: 3,
        error_mode: "Increased trunk flexion during sit-to-stand",
        instructions: "Keep your trunk straight and try flexing your knee more during each sit-to-stand!",
        video_id: "none"
    },
    {
        feedback: 4,
        error_mode: "Increased medial acceleration of the knee during sit-to-stand",
        instructions: "Keep both knees from coming into contact with each other by pushing your knee out a little more while performing each sit-to-stand!",
        video_id: "none"
    },
    {
        feedback: 5,
        error_mode: "Increased lateral acceleration of the knee during sit-to-stand",
        instructions: "Keep your knee from bending outward by pushing your knee in a little more while performing each sit-to-stand!",
        video_id: "none"
    },
    {
        feedback: 6,
        error_mode: "Great form!",
        instructions: "Keep up the good work.",
        video_id: "none"
    },
    {
        feedback: 7,
        error_mode: "Reduction in knee flexion during one-legged stair climb",
        instructions: "Flex your knee more while reducing how much your trunk leans into each stair climb!",
        video_id: "none"
    },
    {
        feedback: 8,
        error_mode: "Increase in medial acceleration of the leg during one-legged stair climb",
        instructions: "Move your leg a little more laterally during each stair climb!",
        video_id: "none"
    },
    {
        feedback: 9,
        error_mode: "Increased sway during one-legged stair climb",
        instructions: "Flex your hip and knee more to move your leg, and decrease how much your trunk leans into each stair climb!",
        video_id: "none"
    },
]


// Sit-to-Stand:
// Mode 1: 20 sets, 10 reps normal = 200 reps total

// Mode 2: modeOfError: “Weight bearing asymmetry during sit-to-stand”
// Instruction: “Keep your leg a little closer to your body while flexing your knee more during each sit-to-stand!”

// Mode 3: modeOfError: “Increased trunk flexion during sit-to-stand”
// Instruction: “Keep your trunk straight and try flexing your knee more during each sit-to-stand!”

// Mode 4: modeOfError: “Increased medial acceleration of the knee during sit-to-stand”
// Instruction: “Keep both knees from coming into contact with each other by pushing your knee out a little more while performing each sit-to-stand!”

// Mode 5: modeOfError: “Increased lateral acceleration of the knee during sit-to-stand”
// Instruction: “Keep your knee from bending outward by pushing your knee in a little more while performing each sit-to-stand!”


// Stair Climb:
// Right up Right down
// Mode 6: 15 sets, 10 reps normal = 150 reps total

// Left up Left down
// Mode 7: modeOfError: “Reduction in knee flexion during one-legged stair climb”
// Instruction: “Flex your knee more while reducing how much your trunk leans into each stair climb!”

// Right up Right down
// Mode 8: modeOfError: “Increase in medial acceleration of the leg during one-legged stair climb”
// Instruction: “Move your leg a little more laterally during each stair climb!”

// Left up Left down
// Mode 9: modeOfError: “Increased sway during one-legged stair climb”
// Instruction: “Flex your hip and knee more to move your leg, and decrease how much your trunk leans into each stair climb!”
