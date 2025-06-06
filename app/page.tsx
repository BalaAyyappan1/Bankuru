import Hero from "@/Components/Sections/Hero";

import BGLinesLayout from "@/Components/Background/BGLinesLayout";
import BGCircleLayout from "@/Components/Background/BGCircleLayout";
import About from "@/Components/Sections/About";
import Vision from "@/Components/Sections/Vision";
import Journey from "@/Components/Sections/Journey";
import Footer from "@/Components/Sections/Footer";
import Building from "@/Components/Sections/Building";
import Message from "@/Components/Sections/Message";
import Mission from "@/Components/Sections/Mission";
import TopNav from "@/Components/Sections/TopNav";
import JourneyMobile from "@/Components/Sections/JourneyMobile";

export default function Home() {

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BGLinesLayout>
        <BGCircleLayout>
          <TopNav />
          <Hero />
          <div className="md:mt-[120px] mt-[100px] xl:mb-[150px]"> 
          <About />
          </div>
          <div className=" md:mb-[150px] mb-[100px]"> 
          <Vision />

            </div>
            <>
  {/* Desktop and tablet */}
  <div className="hidden md:block">
    <Journey />
  </div>

  {/* Mobile only */}
  <div className="block md:hidden">
    <JourneyMobile />
  </div>
</>

          <div className="md:mt-[120px] md:mb-[150px]"> 
          <Building />

          </div>
          <div className="md:mt-[120px] md:mb-[150px]">
          <Message />
          </div>
          <div className="md:mt-[120px] mb-[150px]">
          <Mission />
          </div>
        </BGCircleLayout>
      </BGLinesLayout>
      <Footer />


    </div>
  );
}