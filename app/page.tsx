import Image from "next/image";
import { socialLinks } from "./lib/config";

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

function CallToAction() {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <h2 className="text-xl font-medium text-[var(--nav-fg)] capitalize text-center">
            learn more about me
          </h2>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <section>
      <HeroSection />
      <CallToAction />
    </section>
  );
}
