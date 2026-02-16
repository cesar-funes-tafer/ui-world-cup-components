import { defineCustomElement } from "vue";
import FootballGameComponent from "../components/football-game.ce.vue";

if (!customElements.get("football-game")) {
  customElements.define(
    "football-game",
    defineCustomElement(FootballGameComponent),
  );
}
