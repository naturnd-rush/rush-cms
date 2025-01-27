import { prisma } from '@/lib/prisma'

export default async function Page() {
  const featureCollections = await prisma.user.findMany()
  
  return (
    <div>
      <h1>Users:</h1>
      {featureCollections.map((user) => {
        return <p key={user.id}>Name: {user.name}, Email: {user.email}.</p>
      })}
    </div>
  );
}