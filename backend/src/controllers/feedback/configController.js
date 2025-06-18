export const configController = (req, res) => {
  try {
    const response = {
      'feedback-back-and-fourth': {
        firstFeedback: 5,
        others: 3,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error in configController:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
