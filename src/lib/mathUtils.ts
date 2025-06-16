/**
 * Mathematical utility functions for answer validation and equivalence checking
 * @module mathUtils
 */

/**
 * Checks if two mathematical expressions are equivalent
 * Handles various formats including fractions, decimals, expressions, and special values
 * 
 * @param userAnswer - The answer provided by the user
 * @param correctAnswer - The expected correct answer
 * @returns true if the answers are mathematically equivalent, false otherwise
 * 
 * @example
 * areEquivalent("1/2", 0.5) // returns true
 * areEquivalent("2^3", 8) // returns true
 * areEquivalent("sqrt(4)", 2) // returns true
 * areEquivalent("3:6", "1:2") // returns true (equivalent ratios)
 */
export function areEquivalent(userAnswer: string, correctAnswer: string | number): boolean {
  // Clean up the answers
  const cleanUser = userAnswer.trim().toLowerCase();
  const cleanCorrect = correctAnswer.toString().trim().toLowerCase();
  
  // Direct string match
  if (cleanUser === cleanCorrect) return true;
  
  // Try to evaluate both as mathematical expressions
  try {
    const userValue = evaluateMathExpression(cleanUser);
    const correctValue = evaluateMathExpression(cleanCorrect);
    
    // Check if both evaluated successfully and are equal (within small tolerance for decimals)
    if (userValue !== null && correctValue !== null) {
      return Math.abs(userValue - correctValue) < 0.0001;
    }
  } catch (e) {
    // If evaluation fails, continue to other checks
  }
  
  // Check for fraction equivalence (e.g., 1/2 = 0.5)
  const fractionPattern = /^(-?\d+)\s*\/\s*(\d+)$/;
  const userFraction = cleanUser.match(fractionPattern);
  const correctFraction = cleanCorrect.match(fractionPattern);
  
  if (userFraction) {
    const userDecimal = parseFloat(userFraction[1]) / parseFloat(userFraction[2]);
    const correctFloat = parseFloat(cleanCorrect);
    if (!isNaN(correctFloat) && Math.abs(userDecimal - correctFloat) < 0.0001) return true;
  }
  
  if (correctFraction) {
    const correctDecimal = parseFloat(correctFraction[1]) / parseFloat(correctFraction[2]);
    const userFloat = parseFloat(cleanUser);
    if (!isNaN(userFloat) && Math.abs(userFloat - correctDecimal) < 0.0001) return true;
  }
  
  // Check for ratio format (e.g., 3:4)
  const ratioPattern = /^(-?\d+)\s*:\s*(-?\d+)$/;
  const userRatio = cleanUser.match(ratioPattern);
  const correctRatio = cleanCorrect.match(ratioPattern);
  
  if (userRatio && correctRatio) {
    // Check if ratios are proportional
    const userGcd = gcd(Math.abs(parseInt(userRatio[1])), Math.abs(parseInt(userRatio[2])));
    const correctGcd = gcd(Math.abs(parseInt(correctRatio[1])), Math.abs(parseInt(correctRatio[2])));
    
    const userSimplified = `${parseInt(userRatio[1])/userGcd}:${parseInt(userRatio[2])/userGcd}`;
    const correctSimplified = `${parseInt(correctRatio[1])/correctGcd}:${parseInt(correctRatio[2])/correctGcd}`;
    
    if (userSimplified === correctSimplified) return true;
  }
  
  return false;
}

/**
 * Safely evaluates a mathematical expression
 * @param expr - The mathematical expression to evaluate
 * @returns The numerical result or null if evaluation fails
 * @private
 */
function evaluateMathExpression(expr: string): number | null {
  try {
    // Replace common mathematical functions and constants
    let processed = expr
      .replace(/\s+/g, '') // Remove all whitespace
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/cbrt\(/g, 'Math.cbrt(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/pow\(/g, 'Math.pow(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/\^/g, '**') // Convert ^ to ** for exponentiation
      .replace(/pi/g, 'Math.PI')
      .replace(/e(?!\d)/g, 'Math.E') // e not followed by a digit
      .replace(/infinity/g, 'Infinity')
      .replace(/∞/g, 'Infinity');
    
    // Add multiplication signs where needed (e.g., 2(3) -> 2*(3))
    processed = processed.replace(/(\d)\(/g, '$1*(');
    processed = processed.replace(/\)(\d)/g, ')*$1');
    processed = processed.replace(/(\d)([a-zA-Z])/g, '$1*$2'); // 2pi -> 2*pi
    
    // Validate the expression contains only safe characters
    if (!/^[0-9+\-*/().,\s]|Math\.[a-zA-Z]+|Math\.[A-Z]+|Infinity$/i.test(processed.replace(/Math\.\w+/g, '').replace(/Infinity/g, ''))) {
      return null;
    }
    
    // Use Function constructor instead of eval for safety
    const result = new Function('Math', `return ${processed}`)(Math);
    
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return result;
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Calculates the greatest common divisor using Euclidean algorithm
 * @param a - First number
 * @param b - Second number
 * @returns The greatest common divisor
 * @private
 */
function gcd(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Formats a numerical answer to show equivalent representations
 * @param answer - The numerical answer to format
 * @returns A string showing the answer and common equivalent forms
 * 
 * @example
 * formatMathAnswer(0.5) // returns "0.5 or 1/2"
 * formatMathAnswer(9) // returns "9 or 3²"
 */
export function formatMathAnswer(answer: number): string {
  // Check if the answer is close to a common fraction
  const commonFractions = [
    { decimal: 0.5, fraction: '1/2' },
    { decimal: 0.333333, fraction: '1/3' },
    { decimal: 0.666667, fraction: '2/3' },
    { decimal: 0.25, fraction: '1/4' },
    { decimal: 0.75, fraction: '3/4' },
    { decimal: 0.2, fraction: '1/5' },
    { decimal: 0.4, fraction: '2/5' },
    { decimal: 0.6, fraction: '3/5' },
    { decimal: 0.8, fraction: '4/5' },
    { decimal: 0.166667, fraction: '1/6' },
    { decimal: 0.833333, fraction: '5/6' },
    { decimal: 0.125, fraction: '1/8' },
    { decimal: 0.375, fraction: '3/8' },
    { decimal: 0.625, fraction: '5/8' },
    { decimal: 0.875, fraction: '7/8' }
  ];
  
  for (const { decimal, fraction } of commonFractions) {
    if (Math.abs(answer - decimal) < 0.0001) {
      return `${answer} or ${fraction}`;
    }
  }
  
  // Check if it's a perfect square
  const sqrt = Math.sqrt(answer);
  if (Number.isInteger(sqrt)) {
    return `${answer} or ${sqrt}²`;
  }
  
  // Check if answer is a perfect square
  if (Number.isInteger(answer) && answer > 1) {
    const root = Math.sqrt(answer);
    if (Number.isInteger(root)) {
      return `${answer} or sqrt(${answer * answer})`;
    }
  }
  
  return answer.toString();
}