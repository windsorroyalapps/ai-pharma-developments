/**
 * Optional Pub/Sub publish after a verified webhook.
 * No-op unless FULFILLMENT_TOPIC is set and the Cloud Run metadata server answers.
 */
async function metadataToken() {
  const res = await fetch(
    'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
    { headers: { 'Metadata-Flavor': 'Google' } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token || null;
}

async function publishFulfillment(payload) {
  const topic = process.env.FULFILLMENT_TOPIC;
  if (!topic || payload.dry_run) return { published: false };
  const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
  if (!project) return { published: false, reason: 'no project' };
  let token;
  try {
    token = await metadataToken();
  } catch (err) {
    return { published: false, reason: 'no metadata server' };
  }
  if (!token) return { published: false, reason: 'no token' };
  const url = `https://pubsub.googleapis.com/v1/projects/${project}/topics/${topic}:publish`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{
        data: Buffer.from(JSON.stringify(payload)).toString('base64'),
        attributes: { source: String(payload.source || 'website') },
      }],
    }),
  });
  return { published: res.ok, topic };
}

module.exports = { publishFulfillment };
