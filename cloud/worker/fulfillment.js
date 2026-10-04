/**
 * Optional Pub/Sub publish for verified payments.
 * No-op unless FULFILLMENT_TOPIC is set and the runtime has a metadata token.
 * Never publishes from dry-run sessions.
 */
const { GoogleAuth } = require('google-auth-library');

async function publishFulfillment(payload) {
  const topic = process.env.FULFILLMENT_TOPIC;
  if (!topic) return { published: false, reason: 'FULFILLMENT_TOPIC unset' };
  if (payload.dry_run) return { published: false, reason: 'dry_run' };

  const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/pubsub'] });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
  if (!project || !token || !token.token) {
    return { published: false, reason: 'no runtime identity' };
  }

  const url = `https://pubsub.googleapis.com/v1/projects/${project}/topics/${topic}:publish`;
  const body = {
    messages: [{
      data: Buffer.from(JSON.stringify(payload)).toString('base64'),
      attributes: { source: String(payload.source || 'website') },
    }],
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('fulfillment publish failed', res.status, text.slice(0, 300));
    return { published: false, reason: 'publish_failed' };
  }
  return { published: true, topic };
}

module.exports = { publishFulfillment };
