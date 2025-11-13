import { App } from "./src/App.js";

const app = new App();

// ページのロードが完了したときのイベント
window.addEventListener("load", () => {
  app.mount();
});
// ページがアンロードされたときのイベント
window.addEventListener("unload", () => {
  app.unmount();
});
