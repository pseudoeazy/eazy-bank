import { GenCC } from 'creditcard-generator';
import validator from 'validator';

interface ATMCard {
  cardNumber: string;
  cvv: string;
  expiryDate: string;
}

export async function generateATMCard(): Promise<ATMCard> {
  // Generate a credit card number
  const cardNumbers = GenCC('VISA');
  const cardNumber = cardNumbers[0];

  // Generate a unique CVV
  const cvv = Math.floor(100 + Math.random() * 900).toString();

  // Generate an expiration date (2 years from now)
  const today = new Date();
  const expirationMonth = String(today.getMonth() + 1).padStart(2, '0');
  const expirationYear = String(today.getFullYear() + 2)
    .toString()
    .slice(2);

  const expiryDate = `${expirationMonth}/${expirationYear}`;

  // Validate the generated card number
  if (!validator.isCreditCard(cardNumber)) {
    throw new Error('Generated card number is invalid');
  }

  return {
    cardNumber,
    cvv,
    expiryDate,
  };
}
