import { ProjectCard } from "./projectCard";

export function ProjectsSection() {
  const projects = [
    {
      link: "/projects/lockscreen", // 修复：移除.tsx扩展名，匹配实际目录名
      images: "/projectimg1.png",
      title: "Lock screen personalization editing",
      description: "Interaction Design · Product Design · Visual Design",
    },
    {
      link: "/projects/toucharea", // 修复：移除.tsx扩展名，匹配实际目录名
      images: "/projectimg2.png",
      title: "Research on screen touch hotspots", // 建议：更新为正确的标题
      description: "Project Lead · Experimental Design · Interaction Design",
    },
    {
      link: "/projects/designsystem", // 修复：移除.tsx扩展名，匹配实际目录名
      images: "/projectimg3.png",
      title: "MIUI Design Guidelines 2.0", // 建议：更新为正确的标题
      description: "Project Lead · Design system · Design specifications",
    },
    {
      link: "/projects/multilanguage", // 修复：移除.tsx扩展名，匹配实际目录名
      images: "/projectimg4.png",
      title: "MIUI multilingual design specifications and processes", // 建议：更新为正确的标题
      description: "Multilingual Design · Global Design",
    },
  ];

  return (
    <section className="w-full">
      <div className="mx-auto py-6">
        <div className="flex flex-col gap-24">
          <div className="flex flex-col lg:flex-row gap-4">
            <ProjectCard {...projects[0]} />
            <div className="lg:hidden">
              <ProjectCard {...projects[1]} />
            </div>
            <div className="hidden lg:block w-full">
              <ProjectCard {...projects[1]} />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
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
