<template>
  <main class="dashboard-content">
    <div class="dashboard-header">
      <h2>Calendar</h2>
    </div>

    <div class="calendar-toolbar">
      <button type="button" class="nav-btn" @click="prevMonth" aria-label="Previous month">
        ‹
      </button>
      <h3 class="current-month">{{ monthTitle }}</h3>
      <button type="button" class="nav-btn" @click="nextMonth" aria-label="Next month">
        ›
      </button>
    </div>

    <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day" class="calendar-cell calendar-cell--head">
        {{ day }}
      </div>
      <template v-for="(cell, i) in gridCells" :key="i">
        <button
          v-if="cell"
          type="button"
          class="calendar-cell calendar-cell--day"
          :class="{
            'calendar-cell--other': cell.otherMonth,
            'calendar-cell--today': cell.isToday,
            'calendar-cell--has-schedules': scheduleCount(cell.dateKey) > 0,
          }"
          @click="openDay(cell.dateKey)"
        >
          <span class="cell-date">{{ cell.day }}</span>
          <span v-if="scheduleCount(cell.dateKey)" class="cell-badge">
            {{ scheduleCount(cell.dateKey) }}
          </span>
        </button>
        <div v-else class="calendar-cell calendar-cell--empty"></div>
      </template>
    </div>

    <BaseModal :show="dayModalOpen" :title="dayModalTitle" @click.self="dayModalOpen = false">
      <div class="day-modal-content">
        <div class="schedule-list">
          <div
            v-for="s in daySchedules"
            :key="s.id"
            class="schedule-item"
          >
            <div class="schedule-item-main">
              <span class="schedule-title">{{ s.title }}</span>
              <span class="schedule-time">
                {{ s.startTime }}{{ s.endTime ? ` – ${s.endTime}` : '' }}
              </span>
              <p v-if="s.notes" class="schedule-notes">{{ s.notes }}</p>
            </div>
            <button
              type="button"
              class="schedule-delete"
              aria-label="Delete schedule"
              @click="removeSchedule(s.id)"
            >
              ×
            </button>
          </div>
          <p v-if="daySchedules.length === 0" class="no-schedules">No schedules for this day.</p>
        </div>

        <div class="day-modal-actions">
          <button type="button" class="close-btn" @click="dayModalOpen = false">Close</button>
        </div>
        <form class="add-schedule-form" @submit.prevent="addSchedule">
          <h4>Add schedule</h4>
          <input
            v-model="newSchedule.title"
            type="text"
            placeholder="Title"
            required
            class="form-input"
          />
          <div class="form-row">
            <input
              v-model="newSchedule.startTime"
              type="time"
              placeholder="Start"
              class="form-input"
            />
            <input
              v-model="newSchedule.endTime"
              type="time"
              placeholder="End"
              class="form-input"
            />
          </div>
          <textarea
            v-model="newSchedule.notes"
            placeholder="Notes (optional)"
            rows="2"
            class="form-input form-textarea"
          ></textarea>
          <button type="submit" class="submit-btn">Add</button>
        </form>
      </div>
    </BaseModal>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from '../modals/BaseModal.vue'
import { useCalendarStore, toDateKey } from '../../../stores/calendar.js'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarStore = useCalendarStore()
const viewDate = ref(new Date())
const selectedDateKey = ref(null)
const dayModalOpen = ref(false)

const newSchedule = ref({
  title: '',
  startTime: '',
  endTime: '',
  notes: '',
})

const monthTitle = computed(() =>
  viewDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

const gridCells = computed(() => {
  const year = viewDate.value.getFullYear()
  const month = viewDate.value.getMonth()
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startPad = first.getDay()
  const daysInMonth = last.getDate()
  const prevMonthLast = new Date(year, month, 0).getDate()
  const cells = []

  for (let i = 0; i < startPad; i++) {
    const d = prevMonthLast - startPad + i + 1
    const dateKey = toDateKey(new Date(year, month - 1, d))
    cells.push({
      day: d,
      dateKey,
      otherMonth: true,
      isToday: false,
    })
  }
  const todayKey = toDateKey(new Date())
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = toDateKey(new Date(year, month, d))
    cells.push({
      day: d,
      dateKey,
      otherMonth: false,
      isToday: dateKey === todayKey,
    })
  }
  const remaining = 42 - cells.length
  for (let i = 0; i < remaining; i++) {
    const dateKey = toDateKey(new Date(year, month + 1, i + 1))
    cells.push({
      day: i + 1,
      dateKey,
      otherMonth: true,
      isToday: false,
    })
  }
  return cells
})

