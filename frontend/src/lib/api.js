const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function askQuestion(question) {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(`Backend responded with ${response.status}`);
  }

  return response.json();
}

export async function uploadDocuments(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 5 * 60 * 1000);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const detail = errorBody?.detail || `Upload failed with ${response.status}`;
      throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }

    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Upload timed out while indexing. Try a smaller file or wait and refresh.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function getDocuments() {
  const response = await fetch(`${API_BASE_URL}/documents`);
  if (!response.ok) {
    throw new Error(`Documents request failed with ${response.status}`);
  }
  return response.json();
}

export async function deleteDocument(documentId) {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Delete failed with ${response.status}`);
  }
  return response.json();
}

export async function getAnalytics() {
  const response = await fetch(`${API_BASE_URL}/analytics`);
  if (!response.ok) {
    throw new Error(`Analytics request failed with ${response.status}`);
  }
  return response.json();
}
