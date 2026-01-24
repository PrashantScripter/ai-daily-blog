import Footer from "@/components/common/Footer";
import LandingHeader from "@/components/landing-page/LandingHeader";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-dvh bg-[#fdfbf7]">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
