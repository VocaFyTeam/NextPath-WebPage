<script setup>
import  { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Card from 'primevue/card'

import { useIamStore } from '../../application/iam.store'

const router = useRouter()
const iamStore = useIamStore()

const user = computed(() => iamStore.user)

const isStudent = computed(() => {
  return user.value?.role === 'student'
})

const logout = () => {
  iamStore.logout()
  router.push('/login')
}
</script>

<template>
  <main class="dashboard-page">

    <header class="dashboard-header">

      <div class="dashboard-brand">
        <div class="brand-logo">
          <img src="/src/./images/LOGO%202.png" alt="NextPath Logo" />
        </div>
      </div>

      <Button
          label="Sign out"
          icon="pi pi-sign-out"
          severity="secondary"
          outlined
          @click="logout"
      />

    </header>

    <section class="dashboard-content">

      <div class="welcome-section">

                <span class="dashboard-label">
                    {{ isStudent ? 'STUDENT' : 'PSYCHOLOGIST' }}
                </span>

        <h2>
          Welcome{{ user?.name ? ', ' + user.name : '' }}!
        </h2>

        <p v-if="isStudent">
          Explore your vocational profile and discover
          career paths aligned with your interests.
        </p>

        <p v-else>
          Manage your students, sessions and vocational
          follow-up from one place.
        </p>

      </div>

      <!-- STUDENT -->
      <div
          v-if="isStudent"
          class="dashboard-grid"
      >

        <Card class="dashboard-card">
          <template #title>
            <i class="pi pi-compass"></i>
            Vocational Test
          </template>

          <template #content>
            <p>
              Discover your interests, abilities and
              professional profile.
            </p>

            <Button
                label="Take the test"
                icon="pi pi-arrow-right"
                @click="router.push('/vocational-test')"
            />
          </template>
        </Card>

        <Card class="dashboard-card">
          <template #title>
            <i class="pi pi-briefcase"></i>
            Career Exploration
          </template>

          <template #content>
            <p>
              Explore careers that match your profile
              and professional interests.
            </p>

            <Button
                label="Explore careers"
                icon="pi pi-arrow-right"
                severity="secondary"
                @click="router.push('/careers')"
            />


          </template>
        </Card>

        <Card class="dashboard-card">
          <template #title>
            <i class="pi pi-map"></i>
            My Career Plan
          </template>

          <template #content>
            <p>
              Follow your progress and build your
              professional roadmap.
            </p>

            <Button
                label="View plan"
                icon="pi pi-arrow-right"
                severity="secondary"
            />
          </template>
        </Card>

      </div>

      <!-- PSYCHOLOGIST -->
      <div
          v-else
          class="dashboard-grid"
      >

        <Card class="dashboard-card">
          <template #title>
            <i class="pi pi-users"></i>
            Students
          </template>

          <template #content>
            <p>
              Monitor the vocational progress of your
              students.
            </p>

            <Button
                label="View students"
                icon="pi pi-arrow-right"
            />
          </template>
        </Card>

        <Card class="dashboard-card">
          <template #title>
            <i class="pi pi-calendar"></i>
            Sessions
          </template>

          <template #content>
            <p>
              Manage your vocational guidance sessions
              and appointments.
            </p>

            <Button
                label="Manage sessions"
                icon="pi pi-arrow-right"
                severity="secondary"
                @click="router.push('/counseling')"
            />
          </template>
        </Card>

        <Card class="dashboard-card">
          <template #title>
            <i class="pi pi-chart-bar"></i>
            Reports
          </template>

          <template #content>
            <p>
              Review evaluations and vocational
              progress reports.
            </p>

            <Button
                label="View reports"
                icon="pi pi-arrow-right"
                severity="secondary"
            />
          </template>
        </Card>

      </div>

    </section>

  </main>
</template>