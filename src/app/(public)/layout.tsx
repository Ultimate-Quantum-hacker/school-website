import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PageTransition } from "@/components/ui/PageTransition";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
