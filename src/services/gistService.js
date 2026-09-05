/**
 * Fetches gas details from a GitHub Gist.
 * 
 * Supports:
 * - Gist ID (e.g. '8c2f1a...', 'a1b2c3d4e5f6...')
 * - GitHub Gist URL (e.g. 'https://gist.github.com/username/gist_id')
 * - Direct Raw Gist URL (e.g. 'https://gist.githubusercontent.com/...')
 * 
 * @param {string} gistIdOrUrl - The GitHub Gist ID or Gist URL containing gas details.
 * @param {Object} [options] - Optional configurations.
 * @param {string} [options.fileName] - Specific filename in the Gist to read.
 * @param {string} [options.token] - GitHub Personal Access Token (for private gists or higher rate limits).
 * @returns {Promise<Object|Array>} Parsed gas details data.
 */
export async function getGasDetailsFromGist(gistIdOrUrl, options = {}) {
  const { fileName = null, token = null } = options;

  if (!gistIdOrUrl || typeof gistIdOrUrl !== 'string') {
    throw new Error('A valid GitHub Gist ID or URL string is required.');
  }

  const trimmedInput = gistIdOrUrl.trim();

  // Handle direct raw URL (e.g., https://gist.githubusercontent.com/...)
  if (trimmedInput.includes('gist.githubusercontent.com')) {
    const headers = token ? { Authorization: `token ${token}` } : {};
    const response = await fetch(trimmedInput, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch raw Gist content (${response.status}: ${response.statusText})`);
    }

    return await response.json();
  }

  // Extract Gist ID from web URL if full URL is passed
  let gistId = trimmedInput;
  const urlMatch = trimmedInput.match(/gist\.github\.com\/(?:[^\/]+\/)?([a-f0-9]+)/i);
  if (urlMatch && urlMatch[1]) {
    gistId = urlMatch[1];
  }

  // GitHub Gist REST API endpoint
  const apiUrl = `https://api.github.com/gists/${gistId}`;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `token ${token}` } : {})
  };

  const response = await fetch(apiUrl, { headers });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Gist not found (404). Check if the Gist ID '${gistId}' is correct.`);
    }
    throw new Error(`GitHub Gist API error (${response.status}): ${response.statusText}`);
  }

  const gistData = await response.json();
  const files = gistData.files;

  if (!files || Object.keys(files).length === 0) {
    throw new Error('No files found in the specified GitHub Gist.');
  }

  // Determine target file inside the Gist
  let targetFile = null;

  if (fileName && files[fileName]) {
    targetFile = files[fileName];
  } else {
    // Pick first file ending with .json or fallback to first file
    const jsonFileName = Object.keys(files).find(name => name.endsWith('.json'));
    targetFile = jsonFileName ? files[jsonFileName] : files[Object.keys(files)[0]];
  }

  if (!targetFile) {
    throw new Error('Could not locate a suitable file in the Gist.');
  }

  // If content is present directly in API response, parse it
  if (targetFile.content) {
    try {
      return JSON.parse(targetFile.content);
    } catch (err) {
      throw new Error(`Invalid JSON format in Gist file '${targetFile.filename}': ${err.message}`);
    }
  } 

  // Otherwise fetch from raw_url (e.g. for large files)
  if (targetFile.raw_url) {
    const rawResponse = await fetch(targetFile.raw_url);
    if (!rawResponse.ok) {
      throw new Error(`Failed to fetch raw file from ${targetFile.raw_url}`);
    }
    return await rawResponse.json();
  }

  throw new Error('Gist file content is empty or unavailable.');
}

export default getGasDetailsFromGist;
