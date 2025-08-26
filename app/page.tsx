import Image from "next/image";
import Link from "next/link";

function HeroSection() {
  return (
    <section className="w-full">
      <div className="mx-auto px-6 md:px-16 py-12">
        <div className="flex flex-col gap-4 items-start">
          {/* Name and title */}
          <div className="flex gap-1 items-center flex-wrap">
            <span className="text-xl md:text-2xl text-[var(--greytext)] font-light capitalize">
              xueyi(Sherry) Zhou
            </span>
            <div className="flex items-center justify-center h-[23px]">
              <div className="w-[23px] h-[1px] bg-[var(--greytext)] rotate-90"></div>
            </div>
            <span className="text-xl md:text-2xl text-[var(--greytext)] font-light capitalize">
              Product & UX designer
            </span>
          </div>

          {/* Main heading - responsive text size */}
          <h2 className="text-2xl md:text-5xl font-bold text-white capitalize leading-[1.5] max-w-full">
            Hi 👋 nice to meet you!
          </h2>

          {/* Description */}
          <div className="flex flex-col gap-4 text-base text-[var(--nav-fg)] font-normal leading-[1.5] tracking-[0.48px] capitalize max-w-[1000px]">
            <p>
              I'm a UX/Product Designer with 5 years experience at Huawei, Xiaomi, and AppLovin.</p>
            <p className="hidden md:block">Recently, I've been excited about the new opportunities AI brings and I'm actively learning coding to expand my skills. <br></br>I'll also be starting new journeys with BrainStation and Designlab to grow further.</p>
            <p className="hidden md:block">I'm always happy to connect and make friends! 🌟</p>
          </div>

          {/* CTA Button */}
          <button className="bg-[rgba(255,255,255,0.95)] px-6 py-3 rounded-[12px] text-black font-semibold text-[16px] capitalize hover:bg-white transition-colors">
            👉 Let's Connect!
          </button>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ 
  images, 
  title, 
  description 
}: { 
  images: string, 
  title: string, 
  description: string 
}) {
  return (
    <div className="flex flex-col gap-9 w-full">
      <div className="aspect-[2/1] rounded-[24px] w-full bg-white overflow-hidden relative">
      <Image 
        src={images}
        alt={title}
        className="w-full h-full object-cover"
        width={500} 
        height={500}
      />
      </div>
      <div className="flex flex-col gap-2 text-white capitalize">
        <h3 className="text-[24px] font-semibold">{title}</h3>
        <p className="text-[20px] font-light">{description}</p>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const projects = [
    {
      images: "/projectimg1.png",
      title: "Lock Screen",
      description: "interaction design"
    },
    {
      images: "/projectimg2.png",
      title: "Lock Screen",
      description: "interaction design"
    },
    {
      images: "/projectimg3.png",
      title: "Lock Screen",
      description: "interaction design"
    },
    {
      images: "/projectimg4.png",
      title: "Lock Screen",
      description: "interaction design"
    }
  ];

  return (
    <section className="w-full">
      <div className="mx-auto px-6 md:px-16 py-6">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col lg:flex-row gap-9">
            <ProjectCard {...projects[0]} />
            <div className="lg:hidden">
              <ProjectCard {...projects[1]} />
            </div>
            <div className="hidden lg:block w-full">
              <ProjectCard {...projects[1]} />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-9">
            <ProjectCard {...projects[2]} />
            <div className="lg:hidden">
              <ProjectCard {...projects[3]} />
            </div>
            <div className="hidden lg:block w-full">
              <ProjectCard {...projects[3]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LearnMore() {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-xl font-medium text-[var(--nav-fg)] capitalize text-center">
          <Link href="/about" className="flex flex-col items-center justify-center hover:text-[var(--accent)] underline">
          learn more about me
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <section className="w-full flex flex-col gap-6 md:gap-16">
      <HeroSection />
      <ProjectsSection />
      <LearnMore />
    </section>
  );
}
