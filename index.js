document.addEventListener('DOMContentLoaded', () => {
  const characterBar = document.getElementById('character-bar');
  const detailedInfo = document.getElementById('detailed-info');
  const votesForm = document.getElementById('votes-form');
  const resetBtn = document.getElementById('reset-btn');
  const characterForm = document.getElementById('character-form');
  const nameDisplay = document.getElementById('name');
  const imageDisplay = document.getElementById('image');
  const voteCountDisplay = document.getElementById('vote-count');
  const votesInput = document.getElementById('votes');
  const nameInput = document.getElementById('name-input');
  const imageUrlInput = document.getElementById('image-url');

  let characters = [];
  let currentCharacterIndex = 0;

  fetch('asset.json')
    .then(response => response.json())
    .then(data => {
      characters = data.characters;
      updateCharacterBar();
      showCharacterInfo(currentCharacterIndex);
    })
    .catch(error => console.error('Error fetching character data:', error));

  function updateCharacterBar() {
    characterBar.innerHTML = '';
    characters.forEach((character, index) => {
      const charDiv = document.createElement('div');
      charDiv.textContent = character.name;
      charDiv.classList.add('character-item');
      charDiv.tabIndex = 0;
      charDiv.addEventListener('click', () => showCharacterInfo(index));
      charDiv.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') showCharacterInfo(index);
      });

      // Add Edit and Delete buttons
      const editButton = createButton('Edit', () => editCharacter(character));
      const deleteButton = createButton('Delete', () => deleteCharacter(character.id));

      charDiv.append(editButton, deleteButton);
      characterBar.appendChild(charDiv);
    });
  }

  function createButton(label, onClick) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }

  function showCharacterInfo(index) {
    currentCharacterIndex = index;
    const character = characters[index];
    nameDisplay.textContent = character.name;
    imageDisplay.src = character.image;
    imageDisplay.alt = character.name;
    voteCountDisplay.textContent = character.votes;
  }

  function handleVoteSubmit(event) {
    event.preventDefault();
    const votes = parseInt(votesInput.value, 10);
    if (!isNaN(votes) && votes >= 0) {
      characters[currentCharacterIndex].votes += votes;
      voteCountDisplay.textContent = characters[currentCharacterIndex].votes;
      votesInput.value = '';
    } else {
      alert('Please enter a valid number of votes.');
    }
  }

  function handleReset() {
    characters[currentCharacterIndex].votes = 0;
    voteCountDisplay.textContent = 0;
  }

  function editCharacter(character) {
    nameInput.value = character.name;
    imageUrlInput.value = character.image;
    characterForm.onsubmit = (event) => {
      event.preventDefault();
      const updatedCharacter = {
        name: nameInput.value.trim(),
        votes: character.votes,
        image: imageUrlInput.value.trim(),
      };
      updateCharacter(character.id, updatedCharacter);
    };
  }

  function updateCharacter(id, updatedCharacter) {
    fetch(`http://localhost:3000/characters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCharacter),
    })
    .then(response => response.json())
    .then(data => {
      const index = characters.findIndex(c => c.id === id);
      characters[index] = data; // Update character in array
      updateCharacterBar();
      showCharacterInfo(index);
      nameInput.value = '';
      imageUrlInput.value = '';
    })
    .catch(error => console.error('Error updating character:', error));
  }

  function deleteCharacter(id) {
    fetch(`http://localhost:3000/characters/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      characters = characters.filter(c => c.id !== id);
      updateCharacterBar();
      if (currentCharacterIndex >= characters.length) currentCharacterIndex = characters.length - 1;
      showCharacterInfo(currentCharacterIndex);
    })
    .catch(error => console.error('Error deleting character:', error));
  }

  function handleCharacterSubmit(event) {
    event.preventDefault();
    const newCharacter = {
      name: nameInput.value.trim(),
      votes: 0,
      image: imageUrlInput.value.trim(),
    };
    if (newCharacter.name && newCharacter.image) {
      addCharacter(newCharacter);
    } else {
      alert('Both name and image URL are required.');
    }
  }

  function addCharacter(newCharacter) {
    fetch('http://localhost:3000/characters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCharacter),
    })
    .then(response => response.json())
    .then(data => {
      characters.push(data);
      updateCharacterBar();
      nameInput.value = '';
      imageUrlInput.value = '';
      showCharacterInfo(characters.length - 1);
    })
    .catch(error => console.error('Error adding character:', error));
  }

  // Event listeners
  votesForm.addEventListener('submit', handleVoteSubmit);
  resetBtn.addEventListener('click', handleReset);
  characterForm.addEventListener('submit', handleCharacterSubmit);
});
