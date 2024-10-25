<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Ajouter un nouvel acteur</h2>

      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>

      <form @submit.prevent="submitForm">
        <div class="form-row">
          <div class="form-group">
            <label for="firstname">Prénom</label>
            <input
              id="firstname"
              v-model="actor.firstname"
              type="text"
              placeholder="Prénom de l'acteur"
            />
          </div>

          <div class="form-group">
            <label for="lastname">Nom <span class="required">*</span></label>
            <input
              id="lastname"
              v-model="actor.lastname"
              type="text"
              required
              placeholder="Nom de l'acteur"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="dob"
              >Date de naissance <span class="required">*</span></label
            >
            <input id="dob" v-model="actor.dob" type="date" required />
          </div>

          <div class="form-group">
            <label for="gender">Genre <span class="required">*</span></label>
            <select id="gender" v-model="actor.gender" required>
              <option value="">Sélectionner un genre</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="nationality"
            >Nationalité <span class="required">*</span></label
          >
          <select id="nationality" v-model="actor.nationality" required>
            <option value="">Sélectionner un pays</option>
            <option
              v-for="country in countries"
              :key="country.code"
              :value="country.code"
            >
              {{ country.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="media">Photo (URL)</label>
          <input
            id="media"
            v-model="actor.media"
            type="url"
            placeholder="https://exemple.com/photo.jpg"
          />
        </div>

        <div class="form-group">
          <label for="bio">Biographie</label>
          <textarea
            id="bio"
            v-model="actor.bio"
            rows="4"
            placeholder="Biographie de l'acteur"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="awards">Nombre de récompenses</label>
            <input
              id="awards"
              v-model="actor.awards"
              type="number"
              min="0"
              placeholder="0"
            />
          </div>

          <div class="form-group">
            <label for="deathDate">Date de décès</label>
            <input
              id="deathDate"
              v-model="actor.deathDate"
              type="date"
              :max="currentDate"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            <i class="fas fa-times"></i> Annuler
          </button>
          <button type="submit" class="btn-submit">
            <i class="fas fa-check"></i> Ajouter l'acteur
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddActorForm",
  data() {
    return {
      actor: {
        firstname: "",
        lastname: "",
        dob: "",
        nationality: "",
        gender: "",
        media: "",
        bio: "",
        awards: null,
        deathDate: null,
      },
      error: null,
      countries: [
        { code: "FR", name: "France" },
        { code: "US", name: "États-Unis" },
        { code: "GB", name: "Royaume-Uni" },
        { code: "DE", name: "Allemagne" },
        { code: "IT", name: "Italie" },
        { code: "ES", name: "Espagne" },
        { code: "CA", name: "Canada" },
        // Ajouter d'autres pays selon vos besoins
      ],
    };
  },
  computed: {
    currentDate() {
      return new Date().toISOString().split("T")[0];
    },
  },
  methods: {
    validateForm() {
      if (!this.actor.lastname) {
        this.error = "Le nom est requis";
        return false;
      }
      if (!this.actor.dob) {
        this.error = "La date de naissance est requise";
        return false;
      }
      if (!this.actor.nationality) {
        this.error = "La nationalité est requise";
        return false;
      }
      if (!this.actor.gender) {
        this.error = "Le genre est requis";
        return false;
      }

      // Vérifier que la date de décès est après la date de naissance
      if (
        this.actor.deathDate &&
        this.actor.dob &&
        this.actor.deathDate <= this.actor.dob
      ) {
        this.error =
          "La date de décès doit être postérieure à la date de naissance";
        return false;
      }

      return true;
    },
    async submitForm() {
      try {
        if (!this.validateForm()) {
          return;
        }

        const formattedActor = {
          ...this.actor,
          awards: this.actor.awards ? parseInt(this.actor.awards) : 0,
        };

        await this.$emit("add-actor", formattedActor);
        this.$emit("close");
      } catch (error) {
        this.error = error.message;
      }
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--background-color);
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: var(--border-color);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 4px;
}

h2 {
  margin-bottom: 2rem;
  text-align: center;
  color: var(--text-color);
  font-size: 1.5rem;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

.required {
  color: #dc2626;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--accent-color);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-submit,
.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-submit {
  background-color: var(--accent-color);
  color: white;
}

.btn-cancel {
  background-color: #9ca3af;
  color: white;
}

.btn-submit:hover,
.btn-cancel:hover {
  opacity: 0.9;
}

@media (max-width: 640px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%;
    justify-content: center;
  }
}
</style>
