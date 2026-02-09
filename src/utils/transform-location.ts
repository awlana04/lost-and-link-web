export default function transformLocationLonLatForm(
  location: number[]
): string {
  // transform the array into a string and remove the blank spaces.
  const locationArray = location.toString().trim();
  // separes the lat/lon string by removing the comma, reverse the strings to lon/lat form and transform it into a string.
  return locationArray.split(/,+/).toReversed().toString();
}
