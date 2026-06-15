import { useState, useEffect } from 'react';
import { BsCheckCircleFill, BsMicFill, BsCodeSlash, BsChatDots } from 'react-icons/bs';
import './index.css';

function InterviewActionsLog({ interview }) {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    if (!interview) return;

    const actionList = [];

    // Interview started
    actionList.push({
      id: 'start',
      type: 'start',
      timestamp: new Date(interview.createdAt),
      description: `Interview started for ${interview.role}`,
      icon: BsChatDots,
    });

    // Questions and answers
    interview.questions.forEach((question, index) => {
      const questionNum = index + 1;

      // Question asked
      actionList.push({
        id: `question-${questionNum}`,
        type: 'question',
        timestamp: new Date(), // Assuming current time, could be improved
        description: `Question ${questionNum} asked: ${question.text}`,
        icon: BsChatDots,
      });

      // Check if user answered
      const userMessages = interview.messages.filter(m => m.role === 'user');
      const answer = userMessages.find(m => m.questionNum === questionNum);

      if (answer) {
        if (answer.type === 'text') {
          actionList.push({
            id: `answer-text-${questionNum}`,
            type: 'answer-text',
            timestamp: new Date(),
            description: 'Text answer submitted',
            icon: BsChatDots,
          });
        } else if (answer.type === 'audio') {
          actionList.push({
            id: `answer-audio-${questionNum}`,
            type: 'answer-audio',
            timestamp: new Date(),
            description: 'Audio answer recorded and transcribed',
            icon: BsMicFill,
          });
        }
      }

      // Check if code submitted
      const codeSubmission = interview.codeSubmissions.find(c => c.questionNum === questionNum);
      if (codeSubmission) {
        actionList.push({
          id: `code-${questionNum}`,
          type: 'code',
          timestamp: new Date(),
          description: 'Code submitted and evaluated',
          icon: BsCodeSlash,
        });
      }
    });

    // Interview completed
    if (interview.status === 'completed') {
      actionList.push({
        id: 'complete',
        type: 'complete',
        timestamp: new Date(),
        description: 'Interview completed, feedback generated',
        icon: BsCheckCircleFill,
      });
    }

    setActions(actionList);
  }, [interview]);

  if (!interview || actions.length === 0) return null;

  return (
    <div className="actions-log">
      <h3 className="actions-log-title">Interview Actions</h3>
      <div className="actions-timeline">
        {actions.map((action, index) => (
          <div key={action.id} className="action-item">
            <div className="action-icon">
              <action.icon />
            </div>
            <div className="action-content">
              <p className="action-description">{action.description}</p>
              <span className="action-timestamp">
                {action.timestamp.toLocaleTimeString()}
              </span>
            </div>
            {index < actions.length - 1 && <div className="action-connector"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InterviewActionsLog;