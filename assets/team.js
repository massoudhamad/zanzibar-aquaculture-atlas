'use strict';
(async function loadTeam() {
  const container = document.getElementById('field-team');
  if (!container) return;
  try {
    const response = await fetch('data/team.json');
    if (!response.ok) throw new Error('Team data unavailable');
    const members = await response.json();
    if (!Array.isArray(members)) throw new Error('Invalid team list');
    const confirmed = members.filter(m => m &&
      typeof m.name === 'string' && m.name.trim());
    if (!confirmed.length) return;
    container.replaceChildren();
    for (const member of confirmed) {
      const card = document.createElement('article');
      card.className = 'team-member';
      if (typeof member.photo === 'string' && member.photo.trim()) {
        const url = new URL(member.photo, document.baseURI);
        if (['http:', 'https:'].includes(url.protocol)) {
          const photo = document.createElement('img');
          photo.src = url.href;
          photo.alt = `Portrait of ${member.name}`;
          photo.loading = 'lazy';
          photo.addEventListener('error', () => photo.remove());
          card.append(photo);
        }
      }
      const heading = document.createElement('h3');
      heading.textContent = member.name;
      card.append(heading);
      for (const [label, key] of [['Program', 'program'],
        ['Institution', 'institution'], ['Role', 'role']]) {
        if (typeof member[key] !== 'string' || !member[key].trim()) continue;
        const paragraph = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = label + ': ';
        paragraph.append(strong, document.createTextNode(member[key]));
        card.append(paragraph);
      }
      container.append(card);
    }
  } catch {
    // The page's existing explanatory text stays visible if data cannot load.
  }
})();
