const KEY = "questline-missions";

const starterMissions = [
  {
    id: "door",
    title: "The Whispering Door",
    type: "code",
    difficulty: "easy",
    description: "The ancient gate opens when the hidden number is spoken.",
    clue: "What number comes after 2?",
    answer: "3",
  },
  {
    id: "lantern",
    title: "The Lantern Riddle",
    type: "riddle",
    difficulty: "medium",
    description: "A lantern keeper hides a secret.",
    clue: "I speak without a mouth and hear without ears. What am I?",
    answer: "echo",
  },
];

function getMissions() {
  const saved = localStorage.getItem(KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(KEY, JSON.stringify(starterMissions));
  return starterMissions;
}

function saveMissions(missions) {
  localStorage.setItem(KEY, JSON.stringify(missions));
}

function makeId() {
  return Date.now().toString();
}

function showAdminMissions() {
  const list = document.querySelector("#mission-list");

  if (!list) return;

  const missions = getMissions();

  list.innerHTML = "";

  if (missions.length === 0) {
    list.innerHTML = `
      <p class="empty-state">
        No missions yet. Create your first mission.
      </p>
    `;
    return;
  }

  missions.forEach((mission) => {
    const card = document.createElement("article");

    card.className = "mission-item";

    card.innerHTML = `
      <div class="mission-item-header">
        <div>
          <h3>${mission.title}</h3>
          <span class="badge ${mission.type}">
            ${mission.type}
          </span>
        </div>

        <span class="badge ${mission.difficulty}">
          ${mission.difficulty}
        </span>
      </div>

      <p>${mission.description}</p>

      <p>
        <strong>Clue:</strong>
        ${mission.clue}
      </p>

      <div class="item-actions">
        <button data-edit="${mission.id}">
          Edit
        </button>

        <button data-delete="${mission.id}">
          Delete
        </button>
      </div>
    `;

    list.appendChild(card);
  });

  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      editMission(button.dataset.edit);
    });
  });

  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      deleteMission(button.dataset.delete);
    });
  });
}

function editMission(id) {
  const missions = getMissions();
  const mission = missions.find((item) => item.id === id);

  if (!mission) return;

  document.querySelector("#mission-id").value = mission.id;
  document.querySelector("#mission-title").value = mission.title;
  document.querySelector("#mission-type").value = mission.type;
  document.querySelector("#mission-difficulty").value = mission.difficulty;
  document.querySelector("#mission-description").value =
    mission.description;
  document.querySelector("#mission-clue").value = mission.clue;
  document.querySelector("#mission-answer").value = mission.answer;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function deleteMission(id) {
  const confirmed = confirm("Do you want to delete this mission?");

  if (!confirmed) return;

  const missions = getMissions().filter((mission) => mission.id !== id);

  saveMissions(missions);
  showAdminMissions();
}

function setupAdminPage() {
  const form = document.querySelector("#mission-form");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = document.querySelector("#mission-id").value;
    const title = document.querySelector("#mission-title").value.trim();
    const type = document.querySelector("#mission-type").value;
    const difficulty = document.querySelector("#mission-difficulty").value;
    const description = document
      .querySelector("#mission-description")
      .value.trim();
    const clue = document.querySelector("#mission-clue").value.trim();
    const answer = document
      .querySelector("#mission-answer")
      .value.trim()
      .toLowerCase();

    if (!title || !description || !clue || !answer) {
      alert("Please fill in every field.");
      return;
    }

    const missions = getMissions();

    const newMission = {
      id: id || makeId(),
      title: title,
      type: type,
      difficulty: difficulty,
      description: description,
      clue: clue,
      answer: answer,
    };

    if (id) {
      const index = missions.findIndex((mission) => mission.id === id);

      if (index !== -1) {
        missions[index] = newMission;
      }
    } else {
      missions.push(newMission);
    }

    saveMissions(missions);

    form.reset();
    document.querySelector("#mission-id").value = "";

    showAdminMissions();

    alert("Mission saved!");
  });

  const clearButton = document.querySelector("#reset-form");

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      form.reset();
      document.querySelector("#mission-id").value = "";
    });
  }

  showAdminMissions();
}

function showPlayerMissions() {
  const board = document.querySelector("#mission-board");

  if (!board) return;

  const missions = getMissions();
  const playerName =