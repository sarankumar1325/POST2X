import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Navigation from '@/components/custom/Navigation';
import { getUserByClerkId } from '@/lib/db';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Get user credits from database
  let userCredits = 100; // Default credits
  try {
    const user = await getUserByClerkId(userId);
    if (user) {
      userCredits = user.credits;
    }
  } catch (error) {
    console.error('Error fetching user credits:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation credits={userCredits} />
      
      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-16">
          <div className="space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
