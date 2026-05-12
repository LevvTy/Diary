const TZ_OFFSET = 7 * 60 // UTC+7 tính bằng phút

/** Trả về Date hiện tại theo UTC+7 */
export function nowVN() {
  const now = new Date()
  return new Date(now.getTime() + TZ_OFFSET * 60 * 1000)
}

/** Chuyển Date sang ISO string UTC+7 (không có Z ở cuối) */
export function toVNISOString(date = new Date()) {
  const vn = new Date(date.getTime() + TZ_OFFSET * 60 * 1000)
  return vn.toISOString().replace('Z', '+07:00')
}

/** Lấy YYYY-MM-DD từ ISO string (lấy trực tiếp, không parse qua Date) */
export function getDateKey(isoString) {
  return isoString.slice(0, 10)
}

/** Lấy HH:MM từ ISO string */
export function getTimeStr(isoString) {
  return isoString.slice(11, 16)
}

/** Format ngày dạng "12 tháng 5, 2026" từ key YYYY-MM-DD */
export function formatDateLabel(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Format ngày đầy đủ "Thứ Ba, 12 tháng 5, 2026" */
export function formatFullDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Format datetime-local input value từ Date UTC+7 */
export function toInputDatetimeValue(date = new Date()) {
  const vn = new Date(date.getTime() + TZ_OFFSET * 60 * 1000)
  const iso = vn.toISOString()
  return iso.slice(0, 16) // YYYY-MM-DDTHH:MM
}
