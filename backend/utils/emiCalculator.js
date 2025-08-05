// EMI Calculator Utility Functions

/**
 * Calculate EMI amount using the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
 * Where P = Principal amount, r = monthly interest rate, n = number of months
 */
export function calculateEMI(principalAmount, annualInterestRate, tenureMonths) {
    const monthlyInterestRate = annualInterestRate / (12 * 100);
    const emi = principalAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths) / 
                (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
    return Math.round(emi * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate total interest amount
 */
export function calculateTotalInterest(principalAmount, totalAmount) {
    return Math.round((totalAmount - principalAmount) * 100) / 100;
}

/**
 * Calculate total amount to be paid
 */
export function calculateTotalAmount(monthlyEMI, tenureMonths) {
    return Math.round(monthlyEMI * tenureMonths * 100) / 100;
}

/**
 * Get all available EMI options for a given amount
 */
export function getEMIOptions(principalAmount, interestRate = 16.00) {
    const tenures = [3, 6, 9, 12, 18, 24];
    const emiOptions = [];

    tenures.forEach(tenure => {
        const monthlyEMI = calculateEMI(principalAmount, interestRate, tenure);
        const totalAmount = calculateTotalAmount(monthlyEMI, tenure);
        const totalInterest = calculateTotalInterest(principalAmount, totalAmount);

        emiOptions.push({
            tenure,
            monthlyEMI,
            totalAmount,
            totalInterest,
            interestRate
        });
    });

    return emiOptions;
}

/**
 * Format EMI option for display
 */
export function formatEMIOption(option) {
    return {
        tenure: option.tenure,
        displayText: `₹${option.monthlyEMI.toLocaleString('en-IN')} x ${option.tenure} M | @${option.interestRate}% p.a`,
        totalInterestText: `Total ₹${option.totalInterest.toLocaleString('en-IN')} interest charged`,
        monthlyEMI: option.monthlyEMI,
        totalAmount: option.totalAmount,
        totalInterest: option.totalInterest,
        interestRate: option.interestRate
    };
} 