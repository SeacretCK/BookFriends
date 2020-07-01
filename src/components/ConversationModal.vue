<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="close">
      <div class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="close"><font-awesome-icon icon="times"/></button>
        </div>
        <div class="modal__content" id="scrollDiv">
          <h1 class="modal__content-heading">Your conversation with {{ recipientName }} </h1>

          <section class="conversation">
            <div class="conversation__item"
            v-for="message in userConversation" :key=message.id>
              <div class="message" :class="{'senderIsUser' : message.senderId === getCurrentUser.uid}">
                <div class="message__timestamp">
                  <p>{{message.timestamp | formatDate }}</p>
                </div>
                
                <div class="message__content" :class="{'senderIsUser' : message.senderId === getCurrentUser.uid}">
                  <img 
                    v-if="message.senderId !== getCurrentUser.uid"
                    :src="getUserImage || defaultProfilePicture" 
                    alt="profile picture" 
                    class="message__profile-picture">
                  <img 
                    v-if="message.senderId === getCurrentUser.uid"
                    :src="getCurrentUserProfile.image || defaultProfilePicture" 
                    alt="profile picture" 
                    class="message__profile-picture">
                  <p class="message__message">{{message.message}}</p>
                </div>
                
              </div>
            </div>
          </section>

          <form @submit.prevent class="form">
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
import { mapGetters, mapActions } from 'vuex'
import { messagesCollection } from "@/firebaseConfig"
import moment from 'moment'

export default {
  name: "ConversationModal",
  props: [
    "recipientId",
    "recipientName"
  ],
  data() {
    return {
      message: {
        content: ""
      },
      //userImage: this.getUserImage
    }
  },
  created() {
    this.setUserConversation(this.recipientId);
    
  },
  mounted() {
    this.scrollBottom();
  },

  methods: {
    ...mapActions([
      "setUserConversation",
      "clearUserConversation",
      "setAllMessages",
    ]),
    scrollBottom() {
      console.log("scroll bottom")
      // let element = document.getElementById('modal-wrapper');
      // element.scrollTop = element.scrollHeight;
      document.getElementById('scrollDiv').scrollIntoView({ behavior: 'smooth', block: 'end' });
    },
    sendMessage() {
      console.log("send ", this.message.content)
      messagesCollection
        .add({
          timestamp: new Date(),
          recipientId: this.recipientId,
          //recipientName: this.recipientName, //should work only with the id because user can change their names
          senderId: this.getCurrentUser.uid,
          //senderName: this.getCurrentUserProfile.name,
          message: this.message.content,
          read: false
        })
        .then(() => {
          console.log("message successfully sent")
          this.message.content = "";
          this.setAllMessages();
          setTimeout(() => {
            console.log("timeout for setting userConversation");
            this.setUserConversation(this.recipientId)
          }, 1500);
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    close() {
      this.clearUserConversation();
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters([
      "getCurrentUser",
      "getCurrentUserProfile",
      "getConversations",
      "getDefaultProfilePicture",
      "getUserConversation",
      "getRealtimeUpdateMessages"
    ]),
    getUserImage() { 
      console.log("getUserImage: ", this.getConversations);
      console.log("userImage: ", this.getConversations.find(user => user.userId === this.recipientId).userImage);
      console.log("recipientId: ", this.recipientId);
      return this.getConversations.find(user => user.userId === this.recipientId).userImage
    },
    defaultProfilePicture() {
      return this.getDefaultProfilePicture
    },
    userConversation() {
      let displayedMessages = this.getUserConversation;
      displayedMessages.forEach(message => {
        if (message.recipientId === this.getCurrentUser.uid && message.read === false) {
          messagesCollection
          .doc(message.id)
          .update({
            read: true
          })
          .then(() => {
            console.log("message set to read", message.id)
          })
          .catch(err => {
            console.log(err)
          });
        }
      })

      return this.getUserConversation
    }
  
  },
  watch: {
    getRealtimeUpdateMessages() {
      this.setAllMessages();
      setTimeout(() => {
        console.log("timeout for setting userConversation");
        this.setUserConversation(this.recipientId)
      }, 1500);
    }
  },

  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).format('MMMM Do YYYY, k:mm:ss');
    },
  }
}
</script>


<style lang="scss" scoped>

.modal__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.modal__content-heading {
  padding-bottom: 0.5em;
}

.message.senderIsUser {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message__content {
  width: 80%;
  padding: 0.5rem;
  margin: 5px 0;
  border-radius: 3px;
  background-color: lighten($color-light-grey, 20%);
}

.message__content.senderIsUser {
  background-color: lighten($color-light-blue, 25%);
  flex-direction: row-reverse;
  justify-content: flex-start;
  text-align: right;


  .message__profile-picture {
    margin-right: 0.2rem;
    margin-left: 1rem;
  }
}

.message__timestamp {
  text-align: center;
  align-self: center;
  font-size: 0.8rem;
  font-style: italic;
}

.message__content {
  display: flex;
  text-align: left;
  padding: 0.5rem 0;
}

.message__profile-picture {
  height: 40px;
  width: 40px;
  object-fit: cover;
  border-radius: 20px;
  border: 1px solid $color-light-blue;
  margin-right: 1rem;
  margin-left: 0.2rem;
}

.form {
  display: flex;
  flex-direction: column;
}

.input {
  padding: 0.5rem;
  margin-bottom: 10px;
  border-radius: 3px;
  border: 1px solid $color-medium-grey;
}

</style>