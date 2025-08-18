import Image from "next/image";

export default function DocumentCard({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-3 bg-gray-50 border-b">
        <h4 className="font-medium">{title}</h4>
      </div>
      <div className="relative h-48 bg-gray-100">
        {/* <Image
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7MebvjYTbOwibe4vkuLd5gid46eeGoj2v1A&s"
          }
          alt={title}
          fill
          className="object-contain"
          unoptimized
        /> */}
      </div>
      <div className="p-2 bg-gray-50 text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          View Full Size
        </a>
      </div>
    </div>
  );
}
