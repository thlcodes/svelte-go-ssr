import App from './App.svelte'

export default (state = {}) => App.render({name: state.name || "World"}).html