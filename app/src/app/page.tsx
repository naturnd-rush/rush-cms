import { prisma } from '../lib/prisma'

type User = {
  name: string;
  id: string;
  email: string;
  password: string;
  createdAt: Date | null;
};

export default async function Page() {
  const users: User[] = await prisma.user.findMany();

  return (
    <div>
      <h1>Users:</h1>
      {users.map((user) => {
        return <p key={user.id}>Name: {user.name}, Email: {user.email}.</p>
      })}
    </div>
  );
}