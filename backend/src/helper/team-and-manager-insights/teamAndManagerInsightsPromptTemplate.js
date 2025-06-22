export const getTeamAndManagerInsightsPrompt = (managerScores, teamScores) => {
  return `Assume you are an expert leadership and team coach. Your task is to analyze feedback from a manager and their team to generate actionable insights.

You will be provided with two JSON objects:
1. \`manager_assessment\`: The manager's self-assessment scores on various leadership competencies.
2. \`team_feedback\`: An array of feedback from team members, including their scores for the manager on the same competencies.

Based on this data, please generate a JSON object with two keys: \`insightsForTeam\` and \`reflectionsForManager\`.

- \`insightsForTeam\`: Provide actionable advice for the team based on their collective feedback. Focus on areas where there are significant gaps between the manager's perception and the team's experience, as well as areas of shared agreement. The tone should be constructive and aimed at improving team dynamics and performance.
- \`reflectionsForManager\`: Provide direct, candid reflections for the manager. Highlight blind spots, areas for development, and strengths to leverage. The tone should be that of a trusted coach, encouraging self-awareness and growth.

The response should be in the format shown in "insights_and_reflections_report_template". The output MUST ONLY BE A JSON and nothing more than that. The JSON should not be in a markdown block.

manager_assessment_template:
{
  "sections": {
    "leadership": {
      "CommunicationClarity": {
        "clearLongTermVision": 5,
        "focusShortTermTasks": 2,
        "preferTestedApproaches": 3
      },
      "SupportDevelopment": {
        "mentorOrCoachTeam": 4,
        "createGrowthOpportunities": 5,
        "helpOthersRealizePotential": 5,
        "adjustToTeamsEmotionalState": 4
      },
      "DecisionMakingFairness": {
        "makeIndependentDecisions": 2,
        "seekTeamInputBeforeDeciding": 5,
        "struggleWithDelegation": 1,
        "prioritizeResultsOverRelationships": 3,
        "stayCalmDuringConflict": 4
      },
      "RecognitionTeamCulture": {
        "giveConstructiveFeedbackWithEmpathy": 5,
        "influenceWithoutAuthority": 4,
        "preferStructuredLeadershipRoutines": 3
      },
      "EmpowermentMotivation": {
        "delegateAndTrustOthers": 5,
        "encourageInnovationWithRisk": 4,
        "problemSolverRatherThanEnabler": 2,
        "adjustLeadershipBasedOnTeam": 4,
        "adaptEasilyToUnexpectedChanges": 5
      }
    }
  }
}

team_feedback_template:
[
  {
    "teamMember": "team-member-1",
    "ratingQuestions": [
      { "category": "Communication & Clarity", "text": "I frequently communicate a clear, long-term vision.", "response": 4 },
      { "category": "Support & Development", "text": "I actively mentor or coach members of my team.", "response": 3 }
    ]
  }
]

The category in \`team_feedback_template\` ("Communication & Clarity") maps to the key in \`manager_assessment_template\` (\`CommunicationClarity\`). Please use this mapping to compare the scores.

insights_and_reflections_report_template:
{
  "insightsForTeam": [
    "Major gap in perceived communication—ask the team for feedback on clarity after meetings.",
    "Team feels under-supported—run a needs assessment to uncover missed development opportunities.",
    "Low fairness score—consider implementing a transparent decision-making process.",
    "Strong culture & recognition perception—leverage this to improve other areas.",
    "High motivation from team—delegate more to reinforce trust and ownership."
  ],
  "reflectionsForManager": [
    "Check assumptions—where you rated high but team did not, seek candid feedback.",
    "Use anonymous surveys to understand team sentiment trends.",
    "Prioritize 1-1s for underperforming areas and co-create improvement plans.",
    "Facilitate roundtables to understand fairness issues in decisions.",
    "Recognize positive feedback areas and celebrate with the team."
  ]
}

Here is the actual data:

manager_assessment:
${JSON.stringify(managerScores, null, 2)}

team_feedback:
${JSON.stringify(teamScores, null, 2)}

Please provide the insights and reflections report based on the provided data.
`.trim();
}; 