/* Navigation: keep the current section highlighted while the user scrolls. */
const topicSections = document.querySelectorAll(".topic");
const headerLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll(".intro, .topic");

document.body.classList.add("animate-ready");

function revealSection(item) {
  item.classList.add("is-visible");
}

function updateScrolledHeader() {
  document.body.classList.toggle("is-scrolled", window.scrollY > 20);
}

function setActiveLink(sectionId) {
  headerLinks.forEach(function (link) {
    const isActiveLink = link.getAttribute("href") === "#" + sectionId;

    link.classList.toggle("active", isActiveLink);

    if (isActiveLink) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

headerLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    const sectionId = link.getAttribute("href").replace("#", "");
    setActiveLink(sectionId);
  });
});

window.addEventListener("scroll", updateScrolledHeader);
updateScrolledHeader();

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        revealSection(entry.target);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.12
  });

  topicSections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  revealItems.forEach(function (item) {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach(revealSection);
}

setActiveLink("full-stack");

/* HTML demo: stop the sample form reloading the portfolio page. */
const htmlDemoForm = document.querySelector("#html-demo-form");
const htmlFormStatus = document.querySelector("#html-form-status");

htmlDemoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  htmlFormStatus.textContent = "Demo submitted without leaving the page.";
});

/* CSS demo: update one CSS variable when the colour input changes. */
const colourPicker = document.querySelector("#colour-picker");
const cssDemo = document.querySelector("#css-demo");
const colourStatus = document.querySelector("#colour-status");

colourPicker.addEventListener("input", function () {
  cssDemo.style.setProperty("--demo-colour", colourPicker.value);
  colourStatus.textContent = "The first card now uses " + colourPicker.value + ".";
});

/* JavaScript demo: store tasks in an array and render them into the page. */
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskStatus = document.querySelector("#task-status");
const apiDemoButton = document.querySelector("#api-demo-button");
const apiDemoOutput = document.querySelector("#api-demo-output");
const demoApiUrl = "data:application/json,%7B%22message%22%3A%22Sample%20JSON%20loaded%20without%20a%20page%20reload.%22%7D";

let tasks = [
  { id: 1, text: "Check that all five rubric sections are included", done: false },
  { id: 2, text: "Publish the final Canvas ePortfolio link", done: false }
];

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task) {
    const item = document.createElement("li");
    item.className = task.done ? "task-item done" : "task-item";

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeButton = document.createElement("button");
    completeButton.className = "small-button";
    completeButton.type = "button";
    completeButton.textContent = "Done";
    completeButton.setAttribute("aria-label", "Mark " + task.text + " as complete");

    completeButton.addEventListener("click", function () {
      task.done = !task.done;
      taskStatus.textContent = task.done ? "Task marked as complete." : "Task marked as not complete.";
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "small-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", "Delete " + task.text);

    deleteButton.addEventListener("click", function () {
      tasks = tasks.filter(function (currentTask) {
        return currentTask.id !== task.id;
      });

      taskStatus.textContent = "Task deleted.";
      renderTasks();
    });

    actions.append(completeButton, deleteButton);
    item.append(taskText, actions);
    taskList.append(item);
  });

  if (tasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "task-item";
    emptyMessage.textContent = "No tasks yet. Add one with the form above.";
    taskList.append(emptyMessage);
  }
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newTaskText = taskInput.value.trim();

  if (newTaskText === "") {
    taskStatus.textContent = "Please type a task before pressing Add.";
    taskInput.focus();
    return;
  }

  tasks.push({
    id: Date.now(),
    text: newTaskText,
    done: false
  });

  taskInput.value = "";
  taskStatus.textContent = "Task added.";
  renderTasks();
});

apiDemoButton.addEventListener("click", function () {
  apiDemoOutput.textContent = "Requesting JSON...";

  fetch(demoApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      apiDemoOutput.textContent = data.message;
    })
    .catch(function () {
      apiDemoOutput.textContent = "The sample API request could not load.";
    });
});

renderTasks();
