import type { OnboardingForm } from '../../types';
import { formatDate } from '../../utils/helpers';

export function generateOnboardingKit(form: OnboardingForm): string {
  const date = formatDate();

  return `CLIENT ONBOARDING KIT
${'═'.repeat(60)}

Welcome, ${form.clientName}! 🎉
Prepared by: ${form.yourName}
Date: ${date}

I'm thrilled to be working with you on ${form.projectName}. 
This document contains everything you need to kick things off smoothly.

${'─'.repeat(60)}
PROJECT DETAILS
${'─'.repeat(60)}

Project Name:  ${form.projectName}
Start Date:    ${form.startDate}
Your Contact:  ${form.yourName}
Email:         ${form.yourEmail}

${'─'.repeat(60)}
HOW WE'LL COMMUNICATE
${'─'.repeat(60)}

Primary Channel: ${form.communicationChannel}
Meeting Cadence: ${form.meetingCadence}
Your Point of Contact: ${form.pointOfContact || form.clientName}

Response Time: I aim to respond to all messages within 1 business day.
For urgent matters, please mark your message as [URGENT].

${'─'.repeat(60)}
TOOLS WE'LL USE
${'─'.repeat(60)}

${form.tools
  ? form.tools.split('\n').filter(Boolean).map((t) => `  • ${t.trim()}`).join('\n')
  : '  • To be confirmed at kickoff call'}

${'─'.repeat(60)}
WHAT TO EXPECT
${'─'.repeat(60)}

Week 1 — Kickoff & Discovery
  • We'll schedule our kickoff call to align on goals
  • I'll share a detailed project plan and timeline
  • You'll receive access to all shared tools/workspaces

During the Project
  • Regular check-ins per our agreed cadence
  • Progress updates sent proactively
  • Quick decisions kept in writing (email/Slack)

At Completion
  • Final deliverable walkthrough call
  • Handoff of all files and documentation
  • 30-day post-launch support window

${'─'.repeat(60)}
HOW YOU CAN HELP
${'─'.repeat(60)}

  ✓ Respond to requests and reviews within 2 business days
  ✓ Provide feedback in a single consolidated round
  ✓ Let me know early if priorities change
  ✓ Keep decision-makers available for key milestones

${'─'.repeat(60)}
LET'S DO THIS! 🚀

I'm genuinely excited to work with you. Don't hesitate to reach 
out if you have any questions before we begin.

${form.yourName}
${form.yourEmail}
${'─'.repeat(60)}
`;
}

export const ENHANCE_PROMPT = `You are an expert at client onboarding for freelancers. 
Enhance the following onboarding kit to be warmer, more professional, and more thorough. 
Keep all specific details (names, dates, tools) exactly as-is. 
Make the client feel welcomed and confident. Return only the enhanced document.`;
