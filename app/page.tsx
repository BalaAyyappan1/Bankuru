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
import MobileMission from './../Components/Sections/MobileMission';

export default function Home() {

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BGLinesLayout>
        <BGCircleLayout>
          <TopNav />
          <Hero />
          <div className="md:mt-[120px]  xl:mb-[150px]">
            <About />
          </div>
          <div className=" md:mt-[150px] mt-35 md:mb-[100px] mb-10">
            <Vision />
          </div>
          <>
            <div className="hidden md:block">
              <Journey />
            </div>

            <div className="block md:hidden">
              <JourneyMobile />
            </div>
          </>

          <div className="md:mt-[140px] md:mb-[150px]">
            <Building />
          </div>
          <div className=" md:mt-[120px] xl:mb-[200px] lg:mb-[200px] md:mb-[200px] mb-[260px] mt-10">
            <Message />
          </div>
          <div className=" md:mb-[10px]  mt-10 hidden sm:block md:block">
            <Mission />
          </div>
          <div className="block md:hidden">
            <MobileMission />
          </div>
          <div>
            <Footer />
          </div>
        </BGCircleLayout>
      </BGLinesLayout>
      {/* <div className="hidden md:block">
      <Footer />

        </div> */}
    </div>
  );
}