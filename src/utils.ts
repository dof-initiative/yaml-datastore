/**
 * Maps complex string key name to file name using the following rules:
 *
 * 1. Assumes keyName is consistent with the requirements for a typescript/javascript identifier
 * 2. Ignores leading and trailing underscores (e.g., '_myKeyName__' has one leading and two trailing underscores)
 * 3. A single underscore is defined by being surrounded by non-underscores (e.g., 'my_key__name' has one single underscore and it is between 'my' and 'key')
 * 4. All remaining single underscores are replaced by dots (e.g., 'myKey_md_njk' becomes 'myKey.md.njk')
 *
 * @param keyName String of key name to be mapped to file name
 * @returns String of file name mapped from key name
 */
export function complexStringKeyToFileName(keyName: string): string {
  return keyName;
}

/**
 * Maps file name to key name using the following rules:
 *
 * 1. Assumes fileName is consistent with the requirements for a typescript/javascript identifier with the exception of dots, '.'
 * 2. All dots are replaced with single underscores (e.g., 'myKey.md.njk' becomes 'myKey_md_njk')
 *
 * @param fileName
 * @returns
 */
export function fileNameToComplexStringKey(fileName: string): string {
  return fileName.replaceAll(".", "_");
}
