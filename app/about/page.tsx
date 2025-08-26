

import Image from "next/image";

function AboutSection() {
    return (
      <section id="about" className="w-full px-6 lg:px-16 py-12 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-[131px]">
          {/* Profile Image */}
          <Image
            src="/myimg.png"
            alt="My Image"
            width={407}
            height={407}
            className="rounded-[6px] size-[300px] lg:size-[407px] bg-cover bg-center"
          />
  
          {/* About Info */}
          <div className="flex flex-col justify-between w-full lg:w-[373px] lg:h-[407px] py-6">
            <div className="flex flex-col gap-6 text-[#ffffff]">
              <h2 className="font-['Inter:Bold',_sans-serif] font-bold text-[36px] lg:text-[48px] capitalize">
                About me
              </h2>
              <div className="font-['Inter:Regular',_sans-serif] font-normal text-[20px] lg:text-[24px] leading-[1.5]">
                <p className="mb-0">Lively, cheerful and helpful</p>
                <p className="mb-0">ENFP</p>
                <p>Two cat Mom</p>
              </div>
            </div>
  
            <div className="flex flex-col gap-6 text-[#ffffff] text-[20px] lg:text-[24px] mt-8 lg:mt-0">
              <p>📮 Email: sherrryz@outlook.com</p>
              <p>✉️ WeChat: +1 4372497817</p>
            </div>
          </div> {/* ← 这里补闭合 */}
        </div>
      </section>
    );
  }
  
  function ExperienceCard({ 
    image, 
    title, 
    description, 
    locations, 
    showLine = true 
  }: { 
    image: string; 
    title: string; 
    description: string; 
    locations: Array<{place: string; date: string}>; 
    showLine?: boolean;
  }) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-[23px]">
          <div 
            className="bg-center bg-cover bg-no-repeat rounded-[12px] size-[100px]"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <h3 className="font-['Inter:Semi_Bold',_sans-serif] font-semibold text-[28px] lg:text-[32px] text-[#ffffff] capitalize">
            {title}
          </h3>
        </div>
        
        <p className="font-['Inter:Light',_sans-serif] font-light text-[24px] lg:text-[28px] text-[#ffffff] opacity-90 capitalize">
          {description}
        </p>
        
        <div className="flex flex-col gap-6 lg:gap-12">
          {locations.map((location, index) => (
            <div key={index} className="flex flex-col gap-3 text-[#ffffff] text-[20px] lg:text-[24px] capitalize">
              <p>{location.place}</p>
              <p>{location.date}</p>
            </div>
          ))}
        </div>
        
        {showLine && (
          <div className="h-6 w-full">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 865 24">
              <line stroke="white" strokeOpacity="0.3" x2="865" y1="11.5" y2="11.5" />
            </svg>
          </div>
        )}
      </div>
    );
  }
  
  function WorkExperience() {
    const experiences = [
      {
        image: "/applovin.png",
        title: "Product Designer || • Applovin",
        description: "User Research and Innovation Department · HCI Group · UX Designer",
        locations: [
          { place: "Toronto, Canada", date: "2024.10 - 2025.05" },
          { place: "Beijing, China", date: "2023.12 - 2024.10" }
        ]
      },
      {
        image: "/xiaomi.png",
        title: "Senior User Experience Designer • Xiaomi",
        description: "MIUI Design Department·Design System Manager & System Interaction Designer",
        locations: [
          { place: "Beijing, China", date: "2021.06 - 2023.08" }
        ]
      },
      {
        image: "/huawei.png",
        title: "User Experience Designer • Huawei",
        description: "User Research and Innovation Department · HCI Group · UX Designer",
        locations: [
          { place: "Beijing, China", date: "2020.07 - 2021.06" }
        ],
        showLine: false
      }
    ];
  
    return (
      <section className="w-full px-6 lg:px-16 py-16">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-[94px]">
          {/* Work Experience */}
          <div className="lg:col-span-2 flex flex-col gap-14">
            <h2 className="font-['Inter:Bold',_sans-serif] font-bold text-[32px] lg:text-[36px] text-[#ffffff] capitalize">
              💼 Working Experience
            </h2>
            
            <div className="flex flex-col gap-14">
              {experiences.map((exp, index) => (
                <ExperienceCard key={index} {...exp} />
              ))}
            </div>
          </div>
  
          {/* Skills, Tools, Language */}
          <div className="flex flex-col gap-12 lg:gap-[72px]">
            {/* Skills */}
            <div className="flex flex-col gap-12">
              <h3 className="font-['Inter:Bold',_sans-serif] font-bold text-[32px] lg:text-[36px] text-[#ffffff] capitalize">
                🔧 Skills
              </h3>
              <div className="flex flex-col gap-6 text-[#ffffff] text-[28px] lg:text-[32px] capitalize">
                {[
                  "Interaction Design",
                  "Interface Design", 
                  "Prototype design",
                  "User Research",
                  "Design system",
                  "Multilingual design",
                  "Design workshop",
                  "CSS / HTML / JS",
                  "react / tailwind / Next.js"
                ].map((skill, index) => (
                  <p key={index}>{skill}</p>
                ))}
              </div>
            </div>
  
            {/* Tools */}
            <div className="flex flex-col gap-12">
              <h3 className="font-['Inter:Bold',_sans-serif] font-bold text-[32px] lg:text-[36px] text-[#ffffff] capitalize">
                🔧 Tools
              </h3>
              <div className="flex flex-col gap-6 text-[#ffffff] text-[28px] lg:text-[32px] capitalize">
                {["Figma", "Cursor", "Protopie", "VS studio code", "Adobe"].map((tool, index) => (
                  <p key={index}>{tool}</p>
                ))}
              </div>
            </div>
  
            {/* Language */}
            <div className="flex flex-col gap-12">
              <h3 className="font-['Inter:Regular',_sans-serif] font-normal text-[32px] lg:text-[36px] text-[#ffffff] capitalize">
                🇬🇧 Language
              </h3>
              <div className="flex flex-col gap-6 text-[#ffffff] text-[28px] lg:text-[32px] capitalize">
                <p>English</p>
                <p>Chinese</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  function Education() {
    const educationData = [
      {
        institution: "Tsinghua Academy of Fine Arts Interdisciplinary",
        degree: "Master of Design",
        period: "2020.09-2023.06"
      },
      {
        institution: "Kolding School of Design, Denmark",
        degree: "Winter exchange student",
        period: "2018.01-2018.02"
      },
      {
        institution: "Tsinghua School of Journalism and Communication",
        degree: "Second Degree",
        period: "2014.09-2018.06"
      },
      {
        institution: "Tsinghua Academy of Fine Arts Information Art Design",
        degree: "Bachelor of Design",
        period: "2013.09-2017.06"
      }
    ];
  
    return (
      <section className="w-full px-6 lg:px-16 py-16">
        <div className="flex flex-col gap-14">
          <h2 className="font-['Inter:Bold',_sans-serif] font-bold text-[32px] lg:text-[36px] text-[#ffffff] capitalize">
            🏫 Education
          </h2>
          
          <div className="flex flex-col gap-14">
            {educationData.map((edu, index) => (
              <div key={index} className="flex flex-col gap-6 text-[#ffffff]">
                <div className="flex flex-col gap-3">
                  <h3 className="font-['Inter:Semi_Bold',_sans-serif] font-semibold text-[28px] lg:text-[32px] leading-[1.33]">
                    {edu.institution}
                  </h3>
                  <p className="font-['Inter:Light',_sans-serif] font-light text-[24px] lg:text-[28px] leading-[1.33]">
                    {edu.degree}
                  </p>
                </div>
                <p className="font-['Inter:Regular',_sans-serif] font-normal text-[20px] lg:text-[24px] capitalize">
                  {edu.period}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  function SectionDivider() {
    return (
      <div className="w-full px-6 lg:px-16">
        <div className="h-24 w-full">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1472 96">
            <line stroke="white" strokeOpacity="0.3" x1="24" x2="1448" y1="47.5" y2="47.5" />
          </svg>
        </div>
      </div>
    );
  }

export default function AboutPage() {
  return (
    <div className=" min-h-screen w-full">
      <AboutSection />
      <SectionDivider />
      <WorkExperience />
      <SectionDivider />
      <Education />
    </div>
  );
}