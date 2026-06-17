import { Navigation } from "@/components/layout/navigation";
import { Hero } from "@/components/trail/hero";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <Hero />
      </main>
    </>
  );
}
