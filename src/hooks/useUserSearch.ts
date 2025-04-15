
import { useState, useMemo } from 'react';

interface User {
  name: string;
  email: string;
  schoolName: string;
}

export const useUserSearch = <T extends User>(users: T[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredUsers
  };
};
