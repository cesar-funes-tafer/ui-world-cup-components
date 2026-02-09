import { defineCustomElement } from 'vue'
import UserProfile from './user-profile.ce.vue'

customElements.define('user-profile', defineCustomElement(UserProfile))
