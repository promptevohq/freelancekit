import type { ScopeForm } from '../../types';
import { formatDate, parseLines } from '../../utils/helpers';

export function generateScope(form: ScopeForm): string {
  const date = formatDate();
  const inScope = parseLines(form.inScope).map((l) => `  ✓ ${l}`).join('\n');
  const outScope = parseLines(form.outOfScope).map((l) => `  ✗ ${l}`).join('\n');
  const deliverables = parseLines(form.deliverables).map((l) => `  • ${l}`).join('\n');

  return `PROJECT SCOPE OF WORK
${'═'.repeat(60)}

Project:      ${form.projectName}
Client:       ${form.clientName}
Date:         ${date}

${'─'.repeat(60)}
PROJECT OBJECTIVES
${'─'.repeat(60)}

${form.objectives}

${'─'.repeat(60)}
WHAT'S INCLUDED (IN SCOPE)
${'─'.repeat(60)}

${inScope || '  • To be defined'}

${'─'.repeat(60)}
WHAT'S NOT INCLUDED (OUT OF SCOPE)
${'─'.repeat(60)}

${outScope || '  • To be defined'}

${'─'.repeat(60)}
DELIVERABLES
${'─'.repeat(60)}

${deliverables || '  • To be defined'}

${'─'.repeat(60)}
TIMELINE
${'─'.repeat(60)}

${form.timeline}

${'─'.repeat(60)}
REVISIONS & CHANGES
${'─'.repeat(60)}

${form.revisions || 'This project includes up to 2 rounds of revisions. Additional revisions will be billed at the agreed hourly rate.'}

${'─'.repeat(60)}
PAYMENT TERMS
${'─'.repeat(60)}

${form.paymentTerms || '50% deposit due before work begins. Remaining 50% due upon project completion.'}

${'─'.repeat(60)}
AGREEMENT

By proceeding with this project, both parties agree to the scope 
and terms outlined in this document. Any changes to scope must 
be agreed upon in writing by both parties.

Client: ${form.clientName}
Freelancer: _______________________
Date: ${date}
${'─'.repeat(60)}
`;
}

export const ENHANCE_PROMPT = `You are a freelance contract expert. 
Enhance the following scope of work document to be more legally clear, professional, 
and protective for the freelancer. Keep all specific details intact. 
Improve the language to prevent scope creep and misunderstandings. Return only the enhanced document.`;
