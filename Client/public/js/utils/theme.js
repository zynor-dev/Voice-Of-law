const Theme = {
  init() {
    const isDark = localStorage.getItem('vol-theme') === 'dark' || 
                   (!localStorage.getItem('vol-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.setTheme(isDark);
  },

  setTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vol-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vol-theme', 'light');
    }
  },

  toggle() {
    const isDark = document.documentElement.classList.contains('dark');
    this.setTheme(!isDark);
  }
};

// Initialize immediately to prevent flash
Theme.init();
