export interface Question {
  id: string;
  label: string;
  description: string;
  lowLabel: string;
  highLabel: string;
}

export const questions: Question[] = [
  {
    id: "mentalDemand",
    label: "Mental Demand",
    description:
      "How much thinking, deciding, calculating, remembering, and searching did your work require?",
    lowLabel: "Low",
    highLabel: "High",
  },
  {
    id: "temporalDemand",
    label: "Temporal Demand",
    description:
      "How rushed did you feel? Was the pace slow and leisurely, or rapid and frantic?",
    lowLabel: "Low",
    highLabel: "High",
  },
  {
    id: "performance",
    label: "Performance",
    description:
      "How successful do you think you were in accomplishing your work goals? How satisfied are you with your performance?",
    lowLabel: "Good",
    highLabel: "Poor",
  },
  {
    id: "effort",
    label: "Effort",
    description:
      "How hard did you have to work to accomplish your level of performance?",
    lowLabel: "Low",
    highLabel: "High",
  },
  {
    id: "frustration",
    label: "Frustration",
    description:
      "How stressed, irritated, discouraged, and annoyed did you feel — versus relaxed and content?",
    lowLabel: "Low",
    highLabel: "High",
  },
  {
    id: "interruptionFrequency",
    label: "Interruption Frequency",
    description:
      "How often were you interrupted during focused work? (e.g., unexpected messages, meetings, people stopping by, notifications)",
    lowLabel: "Low",
    highLabel: "High",
  },
];
