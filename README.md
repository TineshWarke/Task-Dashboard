# 🧠 Task Management Dashboard

A responsive and interactive Kanban-style task management system built using **React.js**, **Material UI**, and **Drag and Drop** functionality powered by `@hello-pangea/dnd`.

## 📌 Features

- ✅ Create, edit, and delete tasks with title, description, priority, category, due date, and reminder.
- 🔄 Drag-and-drop tasks across **To Do**, **In Progress**, and **Done** stages.
- 🔍 Multi-criteria filtering:
  - By **Priority** (High, Medium, Low)
  - By **Category** (Work, Personal, Urgent, etc.)
  - By **Due Date** (Today, This Week)
- 🔔 Reminder pop-ups for upcoming tasks.
- 💾 Data persistence with `localStorage`.
- 📱 Responsive layout using Material UI components.

---

## 🧠 Approach

The application was built following **component-driven architecture** and modular design principles for scalability and readability. Key decisions and approaches include:

### 1. **State Management**
- Used React's `useState` and `useEffect` for local state.
- Task data is organized in an object structure with keys: `todo`, `inprogress`, and `done`.

### 2. **Persistence**
- Leveraged `localStorage` to save and restore tasks, eliminating the need for a backend in the MVP.

### 3. **Drag & Drop**
- Implemented using `@hello-pangea/dnd`, which supports robust drag-and-drop interactions with accessibility in mind.

### 4. **Filtering**
- Added filters that act **independently and combinatorially**.
- Filtering is applied in-memory to reduce complexity and avoid unnecessary rerenders.

### 5. **Reminder Notifications**
- Reminders are managed with `setTimeout` based on the user's local system time.
- Users are alerted using browser `alert()` for simplicity; future enhancements can use `Notifications API`.

---

## ⚙️ Assumptions

- Each task contains:
  - `id`, `title`, `description`, `priority`, `dueDate`, `reminder`, `category`, and `stage`.
- Task `category` is a single string (not a multi-tag system).
- Users operate in the same time zone as the system (for reminders).
- No authentication or multi-user management in this version.
- All data is non-persistent across devices — `localStorage` is per browser instance.

---

## 🚀 Getting Started

Follow the steps below to run the project locally.

### 🔧 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm or yarn

### 📦 Installation

```bash
git clone https://github.com/TineshWarke/Task-Dashboard.git
cd Task-Dashboard
npm install
