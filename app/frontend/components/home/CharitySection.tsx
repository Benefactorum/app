import CharityCarousel from "./CharityCarousel";

export default function CharitySection() {
  return (
    <div className="bg-white py-4 overflow-x-hidden">
      <CharityCarousel />
      <div className="2xl:container mx-auto flex flex-col gap-8">
        <h2 className="p-16 text-2xl md:text-3xl font-semibold">
          Soutenez les causes qui vous tiennent à coeur
        </h2>
      </div>
    </div>
  );
}
