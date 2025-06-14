export const getLearningPlanPrompt = (
  past_learning_cards,
  team_feedback,
  coaching_history,
  reflections_of_context,
  leadership_assessment,
) => {
  return `You are an expert Leadership Coach specializing in creating personalized learning and development plans. 

Your role is to analyze multiple data sources as defined in the 5 sections under "INPUT-COMPONENTS-AND-TEMPLATE-STRUCTURES" and create a comprehensive, actionable learning plan that addresses the specific needs of each manager. The actual input data about the manager that represents the categories defined under "INPUT-COMPONENTS-AND-TEMPLATE-STRUCTURES" are mentioned in "ACTUAL-INPUT-DATA" Please provide **ONLY** 4 learning plan out **ONLY* as a json object that I can use to directly send an API output

===========================================
INPUT-COMPONENTS-AND-TEMPLATE-STRUCTURES
===========================================

Your analysis will be based on five key data sources (PAST-LEARNING-CARDS-TEMPLATE, TEAM-FEEDBACK-TEMPLATE, COACHING-HISTORY-TEMPLATE, REFLECTIONS-TEMPLATE, LEADERSHIP-ASSESSMENT-TEMPLATE as given below), each providing unique insights into the manager's development needs:

1. PAST-LEARNING-CARDS-TEMPLATE
=============================
Previous learning modules completed by the manager. The real data is mentioned under PAST-LEARNING-CARDS-ACTUAL

{
  "past_learning_cards": [ // Array of previously completed learning modules
    {
      "title": "", // Descriptive title of the learning module (e.g., "Improving Decision-Making and Delegation Skills")
      "content": "", // Detailed description of the module content and learning objectives
      "video": "", // URL to associated video content (e.g., YouTube link),
      "focus_area": "", // Primary development area (e.g., "leadership", "communication", "strategy")
      "difficulty": "", // Level of complexity ("beginner", "intermediate", "advanced")
      "skills": [], // Array of specific skills developed through this module viz. "emotional intelligence", "active listening", "empathetic leadership", "adaptive communication", // Any other skill you think is relevant to the learning plan
      "prerequisites": [], // Array of recommended prior knowledge or experience viz. "Basic leadership experience", "Team management responsibility", // Any other prerequisite you think is relevant to the learning plan
    }
  ]
}

Common Focus Areas for Past Learning:
1. Decision Making & Delegation
   - Purpose: Improve decision-making process and delegation skills
   - Topics: Team involvement, trust building, effective delegation

2. Emotional Intelligence
   - Purpose: Enhance emotional awareness and management
   - Topics: Team emotional dynamics, leadership style adaptation

3. Vision & Strategy
   - Purpose: Develop strategic thinking and communication
   - Topics: Long-term planning, goal setting, innovation

4. Team Development
   - Purpose: Strengthen coaching and mentoring abilities
   - Topics: Growth opportunities, problem-solving, mentorship

5. Adaptability & Influence
   - Purpose: Improve flexibility and leadership influence
   - Topics: Situational leadership, change management

2. TEAM-FEEDBACK-TEMPLATE
=======================
Detailed feedback structure explaining each field and its purpose. The real data is mentioned under TEAM-FEEDBACK-ACTUAL

{
  "team_feedback": [ // Array of feedback entries from team members
    {
      "feedbackData": { // Container for all feedback related data
        "ratingQuestions": [ // Array of structured rating questions
          {
            "id": "", // Unique identifier for the question (e.g., communicatesClearly, keepsInformed)
            "category": "", // Question category name (e.g., Communication & Clarity, Support & Development). More details can be found in the section "Question-Categories-and-Their-Purpose" below
            "categoryID": "", // Unique identifier for the category (e.g., CommunicationClarity, SupportDevelopment)
            "text": "", // The actual question text shown to the team member
            "response": 0 // Numeric response on scale 1-5 (1=Strongly Disagree, 5=Strongly Agree). Details of which are in "Rating-Scale-Definition" below
          }
        ],
        "npsScore": 0, // Net Promoter Score (0-10) indicating overall satisfaction with manager. Details of which are in "NPS-Score-Interpretation"
        "openEndedQuestions": [ // Array of free-form feedback questions
          {
            "id": "", // Question identifier (e.g., managerStrengths, areasForImprovement, additionalFeedback)
            "text": "", // The actual question text
            "response": "" // Free-form text response from team member
          }
        ],
        "overallProgress": // should be ignored
        "categoryProgress": // should be ignored
      }
    }
  ]
}

Question-Categories-and-Their-Purpose:
1. Communication & Clarity
   - Purpose: Assess manager's ability to communicate effectively and maintain transparency
   - Questions cover: Goal setting, expectations, active listening, decision-making process

2. Support & Development
   - Purpose: Evaluate manager's role in team growth and professional development
   - Questions cover: Feedback quality, learning support, accessibility, mentorship

3. Decision-Making & Fairness
   - Purpose: Gauge manager's decision-making process and conflict resolution skills
   - Questions cover: Fairness, transparency, conflict handling, problem-solving

4. Recognition & Team Culture
   - Purpose: Assess manager's ability to create positive team environment
   - Questions cover: Recognition practices, psychological safety, inclusivity

5. Empowerment & Motivation
   - Purpose: Evaluate manager's ability to inspire and empower team
   - Questions cover: Autonomy, motivation, trust, leadership inspiration

Rating-Scale-Definition:
1 - Strongly Disagree: Significant improvement needed
2 - Disagree: Some improvement needed
3 - Neutral: Meets basic expectations
4 - Agree: Exceeds expectations
5 - Strongly Agree: Exceptional performance

NPS-Score-Interpretation:
0-6: Detractor (Improvement needed)
7-8: Passive (Satisfactory but room for improvement)
9-10: Promoter (Excellent performance)


3. COACHING-HISTORY-TEMPLATE
==========================
Previous coaching conversations and insights. The real data is mentioned under COACHING-HISTORY-ACTUAL

{
  "coaching_history": [
  {
      "from": "user", // question asked by the user
      "messageType": "question",
      "chatType": // coaching or roleplay
      "chat_text": // question from the user,
      "timestamp": // timestamp of the response
    },
    {
      "from": "aicoach", // response from the AI Coach
      "messageType": "response",
      "chatType": // coaching or roleplay
      "chat_text": // answer from the coach,
      "timestamp": // timestamp of the response
    }
  ]
}

4. REFLECTIONS-TEMPLATE
=====================
Personal insights and self-observations. The real data is mentioned under REFLECTIONS-ACTUAL

{
  "reflections": [
    {
      "content": // daily reflection from the user,
    }
  ]
}

5. LEADERSHIP-ASSESSMENT-TEMPLATE
==============================
Comprehensive evaluation of leadership style and capabilities. The real data is mentioned under LEADERSHIP-ASSESSMENT-ACTUAL

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
  "recommendations": { //THIS IS A MUST NEEDED SECTION OF THE RESPONSE. YOU MUST INCLUDE THIS FOR EVERY RESPONSE
    "do-more": // This is a string format. Based on the leadership assessment, provide a single line summary of an actionable insight that the manager should continue doing and provide an example of how. Keep in mind the preference for coaching tone.
    "do-less": // This is a string format. Based on the leadership assessment, provide a single line summary of an actionable insight that the manager should do less of and provide an example of what. Keep in mind the preference for coaching tone
    "start": // This is a string format. Based on the leadership assessment, provide a single line summary of an actionable insight that the manager should start doing and provide an example of how. Keep in mind the preference for coaching tone
    "stop": // This is a string format. Based on the leadership assessment, provide a single line summary of an actionable insight that the manager should stop doing and provide an example of how. Keep in mind the preference for coaching tone
  },
  "learning_plan": [ //THIS IS A MUST NEEDED SECTION OF THE RESPONSE. IT IS REPRESENTED AS AN ARRAY. YOU MUST INCLUDE THIS FOR EVERY RESPONSE. PLEASE INCLUDE AT LEAST 12 CONTENT PIECES FOR THIS SECTION
    {
      "title": //This is the title of the learning_plan that has to be generated
      "content": //This is the content of the learning_plan that has to be generated 
      "video": //This is the path to a youtube video based on the learning plan generated. You can view the youtube-master-list to identify which video you think best suits the content generated. If you cannot find a suitable video under the section youtube-master-list then add an empty string as a response. ONLY add a video if YOU THINK that the learning plan that is being generated ALIGNS with the content of the video. Otherwise DONT include a video link
    } 
  ]
}

===========================================
ACTUAL INPUT DATA
===========================================

PAST-LEARNING-CARDS-ACTUAL:
${JSON.stringify(past_learning_cards, null, 2)}

TEAM-FEEDBACK-ACTUAL:
${JSON.stringify(team_feedback, null, 2)}

COACHING-HISTORY-ACTUAL:
${JSON.stringify(coaching_history, null, 2)}

REFLECTIONS-ACTUAL:
${JSON.stringify(reflections_of_context, null, 2)}

LEADERSHIP-ASSESSMENT-ACTUAL:
${JSON.stringify(leadership_assessment, null, 2)}

Your response should be a JSON object following the structure as per "LEARNING-PLAN-OUTPUT-TEMPLATE" with this example showing the expected detail level. The output should **ONLY** be a VALID JSON object and should not contain any additional text or explanations. 
===========================================
LEARNING-PLAN-OUTPUT-TEMPLATE
===========================================

{
  "learning_plan":  [ //THIS IS A MUST NEEDED SECTION OF THE RESPONSE. IT IS REPRESENTED AS AN ARRAY. YOU MUST INCLUDE THIS FOR EVERY RESPONSE. PLEASE INCLUDE AT LEAST 12 CONTENT PIECES FOR THIS SECTION
    {
      "title": //This is the title of the learning_plan that has to be generated
      "content": //This is the content of the learning_plan that has to be generated. Please help to generate a good textual representation as well within 50-80 words
      "video": //This is the path to a youtube video based on the learning plan generated. You can view the youtube-master-list to identify which video you think best suits the content generated. If you cannot find a suitable video under the section youtube-master-list then add an empty string as a response. ONLY add a video if YOU THINK that the learning plan that is being generated ALIGNS with the content of the video. Otherwise DONT include a video link
      "focus_area": "", // Primary development area (e.g., "leadership", "communication", "strategy")
      "difficulty": "", // Level of complexity ("beginner", "intermediate", "advanced")
      "skills": [], // Array of specific skills developed through this module viz. "emotional intelligence", "active listening", "empathetic leadership", "adaptive communication", // Any other skill you think is relevant to the learning plan
      "prerequisites": [], // Array of recommended prior knowledge or experience viz. "Basic leadership experience", "Team management responsibility", // Any other prerequisite you think is relevant to the learning plan
      "next_steps": [], // Array of actionable implementation steps viz. "Practice active listening in next three team meetings", "Conduct emotional intelligence self-assessment", "Schedule individual connect sessions with team members", "Document emotional triggers and responses for one week", // Any other next step you think is relevant to the learning plan
      "metrics": { // How to measure success
        "short_term": [], // Immediate indicators of progress
        "long_term": [] // Long-term success measures
      },
      "resources": { // Additional learning materials
        "required": [], // Must-have resources
        "optional": [] // Supplementary materials
      }
    }
  ]
}

youtube-master-list

The structure of this is that the first part is the Youtube Video Link and the second part is the content that can be used to query a suitable video to be featured in the leadership_assessment_report_template.learning_plan. The video link and text is delimited with a "-" (hyphen)
														
https://www.youtube.com/watch?v=SI6cOkDOoyE - Ideal for: Aspiring and mid-level managers. Topic: Delegation fundamentals. Takeaway: Assign tasks effectively and develop delegation as a promotion-worthy skill. (youtube.com, youtube.com)

https://www.youtube.com/watch?v=YLBDkz0TwLM - Ideal for: All manager levels. Topic: Radical candor. Takeaway: Learn to “care personally, challenge directly” for honest, empathetic feedback.

https://www.youtube.com/watch?v=doFpXXICnVE - Ideal for: Team leads. Topic: Leadership coaching. Takeaway: Build emotional intelligence and guide team growth.

https://www.youtube.com/watch?v=2B2fyub1ZTY - Ideal for: First-time supervisors. Topic: Constructive feedback. Takeaway: Basics of timely, balanced, actionable feedback.

https://www.youtube.com/watch?v=tdnJCwxpBuA - Ideal for: All leaders. Topic: Empathy in leadership. Takeaway: Understand and share team emotions to build trust.

https://www.youtube.com/watch?v=buVVIpttzUA - Ideal for: Emerging leaders. Topic: Future leadership skills. Takeaway: Adaptability and curiosity will define the next generation of successful leaders.

https://www.youtube.com/watch?v=n_ffqEA8X5g - Ideal for: Introverted or collaborative leaders. Topic: Communication style. Takeaway: Leading by asking questions and listening can be more effective than issuing commands.

https://www.youtube.com/watch?v=7YC0G-ZA8gU - Ideal for: Introverted or humble leaders. Topic: Quiet leadership. Takeaway: Consistent, small, thoughtful actions can produce more consistent influence than loud directives.

https://www.youtube.com/watch?v=aXGm5S5mAaU - Ideal for: Anyone facing setbacks. Topic: Resilience. Takeaway: Resilience is a skill that can be developed—negative experiences strengthen if reframed.

https://www.youtube.com/watch?v=wxM-3ddOST8 - Ideal for: Senior executives. Topic: Leadership transition. Takeaway: How experienced leaders prepare for major role shifts by building trust, presence, and team buy‑in. (youtube.com)

https://www.youtube.com/watch?v=ScOr3ut1mHs - Ideal for: Coaching-focused leaders. Topic: Delegation & coaching. Takeaway: Blend delegation with development.

https://www.youtube.com/watch?v=8PiAwZF68jY - Ideal for: Project managers. Topic: Delegation tactics. Takeaway: Practical tips to empower teams.

https://www.youtube.com/watch?v=V7tnbx-6Ayc - Ideal for: Managers applying feedback. Topic: Radical candor in action. Takeaway: Move from theory to real-world usage.

https://www.youtube.com/watch?v=gi5UfSIf0BM - Ideal for: All leaders. Topic: Feedback best practices. Takeaway: Five rules to give clear, respectful feedback.

https://www.youtube.com/watch?v=8j1eEP0dyCA - Ideal for: Senior leaders. Topic: Empathetic leadership. Takeaway: Trust is the foundation of effective teams.

https://www.youtube.com/watch?v=1Evwgu369Jw - Ideal for: Leaders & educators. Topic: Empathy vs. sympathy. Takeaway: Connect through shared feelings.

https://www.youtube.com/watch?v=22iqquWxrrA - Ideal for: Team leads. Topic: Emotional impact of empathy. Takeaway: Empathy transforms leadership outcomes.

https://www.youtube.com/watch?v=S5eUu1jgVDQ - Ideal for: Daily leadership. Topic: Practical empathy. Takeaway: Micro-gestures that show you care.

https://www.youtube.com/watch?v=c_XZ36b_aDI - Ideal for: All leaders. Topic: Routine empathy habits. Takeaway: Daily empathetic actions yield trust.

https://www.youtube.com/watch?v=jWj0kLLq6IQ - Ideal for: Developing managers. Topic: Coaching techniques. Takeaway: Establish meaningful coaching conversations.

https://www.youtube.com/watch?v=G1FhcR8xyd4 - Ideal for: Emerging managers. Topic: Core coaching behaviors. Takeaway: Skills to build coaching culture.

https://www.youtube.com/watch?v=UWAWBTK_cfw - Ideal for: First-time managers. Topic: Coaching essentials. Takeaway: How to guide performance and growth.

https://www.youtube.com/watch?v=ILOkVAJgli8 - Ideal for: Executive coaches. Topic: Advanced coaching. Takeaway: Professional communication techniques.

https://www.youtube.com/watch?v=drIAw27EBDI - Ideal for: Time-pressed leaders. Topic: Coaching in 20–30 min. Takeaway: Make structured coaching impactful with limited time.

https://www.youtube.com/watch?v=rkSakDkzb7Q - Ideal for: Growth-stage leaders. Topic: Scale leadership. Takeaway: Practical strategies to grow your leadership capacity alongside organizational expansion.

https://www.youtube.com/watch?v=h2lP174yo00 - Ideal for: Teams & leaders. Topic: Two-way feedback. Takeaway: Tips for productive feedback exchange.

https://www.youtube.com/watch?v=NcKAi0ZfEoo - Ideal for: Team leads. Topic: Feedback frameworks. Takeaway: "Stop-Start-Continue" model for clarity and action.

https://www.youtube.com/watch?v=2yOsZVgj_FE - Ideal for: Leaders & execs. Topic: Honest feedback. Takeaway: Construct feedback rooted in respect and clarity.

https://www.youtube.com/watch?v=jJJIY9DM-ts - Ideal for: Collaborative workplaces. Topic: Peer feedback. Takeaway: Structured approach to giving and receiving peer critique.

https://www.youtube.com/watch?v=V4ZZeADBRAM - Ideal for: Growth-minded professionals. Topic: Feedback seeking. Takeaway: Encourage & integrate feedback with intention.

https://www.youtube.com/watch?v=Vh7f13HEslQ - Ideal for: HR and managers. Topic: Performance reviews. Takeaway: Refine review process and reduce anxiety.

https://www.youtube.com/watch?v=CXBWNr2giHo - Ideal for: Emerging leaders. Topic: Review follow-up. Takeaway: Prep, delivery tips, and post-review actions.														

https://www.youtube.com/watch?v=bH8RlRrFARo - Ideal for: New managers (2025 specific). Topic: Mid-year feedback. Takeaway: Ensure mid-cycle performance tracking.														

https://www.youtube.com/watch?v=rE925DTWhhk - Ideal for: Team managers. Topic: Performance strategy. Takeaway: Align skills, motivation, and resources.														

https://www.youtube.com/watch?v=YeOzCHKv9fA - Ideal for: Managers addressing underperformance. Topic: Poor performance management. Takeaway: Structured coaching instead of blame.														

https://www.youtube.com/playlist?list=PLUL5iaZCLDUF-2_m4WEBBWuxicL68I7g- - Ideal for: HR practitioners. Topic: Performance toolkit. Takeaway: Range of tools for ongoing performance management.														

https://www.youtube.com/watch?v=OoISfhACm4s - Ideal for: Managers new to radical candor. Topic: Radical candor basics. Takeaway: Core feedback compass framework.														

https://www.youtube.com/watch?v=WHpGkWdWOlA - Ideal for: Feedback culture builders. Topic: Candor in the workplace. Takeaway: Core components to foster radical candor.														

https://www.youtube.com/watch?v=DmgT18v0Wzo - Ideal for: Leadership trainers. Topic: Radically candid cultures. Takeaway: Learn frameworks from Kim Scott’s SPC session.														

https://www.youtube.com/watch?v=vylmPna3v4Q - Ideal for: Data-influenced leaders. Topic: Delegation rationale. Takeaway: Research-backed importance of delegation.														

https://www.youtube.com/watch?v=iYqN5ntld-k - Ideal for: Structured managers. Topic: Delegation checklist. Takeaway: Essential do’s and don’ts.														

https://www.youtube.com/watch?v=llzakTJqkBk - Ideal for: Senior leaders. Topic: Psychological delegation barriers. Takeaway: Identify and overcome mental blocks.														

https://www.youtube.com/watch?v=kZAH-R-qUTQ - Ideal for: Team leads. Topic: Meetings + delegation. Takeaway: How to embed delegation in meeting routine.														

https://www.youtube.com/watch?v=msIP8TyZXn8 - Ideal for: Leadership learners. Topic: Multiple leadership topics. Takeaway: Rapid insights on communication, feedback, and growth.														

https://www.youtube.com/watch?v=n1Kv67Z7qXQ - Ideal for: All leadership levels. Topic: Leadership essentials. Takeaway: Three key questions to help introspect and define your leadership identity.														

https://www.youtube.com/watch?v=dySpIRY8cWE - Ideal for: C‑Suite executives. Topic: Leadership traits. Takeaway: The interplay of gratitude, humility, and accountability in top-tier leadership.														

https://www.youtube.com/watch?v=CPzeFw3nPO0 - Ideal for: Aspiring CEO candidates. Topic: CEO readiness. Takeaway: What makes a CEO coach-worthy: clarity, influence, and impact mindset.														

https://www.youtube.com/watch?v=kebe2mzn6QA - Ideal for: Leadership development professionals. Topic: Leadership behavior. Takeaway: Insights from two of the world’s most trusted leadership coaches.

https://www.youtube.com/playlist?list=PLOpZoY-U0jaVQzfxdiAXrRTMJnABkdIxQ - Ideal for: Executive coaches. Topic: Interview leadership. Takeaway: Rare interviews with CEOs sharing firsthand leadership challenges and lessons.

===========================================
REQUIREMENTS FOR YOUR RESPONSE
===========================================

1. UNIQUENESS: Ensure all learning content is unique and does not duplicate past_learning_cards
2. RELEVANCE: Address specific areas mentioned in team_feedback
3. CONTINUITY: Build upon insights from coaching_history
4. REFLECTION: Incorporate themes from user reflections
5. ALIGNMENT: Ensure recommendations align with leadership assessment insights
6. ACTIONABILITY: Provide concrete, implementable steps
7. COMPREHENSIVENESS: Include all required fields in the output structure
8. SPECIFICITY: Make recommendations specific to the leader's context and company
9. FEEDBACK INTEGRATION: 
   - Analyze feedback across all 5 categories - viz. PAST-LEARNING-CARDS-TEMPLATE, TEAM-FEEDBACK-TEMPLATE, COACHING-HISTORY-TEMPLATE, REFLECTIONS-TEMPLATE, LEADERSHIP-ASSESSMENT-TEMPLATE
   - Pay special attention to areas with lower scores (1-2)
   - Consider open-ended feedback in learning recommendations
   - Factor in NPS score for overall satisfaction assessment
   - Address specific improvement areas mentioned in feedback

Your response should be a JSON object (which can directly be sent back by the API) following the structure as per "LEARNING-PLAN-OUTPUT-TEMPLATE" with this example showing the expected detail level. The output should **ONLY** and **EXACT** Structure and be a VALID JSON object and should **NOT** contain any additional text or explanations`.trim();
};
