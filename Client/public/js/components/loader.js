/**
 * Loader / Spinner Component
 */

const Loader = {
  show(containerId = null) {
    const html = `
      <div id="page-loader" class="flex items-center justify-center py-20">
        <div class="flex flex-col items-center gap-3">
          <div class="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p class="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>`;

    if (containerId) {
      document.getElementById(containerId).innerHTML = html;
    } else {
      return html;
    }
  },

  hide(containerId) {
    const loader = document.getElementById('page-loader');
    if (loader) loader.remove();
  },

  // Full page overlay loader
  overlay(message = 'Processing...') {
    const overlay = document.createElement('div');
    overlay.id = 'overlay-loader';
    overlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm';
    overlay.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl px-8 py-6 flex items-center gap-4">
        <div class="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <span class="text-sm font-medium text-gray-700">${message}</span>
      </div>`;
    document.body.appendChild(overlay);
  },

  hideOverlay() {
    const overlay = document.getElementById('overlay-loader');
    if (overlay) overlay.remove();
  }
};

window.Loader = Loader;
