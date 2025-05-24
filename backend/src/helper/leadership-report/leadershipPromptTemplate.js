export const getLeadershipPrompt = (inputJson) => {
    return `Assume that you are a Leadership Coach and are an expert at evaluating and providing a managers DISC profile based on inputs.

Hence, can you please help provide a Leadership Assessment report in the JSON format "leadership_assessment_report_template" given below for the JSON input as defined in "leadership_assessment_input_template".

For generating the output based on leadership_assessment_report_template, please generate it in *EXACTLY* and *ABSOLUTELY* the same format as it is defined in the template. The output MUST ONLY BE A JSON and nothing more than that.

Also, the actual input is given in "leadership_assessment_input_actual" JSON structure as mentioned in the section below.

leadership_assessment_input_template: This is the JSON template that captures the input from the user for the strings mentioned inside the template. Please parse the JSON template properly and use it to build the context for the actual input mentioned in section "leadership_assessment_input_actual"

The description and instructions of each field, its type and content is provided after a // delimiter

{
  "meta": //You can ignore this field as this is not part of the context you should add for generating output
  "sections": {
    "leadership": {
      "DecisionMakingDelegation": { //These are the group of questions that are captured from the manager to understand how they make decision and how they delegate. Each of the questions under this grouping is answered on a scale of 1 - 5 (1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 Strongly Agree). Each question in this template is represented as an N which will be between 1 and 5

        "independentDecisions": N, // The question is: "I prefer to make decisions independently without consulting others" 
        "seekTeamInput": N, // The question is: "I regularly seek team input before making final decisions." 
        "delegateTasks": N, // The question is: "I enjoy delegating tasks and trust others to handle them." 
        "struggleDelegation": N // The question is: "I struggle to delegate important responsibilities." 
      },
      "EmotionalIntelligenceEmpathy": { //These are the group of questions that are captured from the manager to understand their levels of Emotional Intelligence & Empathy. Each of the questions under this grouping is answered on a scale of 1 - 5 (1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 Strongly Agree) Each question in this template is represented as an N which will be between 1 and 5
        "tuneIntoTeam": N, // The question is: I often tune into my team’s emotional state and adjust accordingly.
        "constructiveFeedback": N, // The question is: I give regular, constructive feedback with empathy.
        "resultsOverRelationships": N, // The question is: I prioritize results over relationships when needed.
        "stayCalmInConflict": N // The question is: I stay calm and composed during conflict.
      },
      "VisionStrategy": { //These are the group of questions that are captured from the manager to understand their skills and directions on Vision and Strategy. Each of the questions under this grouping is answered on a scale of 1 - 5 (1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 Strongly Agree). Each question in this template is represented as an N which will be between 1 and 5
        "communicateVision": N, // The question is: I frequently communicate a clear, long-term vision.
        "shortTermFocus": N, // The question is: I focus more on short-term tasks than strategic goals.
        "encourageInnovation": N, // The question is: I encourage innovation even when it involves risk.
        "preferTestedApproaches": N // The question is: I prefer tried-and-tested approaches over experimentation.
      },
      "TeamDevelopmentCoaching": { //These are the group of questions that are captured from the manager to understand how they develop their team and how they coach their team. Each of the questions under this grouping is answered on a scale of 1 - 5 (1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 Strongly Agree). Each question in this template is represented as an N which will be between 1 and 5
        "mentoring": N, // The question is: I actively mentor or coach members of my team.
        "designGrowthOpportunities": N, // The question is:  I design opportunities for others to grow and stretch.
        "energizedByHelping": N, // The question is: I am energized by helping others realize their potential.
        "solveInsteadEnable": N // The question is: I often find myself solving problems rather than enabling others.
      },
      "AdaptabilityInfluence": { //These are the group of questions that are captured from the manager to understand how they adapt to situations and also how they are able to influence their team and leadership. Each of the questions under this grouping is answered on a scale of 1 - 5 (1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 Strongly Agree). Each question in this template is represented as an N which will be between 1 and 5
        "changeApproach": N, // The question is: I change my leadership approach based on who I’m working with.
        "influenceWithoutAuthority": N, // The question is: I can influence others even without formal authority.
        "adaptToChange": N, // The question is: I adapt quickly when things don’t go as planned.
        "preferStructure": N // The question is: I prefer a structured, consistent leadership routine.
      }
    },
    "roleInfo": {
      "role": "", // This is the designation that they have and could be a Manager, Sr. Manager, Director, VP, CXO, etc and hence the responses to the SWOT assessment should factor this in as each level would need a different set of directions
      "teamSize": "", // This is a span of control that the manager has and is a range value and hence the responses to the SWOT assessment should factor this in as each level would need a different set of directions
      "industry": "", // This is the industry that they belong to and hence the responses to the SWOT assessment should factor this in as each level would need a different set of directions
      "challenges": [
        //These are challenges that the manager has entered into the App as the challenges that they face and hence the responses to the SWOT assessment should factor this in as each level would need a different set of directions. Please do not hesitate to call them out as part of SWOT if need be and provide proper examples for your answers. This is an array and each element is one of the problem areas that they have.
      ]
    },
    "psychographic": {
      "learningStyle": [// This is an array and has the learning styles of the manager such as On Demand, etc],
      "coachingTone": [// This is the tone that the manager is requesting that the AI Coach has and hence provide the SWOT analysis using this tone]
    }
  }
}


leadership_assessment_input_actual: This is the JSON input that we have received from the App and is filled by the manager.

${JSON.stringify(inputJson, null, 2)}

leadership_assessment_report_template: this is the template that I expect as the output from you the Leadership Coach.

{
  "persona": [{
    "id": //This should be either "Visionary", "Coaching", "Democratic", "Affiliative", "Directive",
    "label": //This should be either "Visionary", "Coaching", "Democratic", "Affiliative", "Directive" and is derived from the input of leadership assessment provided in "leadership_assessment_input_template"
    "summary": "" // For this, Provide a 80-100 word text explaining what the leadership type and persona.
  },],
  "insights": {
    "strengths": [
      // This is an array of text to summarize the strengths based on the assessment you would perform from the input "leadership_assessment_input_template" - please ONLY mention a max of 5 strentghs and the most prominant ones. Please respect the user's choice of tone from coach as provided in the input "leadership_assessment_input_template"
    ],
    "weaknesses": [
      // This is an array of text to summarize the weakness based on the assessment you would perform from the input "leadership_assessment_input_template" - please ONLY mention a max of 5 weakness and the most prominant ones. Please respect the user's choice of tone from coach as provided in the input "leadership_assessment_input_template"
    ],
    "opportunities": [
      // This is an array of text to summarize the opportunities based on the assessment you would perform from the input "leadership_assessment_input_template" - please ONLY mention a max of 5 opportunities and the most prominant ones. Please respect the user's choice of tone from coach as provided in the input "leadership_assessment_input_template"
    ],
    "threats": [
      // This is an array of text to summarize the threats based on the assessment you would perform from the input "leadership_assessment_input_template" - please ONLY mention a max of 5 threats and the most prominant ones. Please respect the user's choice of tone from coach as provided in the input "leadership_assessment_input_template"
    ]
  },
  "recommendations": {
    "do-more": // This is a string format. Based on the leadership assessment, provide a single line summary of an actionable insight that the manager should continue doing and provide an example of how. Keep in mind the preference for coaching tone.
    "do-less": // This is a string format. Based on the leadership assessment, provide a single line summary of an actionable insight that the manager should do less of and provide an example of what. Keep in mind the preference for coaching tone
    "start": // This is a string format. Based on the leadership assessment, provide a single line summary of an actionable insight that the manager should start doing and provide an example of how. Keep in mind the preference for coaching tone
    "stop": // This is a string format. Based on the leadership assessment, provide a single line summary of an actionable insight that the manager should stop doing and provide an example of how. Keep in mind the preference for coaching tone
  }
}`.trim();
};