function scheduleCount(dateKey) {
  return calendarStore.schedulesByDate(dateKey).length
}

const daySchedules = computed(() =>
  selectedDateKey.value ? calendarStore.schedulesByDate(selectedDateKey.value) : []
)

const dayModalTitle = computed(() => {
  if (!selectedDateKey.value) return 'Schedule'
  const [y, m, d] = selectedDateKey.value.split('-')
  const date = new Date(Number(y), Number(m) - 1, Number(d))
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
})

function prevMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1)
}

function nextMonth() {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1)
}

function openDay(dateKey) {
  selectedDateKey.value = dateKey
  dayModalOpen.value = true
  resetNewSchedule()
}

watch(dayModalOpen, (open) => {
  if (!open) selectedDateKey.value = null
})

function resetNewSchedule() {
  newSchedule.value = { title: '', startTime: '', endTime: '', notes: '' }
}

function addSchedule() {
  if (!selectedDateKey.value) return
  calendarStore.addSchedule({
    dateKey: selectedDateKey.value,
    title: newSchedule.value.title.trim(),
    startTime: newSchedule.value.startTime,
    endTime: newSchedule.value.endTime,
    notes: newSchedule.value.notes.trim(),
  })
  resetNewSchedule()
}

function removeSchedule(id) {
  calendarStore.removeSchedule(id)
}
</script>

<style scoped>
.dashboard-header {
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #bdbdbd;
  padding-bottom: 0.7rem;
}
.dashboard-header h2 {
  font-size: 2rem;
  color: #5a1818;
  margin: 0;
}

.calendar-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.nav-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #bdbdbd;
  background: #fff;
  color: #5a1818;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}
.nav-btn:hover {
  background: #5a1818;
  color: #fff;
  border-color: #5a1818;
}
.current-month {
  margin: 0;
  font-size: 1.35rem;
  color: #5a1818;
  min-width: 200px;
  text-align: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  max-width: 900px;
  margin: 0 auto;
}
.calendar-cell {
  aspect-ratio: 1;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 0.95rem;
  border-radius: 8px;
}
.calendar-cell--head {
  font-weight: 600;
  color: #5a1818;
  background: #f5eaea;
}
.calendar-cell--day {
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  position: relative;
}
.calendar-cell--day:hover {
  background: #faf5f5;
  border-color: #5a1818;
}
.calendar-cell--other {
  color: #999;
  background: #fafafa;
}
.calendar-cell--today {
  border-color: #5a1818;
  background: #fdf2f2;
  font-weight: 600;
}
.calendar-cell--has-schedules .cell-badge {
  display: inline-flex;
}
.cell-date {
  display: block;
}
.cell-badge {
  display: none;
  margin-top: 2px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: #5a1818;
  color: #fff;
  font-size: 0.75rem;
  align-items: center;
  justify-content: center;
}
.calendar-cell--empty {
  background: transparent;
  min-height: 0;
  aspect-ratio: unset;
}

.day-modal-content {
  min-width: 320px;
  max-width: 420px;
}
.schedule-list {
  margin-bottom: 1.5rem;
  max-height: 220px;
  overflow-y: auto;
}
.schedule-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: #fafafa;
}
.schedule-item-main {
  flex: 1;
  min-width: 0;
}
.schedule-title {
  font-weight: 600;
  color: #5a1818;
  display: block;
}
.schedule-time {
  font-size: 0.9rem;
  color: #666;
}
.schedule-notes {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #555;
}
.schedule-delete {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: none;
  background: #e0e0e0;
  color: #333;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}
.schedule-delete:hover {
  background: #c62828;
  color: #fff;
}
.no-schedules {
  margin: 0;
  color: #888;
  font-size: 0.95rem;
}

.day-modal-actions {
  margin-bottom: 1rem;
}
.close-btn {
  padding: 0.5rem 1rem;
  background: #e0e0e0;
  color: #333;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.close-btn:hover {
  background: #bdbdbd;
}

.add-schedule-form h4 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
  color: #5a1818;
}
.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
}
.form-textarea {
  resize: vertical;
  min-height: 60px;
}
.form-row {
  display: flex;
  gap: 0.5rem;
}
.form-row .form-input {
  flex: 1;
}
.submit-btn {
  margin-top: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: #5a1818;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.submit-btn:hover {
  background: #3d1010;
}
</style>
