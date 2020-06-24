<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="$emit('close')">
      <div class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="$emit('close')"><font-awesome-icon icon="times"/></button>
        </div>
        <div class="modal__content">

          <form @submit.prevent class="form">
            <h1 class="form-heading">Send a message to {{ recipientName }} </h1>
            <textarea class="input"
              v-model.trim="message.content"
              rows="5">
            </textarea>
            <button
              class="button"
              :disabled="!message.content"
              @click="sendMessage"
            >
              Send message
            </button>
          </form>

        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "SendMessage",
  props: [
    "recipientId",
    "recipientName"
  ],
  data() {
    return {
      message: {
        content: ""
      }
    }
  },
  methods: {
    sendMessage() {
      console.log("send ", this.message.content)
    }
  },
  computed: {
    ...mapGetters([
      "getCurrentUser"
    ]),
    senderId() {
      return this.getCurrentUser.uid
    }
  }
}
</script>


<style lang="scss" scoped>

.modal__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.form {
  display: flex;
  flex-direction: column;
}

.form__heading {
  padding-bottom: 0.5em;
}

.input {
  padding: 0.5rem;
  margin-bottom: 10px;
  border-radius: 3px;
  border: 1px solid $color-medium-grey;
}

</style>