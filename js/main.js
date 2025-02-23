Vue.component('task-form', {
    data() {
        return {
            title: '', // Заголовок задачи
            description: '', // Описание задачи
            deadline: '', // Дедлайн задачи
        };
    },
    computed: {
        canAddTask() {
            // Проверка, можно ли отправить форму (например, если есть заголовок, описание и дедлайн)
            return this.title && this.description && this.deadline;
        }
    },
    methods: {
        submitTask() {
            // Создаем новый объект задачи
            const newTask = {
                title: this.title,
                description: this.description,
                deadline: this.deadline,
                status: 'unfinished' // Статус задачи по умолчанию
            };

            // Эмитируем событие для родительского компонента с новой задачей
            this.$emit('add-task', newTask);

            // Очищаем форму
            this.resetForm();
        },
        resetForm() {
            // Сбрасываем поля формы
            this.title = '';
            this.description = '';
            this.deadline = '';
        }
    },
    template: `
  <div>
    <form @submit.prevent="submitTask">
      <div>
        <label for="title">Заголовок</label>
        <input type="text" id="title" v-model="title" required />
      </div>

      <div>
        <label for="description">Описание</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>

      <div>
        <label for="deadline">Дедлайн</label>
        <input type="date" id="deadline" v-model="deadline" required />
      </div>

      <button type="submit" :disabled="!canAddTask">Создать задачу</button>
    </form>
  </div>
  `
});

Vue.component('task-column', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
      <h2>Запланированные задачи</h2>
      <ul>
        <li v-for="(task, index) in tasks" :key="index">
          <strong>{{ task.title }}</strong>
          <p>{{ task.description }}</p>
          <p><em>Дедлайн: {{ task.deadline }}</em></p>
          <p>Status: {{ task.status }}</p>
        </li>
      </ul>
    </div>
  `
});


new Vue({
    el: '#app',
    data() {
        return {
            tasks: [] // Массив для хранения задач
        };
    },
    methods: {
        addTask(newTask) {
            // Добавляем новую задачу в массив
            this.tasks.push(newTask);
        }
    }
});
