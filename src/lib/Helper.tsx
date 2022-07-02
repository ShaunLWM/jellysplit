export function cutMiddle(str = '', length = 10): string {
  if (str.length <= length) {
    return str;
  }
  return str.substring(0, length / 2) + '...' + str.substring(str.length - length / 2);
}