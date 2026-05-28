import type { RateForm, RateResult } from '../../types';
import { formatCurrency } from '../../utils/helpers';

export function calculateRates(form: RateForm): RateResult {
  const income = parseFloat(form.annualIncome) || 0;
  const weeks = parseFloat(form.workWeeksPerYear) || 48;
  const hours = parseFloat(form.hoursPerWeek) || 40;
  const expenses = parseFloat(form.businessExpenses) || 0;
  const taxRate = parseFloat(form.taxRate) / 100 || 0.3;
  const margin = parseFloat(form.profitMargin) / 100 || 0.2;

  const totalNeeded = (income + expenses) / (1 - taxRate) * (1 + margin);
  const annualHours = weeks * hours;
  const billableHours = annualHours * 0.6; // 60% utilization

  const hourlyRate = Math.ceil(totalNeeded / billableHours / 5) * 5;
  const dayRate = Math.ceil((hourlyRate * 8) / 50) * 50;
  const weeklyRate = Math.ceil((dayRate * 5) / 100) * 100;
  const monthlyRate = Math.ceil((weeklyRate * 4) / 500) * 500;

  return {
    hourlyRate,
    dayRate,
    weeklyRate,
    monthlyRate,
    starterPackage: {
      name: 'Starter',
      price: Math.ceil((hourlyRate * 20) / 500) * 500,
      description: '~20 hours — ideal for small projects, audits, or quick wins',
    },
    growthPackage: {
      name: 'Growth',
      price: Math.ceil((hourlyRate * 40) / 500) * 500,
      description: '~40 hours — perfect for a focused sprint or deliverable',
    },
    premiumPackage: {
      name: 'Premium',
      price: Math.ceil((monthlyRate * 1.2) / 500) * 500,
      description: '~80+ hours — full engagement, ongoing or complex projects',
    },
  };
}

export function generateRateDoc(form: RateForm, result: RateResult): string {
  return `RATE & PACKAGE CALCULATOR RESULTS
${'═'.repeat(60)}

${'─'.repeat(60)}
YOUR BASE RATES
${'─'.repeat(60)}

  Hourly Rate:   ${formatCurrency(result.hourlyRate)}
  Day Rate:      ${formatCurrency(result.dayRate)}
  Weekly Rate:   ${formatCurrency(result.weeklyRate)}
  Monthly Rate:  ${formatCurrency(result.monthlyRate)}

${'─'.repeat(60)}
SERVICE PACKAGES
${'─'.repeat(60)}

  📦 ${result.starterPackage.name} Package — ${formatCurrency(result.starterPackage.price)}
     ${result.starterPackage.description}

  📦 ${result.growthPackage.name} Package — ${formatCurrency(result.growthPackage.price)}
     ${result.growthPackage.description}

  📦 ${result.premiumPackage.name} Package — ${formatCurrency(result.premiumPackage.price)}
     ${result.premiumPackage.description}

${'─'.repeat(60)}
INPUTS USED
${'─'.repeat(60)}

  Target Annual Income:    ${formatCurrency(parseFloat(form.annualIncome) || 0)}
  Work Weeks / Year:       ${form.workWeeksPerYear || '48'} weeks
  Hours / Week:            ${form.hoursPerWeek || '40'} hours
  Business Expenses:       ${formatCurrency(parseFloat(form.businessExpenses) || 0)}
  Tax Rate:                ${form.taxRate || '30'}%
  Profit Margin:           ${form.profitMargin || '20'}%
  Billable Utilization:    60% (industry standard)

${'─'.repeat(60)}
NOTES
${'─'.repeat(60)}

These rates are calculated based on your target income, expenses, 
taxes, and a 60% billable utilization rate (the time you actually 
bill vs. admin, sales, and unpaid work).

Consider raising your rates by 10–15% annually to account for 
experience growth, inflation, and increased value.
${'─'.repeat(60)}
`;
}
