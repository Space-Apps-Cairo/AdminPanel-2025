import InfoCard from "./InfoCard";
import type { CardData } from "@/app/(dashboard)/dashboard/page";

type CardsGridProps = {
  data: CardData[];
};

export default function CardsGrid({ data }: CardsGridProps) {
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        {data
          .filter((item) => !item.type)
          .map((item, index) => (
            <InfoCard key={index} {...item} />
          ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 w-full">
        {data
          .filter((item) => item.type)
          .map((item, index) => (
            <div key={index} className="w-full h-full">
              <InfoCard {...item} />
            </div>
          ))}
      </div>
    </>
  );
}
