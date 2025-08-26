
function AboutHeroSection() {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-16 py-24">
        <div className="flex flex-col gap-6 items-start">
          {/* Name and title */}
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-[24px] text-[rgba(255,255,255,0.6)] font-light capitalize">
              About Me
            </span>
            <div className="flex items-center justify-center h-[23px]">
              <div className="w-[23px] h-[1px] bg-white opacity-60 rotate-90"></div>
            </div>
            <span className="text-[24px] text-[rgba(255,255,255,0.6)] font-light capitalize">
              My Journey
            </span>
          </div>

          {/* Main heading - responsive text size */}
          <h2 className="text-[36px] lg:text-[48px] font-bold text-white capitalize leading-[1.5] max-w-full">
            Hello! Let me tell you my story 👋
          </h2>

          {/* Description */}
          <div className="text-[16px] text-[rgba(255,255,255,0.9)] font-normal leading-[1.5] tracking-[0.48px] max-w-full">
            <p className="mb-4">
              I'm Xueyi Zhou, a passionate UX/Product Designer with a unique journey that spans across some of the world's leading tech companies.
            </p>
            <p className="mb-4">
              My professional journey has taken me through exciting roles at Huawei, where I learned the importance of user-centered design at scale, 
              Xiaomi, where I contributed to creating intuitive mobile experiences, and AppLovin, where I dove deep into product strategy and user engagement.
            </p>
            <p className="mb-4">
              What excites me most about design is the intersection of creativity and technology. Recently, I've been fascinated by the possibilities 
              that AI brings to our field, and I'm actively expanding my skillset by learning to code. This technical knowledge helps me bridge 
              the gap between design vision and implementation reality.
            </p>
            <p className="mb-4">
              I believe in continuous learning and growth. That's why I'm embarking on new educational journeys with BrainStation and Designlab, 
              where I'll be deepening my expertise and exploring new methodologies in design thinking and product development.
            </p>
            <p>
              Beyond work, I'm always eager to connect with fellow designers, developers, and creative minds. 
              Feel free to reach out if you'd like to chat about design, share ideas, or simply make new friends in this incredible creative community! 🌟
            </p>
          </div>

          {/* CTA Button */}
          <button className="bg-[rgba(255,255,255,0.95)] px-6 py-3 rounded-[12px] text-black font-semibold text-[16px] capitalize hover:bg-white transition-colors">
            💬 Let's Chat!
          </button>
        </div>
      </div>
    </section>
  );
}


export default function AboutPage() {
  return (
    <div className=" min-h-screen w-full">
      <AboutHeroSection />
    </div>
  );
}