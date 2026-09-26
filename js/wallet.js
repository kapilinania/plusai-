/**
 * AI+ Platform | Wallet Page JavaScript
 * Handles balance counter displays, simulated transaction filters, and demonstration redemption modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Redeem Now Modal Trigger
  const redeemBtn = document.getElementById('btn-redeem-trigger');
  if (redeemBtn) {
    redeemBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.openModal) {
        window.openModal('wallet-redeem-modal');
      }
    });
  }

  // 2. Demo Confirm Redeem Action
  const confirmRedeemBtn = document.getElementById('btn-confirm-redeem');
  if (confirmRedeemBtn) {
    confirmRedeemBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.closeModal) {
        window.closeModal('wallet-redeem-modal');
      }
      if (window.showDemoToast) {
        window.showDemoToast('Demonstration redemption request simulated.');
      }
    });
  }

  // 3. Activity Filter Tabs (All / Approved / Pending)
  const activityTabs = document.querySelectorAll('.wallet-filter-tab');
  const activityItems = document.querySelectorAll('.activity-item');

  activityTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activityTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-status') || 'all';
      activityItems.forEach(item => {
        const itemStatus = item.getAttribute('data-status') || 'approved';
        if (filter === 'all' || itemStatus === filter) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});
