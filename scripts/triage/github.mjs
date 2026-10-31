// The few GitHub and Discord calls the triage makes. Errors name the request and status only, so
// a response body or a token can't reach a log.
const API = 'https://api.github.com';

export const createGitHub = ({ token, repository, fetchImpl = fetch }) => {
  const request = async (route, { method = 'GET', body } = {}) => {
    const response = await fetchImpl(`${API}${route}`, {
      method,
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'x-github-api-version': '2022-11-28',
        ...(body && { 'content-type': 'application/json' }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });
    if (!response.ok)
      throw new Error(`GitHub ${method} ${route.split('?')[0]}: ${response.status}`);
    return response.json();
  };
  const repo = `/repos/${repository}`;

  return {
    recentIssues: (since) =>
      request(`${repo}/issues?state=all&per_page=50&since=${encodeURIComponent(since)}`),
    searchIssues: async (words) => {
      const q = encodeURIComponent(`repo:${repository} is:issue ${words}`);
      return (await request(`/search/issues?per_page=10&q=${q}`)).items;
    },
    comments: (number) => request(`${repo}/issues/${number}/comments?per_page=100`),
    comment: (number, body) =>
      request(`${repo}/issues/${number}/comments`, { method: 'POST', body: { body } }),
    labels: async () => (await request(`${repo}/labels?per_page=100`)).map((label) => label.name),
    addLabels: (number, labels) =>
      request(`${repo}/issues/${number}/labels`, { method: 'POST', body: { labels } }),
  };
};

// An alert that fails must not cost the review, so this warns instead of throwing.
export const sendDiscord = async (url, payload, fetchImpl = fetch) => {
  try {
    const response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) console.warn(`Discord alert failed: ${response.status}`);
  } catch {
    console.warn('Discord alert failed: no response');
  }
};
