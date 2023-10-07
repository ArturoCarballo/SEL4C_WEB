import React from "react";

export const UserContext = React.createContext({
  users: [],
  setUsers: (users: any) => {},
  filteredUsers: [],
  setFilteredUsers: (users: any) => {},
  // ... otros estados y setters ...
});
