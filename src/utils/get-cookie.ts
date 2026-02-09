export default function getCookie(name: string) {
  // Create a regex to find the cookie name followed by an equals sign,
  // and then capture the value until a semicolon or the end of the string.
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    // Trim leading white space
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);

    // If the cookie string starts with the desired name, return its value
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null; // Return null if the cookie is not found
}
