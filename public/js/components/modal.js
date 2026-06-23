/**
 * Modal Component
 */

const Modal = {
  show(options = {}) {
    const { title = '', content = '', size = 'md', onClose = null, actions = [] } = options;

    const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' };

    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'fixed inset-0 z-[9998] flex items-center justify-center px-4 py-6 bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-200';

    const modalHTML = `
      <div class="bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] flex flex-col transform scale-95 transition-transform duration-200" id="modal-content">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
          <button id="modal-close-btn" class="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="px-6 py-4 overflow-y-auto flex-1">${content}</div>
        ${actions.length ? `<div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100" id="modal-actions"></div>` : ''}
      </div>`;

    overlay.innerHTML = modalHTML;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      overlay.querySelector('#modal-content').classList.remove('scale-95');
    });

    const close = () => {
      overlay.classList.add('opacity-0');
      overlay.querySelector('#modal-content').classList.add('scale-95');
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
        if (onClose) onClose();
      }, 200);
    };

    overlay.querySelector('#modal-close-btn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    // Add action buttons
    if (actions.length) {
      const actionsContainer = overlay.querySelector('#modal-actions');
      actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = action.className || 'px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors';
        btn.textContent = action.label;
        btn.addEventListener('click', () => { action.onClick(close); });
        actionsContainer.appendChild(btn);
      });
    }

    return { close, overlay };
  },

  confirm(message, onConfirm) {
    return this.show({
      title: 'Confirm Action',
      content: `<p class="text-gray-600">${message}</p>`,
      size: 'sm',
      actions: [
        { label: 'Cancel', onClick: (close) => close() },
        { label: 'Confirm', className: 'px-4 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors', onClick: (close) => { onConfirm(); close(); } }
      ]
    });
  }
};

window.Modal = Modal;
