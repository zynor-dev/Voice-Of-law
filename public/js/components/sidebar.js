class Sidebar {
  constructor() {
    this.menuItems = [
      { name: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
      { name: 'Cases', icon: 'briefcase', href: '/cases' },
      { name: 'AI Assistant', icon: 'robot', href: '/ai-assistant' },
      { name: 'Drafting', icon: 'document', href: '/drafting' },
      { name: 'Library', icon: 'book', href: '/library' },
      { name: 'Calendar', icon: 'calendar', href: '/calendar' },
      { name: 'Notifications', icon: 'bell', href: '/notifications' },
      { name: 'Profile', icon: 'user', href: '/profile' },
      { name: 'Settings', icon: 'cog', href: '/settings' }
    ];

    this.icons = {
      dashboard: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',
      briefcase: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
      robot: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
      document: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
      book: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
      calendar: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
      bell: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
      user: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
      cog: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
    };
  }

  render(containerId, activePage) {
    this.currentPage = activePage;
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = Auth.getUser();
    const initial = user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';

    container.innerHTML = \`
      <div class="flex flex-col h-full bg-white dark:bg-vol-sidebar border-r border-gray-200 dark:border-vol-border transition-colors duration-200">
        
        <!-- Logo Header exactly matching screenshots -->
        <div class="flex items-center gap-3 px-6 py-8">
          <div class="w-10 h-10 rounded-lg bg-vol-gold flex items-center justify-center shadow">
            <svg class="w-6 h-6 text-white dark:text-vol-main" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/></svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-vol-gold tracking-tight">Voice of Law</h1>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mt-0.5">Legal Tech Excellence</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          \${this.menuItems.map(item => {
            const isActive = activePage === item.name.toLowerCase().replace(/\\s+/g, '-');
            
            // Light and Dark theme styling merged natively using tailwind
            return \`
              <a href="\${item.href}" class="flex items-center gap-4 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200 group \${isActive 
                ? 'bg-gray-100 dark:bg-[#1f2029] border-l-2 border-vol-gold dark:border-vol-gold shadow-sm text-gray-900 dark:text-white' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-vol-hover outline-none'}">
                <span class="\${isActive ? 'text-vol-gold' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'}">\${this.icons[item.icon]}</span>
                <span>\${item.name}</span>
              </a>\`;
          }).join('')}
        </nav>

        <!-- Bottom Actions (Theme Toggle & Profiler/Logout) -->
        <div class="px-5 py-4 border-t border-gray-200 dark:border-vol-border mt-auto space-y-3">
          
          <button onclick="Theme.toggle()" class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-vol-hover transition-colors">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              <svg class="w-4 h-4 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              Theme
            </span>
            <div class="w-8 h-4 bg-gray-300 dark:bg-gray-600 rounded-full relative transition-colors">
              <div class="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5 dark:translate-x-4 transition-transform"></div>
            </div>
          </button>

          <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#161720] rounded-xl border border-gray-100 dark:border-vol-border/50">
            \${user?.profilePicture ? \`<img src="\${user.profilePicture}" alt="" class="w-10 h-10 rounded-full object-cover">\` : \`<div class="w-10 h-10 rounded-full bg-vol-gold flex items-center justify-center text-white font-bold">\${initial}</div>\`}
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">\${user?.fullName || 'User'}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 text-vol-gold dark:text-gray-500">\${user?.role === 'admin' ? 'Administrator' : ''}</p>
            </div>
            <button onclick="Auth.logout()" title="Logout" class="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            </button>
          </div>
          
        </div>
      </div>\`;
  }
};
