import App from './App.svelte';
import "./client.css";

setTimeout(() => {
  const app = new App({
    target: document.body,
    hydrate: true,
    props: {
      name: 'world'
    },
    anchor: document.querySelector("footer")
  });
}, 2000)

//export default app;