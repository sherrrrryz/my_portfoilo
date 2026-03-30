import Image from "next/image";
import Link from "next/link";
import { FadeInWhenVisible } from "./components/fadeIn";
import { ProjectsSection } from "./components/project/projectSection";
import { ArrowRight } from "lucide-react";

function HeroSection() {
  return (
    <section className="w-full">
      <div className="mx-auto px-6 md:px-16 py-12">
        <div className="flex flex-col gap-2 items-start">
          {/* Name and title */}
          <div className="flex gap-1 items-center flex-wrap">
            <span className="text-lg md:text-xl text-[var(--greytext)] font-light capitalize">
              xueyi(Sherry) Zhou
            </span>
            <div className="flex items-center justify-center h-[23px]">
              <div className="w-[16px] h-[1px] bg-[var(--greytext)] rotate-90"></div>
            </div>
            <span className="text-lg md:text-xl text-[var(--greytext)] font-light capitalize">
              Product & UX designer
            </span>
          </div>

          {/* Main heading - responsive text size */}
          <h2 className="text-2xl md:text-5xl font-bold text-[var(--sh-identifier)] capitalize leading-[1.5] max-w-full">
            Hi 👋 nice to meet you!
          </h2>

          {/* Description */}
          <div className="flex flex-col gap-2 text-base text-[var(--nav-fg)] font-normal leading-[1.5] tracking-[0.48px] capitalize max-w-[1000px]">
            <p>
              I'm a UX/Product Designer with 5 years experience at Huawei, Xiaomi, and AppLovin.</p>
            <p className="hidden md:block">Recently, I've been excited about the new opportunities AI brings and I'm actively learning coding to expand my skills. <br></br>This fall, I’ll also be beginning new journeys with BrainStation and Designlab to continue growing.</p>
            <p className="hidden md:block">Always cheerful and open-minded, I love collaborating with others, sharing ideas, and building meaningful connections along the way.  🌟</p>
          </div>
        </div>
        <br></br>
        <button className="bg-[var(--sh-identifier)] px-6 py-3 rounded-[12px] text-[var(--sh-btn)] font-semibold text-[16px] capitalize hover:opacity-80 transition-colors">
            👉 Let's Connect!
          </button>
      </div>
    </section>
  );
}


function EphemeralChatEntry() {
  return (
    <section className="w-full">
      <div className="mx-auto px-6 md:px-16 py-16 md:py-24">
        <div className="border border-[var(--border)] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-[var(--greytext)] font-medium">
              Side experiment
            </span>
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--sh-identifier)]">
              Ephemeral Chat
            </h3>
            <p className="text-sm text-[var(--nav-fg)] max-w-md leading-relaxed">
              A chat interface where words dissolve like sound. No input box, no send button. Type freely, interrupt anytime.
            </p>
          </div>
          <Link
            href="/chat"
            className="flex items-center gap-2 bg-[var(--sh-identifier)] text-[var(--sh-btn)] px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity whitespace-nowrap flex-shrink-0"
          >
            Enter the space
            <ArrowRight size={15} />
          </Link>
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
      <FadeInWhenVisible>
        <HeroSection />
      </FadeInWhenVisible>
      <FadeInWhenVisible delay={0.2}>
        <ProjectsSection />
      </FadeInWhenVisible>
      <FadeInWhenVisible delay={0.3}>
        <EphemeralChatEntry />
      </FadeInWhenVisible>
        <LearnMore />
    </section>
  );
}
