const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO
const FILE_PATH = import.meta.env.VITE_ENTRIES_FILE || 'entries.json'

const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  'Content-Type': 'application/json',
  Accept: 'application/vnd.github+json',
}

/**
 * Lấy danh sách entries từ GitHub
 * @returns {{ entries: Array, sha: string }}
 */
export async function fetchEntries() {
  const res = await fetch(API_BASE, { headers })

  if (res.status === 404) {
    // File chưa tồn tại
    return { entries: [], sha: null }
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const content = atob(data.content.replace(/\n/g, ''))
  const entries = JSON.parse(content)

  return { entries, sha: data.sha }
}

/**
 * Lưu toàn bộ entries lên GitHub (tạo hoặc update file)
 * @param {Array} entries
 * @param {string|null} sha - SHA của file hiện tại (null nếu tạo mới)
 */
export async function saveEntries(entries, sha) {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(entries, null, 2))))

  const body = {
    message: `📝 Add diary entry - ${new Date().toLocaleString('vi-VN')}`,
    content,
    ...(sha ? { sha } : {}),
  }

  const res = await fetch(API_BASE, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || `GitHub API error: ${res.status}`)
  }

  return res.json()
}

/**
 * Thêm 1 entry mới vào file
 * @param {object} entry
 */
export async function addEntry(entry) {
  const { entries, sha } = await fetchEntries()
  const updated = [entry, ...entries]
  await saveEntries(updated, sha)
  return updated
}

/**
 * Xóa 1 entry theo id
 * @param {number} id
 */
export async function deleteEntry(id) {
  const { entries, sha } = await fetchEntries()
  const updated = entries.filter(e => e.id !== id)
  await saveEntries(updated, sha)
  return updated
}
