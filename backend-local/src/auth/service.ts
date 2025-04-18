export function login(username: string, password: string): string | null {
  const users = [
    { username: 'alice', password: '123456' },
    { username: 'bob', password: 'abcdef' },
  ];

  const user = users.find(u => u.username === username && u.password === password);
  return user ? `mock-token-${user.username}` : null;
}

