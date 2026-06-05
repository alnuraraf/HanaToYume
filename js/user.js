const UserSystem = {
    init() {
        if (!localStorage.getItem('userProfile')) {
            localStorage.setItem('userProfile', JSON.stringify({
                displayName: 'Guest',
                avatarUrl: 'https://i.pravatar.cc/150?img=11',
                watchHistory: {},
                watchlist: [],
                favorites: []
            }));
        }
    },

    getProfile() {
        return JSON.parse(localStorage.getItem('userProfile'));
    },

    updateProfile(data) {
        const profile = this.getProfile();
        localStorage.setItem('userProfile', JSON.stringify({ ...profile, ...data }));
    },

    saveHistory(malId, episode) {
        const profile = this.getProfile();
        profile.watchHistory[malId] = { episode, timestamp: Date.now() };
        this.updateProfile({ watchHistory: profile.watchHistory });
    }
};

// Initialize on load
UserSystem.init();
