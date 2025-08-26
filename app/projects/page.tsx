import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "./project-data";
import { ProjectsSection } from "../page";
import { FadeInWhenVisible } from "../components/fadeIn";

export const metadata: Metadata = {
  title: "Projects",
  description: "Nextfolio Projects",
};



export default function Projects() {
  return (
    <section>
      <FadeInWhenVisible>
      <h1 className="flex text-4xl font-bold m-10">Projects</h1>
      <ProjectsSection />
      </FadeInWhenVisible>
    </section>
  );
}
