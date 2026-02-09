export default function getCookie(name: string) {
  const cookieName = name + '=';
  const cookie = document.cookie.split(';');

  for (let i = 0; i < cookie.length; i++) {
    let cookieValue = cookie[i];

    while (cookieValue.charAt(0) === ' ')
      cookieValue = cookieValue.substring(1, cookieValue.length);

    if (cookieValue.indexOf(cookieName) === 0) {
      return cookieValue.substring(cookieName.length, cookieValue.length);
    }
  }

  return null;
}
