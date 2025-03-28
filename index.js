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

  fetch('asset.json')
    .then(response => response.json())
    .then(data => {
      characters = data.characters;
      updateCharacterBar();
      showCharacterInfo(currentCharacterIndex);
    })
    .catch(error => console.error('Error fetching character data:', error));

  let currentCharacterIndex = 0; // Declare currentCharacterIndex only once

  function updateCharacterBar() {
    characterBar.innerHTML = '';
    characters.forEach((character, index) => {
      const charDiv = document.createElement('div');
      charDiv.textContent = character.name;
      charDiv.classList.add('character-item');
      charDiv.setAttribute('role', 'button');
      charDiv.setAttribute('tabindex', '0');
      charDiv.addEventListener('click', () => showCharacterInfo(index));
      charDiv.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          showCharacterInfo(index);
        }
      });

      // Add Edit button
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => handleEditCharacter(character.id));
      charDiv.appendChild(editButton);

      // Add Delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => handleDeleteCharacter(character.id));
      charDiv.appendChild(deleteButton);

      characterBar.appendChild(charDiv);
    });
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

  function handleEditCharacter(id) {
    const character = characters.find(c => c.id === id);
    if (character) {
      nameInput.value = character.name;
      imageUrlInput.value = character.image;
      characterForm.onsubmit = (event) => {
        event.preventDefault();
        const updatedCharacter = {
          name: nameInput.value.trim(),
          votes: character.votes,
          image: imageUrlInput.value.trim(),
        };
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
          characters[index] = data; // Update the character in the array
          updateCharacterBar();
          showCharacterInfo(index);
          nameInput.value = '';
          imageUrlInput.value = '';
        })
        .catch(error => console.error('Error updating character:', error));
      };
    }
  } // Ensure this block is properly closed


  function handleDeleteCharacter(id) {
    fetch(`http://localhost:3000/characters/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      characters = characters.filter(c => c.id !== id);
      updateCharacterBar();
      if (currentCharacterIndex >= characters.length) {
        currentCharacterIndex = characters.length - 1;
      }
      showCharacterInfo(currentCharacterIndex);
    })
    .catch(error => console.error('Error deleting character:', error));
  }

  function handleCharacterSubmit(event) {
    event.preventDefault();
    console.log('Adding new character:', nameInput.value.trim(), imageUrlInput.value.trim());
    const newCharacter = {
      name: nameInput.value.trim(),
      votes: 0,
      image: imageUrlInput.value.trim(),
    };
    if (newCharacter.name && newCharacter.image) {
        console.log('New character data is valid, sending to server...');
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
    } else {
      alert('Both name and image URL are required.');
    }
  }

  votesForm.addEventListener('submit', handleVoteSubmit);
  resetBtn.addEventListener('click', handleReset);
  characterForm.addEventListener('submit', handleCharacterSubmit);

  updateCharacterBar();
  showCharacterInfo(currentCharacterIndex);
});
