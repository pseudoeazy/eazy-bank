import { v4 as uuidv4 } from 'uuid';

export function generateAccountNumber(): string {
  // Use UUID and a timestamp to generate a unique account number
  const uuidPart = uuidv4().replace(/-/g, '').slice(0, 8); // Take the first 8 characters of UUID
  const timestampPart = Date.now().toString().slice(-8); // Take the last 8 characters of the current timestamp

  const accountNumber = `${uuidPart}${timestampPart}`;

  return accountNumber;
}
