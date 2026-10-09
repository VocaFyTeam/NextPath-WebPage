<template>
  <div class="counseling-page">
    <h1 class="main-title">Programacion de Sesiones de Orientacion</h1>

    <div class="counseling-grid">
      <!-- Columna Izquierda: Sesiones Programadas -->
      <div class="panel sessions-panel">
        <div class="panel-header">
          <h2 class="panel-title">Sesiones Programadas</h2>
          <button @click="resetForm" class="btn btn-add">Agregar</button>
        </div>

        <div class="sessions-list">
          <div
              v-for="session in counselingStore.sessions"
              :key="session.id"
              class="session-card"
              @click="selectSession(session)"
          >
            <div class="session-info">
              <h3 class="session-card-title">{{ session.title }}</h3>
              <p class="session-datetime">
                Fecha y Hora {{ session.date }} - {{ session.time }}
              </p>
              <p class="session-subtitle">
                {{ session.type === 'GROUP' ? `Alumnos :${session.attendeesCount || 10}` : 'Acompañamiento 1a1' }}
              </p>
            </div>
            <button class="btn btn-card">Ver Mas</button>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Detalles de la Sesión -->
      <div class="panel details-panel">
        <h2 class="panel-title-large">DETALLES DE SESIÓN</h2>

        <form @submit.prevent="handleSaveSession" class="details-form">
          <!-- Tipo de Sesión -->
          <div class="form-group">
            <label class="form-label">Tipo de Sesion</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="form.type" value="INDIVIDUAL" />
                <span>individual</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="form.type" value="GROUP" />
                <span>Grupal</span>
              </label>
            </div>
          </div>

          <!-- Estudiante / Grupo -->
          <div class="form-group">
            <label class="form-label">
              {{ form.type === 'GROUP' ? 'Estudiante/Grupo:' : 'Estudiante:' }}
            </label>
            <input
                v-model="form.target"
                type="text"
                class="form-input"
                placeholder="Ej. Grupo1"
                required
            />
          </div>

          <!-- Observaciones previas -->
          <div class="form-group">
            <label class="form-label label-highlight">Observaiones previas</label>
            <textarea
                v-model="form.notes"
                rows="3"
                class="form-textarea"
                placeholder="Objetivo de la reunion : Profundizar en la autoevaluacion..."
            ></textarea>
          </div>

          <!-- Fecha y Hora -->
          <div class="form-group">
            <label class="form-label">Fecha y hora</label>
            <div class="datetime-grid">
              <input v-model="form.date" type="text" class="form-input text-center" placeholder="12-10-2026" required />
              <input v-model="form.time" type="text" class="form-input text-center" placeholder="11:00 a.m." required />
            </div>
          </div>

          <!-- Enlace de la reunión -->
          <div class="meet-section">
            <span class="meet-label">Enlace de la reunión:</span>
            <div class="meet-input-wrapper">
              <input v-model="form.meetLink" type="text" class="meet-input" readonly />
              <button type="button" @click="copyMeetLink" class="copy-btn" title="Copiar">📋</button>
            </div>
          </div>

          <!-- Botón Agendar -->
          <div class="form-actions">
            <button type="submit" class="btn btn-submit">
              Agendar y notificar al estudiante
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCounselingStore } from '../../application/counseling.store';

const counselingStore = useCounselingStore();

const form = ref({
  id: null,
  type: 'GROUP',
  target: 'Grupo1',
  notes: 'Objetivo de la reunion : Profundizar en la autoevaluacion...',
  date: '12-10-2026',
  time: '11:00 a.m.',
  meetLink: 'https://meet.google.'
});

const selectSession = (session) => {
  form.value = {
    id: session.id,
    type: session.type || 'INDIVIDUAL',
    target: session.title,
    notes: session.notes || '',
    date: session.date || '',
    time: session.time || '',
    meetLink: session.meetLink || 'https://meet.google.'
  };
};

const resetForm = () => {
  form.value = {
    id: null,
    type: 'INDIVIDUAL',
    target: '',
    notes: '',
    date: '',
    time: '',
    meetLink: 'https://meet.google.'
  };
};

const handleSaveSession = () => {
  if (form.value.id) {
    const index = counselingStore.sessions.findIndex(s => s.id === form.value.id);
    if (index !== -1) {
      counselingStore.sessions[index] = {
        ...counselingStore.sessions[index],
        title: form.value.target,
        type: form.value.type,
        date: form.value.date,
        time: form.value.time,
        notes: form.value.notes
      };
    }
  } else {
    counselingStore.addSession({
      title: form.value.target,
      date: form.value.date,
      time: form.value.time,
      type: form.value.type,
      notes: form.value.notes
    });
  }
  alert('¡Sesión agendada correctamente!');
};

const copyMeetLink = () => {
  navigator.clipboard.writeText(form.value.meetLink);
  alert('Enlace copiado');
};
</script>

<style scoped>
.counseling-page {
  padding: 24px;
  background-color: #f3f4f6;
  min-height: 100vh;
  font-family: inherit;
}

.main-title {
  font-size: 28px;
  font-weight: 700;
  color: #0b5e56;
  margin-bottom: 24px;
}

.counseling-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 1024px) {
  .counseling-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.panel {
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sessions-panel {
  border: 1px solid #e5e7eb;
}

.details-panel {
  border: 1.5px solid #0b5e56;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-title {
  font-size: 20px;
  font-weight: 700;
  color: #0b5e56;
  margin: 0;
}

.panel-title-large {
  font-size: 22px;
  font-weight: 800;
  color: #0b5e56;
  margin-top: 0;
  margin-bottom: 24px;
  letter-spacing: 0.5px;
}

/* Botones */
.btn {
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-add {
  background-color: #0b4d46;
  color: white;
  padding: 8px 20px;
  font-size: 14px;
}

.btn-add:hover {
  background-color: #083833;
}

.btn-card {
  background-color: #0b5e56;
  color: white;
  padding: 8px 16px;
  font-size: 13px;
  white-space: nowrap;
}

.btn-card:hover {
  background-color: #08433d;
}

.btn-submit {
  width: 100%;
  background-color: #0b5e56;
  color: white;
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
}

.btn-submit:hover {
  background-color: #08433d;
}

/* Lista de tarjetas */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.session-card {
  background-color: #f3f4f6;
  padding: 16px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}

.session-card:hover {
  border-color: #0b5e56;
}

.session-card-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #111827;
}

.session-datetime {
  font-size: 13px;
  font-weight: 600;
  color: #0b5e56;
  margin: 0 0 2px 0;
}

.session-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Formulario */
.details-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-weight: 700;
  color: #1f2937;
  font-size: 14px;
}

.label-highlight {
  color: #0b5e56;
  font-size: 18px;
}

.radio-group {
  display: flex;
  gap: 24px;
  align-items: center;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

.form-input, .form-textarea {
  width: 100%;
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #0b5e56;
}

.datetime-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.text-center {
  text-align: center;
}

/* Enlace Meet */
.meet-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.meet-label {
  font-weight: 700;
  color: #0b5e56;
  font-size: 16px;
}

.meet-input-wrapper {
  display: flex;
  align-items: center;
  border: 1.5px solid #0b5e56;
  border-radius: 20px;
  padding: 4px 12px;
  background: white;
}

.meet-input {
  border: none;
  outline: none;
  color: #0b5e56;
  font-weight: 700;
  font-size: 13px;
  width: 170px;
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}
</style>