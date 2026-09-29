const messageBox = document.getElementById('message');
const loading = document.getElementById('loading');
const grid = document.getElementById('pokemon-grid');
const countText = document.getElementById('count-text');
const detailCard = document.getElementById('detail-card');
const detailContent = document.getElementById('detail-content');
const editCard = document.getElementById('edit-card');

function showMessage(text, type = 'success') {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearMessage() {
  messageBox.textContent = '';
  messageBox.className = 'message hidden';
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);
  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const apiMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
    const requestError = new Error(apiMessage);
    requestError.status = response.status;
    throw requestError;
  }

  return data;
}

function renderPokemon(items) {
  grid.innerHTML = '';
  countText.textContent = `${items.length} Pokemon loaded`;

  if (items.length === 0) {
    grid.innerHTML = '<div class="empty-state">No Pokemon found. Add one using the form above.</div>';
    return;
  }

  items.forEach((pokemon) => {
    const card = document.createElement('article');
    card.className = 'pokemon-card';
    card.innerHTML = `
      <div class="card-topline">
        <span class="pokemon-id">#${pokemon.id}</span>
        <span class="type-badge">${escapeHtml(pokemon.type)}</span>
      </div>
      <h3>${escapeHtml(pokemon.name)}</h3>
      <p class="level-text">Level ${pokemon.level}</p>
      <div class="card-actions">
        <button class="btn btn-light" data-action="view" data-id="${pokemon.id}">View</button>
        <button class="btn btn-secondary" data-action="edit" data-id="${pokemon.id}">Edit</button>
        <button class="btn btn-danger" data-action="delete" data-id="${pokemon.id}">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadPokemon() {
  clearMessage();
  loading.classList.remove('hidden');
  grid.classList.add('hidden');
  countText.textContent = 'Loading...';

  try {
    const items = await apiRequest('/pokemon');
    renderPokemon(items);
    grid.classList.remove('hidden');
  } catch (error) {
    countText.textContent = 'Could not load Pokemon';
    showMessage(`Could not load Pokemon: ${error.message}`, 'error');
  } finally {
    loading.classList.add('hidden');
  }
}

async function showPokemonDetails(id) {
  clearMessage();
  detailCard.classList.remove('hidden');
  detailContent.innerHTML = '<p class="muted">Loading details...</p>';

  try {
    const pokemon = await apiRequest(`/pokemon/${id}`);
    detailContent.innerHTML = `
      <h3 class="detail-name">${escapeHtml(pokemon.name)}</h3>
      <div class="detail-meta">
        <div class="meta-box">
          <span class="meta-label">ID</span>
          <strong>${pokemon.id}</strong>
        </div>
        <div class="meta-box">
          <span class="meta-label">Type</span>
          <strong>${escapeHtml(pokemon.type)}</strong>
        </div>
        <div class="meta-box">
          <span class="meta-label">Level</span>
          <strong>${pokemon.level}</strong>
        </div>
      </div>
    `;
    detailCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    detailContent.innerHTML = `
      <div class="empty-state">
        <strong>${error.status === 404 ? '404 — Pokemon not found' : 'Could not load this Pokemon'}</strong>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
    showMessage(error.message, 'error');
  }
}

async function openEditForm(id) {
  clearMessage();

  try {
    const pokemon = await apiRequest(`/pokemon/${id}`);
    document.getElementById('edit-id').value = pokemon.id;
    document.getElementById('edit-name').value = pokemon.name;
    document.getElementById('edit-type').value = pokemon.type;
    document.getElementById('edit-level').value = pokemon.level;
    editCard.classList.remove('hidden');
    editCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function deletePokemon(id) {
  const confirmed = window.confirm(`Delete Pokemon #${id}?`);
  if (!confirmed) return;

  clearMessage();

  try {
    const result = await apiRequest(`/pokemon/${id}`, { method: 'DELETE' });
    showMessage(result.message || 'Pokemon deleted successfully.');
    detailCard.classList.add('hidden');
    editCard.classList.add('hidden');
    await loadPokemon();
    showMessage(result.message || 'Pokemon deleted successfully.');
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

document.getElementById('add-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();

  const name = document.getElementById('add-name').value.trim();
  const type = document.getElementById('add-type').value.trim();
  const levelValue = document.getElementById('add-level').value;

  const payload = {};
  if (name !== '') payload.name = name;
  if (type !== '') payload.type = type;
  if (levelValue !== '') payload.level = Number(levelValue);

  try {
    const pokemon = await apiRequest('/pokemon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    event.target.reset();
    await loadPokemon();
    showMessage(`${pokemon.name} was added successfully.`);
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

document.getElementById('edit-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();

  const id = document.getElementById('edit-id').value;
  const name = document.getElementById('edit-name').value.trim();
  const type = document.getElementById('edit-type').value.trim();
  const levelValue = document.getElementById('edit-level').value;

  const payload = {
    name,
    type,
    level: levelValue === '' ? null : Number(levelValue)
  };

  try {
    const pokemon = await apiRequest(`/pokemon/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    editCard.classList.add('hidden');
    await loadPokemon();
    showMessage(`${pokemon.name} was updated successfully.`);
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

document.getElementById('find-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('find-id').value;

  if (!id) {
    showMessage('Enter a Pokemon ID first.', 'error');
    return;
  }

  await showPokemonDetails(id);
});

grid.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === 'view') await showPokemonDetails(id);
  if (action === 'edit') await openEditForm(id);
  if (action === 'delete') await deletePokemon(id);
});

document.getElementById('close-detail').addEventListener('click', () => {
  detailCard.classList.add('hidden');
});

document.getElementById('cancel-edit').addEventListener('click', () => {
  editCard.classList.add('hidden');
});

document.getElementById('refresh-btn').addEventListener('click', loadPokemon);

loadPokemon();
