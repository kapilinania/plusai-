/**
 * AI+ Platform | Tasks Page JavaScript
 * Handles category filtering, live task search, and interactive demonstration task details modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterPills = document.querySelectorAll('.filter-pill');
  const taskCards = document.querySelectorAll('.task-card');
  const searchInput = document.getElementById('task-search-input');

  let currentCategory = 'all';
  let searchQuery = '';

  const filterTasks = () => {
    taskCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTitle = (card.querySelector('.task-title')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.task-desc')?.textContent || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all' || cardCategory.toLowerCase() === currentCategory.toLowerCase());
      const matchesSearch = !searchQuery || cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // 1. Filter pill click handler
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-filter') || 'all';
      filterTasks();
    });
  });

  // 2. Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterTasks();
    });
  }

  // 3. View Task Modal Trigger
  const viewTaskButtons = document.querySelectorAll('.btn-view-task');
  const taskModal = document.getElementById('task-demo-modal');
  const modalTaskTitle = document.getElementById('modal-task-title');
  const modalTaskReward = document.getElementById('modal-task-reward');
  const modalTaskCategory = document.getElementById('modal-task-category');
  const modalTaskEst = document.getElementById('modal-task-time');

  viewTaskButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.task-card');
      if (card) {
        const title = card.querySelector('.task-title')?.textContent || 'Sample Task';
        const reward = card.querySelector('.task-reward-num')?.textContent || '₹25';
        const category = card.querySelector('.task-cat-badge')?.textContent || 'General';
        const time = card.querySelector('.task-time-badge')?.textContent || '5 min';

        if (modalTaskTitle) modalTaskTitle.textContent = title;
        if (modalTaskReward) modalTaskReward.textContent = reward;
        if (modalTaskCategory) modalTaskCategory.textContent = category;
        if (modalTaskEst) modalTaskEst.textContent = time;

        if (window.openModal) {
          window.openModal('task-demo-modal');
        }
      }
    });
  });
});
