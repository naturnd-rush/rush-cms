import { prisma } from '@/lib/prisma'

export default async function Page() {
  const users = await prisma.user.findMany();
  const posts = await prisma.post.findMany();
  
  return (
    <div>
      <h1>Users:</h1>
      {users.map((user) => {
        return <p key={user.id}>Name: {user.name}, Email: {user.email}.</p>
      })}
    </div>
  );
}