Vue.component('task-form', {
    data() {
        return {
            title: '',
            description: '',
            deadline: ''
        };
    },
    computed: {
        canAddTask() {
            return this.title && this.description && this.deadline;
        }
    },
    methods: {
        submitTask() {
            const newTask = {
                title: this.title,
                description: this.description,
                deadline: this.deadline,
                status: 'unfinished',
                lastEdited: new Date().toISOString() // Временной штамп последнего редактирования
            };

            // Эмитируем добавление задачи
            this.$emit('add-task', newTask);
            this.resetForm();
        },
        resetForm() {
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
    data() {
        return {
            editingIndex: null, // Индекс редактируемой задачи
            editedTitle: '',
            editedDescription: '',
            editedDeadline: ''
        };
    },
    methods: {
        deleteTask(index) {
            this.$emit('delete-task', index); // Эмитируем удаление задачи
        },
        editTask(index) {
            const task = this.tasks[index];
            this.editingIndex = index;
            this.editedTitle = task.title;
            this.editedDescription = task.description;
            this.editedDeadline = task.deadline;
        },
        saveTask() {
            const updatedTask = {
                title: this.editedTitle,
                description: this.editedDescription,
                deadline: this.editedDeadline,
                status: this.tasks[this.editingIndex].status, // Сохраняем текущий статус
                lastEdited: new Date().toISOString() // Обновляем временной штамп
            };
            this.$emit('update-task', { index: this.editingIndex, updatedTask });
            this.editingIndex = null; // Сбросить индекс редактируемой задачи
        },
        moveToInProgress(index) {
            // Перемещаем задачу в раздел "В работе"
            const task = this.tasks[index];
            task.status = 'inProgress';
            this.$emit('update-task', { index, updatedTask: task });
        }
    },
    template: `
  <div>
    <h2>Запланированные задачи</h2>
    <ul>
      <li v-for="(task, index) in tasks.filter(task => task.status === 'unfinished')" :key="index">
        <div v-if="editingIndex === index">
          <!-- Форма для редактирования задачи -->
          <div>
            <label for="title">Заголовок</label>
            <input type="text" id="title" v-model="editedTitle" required />
          </div>
          <div>
            <label for="description">Описание</label>
            <textarea id="description" v-model="editedDescription" required></textarea>
          </div>
          <div>
            <label for="deadline">Дедлайн</label>
            <input type="date" id="deadline" v-model="editedDeadline" required />
          </div>
          <button @click="saveTask">Сохранить</button>
        </div>
        <div v-else>
          <!-- Отображение задачи -->
          <strong>{{ task.title }}</strong>
          <p>{{ task.description }}</p>
          <p><em>Дедлайн: {{ task.deadline }}</em></p>
          <p>Status: {{ task.status }}</p>
          <p v-if="task.lastEdited">Последнее редактирование: {{ task.lastEdited }}</p>
          <button @click="editTask(index)">Редактировать</button>
          <button @click="deleteTask(index)">Удалить</button>
          <button @click="moveToInProgress(index)">Переместить в работу</button>
        </div>
      </li>
    </ul>
  <h2>Задачи в работе</h2>
    <ul>
      <li v-for="(task, index) in tasks.filter(task => task.status === 'inProgress')" :key="index">
        <strong>{{ task.title }}</strong>
        <p>{{ task.description }}</p>
        <p><em>Дедлайн: {{ task.deadline }}</em></p>
        <p>Status: {{ task.status }}</p>
        <p v-if="task.lastEdited">Последнее редактирование: {{ task.lastEdited }}</p>
        <button @click="editTask(index)">Редактировать</button>
        <button @click="deleteTask(index)">Удалить</button>
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
        },
        deleteTask(index) {
            // Удаляем задачу из массива
            this.tasks.splice(index, 1);
        },
        updateTask({ index, updatedTask }) {
            // Обновляем задачу в массиве
            this.tasks.splice(index, 1, updatedTask);
        }
    }
});

