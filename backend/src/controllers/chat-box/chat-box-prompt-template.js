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

  return `

${JSON.stringify(updatedChat, null, 2)}

`.trim();
};
