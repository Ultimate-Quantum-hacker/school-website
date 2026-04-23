import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PageTransition } from "@/components/ui/PageTransition";
import { WhatsAppChat } from "@/components/public/WhatsAppChat";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <ScrollReveal />
      <WhatsAppChat />
    </>
  );
}
