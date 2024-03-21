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
        video_id: ""
    },
    {
        feedback: 2,
        error_mode: "Weight Bearing Asymmetry",
        instructions: "Bring your leg closer to your body, so that both legs are in the same position.",
        video_id: "ZSg09YXn8fc"
    },
    {
        feedback: 3,
        error_mode: "Increased Trunk Flexion",
        instructions: "Lean forward less as you stand up, and focus on using your muscles in your legs.",
        video_id: "Ct77FaYzoiA"
    },
    {
        feedback: 4,
        error_mode: "Medial Tilt",
        instructions: "Focus on keeping your knees apart as you stand up and sit down.",
        video_id: "RaseRDOEaUA"
    },
    {
        feedback: 5,
        error_mode: "Lateral Tilt",
        instructions: "Focus on not letting your knees stray too far apart as you stand up and sit down.",
        video_id: "S-9b-7vCgxc"
    },
    {
        feedback: 6,
        error_mode: "Great form!",
        instructions: "Keep up the good work.",
        video_id: ""
    },
    {
        feedback: 7,
        error_mode: "Weight bearing asymmetry",
        instructions: "Focus on learning forward less during your step up, and place more weight on your injured leg.",
        video_id: "V_7n9epP6ZM"
    },
    {
        feedback: 8,
        error_mode: "Medial Tilt",
        instructions: "Focus on stepping up evenly and distribute your weight onto both legs.",
        video_id: "ARESF6L6Qrg"
    },
    {
        feedback: 9,
        error_mode: "Hip sway",
        instructions: "Focus on applying weight onto your injured leg, and swing your hips less as you step up.",
        video_id: "wVFzSP0cGH8"
    },
]
