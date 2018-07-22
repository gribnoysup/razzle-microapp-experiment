import Vue from 'vue';

var App = new Vue({
  data: {
    todos: [
      { text: 'Learn JavaScript' },
      { text: 'Build something awesome' },
    ],
  },
  template: `
    <div>
      <h3>This is a Vue microapp just for demonstration purposes</h3>
      <ol>
        <li v-for="todo in todos">
          {{ todo.text }}
        </li>
      </ol>
    </div>
  `,
});

export default App;
