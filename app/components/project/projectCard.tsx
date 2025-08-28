import Link from "next/link";
import Image from "next/image";

export function ProjectCard({
  link,
  images,
  title,
  description,
}: {
  link: string;
  images: string;
  title: string;
  description: string;
}) {
  return (
    <div className="w-full">
      <Link href={link} className="flex flex-col gap-4">
        <div className="aspect-[2/1] w-full overflow-hidden relative">
          <Image src={images} alt={title} fill className="object-cover" />
        </div>

        <div className="flex flex-col gap-2 capitalize">
          <h3 className="text-xl font-semibold text-[var(--sh-identifier)]">
            {title}
          </h3>
          <p className="text-lg font-light text-[var(--nav-dim)]">
            {description}
          </p>
        </div>
      </Link>
    </div>
  );
}
