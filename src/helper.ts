type JSONValue = string | number | boolean | { [key: string]: JSONValue } | JSONValue[];
type Differences = { [key: string]: JSONValue };


//Compare two different json object with same keys, if the value of a key is different, the value of obj2 will be added to the return object.
export function compareJSONObjects(obj1: { [key: string]: JSONValue }, obj2: { [key: string]: JSONValue }): Differences {
  const differences: Differences = {};

  // Ensure both parameters are objects
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    throw new Error('Both parameters should be non-null objects.');
  }

  // Iterate over the keys in the first object
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      // Check if both values are objects for a deep comparison
      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' && obj1[key] !== null && obj2[key] !== null) {
        const nestedDifferences = compareJSONObjects(obj1[key] as { [key: string]: JSONValue }, obj2[key] as { [key: string]: JSONValue });
        if (Object.keys(nestedDifferences).length > 0) {
          differences[key] = nestedDifferences;
        }
      } else {
        // If values are different, assign the value from obj2 to the differences object
        if (obj1[key] !== obj2[key]) {
          differences[key] = obj2[key];
        }
      }
    }
  }

  return differences;
}