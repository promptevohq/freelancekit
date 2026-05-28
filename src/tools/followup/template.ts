import type { FollowupForm } from '../../types';
import { formatDate } from '../../utils/helpers';

export function generateFollowup(form: FollowupForm): string {
  const date = formatDate();
  const toneIntro: Record<FollowupForm['tone'], string> = {
    friendly:     `I hope you're doing well! I wanted to touch base regarding`,
    professional: `I'm writing to follow up on`,
    urgent:       `I wanted to reach out urgently regarding`,
  };
  const toneClose: Record<FollowupForm['tone'], string> = {
    friendly:     `I'd love to hear your thoughts whenever you have a chance!`,
    professional: `I look forward to your response at your earliest convenience.`,
    urgent:       `Please treat this as a priority — a prompt response would be greatly appreciated.`,
  };

  return `Subject: Following Up — ${form.projectName}

Date: ${date}

Hi ${form.clientName},

${toneIntro[form.tone]} ${form.projectName}.

${form.daysSince ? `It's been ${form.daysSince} day${parseInt(form.daysSince) !== 1 ? 's' : ''} since we last connected, and I wanted to check in.` : ''}

${form.context ? form.context + '\n' : ''}
${form.callToAction
  ? `${form.callToAction}`
  : `Could you let me know where things stand on your end? I'm happy to jump on a quick call to discuss next steps.`}

${toneClose[form.tone]}

Best regards,
${form.yourName}
`;
}

export const ENHANCE_PROMPT = `You are an expert at writing persuasive professional emails. 
Enhance the following follow-up email to be more engaging and effective. 
Preserve all specific details (names, project, dates). 
Improve clarity, warmth, and the call to action. Return only the improved email text.`;
