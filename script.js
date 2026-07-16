/* =========================================================
   Ugwu Miracle — Student Portfolio
   script.js — shared behaviour for all pages
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  highlightActiveNavLink();
  runTerminalTyping();
  initPlanner();
  initContactForm();
});

/* ---------------------------------------------------------
   1. Highlight the current page in the nav (DOM manipulation)
   --------------------------------------------------------- */
function highlightActiveNavLink() {
  const navLinks = document.querySelectorAll('nav.mainnav a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ---------------------------------------------------------
   2. Homepage terminal "typing" effect
   --------------------------------------------------------- */
function runTerminalTyping() {
  const typedEl = document.querySelector('[data-typing]');
  if (!typedEl) return;

  const fullText = typedEl.getAttribute('data-typing');
  typedEl.textContent = '';

  let index = 0;
  function typeNextChar() {
    if (index <= fullText.length) {
      typedEl.textContent = fullText.slice(0, index);
      index++;
      setTimeout(typeNextChar, 28);
    }
  }
  typeNextChar();
}

/* ---------------------------------------------------------
   3. Academic Planner — array-backed task manager
   --------------------------------------------------------- */
function initPlanner() {
  const form = document.getElementById('task-form');
  if (!form) return; // not on planner.html

  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const emptyState = document.getElementById('planner-empty');
  const countTotal = document.getElementById('stat-total');
  const countDone = document.getElementById('stat-done');

  // Array holding task objects: { id, text, completed }
  let tasks = [
    { id: generateId(), text: 'Read Chapter 3 — Network Fundamentals', completed: false },
    { id: generateId(), text: 'Submit COS 106 term project proposal', completed: true },
  ];

  function generateId() {
    return 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }

  function renderTasks() {
    list.innerHTML = '';

    if (tasks.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.dataset.id = task.id;

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const completeBtn = document.createElement('button');
        completeBtn.type = 'button';
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = task.completed ? '↺ undo' : '✓ complete';
        completeBtn.addEventListener('click', () => toggleComplete(task.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '✕ delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(actions);
        list.appendChild(li);
      });
    }

    updateStats();
  }

  function updateStats() {
    const total = tasks.length;
    const done = tasks.filter((t) => t.completed).length;
    countTotal.textContent = total;
    countDone.textContent = done;
  }

  function addTask(text) {
    tasks.push({ id: generateId(), text: text, completed: false });
    renderTasks();
  }

  function toggleComplete(id) {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    renderTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    renderTasks();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (value === '') {
      input.focus();
      return;
    }
    addTask(value);
    input.value = '';
    input.focus();
  });

  renderTasks();
}

/* ---------------------------------------------------------
   4. Contact form — validation with regex
   --------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return; // not on contact.html

  const status = document.getElementById('form-status');

  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    message: document.getElementById('message'),
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]+$/;

  function setFieldState(fieldName, isValid, message) {
    const inputEl = fields[fieldName];
    const wrapper = inputEl.closest('.field');
    const errorEl = wrapper.querySelector('.error-msg');

    if (isValid) {
      wrapper.classList.remove('invalid');
    } else {
      wrapper.classList.add('invalid');
      errorEl.textContent = message;
    }
  }

  function validateForm() {
    let isValid = true;

    // Name: required
    if (fields.name.value.trim() === '') {
      setFieldState('name', false, 'Please enter your name.');
      isValid = false;
    } else {
      setFieldState('name', true);
    }

    // Email: required + regex format
    const emailValue = fields.email.value.trim();
    if (emailValue === '') {
      setFieldState('email', false, 'Please enter your email address.');
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      setFieldState('email', false, 'Enter a valid email address (e.g. name@example.com).');
      isValid = false;
    } else {
      setFieldState('email', true);
    }

    // Phone: required + digits only
    const phoneValue = fields.phone.value.trim();
    if (phoneValue === '') {
      setFieldState('phone', false, 'Please enter your phone number.');
      isValid = false;
    } else if (!phonePattern.test(phoneValue)) {
      setFieldState('phone', false, 'Phone number must contain digits only.');
      isValid = false;
    } else {
      setFieldState('phone', true);
    }

    // Message: required
    if (fields.message.value.trim() === '') {
      setFieldState('message', false, 'Please enter a message.');
      isValid = false;
    } else {
      setFieldState('message', true);
    }

    return isValid;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    status.className = 'form-status';

    if (validateForm()) {
      status.textContent = '✓ Message validated and ready to send. Thank you, ' + fields.name.value.trim() + ' — I will get back to you shortly.';
      status.classList.add('show', 'success');
      form.reset();
    } else {
      status.textContent = '✕ Please fix the highlighted fields before submitting.';
      status.classList.add('show', 'error');
    }
  });

  // Live re-validation as the user fixes a field
  Object.keys(fields).forEach((key) => {
    fields[key].addEventListener('input', () => {
      const wrapper = fields[key].closest('.field');
      if (wrapper.classList.contains('invalid')) {
        validateForm();
      }
    });
  });
}
