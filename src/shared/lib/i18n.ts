import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
const resources = {
  en: {
    common: {
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save",
      loading: "Loading...",
      error: "Error",
      confirm: "Confirm"
    },
    tasks: {
      title: "Tasks",
      addTask: "Add Task",
      addSubtask: "Add Subtask",
      editTask: "Edit Task",
      deleteTask: "Delete Task",
      noTasks: "No tasks yet. Create your first task!",
      taskTitle: "Task Title",
      taskDescription: "Task Description",
      enterTitle: "Enter task title...",
      enterDescription: "Enter task description (optional)...",
      deleteConfirm: "Are you sure you want to delete \"{{title}}\"? This action cannot be undone.",
      deleteSubtasksWarning: "This will also delete all subtasks.",
      creating: "Creating...",
      updating: "Updating...",
      deleting: "Deleting...",
      loadingTasks: "Loading tasks...",
      errorLoading: "Failed to load tasks",
      errorSaving: "Failed to save task",
      errorDeleting: "Failed to delete task"
    }
  },
    ru: {
        common: {
        add: "Добавить",
        edit: "Редактировать",
        delete: "Удалить",
        cancel: "Отменить",
        save: "Сохранить",
        loading: "Загрузка...",
        error: "Ошибка",
        confirm: "Подтвердить"
        },
        tasks: {
        title: "Задачи",
        addTask: "Добавить задачу",
        addSubtask: "Добавить подзадачу",
        editTask: "Редактировать задачу",
        deleteTask: "Удалить задачу",
        noTasks: "Пока нет задач. Создайте первую задачу!",
        taskTitle: "Название задачи",
        taskDescription: "Описание задачи",
        enterTitle: "Введите название задачи...",
        enterDescription: "Введите описание задачи (необязательно)...",
        deleteConfirm: "Вы уверены, что хотите удалить \"{{title}}\"? Это действие нельзя отменить.",
        deleteSubtasksWarning: "Это также удалит все подзадачи.",
        creating: "Создание...",
        updating: "Обновление...",
        deleting: "Удаление...",
        loadingTasks: "Загрузка задач...",
        errorLoading: "Не удалось загрузить задачи",
        errorSaving: "Не удалось сохранить задачу",
        errorDeleting: "Не удалось удалить задачу"
        }
    }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    react: {
      useSuspense: false, // Set to false for client-side rendering
    },
  });

export default i18n;
