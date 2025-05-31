import Hero from "@/Components/Sections/Hero";

import BGLinesLayout from "@/Components/Background/BGLinesLayout";
import BGCircleLayout from "@/Components/Background/BGCircleLayout";
import About from "@/Components/Sections/About";
import Vision from "@/Components/Sections/Vision";
import Journey from "@/Components/Sections/Journey";
import Footer from "@/Components/Sections/Footer";

export default function Home() {

  return (
    <div className="relative min-h-screen overflow-hidden">


      <BGLinesLayout>
        <BGCircleLayout>
          <Hero />
          <About />
          <Vision />
          <Journey />
        </BGCircleLayout>
      </BGLinesLayout>
      <Footer />


    </div>
  );
}