// Netlify runs this event function (named after the `submission-created` event) for every verified
// Report form submission. The work is in scripts/triage/form.mjs, which its tests cover.
// It needs GITHUB_ISSUES_TOKEN (fine-grained: Issues read and write on diballesteros/nuzlocke only)
// and optionally DISCORD_WEBHOOK_URL, both in Netlify's environment variables with the Functions
// scope. Variables set in netlify.toml don't reach functions.
import { handleSubmission } from '../../scripts/triage/form.mjs';

export default async (request) => {
  const { payload } = await request.json();
  const result = await handleSubmission({ payload, env: process.env });
  console.info(`Report form submission ${payload?.number}: ${result.status}`);
  return new Response(null, { status: 204 });
};
