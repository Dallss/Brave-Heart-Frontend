import { defineStore } from 'pinia'

function toDateKey(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function nextId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    // Schedules: array of { id, dateKey, title, startTime, endTime, notes }
    schedules: [],
  }),
  getters: {
    schedulesByDate: (state) => (dateKey) =>
      state.schedules
        .filter((s) => s.dateKey === dateKey)
        .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')),
  },
  actions: {
    addSchedule({ dateKey, title, startTime, endTime, notes }) {
      this.schedules.push({
        id: nextId(),
        dateKey,
        title: title || 'Untitled',
        startTime: startTime || '',
        endTime: endTime || '',
        notes: notes || '',
      })
    },
    updateSchedule(id, payload) {
      const i = this.schedules.findIndex((s) => s.id === id)
      if (i !== -1) {
        this.schedules[i] = { ...this.schedules[i], ...payload }
      }
    },
    removeSchedule(id) {
      this.schedules = this.schedules.filter((s) => s.id !== id)
    },
  },
  persist: true,
})

export { toDateKey }
