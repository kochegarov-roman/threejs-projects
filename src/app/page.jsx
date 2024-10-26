import { Projects } from '@/widgets/projects';
import { Footer } from '@/widgets/footer';

export default function Home() {
  return (
    <div className="min-h-screen p-2 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Projects collections</h1>
        <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Projects />
        </div>
      </main>
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}
