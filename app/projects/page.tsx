import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "./project-data";
import { ProjectsSection } from "../page";

export const metadata: Metadata = {
  title: "Projects",
  description: "Nextfolio Projects",
};



export default function Projects() {
  return (
    <section>
      <h1 className="flex text-4xl font-bold m-10">Projects</h1>
      <ProjectsSection />
    </section>
  );
}
