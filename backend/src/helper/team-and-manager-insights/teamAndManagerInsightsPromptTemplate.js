export const getTeamAndManagerInsightsPrompt = (managerScores, teamScores) => {
  return `Assume you are an expert leadership and team coach. Your task is to analyze feedback from a manager and their team to generate actionable insights.

You will be provided with two JSON objects:
1. manager_assessment_input_actual: The manager's self-assessment scores on various leadership competencies / categories.
2. team_feedback_input_actual: An array of feedback from team members, including their scores for the manager on the same competencies / categories.

manager_assessment_input_template: This is the JSON template that captures the input from the manager for the strings mentioned inside the template. Please parse the JSON template properly and use it to build the context for the actual input mentioned in section "manager_assessment_input_actual"

The description and instructions of each field, its type and content is provided after a // delimiter

{
  "Communication & Clarity": { //These are the group of questions that are captured from the manager to understand how they make Communication & Clarity. Each of the questions under this grouping is answered on a scale of 1 - 5 (1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 Strongly Agree). Each question in this template is represented as an N which will be between 1 and 5
        
    "clearLongTermVision": N, // The question is: "I frequently communicate a clear, long-term vision." 
    "focusShortTermTasks": N, // The question is: "I focus more on short-term tasks than strategic goals." 
    "preferTestedApproaches": N, // The question is: "I prefer tried-and-tested approaches over experimentation." 
  },
  "Support & Development": { //These are the group of questions that are captured from the manager to understand their levels of Support & Development. Each of the questions under this grouping is answered on a scale of 1 - 5 (1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 Strongly Agree) Each question in this template is represented as an N which will be between 1 and 5
        
    "mentorOrCoachTeam": N, // The question is: "I actively mentor or coach members of my team."
    "createGrowthOpportunities": N, // The question is: "I design opportunities for others to grow and stretch."
    "helpOthersRealizePotential": N, // The question is: "I feel energized by helping others realize their potential."
    "adjustToTeamsEmotionalState": N // The question is: "I often tune into my team’s emotional state and adjust accordingly."
  },
  "Decision-Making & Fairness": { //These are the group of questions that are captured from the manager to understand their skills and directions on Decision-Making & Fairness. Each of the questions under this grouping is answered on a scale of 1 - 5 (1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 Strongly Agree). Each question in this template is represented as an N which will be between 1 and 5
        
    "makeIndependentDecisions": N, // The question is: "I prefer to make decisions independently without consulting others."
    "seekTeamInputBeforeDeciding": N, // The question is: "I regularly seek team input before making final decisions."
    "struggleWithDelegation": N, // The question is: "I struggle to delegate important responsibilities."
    "prioritizeResultsOverRelationships": N // The question is: "I prioritize results over relationships when needed."
    "stayCalmDuringConflict": N // The question is: "I stay calm and composed during conflict."
  },
  "Recognition & Team Culture": { //These are the group of questions that are captured from the manager to understand how they Recognition & Team Culture. Each of the questions under this grouping is answered on a scale of 1 - 5 (1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 Strongly Agree). Each question in this template is represented as an N which will be between 1 and 5
    "giveConstructiveFeedbackWithEmpathy": N, // The question is: "I give regular, constructive feedback with empathy."
    "influenceWithoutAuthority": N, // The question is: "I can influence others even without formal authority."
    "preferStructuredLeadershipRoutines": N, // The question is: "I prefer structured, consistent leadership routines."
  },
 "Empowerment & Motivation": { //These are the group of questions that are captured from the manager to understand how they Empowerment & Motivation for the team. Each of the questions under this grouping is answered on a scale of 1 - 5 (1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 Strongly Agree). Each question in this template is represented as an N which will be between 1 and 5
    "delegateAndTrustOthers": N, // The question is: "I enjoy delegating tasks and trust others to handle them."
    "encourageInnovationWithRisk": N, // The question is: "I encourage innovation even when it involves risk."
    "problemSolverRatherThanEnabler": N, // The question is: "I often find myself solving problems rather than enabling others."
    "adjustLeadershipBasedOnTeam": N // The question is: "I can change my leadership approach based on who I'm working with."
    "adaptEasilyToUnexpectedChanges": N // The question is: "I adapt easily when things don’t go as planned."
  }
}

manager_assessment_input_actual: This is the JSON input that we have received from the Manager.
${JSON.stringify(managerScores, null, 2)}

team_feedback_input_template: This is the JSON template that which is an array of objects representing the feedback given by multiple team members to their manager. Each team member has responded to multiple questions categorized under different leadership dimensions. Your task is to parse the input, extract the text of the questions, category, and the score (response), and structure it accordingly for analysis and use it to build the context for the actual input mentioned in section "team_feedback_input_actual"

The description and instructions of each field, its type and content is provided after a // delimiter

team_feedback_input_template:
[
  {
    "teamMember": "team-member-1", // The unique identifier for each team member.
    "ratingQuestions": [
      {
        "category": "Communication & Clarity", // Leadership category maps to the key in manager_assessment_input_actual: ("Communication & Clarity")
        "text": // This is a string which is the question asked to the team member based on category - "Communication & Clarity" - the category string maps to the key in manager_assessment_input_actual.
        "response": N // Numerical response score (integer between 1-5).
      },
      {
        "category": "Support & Development", // Leadership category maps to the key in manager_assessment_input_actual: ("Support & Development")
        "text": // This is a string which is the question asked to the team member based on category - "Support & Development" - the category string maps to the key in manager_assessment_input_actual.
        "response": N // Numerical response score (integer between 1-5).
      },
      {
        "category": "Decision-Making & Fairness", // Leadership category maps to the key in manager_assessment_input_actual: ("Decision-Making & Fairness")
        "text": // This is a string which is the question asked to the team member based on category - "Decision-Making & Fairness" - the category string maps to the key in manager_assessment_input_actual.
        "response": N // Numerical response score (integer between 1-5).
      },
      {
        "category": "Recognition & Team Culture", // Leadership category maps to the key in manager_assessment_input_actual: ("Recognition & Team Culture")
        "text":  // This is a string which is the question asked to the team member based on category - "Recognition & Team Culture" - the category string maps to the key in manager_assessment_input_actual.
        "response": N // Numerical response score (integer between 1-5).
      },
      {
        "category": "Empowerment & Motivation", // Leadership category maps to the key in manager_assessment_input_actual: ("Empowerment & Motivation")
        "text":  // This is a string which is the question asked to the team member based on category - "Empowerment & Motivation" - the category string maps to the key in manager_assessment_input_actual.
        "response": N // Numerical response score (integer between 1-5).
      }
    ]
  }
]

team_feedback_input_actual: This is the JSON input that we have received from the Team Members.
${JSON.stringify(teamScores, null, 2)}

Based on the provided manager self-assessment(manager_assessment_input_actual) and team feedback data(team_feedback_input_actual), generate a detailed analysis in JSON format. The JSON object must contain two keys: "insightsFromTeamToManager" and "managerInsights".

**Instructions for "insightsFromTeamToManager":**
- **Analyze Team Feedback**: Synthesize the collective scores from team_feedback_input_actual. Identify patterns, consensus, and significant deviations in how team members perceive their manager across the five leadership categories.
- **Identify Gaps**: Critically compare the team's average scores in each category with the manager's self-assessment scores from manager_assessment_input_actual. Pinpoint the most significant "Perception Gaps" (where manager and team views differ) and "Shared Views" (where they align).
- **Generate Actionable Insights**: Formulate a comprehensive, analytical narrative of upto 300 words. This text should be a cohesive report for the manager, explaining the team's perspective. It must be direct, constructive, and data-driven. Use phrases like "Your team's feedback indicates...", "A notable perception gap appears in...", "An area of alignment is...". The goal is to provide deep insights that foster understanding and drive improvement in team dynamics. Do not just list points; weave them into a coherent analysis.

**Instructions for "managerInsights":**
- **Analyze Manager's Self-Perception**: Deeply analyze the manager's self-assessment scores from manager_assessment_input_actual.
- **Craft a Reflective Narrative**: Generate a reflective, first-person narrative of upto 300 words, as if the manager is interpreting their own results. It should articulate what the manager believes their strengths and development areas are, based **ONLY** on their own scores. Use phrases like "Based on my self-assessment, I see that my strength lies in...", "I perceive a development opportunity for myself in...", "My scores suggest that I am confident in my ability to...".
- **Maintain a Self-Reflective Tone**: The tone should be introspective. This section is about the manager's view of themself, *before* considering the team's feedback.

**Output Format Requirements:**
- The final output MUST be a single, valid JSON object as defined in TEAM-AND-MANAGER-INSIGHTS-RESPONSE-TEMPLATE. Adhere strictly to the TEAM-AND-MANAGER-INSIGHTS-RESPONSE-TEMPLATE.
- Both insightsFromTeamToManager and managerInsights must be array of objects containing detailed category-wise insights

TEAM-AND-MANAGER-INSIGHTS-RESPONSE-TEMPLATE:

The description and instructions of each field, its type and content is provided after a // delimiter
{
  "insightsFromTeamToManager": [
    {
      category: "Communication & Clarity", // This is the category of the insights
      insights: "" // Provide 2-3 concise feedback points from the team's perspective about Communication & Clarity. Keep it brief, clear, and actionable.
    }, 
    {
      category: "Support & Development", // This is the category of the insights
      insights: "" // Provide 2-3 concise feedback points from the team's perspective about Support & Development. Focus on mentoring, empathy, and emotional support.
    }, 
    {
      category: "Decision-Making & Fairness", // This is the category of the insights
      insights: "" // Provide 2-3 concise feedback points from the team's perspective about Decision-Making & Fairness. Include fairness, involving team in decisions, and delegation.
    },
    {
    
      category: "Recognition & Team Culture", // This is the category of the insights
      insights: "" // Provide 2-3 concise feedback points from the team's perspective about Recognition & Team Culture. Focus on appreciation, flexibility, and adapting to individuals.
    },
    {
      category: "Empowerment & Motivation", // This is the category of the insights
      insights: "" // Provide 2-3 concise feedback points from the team's perspective about Empowerment & Motivation. Focus on delegation, trust, and enabling others.
    }
  ],
  "managerInsights": [
    {
      category: "Communication & Clarity", // This is the category of the insights
      insights:  "" // Manager's 2-3 concise self-reflection points about Communication & Clarity. Balance strengths and areas to improve.
    },
    {
      category: "Support & Development", // This is the category of the insights
      insights: "" // Manager's 2-3 concise self-reflection points about Support & Development. Highlight mentoring, empathy, and emotional awareness.
    }, 
    {
      category: "Decision-Making & Fairness", // This is the category of the insights
      insights: "" // Manager's 2-3 concise self-reflection points about Decision-Making & Fairness. Mention independent decisions vs involving team.
    },
    {
      category: "Recognition & Team Culture", // This is the category of the insights
      insights: "" // Manager's 2-3 concise self-reflection points about Recognition & Team Culture. Focus on feedback, flexibility, and team dynamics.
    }, 
    {
      category: "Empowerment & Motivation", // This is the category of the insights
      insights: "" // Manager's 2-3 concise self-reflection points about Empowerment & Motivation. Mention delegation, enabling others, and adapting leadership style.
    }
  ]
}

Now, generate the response based on the actual data provided.`.trim();
};
