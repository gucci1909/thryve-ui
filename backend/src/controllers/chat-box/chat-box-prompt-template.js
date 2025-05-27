export const getCoachPrompt = (question, leadershipReport, company, existingChat) => {
  const cleanContext =
    existingChat && typeof existingChat === 'object' && Array.isArray(existingChat.chat_context)
      ? existingChat.chat_context.map((entry) => ({
          from: entry.from,
          chat_text: entry.chat_text,
        }))
      : [];

  // Step 2: Append current question as user input
  const chatContext = [...cleanContext, { from: 'user', chat_text: question }];

  // Step 3: Prepare updated chat object
  const updatedChat = { chat_context: chatContext };

  return `Assume that you are a Leadership Coach and are an expert at evaluating and providing guidance to a manager for the questions that are being asked.

The inputs given to you are the manager's SWOT analysis and their Recommendations along with a lesson plan as given in the leadership_assessment_report_template.

In addition to this, the user will ask a question for which you are to provide guidance. The request from the user would be in JSON format as per manager_json_request_template and your output should also be in JSON format as per coach_json_response_template. These are mentioned below. Please note that the output should be a chat summary in about 100 words and should *ONLY* and *ABSOLUTELY* be a JSON. 

Also, please factor in the company details of the manager so that when you respond, you can point to the details of the company about them, vision, values, people culture, etc, The details are available under company_values_people

company_values_people_actual_from_db:

${JSON.stringify(company.ABOUT_TEXT, null, 2)}


leadership_assessment_report_template: this is the template that I expect as the output from you the Leadership Coach.

${JSON.stringify(leadershipReport.assessment, null, 2)}

manager_json_request_template: This is the request JSON. The chat_context defines the chat conversation between the user (human) and the aicoach (AI). Details of the field are provided after // delimiter. 

{
	"chat_context" : [
		{
			"from": // Would either be "user" or "aicoach" indicating if the text was from the user or AI as part of chat context history
			"chat_text": // Text blob that would either be a message from the user or previous responses from AI
		}
	]
	
}

coach_json_response_template: This is the response JSON expected. The latest chat message from the user is always towards the end of the JSON object so if there are N responses, that the user's most recent chat message is the Nth one. To build the chat context, please factor in details from manager_json_request_actual (definition of that is defined by manager_json_request_template), leadership_assessment_report_actual (Definition of that is defined by leadership_assessment_report_template) and details from company_values_people_actual_from_db

{
	"from": "aicoach", // This should always be "aicoach" as the response is always from AI
	"chat_text": // This is the text provided by AI
}

manager_json_request_actual: This is the actual context of the chat between the user and AI

${JSON.stringify(updatedChat, null, 2)}

`.trim();
};
