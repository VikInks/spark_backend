import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique identifier using the uuidv4 function.
 *
 * @return {string} A unique identifier.
 */
export function generateUniqueId() {
    return uuidv4();
}