<template>
  <main class="dashboard-content">
    <div class="dashboard-header">
      <h2>Hello, Admin</h2>
    </div>
    <div class="dashboard-panels">
      <section class="panel panel-month">
        <h3>This Month</h3>
        <div class="panel-chart-placeholder">
          <ul class="panel-stats">
            <li>
              Sales revenue: <strong>{{ monthStats.revenue }}</strong>
            </li>
            <li>
              Units sold: <strong>{{ monthStats.unitsSold }}</strong>
            </li>
            <li>
              Order Completion rate: <strong>{{ monthStats.completionRate }}</strong>
            </li>
          </ul>
        </div>
      </section>
      <section class="panel panel-sales">
        <h3>Sales Over Time</h3>
        <div class="panel-chart">
          <div v-if="salesOverTime.length" class="chart-wrap">
            <Bar :data="chartData" :options="chartOptions" />
          </div>
          <div v-else class="chart-empty">Add data via &ldquo;Input data&rdquo;</div>
        </div>
      </section>
      <section class="panel panel-transactions">
        <h3>Live Transactions</h3>
        <!-- <table class="transactions-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tx, i) in liveTransactions" :key="i">
              <td>{{ tx.customer }}</td>
              <td>{{ tx.details }}</td>
            </tr>
          </tbody>
        </table> -->
        <DevPlaceholder class="live-transactions-placeholder" label="Under dev" />
      </section>
      <section class="panel panel-stocks">
        <h3>Stocks</h3>
        <div class="panel-chart-placeholder"></div>
      </section>
    </div>
    <div class="dashboard-actions">
      <button class="btn-input-data" @click="showInputModal = true">Input data</button>
    </div>
    <BaseModal v-if="showInputModal" title="Edit Dashboard Data" :show="showInputModal">
      <form class="input-data-form" @submit.prevent="applyInputData">
        <fieldset>
          <legend>This Month</legend>
          <label>
            Sales revenue
            <input v-model="editForm.revenue" type="text" placeholder="e.g. ₱14,000" />
          </label>
          <label>
            Units sold
            <input v-model.number="editForm.unitsSold" type="number" min="0" />
          </label>
          <label>
            Order Completion rate
            <input v-model="editForm.completionRate" type="text" placeholder="e.g. 90%" />
          </label>
        </fieldset>
        <fieldset>
          <legend>Sales per Month</legend>
          <div v-for="(point, i) in editForm.salesOverTime" :key="i" class="sales-row">
            <input v-model="point.month" type="text" placeholder="Month" />
            <input v-model.number="point.sales" type="number" min="0" placeholder="Sales" />
            <button type="button" class="btn-remove" @click="editForm.salesOverTime.splice(i, 1)">
              Remove
            </button>
          </div>
          <button type="button" class="btn-add" @click="editForm.salesOverTime.push({ month: '', sales: 0 })">
            + Add month
          </button>
        </fieldset>
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="showInputModal = false">Cancel</button>
          <button type="submit" class="btn-apply">Apply</button>
        </div>
      </form>
    </BaseModal>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import DevPlaceholder from '../DevPlaceholder.vue'
import BaseModal from '../modals/BaseModal.vue'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Placeholder data, easy to replace with axios-fetched data
const monthStats = ref({
  revenue: '₱14,000',
  unitsSold: 24,
  completionRate: '90%',
})

const salesOverTime = ref([
  { month: 'Aug', sales: 12 },
  { month: 'Sep', sales: 18 },
  { month: 'Oct', sales: 22 },
  { month: 'Nov', sales: 15 },
  { month: 'Dec', sales: 28 },
])

