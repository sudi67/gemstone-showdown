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

  let characters = [
    { name: 'Rainbow', votes: 0, image: 'assets/rainbow.jpg' },
    { name: 'Blue Sky', votes: 0, image: 'assets/bluesky.jpg' },
    { name: 'Ruby', votes: 0, image: 'assets/ruby.jpg' },
    { name: 'Sapphire', votes: 0, image: 'assets/saphire.jpg' },
    { name: 'Topaz', votes: 0, image: 'assets/topaz.jpg' },
  ];

  let currentCharacterIndex = 0;

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

  function handleCharacterSubmit(event) {
    event.preventDefault();
    const newCharacter = {
      name: nameInput.value.trim(),
      votes: 0,
      image: imageUrlInput.value.trim(),
    };
    if (newCharacter.name && newCharacter.image) {
      characters.push(newCharacter);
      updateCharacterBar();
      nameInput.value = '';
      imageUrlInput.value = '';
      showCharacterInfo(characters.length - 1); // Show the newly added character
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
