import DemoPage from '@/demo/implementation'; // Import the demo component using alias

// Define the props type to include searchParams
interface HomePageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: HomePageProps) {
  // Check if the rewrite added the 'show=demo' query parameter
  if (searchParams?.show === 'demo') {
    // Render the demo page if accessed via the /demo rewrite
    return <DemoPage />;
  }

  // Otherwise, render the default content for the root page
  // Replace this with your actual root page content if needed
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold">Root Page</h1>
      <p className="text-muted-foreground">This is the default root page content.</p>
      {/* Add link to demo for discoverability if desired */}
      {/* <a href="/demo" className="mt-4 text-blue-500 hover:underline">View Demo</a> */}
    </main>
  );
}