const chartData = computed(() => ({
  labels: salesOverTime.value.map((p) => p.month),
  datasets: [
    {
      label: 'Sales',
      data: salesOverTime.value.map((p) => p.sales),
      backgroundColor: 'rgba(90, 24, 24, 0.8)',
      borderColor: 'rgb(90, 24, 24)',
      borderWidth: 1,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const showInputModal = ref(false)
const editForm = ref({
  revenue: '',
  unitsSold: 0,
  completionRate: '',
  salesOverTime: [],
})

watch(showInputModal, (open) => {
  if (open) {
    editForm.value = {
      revenue: monthStats.value.revenue,
      unitsSold: monthStats.value.unitsSold,
      completionRate: monthStats.value.completionRate,
      salesOverTime: salesOverTime.value.map((p) => ({ ...p })),
    }
  }
})

function applyInputData() {
  monthStats.value = {
    revenue: editForm.value.revenue || monthStats.value.revenue,
    unitsSold: editForm.value.unitsSold ?? monthStats.value.unitsSold,
    completionRate: editForm.value.completionRate || monthStats.value.completionRate,
  }
  salesOverTime.value = (editForm.value.salesOverTime || [])
    .filter((p) => p.month && p.sales != null)
    .map((p) => ({ month: String(p.month), sales: Number(p.sales) || 0 }))
  showInputModal.value = false
}

const liveTransactions = ref([
  { customer: 'Juan Dela Cruz', details: 'Order #1234 - Paid' },
  { customer: 'Maria Santos', details: 'Order #1235 - Pending' },
  { customer: 'Pedro Reyes', details: 'Order #1236 - Shipped' },
])
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #222;
}
.sidebar {
  width: 220px;
  background: #5a1818;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
}
.sidebar-title {
  font-size: 1.3rem;
  font-weight: bold;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  border-bottom: 1px solid #3a0e0e;
  letter-spacing: 1px;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
  flex: 1;
}
.nav-item {
  background: none;
  border: none;
  color: #fff;
  text-align: left;
  padding: 0.9rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.nav-item.active,
.nav-item:hover {
  background: #a36a6a;
  color: #fff;
}
.logout {
  margin-top: auto;
  background: #3a0e0e;
  color: #fff;
}

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
.dashboard-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 220px 220px;
  gap: 1.5rem;
}
.panel {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
}
.panel h3 {
  color: #5a1818;
  font-size: 1.1rem;
  margin-bottom: 0.7rem;
}
.panel-chart-placeholder {
  flex: 1;
  border: 2px solid #bdbdbd;
  border-radius: 6px;
  margin-bottom: 0.7rem;
  background: #f7f7f7;
}
.panel-chart {
  flex: 1;
  border: 2px solid #bdbdbd;
  border-radius: 6px;
  margin-bottom: 0.7rem;
  background: #f7f7f7;
  min-height: 100px;
  display: flex;
  flex-direction: column;
}
.chart-wrap {
  flex: 1;
  min-height: 120px;
  padding: 0.5rem;
}
.chart-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 0.9rem;
}
.dashboard-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}
.btn-input-data {
  background: #5a1818;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-input-data:hover {
  background: #7a2828;
}
.input-data-form fieldset {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}
.input-data-form legend {
  font-weight: 600;
  color: #5a1818;
  padding: 0 0.5rem;
}
.input-data-form label {
  display: block;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
}
.input-data-form label input {
  display: block;
  width: 100%;
  margin-top: 0.3rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.sales-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}
.sales-row input {
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.sales-row input:first-child {
  flex: 1;
  min-width: 80px;
}
.sales-row input:last-of-type {
  width: 80px;
}
.btn-remove {
  background: #ccc;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
.btn-remove:hover {
  background: #b00;
  color: #fff;
}
.btn-add {
  background: #eee;
  border: 1px dashed #999;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.3rem;
}
.btn-add:hover {
  background: #e0e0e0;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
.btn-cancel {
  background: #eee;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-apply {
  background: #5a1818;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-apply:hover {
  background: #7a2828;
}
.panel-stats {
  list-style: none;
  padding: 0;
  margin: 20px;
  font-size: 0.98rem;
  color: #333;
}
.panel-stats li {
  margin-bottom: 0.2rem;
}
.transactions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.98rem;
}
.transactions-table th,
.transactions-table td {
  border-bottom: 1px solid #eee;
  padding: 0.4rem 0.6rem;
  text-align: left;
}
.transactions-table th {
  color: #5a1818;
  font-weight: 600;
  background: #f7f7f7;
}
.panel-transactions .live-transactions-placeholder {
  margin-top: 1rem;
}
</style>
