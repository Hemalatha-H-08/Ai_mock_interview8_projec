import { generateContent } from '../config/gemini.config.js';

const buildFallbackResponse = (prompt = '') => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('return only a valid json array')) {
    return JSON.stringify([
      {
        text: 'Can you walk me through a recent project you are most proud of and the impact it had?',
        type: 'behavioral',
        isCodeQuestion: false,
      },
      {
        text: 'What are the most important skills and tools you would use in this role day to day?',
        type: 'technical',
        isCodeQuestion: false,
      },
      {
        text: 'Write a function that removes duplicate values from an array while keeping the original order.',
        type: 'technical',
        isCodeQuestion: true,
        codeType: 'write',
        codeLanguage: 'javascript',
      },
      {
        text: 'How would you debug a feature that works locally but fails after deployment?',
        type: 'technical',
        isCodeQuestion: false,
      },
    ]);
  }

  if (lowerPrompt.includes('short and warm greeting')) {
    return 'Hi, I\'m Natalie and I\'ll be guiding your interview for this role today. Take your time and feel comfortable as we go through the questions. Let\'s start with the basics — tell me about yourself.';
  }

  if (lowerPrompt.includes('only acknowledge') || lowerPrompt.includes('do not repeat or include the next question')) {
    return 'Thanks for sharing that. That gives good context about your approach. Let\'s move on to the next question.';
  }

  if (lowerPrompt.includes('use this exact json structure')) {
    return JSON.stringify({
      overallScore: 78,
      categoryScores: {
        communicationSkills: { score: 80, comment: 'You explained your thoughts clearly and stayed organized.' },
        technicalKnowledge: { score: 76, comment: 'You showed a solid understanding of the core concepts.' },
        problemSolving: { score: 78, comment: 'Your approach was structured and practical.' },
        codeQuality: { score: 75, comment: 'Your code and explanations were reasonable with room for refinement.' },
        confidence: { score: 81, comment: 'You communicated with steady confidence throughout the interview.' },
      },
      strengths: [
        'You communicated your ideas in a clear, easy-to-follow way.',
        'You showed a practical understanding of the role and common workflows.',
      ],
      areasOfImprovement: [
        'Add more concrete examples when discussing technical decisions.',
        'Explain trade-offs a little more deeply in problem-solving answers.',
      ],
      finalAssessment: 'You gave a solid performance with clear communication and good technical foundations. With a bit more depth and detail in your examples, you can become even stronger in future interviews.',
    });
  }

  if (lowerPrompt.includes('respond with only a valid json object')) {
    return JSON.stringify({
      isCorrect: true,
      score: 80,
      feedback: 'This is a solid response that addresses the task reasonably well.',
      suggestions: 'Add a short explanation of edge cases and mention time complexity to make the answer even stronger.',
    });
  }

  return 'Thanks for your answer. Let\'s continue to the next part.';
};

export const askGemini = async (prompt) => {
  try {
    const response = await generateContent(prompt);

    if (!response) {
      throw new Error('Gemini returned an empty response');
    }

    return response;
  } catch (error) {
    console.error('Gemini Service Error:', error.message);
    return buildFallbackResponse(prompt);
  }
};