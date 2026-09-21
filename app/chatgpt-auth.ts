import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Authentication is supplied by Sites dispatch, not by browser form values.
export async function getChatGPTUser() {
  const requestHeaders = await headers();
  const userId = requestHeaders.get('oai-authenticated-user-id');
  const email = requestHeaders.get('oai-authenticated-user-email');
  if (!userId || !email) return null;
  return { userId, email };
}

export function chatGPTSignInPath(returnTo: string) {
  let safe = '/painel';
  try {
    const url = new URL(returnTo, 'https://app.local');
    if (
      url.origin === 'https://app.local' &&
      returnTo.startsWith('/') &&
      !returnTo.startsWith('//')
    )
      safe = url.pathname + url.search;
  } catch {
    /* Use the local panel as the safe default. */
  }
  return `/signin-with-chatgpt?return_to=${encodeURIComponent(safe)}`;
}

export async function requireChatGPTUser(returnTo: string) {
  const user = await getChatGPTUser();
  if (user) return user;
  redirect(chatGPTSignInPath(returnTo));
}
