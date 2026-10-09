<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useMonitoringStore } from '../../application/monitoring.store.js';
import { GroupReport } from '../../domain/model/group-report.js';
import GroupComparisonChart from '../components/group-comparison-chart.vue';

const router = useRouter();
const { t } = useI18n();
const iamStore = useIamStore();
const store = useMonitoringStore();
const loading = ref(true);
const selectedGroupIds = ref([]);

onMounted(async () => {
  if (!store.loaded) await store.fetchMonitoring(iamStore.currentUser.id);
  selectedGroupIds.value = store.groups.map(group => group.id);
  loading.value = false;
});

const groupOptions = computed(() => store.groups.map(group => ({ label: group.name, value: group.id })));
const comparison = computed(() => store.groupComparison(selectedGroupIds.value));
const series = computed(() => comparison.value.map(item => ({ id: item.group.id, name: item.group.name, shares: item.shares })));
const selectedStudents = computed(() => comparison.value.flatMap(item => item.students));

const demandedCareers = computed(() =>
    GroupReport.careerDemand(selectedStudents.value).slice(0, 5)
        .map(item => ({ ...item, name: store.careerName(item.careerId) })));

/** "Hallazgos clave y conclusiones" generated from the data. */
const findings = computed(() => {
  const items = [];
  const [first, second] = comparison.value;
  if (!first) return items;
  const dims = GroupReport.topDimensions(first.shares, 2);
  items.push(t('reports.findingDominant', {
    value: GroupReport.shareWithDominant(first.students, dims), group: first.group.name,
    first: t(`dimensions.${dims[0]}.name`), second: t(`dimensions.${dims[1]}.name`)
  }));
  if (second) {
    const dimension = GroupReport.biggestAdvantage(first.shares, second.shares);
    items.push(t('reports.findingCompare', { other: second.group.name, group: first.group.name, dimension: t(`dimensions.${dimension}.name`) }));
  }
  if (demandedCareers.value[0]) {
    items.push(t('reports.findingAction', { career: demandedCareers.value[0].name }));
  }
  return items;
});

// Keep at least one group selected.
watch(selectedGroupIds, (value, oldValue) => {
  if (!value.length && oldValue?.length) selectedGroupIds.value = [oldValue[0]];
});

function exportReport() {
  window.print();
}

function organizeWorkshop() {
  router.push({ name: 'counseling-sessions', query: { new: 'group', groupId: selectedGroupIds.value[0] } });
}
</script>

<template>
  <div class="np-page report">
    <section class="report__toolbar">
      <label for="group-select" class="report__toolbar-label">{{ $t('reports.selectGroup') }}</label>
      <pv-multi-select input-id="group-select" v-model="selectedGroupIds" :options="groupOptions" option-label="label" option-value="value"
                       display="comma" class="report__select np-no-print" :show-toggle-all="false" :placeholder="$t('reports.selectGroup')" />
      <span class="report__print-groups">{{ comparison.map(item => item.group.name).join(' ; ') }}</span>
      <button type="button" class="np-btn report__export np-no-print" @click="exportReport">{{ $t('reports.export') }}</button>
    </section>

    <div class="report__grid">
      <section class="np-panel report__chart">
        <h1 class="report__title">{{ $t('reports.comparisonTitle') }}</h1>
        <group-comparison-chart v-if="!loading" :series="series" />
        <div v-else class="np-skeleton" style="height: 220px"></div>
      </section>

      <section class="np-panel report__careers">
        <h2>{{ $t('reports.demandedCareers') }}</h2>
        <ul v-if="demandedCareers.length">
          <li v-for="career in demandedCareers" :key="career.careerId">
            <strong>{{ career.name }}</strong>
            <span>{{ $t('reports.preference', { value: career.percentage }) }}</span>
          </li>
        </ul>
        <p v-else-if="!loading" class="np-empty">{{ $t('reports.noData') }}</p>
      </section>
    </div>

    <section class="report__findings">
      <h2>{{ $t('reports.findingsTitle') }}</h2>
      <ul>
        <li v-for="(finding, i) in findings" :key="i">{{ finding }}</li>
      </ul>
      <div class="report__findings-actions np-no-print">
        <button type="button" class="np-btn report__workshop" @click="organizeWorkshop">{{ $t('reports.organizeWorkshop') }}</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.report {
  gap: 14px;
}

.report__toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid var(--np-border);
  background: var(--np-surface);
}

.report__toolbar-label {
  font-family: var(--np-font-heading);
  font-size: 15px;
  font-weight: 600;
  color: var(--np-ink);
}

.report__select {
  min-width: 180px;
  font-size: 12px;
}

.report__select :deep(.p-multiselect-label) {
  padding: 4px 8px;
  font-size: 12px;
}

.report__print-groups {
  display: none;
}

.report__export {
  margin-left: auto;
  border-radius: 0;
  background: var(--np-primary-dark);
  font-family: var(--np-font-body);
  font-weight: 500;
}

.report__export:hover {
  background: var(--np-primary-dark-hover);
}

.report__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
  gap: 12px;
}

.report__chart {
  padding: 20px 18px 22px;
}

.report__title {
  margin: 0 0 22px;
  color: var(--np-primary);
  font-size: 19px;
  font-weight: 600;
}

.report__careers {
  padding: 12px 10px;
}

.report__careers h2 {
  margin: 0 0 12px;
  font-family: var(--np-font-heading);
  font-size: 15px;
  font-weight: 600;
  color: var(--np-ink);
}

.report__careers ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.report__careers li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px;
  border: 1px solid var(--np-border-strong);
  background: var(--np-surface-alt);
  font-size: 11.5px;
}

.report__careers strong {
  min-width: 100px;
  font-size: 11.5px;
}

.report__careers span {
  color: var(--np-muted);
}

.report__findings {
  padding: 10px 16px 14px;
  border: 1px solid var(--np-primary);
  background: var(--np-surface);
}

.report__findings h2 {
  margin: 0 0 6px;
  color: var(--np-primary);
  font-size: 19px;
  font-weight: 600;
}

.report__findings ul {
  margin: 0;
  padding-left: 32px;
  font-size: 12px;
  line-height: 1.5;
}

.report__findings-actions {
  display: flex;
  justify-content: flex-end;
}

.report__workshop {
  border-radius: 0;
  font-family: var(--np-font-body);
  font-weight: 500;
}

@media (max-width: 1000px) {
  .report__grid {
    grid-template-columns: 1fr;
  }
}

@media print {
  .report__print-groups {
    display: inline;
    font-weight: 600;
  }

  .report__grid {
    grid-template-columns: 1.7fr 1fr;
  }
}
</style>
