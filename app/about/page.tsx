

import Image from "next/image";
import { FadeInWhenVisible } from "../components/fadeIn";


function AboutSection() {
  return (
    <section id="about" className="w-full px-6 md:px-16 py-12 md:py-24">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-[100px]">
        {/* Profile Image */}
        <Image
        src="/myimg.png"
        alt="My Image"
        width={400}
        height={400}
        className="rounded-[6px] bg-cover bg-center"
        />
        
        {/* About Info */}
        <div className="flex flex-col justify-between w-full md:w-[500px] py-6">
          <div className="flex flex-col gap-6 text-[var(--sh-identifier)]">
            <div className="font-bold text-[28px] md:text-[48px] capitalize">
              About me
            </div>
            <div className="font-normal text-[16px] leading-[1.5]">
              <p className="mb-0">Hi, I'm Sherry. I'm a UX/Product Designer with five years of experience, having worked at Huawei, Xiaomi, and AppLovin.</p>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0">I recently moved to Toronto and am now focusing on building my portfolio and improving my coding skills to expand my design practice.</p>
              <p className="mb-0">&nbsp;</p>
              <p>I'm a cheerful and open person who enjoys meeting new people and helping others. Outside of work, I love exploring new ideas, learning about different cultures, and spending time with my two cats. I'm always excited to connect and share experiences with others!</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-6 text-[var(--sh-identifier)] text-[20px] mt-8 md:mt-6">
            <p>📮 Email: sherrryz@outlook.com</p>
          </div>
        </div>
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
      <div className="flex flex-col gap-4">
        <div 
          className="bg-center bg-cover bg-no-repeat rounded-[12px] size-[64px]"
          style={{ backgroundImage: `url('${image}')` }}
        />
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-xl md:text-2xl text-[var(--sh-identifier)] capitalize">
          {title}
          </div>
          <div className="font-regular text-lg md:text-xl text-[var(--sh-identifier)]">
          {description}
          </div> 
        </div>
      </div>
      
      
      <div className="flex flex-col gap-6">
        {locations.map((location, index) => (
          <div key={index} className="flex flex-col gap-1 font-light text-[var(--nav-fg)] text-base md:text-lg capitalize">
            <p>{location.place}</p>
            <p>{location.date}</p>
          </div>
        ))}
      </div>
      
      {showLine && (
        <div className="h-6 w-full">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 865 24">
            <line stroke="var(--sh-identifier)" strokeOpacity="0.1" x2="865" y1="11.5" y2="11.5" />
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
      title: "Product Designer II • Applovin",
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
    <section className="w-full px-6 md:px-16 py-16">
      <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-24">
        {/* Work Experience */}
        <div className="md:col-span-2 flex flex-col gap-14">
          <h2 className="font-['Inter:Bold',_sans-serif] font-bold text-2xl md:text-3xl text-[var(--sh-identifier)] capitalize">
            💼 Working Experience
          </h2>
          
          <div className="flex flex-col gap-14">
            {experiences.map((exp, index) => (
              <ExperienceCard key={index} {...exp} />
            ))}
          </div>
        </div>

        {/* Skills, Tools, Language */}
        <div className="flex flex-col gap-12 md:gap-[72px]">
          {/* Skills */}
          <div className="flex flex-col gap-12">
            <div className="font-bold text-2xl md:text-3xl text-[var(--sh-identifier)] capitalize">
              🎨 Skills
            </div>
            <div className="flex flex-col gap-6 text-[var(--sh-identifier)] text-lg md:text-xl capitalize">
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
            <div className="font-bold text-2xl md:text-3xl text-[var(--sh-identifier)] capitalize">
              🔧 Tools
            </div>
            <div className="flex flex-col gap-6 text-[var(--sh-identifier)] text-lg md:text-xl capitalize">
              {["Figma", "Cursor", "Protopie", "VS studio code", "Adobe"].map((tool, index) => (
                <p key={index}>{tool}</p>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="flex flex-col gap-12">
            <div className="font-bold text-2xl md:text-3xl text-[var(--sh-identifier)] capitalize">
              🇬🇧 Language
            </div>
            <div className="flex flex-col gap-6 text-[var(--sh-identifier)] text-lg md:text-xl capitalize">
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
    <section className="w-full px-6 md:px-16 py-16">
      <div className="flex flex-col gap-14">
        <div className="font-bold text-[28px] md:text-[32px] text-[var(--sh-identifier)] capitalize">
          🏫 Education
        </div>
        
        <div className="flex flex-col gap-14">
          {educationData.map((edu, index) => (
            <div key={index} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-[var(--sh-identifier)]">
                <div className="font-semibold text-xl md:text-2xl leading-[1.33]">
                  {edu.institution}
                </div>
                <div className="font-regular text-lg md:text-xl leading-[1.33]">
                  {edu.degree}
                </div>
              </div>
              <div className="font-light text-base md:text-lg text-[var(--nav-fg)] capitalize">
                {edu.period}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

  function SectionDivider() {
    return (
      <div className="w-full px-6 md:px-16">
        <div className="h-24 w-full">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1472 96">
            <line stroke="var(--sh-identifier)" strokeOpacity="0.1" x1="24" x2="1448" y1="47.5" y2="47.5" />
          </svg>
        </div>
      </div>
    );
  }

export default function AboutPage() {
  return (
    <div className=" min-h-screen w-full">
      <FadeInWhenVisible>
        <AboutSection />
      </FadeInWhenVisible>

      <FadeInWhenVisible>
        <SectionDivider />
      </FadeInWhenVisible>

      <FadeInWhenVisible>
        <WorkExperience />
      </FadeInWhenVisible>

      <FadeInWhenVisible>
      <SectionDivider />
      </FadeInWhenVisible>

      <FadeInWhenVisible>
      <Education />
      </FadeInWhenVisible>
    </div>
  );
}