const USER_KEY = "user";

/**
 * Manage how Access User is being stored and retrieved from storage.
 *
 * Current implementation stores to localStorage. Local Storage should always be
 * accessed through this instance.
 **/
const UserService = {
  getUser() {
    return localStorage.getItem(USER_KEY);
  },

  setUser(user) {
    localStorage.setItem(
      USER_KEY,
      typeof user === "object" ? JSON.stringify(user) : user
    );
  },

  deleteUser() {
    localStorage.removeItem(USER_KEY);
  }
};

export { UserService };
