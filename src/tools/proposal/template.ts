import type { ProposalForm } from '../../types';
import { formatDate } from '../../utils/helpers';

export function generateProposal(form: ProposalForm): string {
  const date = formatDate();
  const deliverables = form.deliverables
    .split('\n')
    .filter(Boolean)
    .map((d) => `  • ${d.trim()}`)
    .join('\n');

  return `PROJECT PROPOSAL
${'═'.repeat(60)}

Prepared for: ${form.clientName}
Prepared by:  ${form.yourName}${form.yourRole ? `, ${form.yourRole}` : ''}
Date:         ${date}

${'─'.repeat(60)}
PROJECT OVERVIEW
${'─'.repeat(60)}

Project Title: ${form.projectTitle}

${form.projectDescription}

${'─'.repeat(60)}
DELIVERABLES
${'─'.repeat(60)}

${deliverables}

${'─'.repeat(60)}
TIMELINE
${'─'.repeat(60)}

${form.timeline}

${'─'.repeat(60)}
INVESTMENT
${'─'.repeat(60)}

${form.budget}

${'─'.repeat(60)}
NEXT STEPS
${'─'.repeat(60)}

1. Review this proposal and share any questions or feedback.
2. If you'd like to move forward, confirm via email.
3. A formal contract and invoice will follow upon agreement.

I'm excited about the opportunity to work with you on this project. 
Please don't hesitate to reach out if you have any questions.

Warmly,
${form.yourName}
${'─'.repeat(60)}
`;
}

export const ENHANCE_PROMPT = `You are an expert freelance proposal writer. 
Enhance the following proposal to be more persuasive, professional, and compelling. 
Keep the same structure and all the specific details (names, dates, amounts). 
Make the language more confident and benefit-focused. Return only the enhanced proposal text.`;
