import Image from "next/image";

export default function ResponsiveImg({
    src,
    alt,
  }: {
    src: string;
    alt: string;
  }) {
    return (
      <div className="w-full mb-6">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="w-full h-auto object-cover bg-[var(--imgbg)]"
        />
      </div>
    );
  }