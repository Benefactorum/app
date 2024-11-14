import Maximilien from "/assets/images/cofounders/Maximilien-Pressensé.webp";
import Camille from "/assets/images/cofounders/Camille-Pressensé.webp";
import Pierre from "/assets/images/cofounders/Pierre-Chauty.webp";
import Thomas from "/assets/images/cofounders/Thomas-Garnier.webp";
// @ts-ignore
import Linkedin from "/assets/icons/linkedin.svg?react";

const cofounders = [
  {
    title: "Maximilien Pressensé",
    src: Maximilien,
    description: "Fondateur et président de Benefactorum.",
    linkedin: "https://www.linkedin.com/in/maximilien-pressense",
  },
  {
    title: "Camille Pressensé",
    src: Camille,
    description:
      "Co-fondatrice, trésorière et administratrice de Benefactorum.",
    linkedin: "https://www.linkedin.com/in/camille-pressensé-9303842a5",
  },
  {
    title: "Thomas Garnier",
    src: Thomas,
    description: "Co-fondateur, trésorier et administrateur de Benefactorum.",
    linkedin: "https://www.linkedin.com/in/garnierthomas/",
  },
  {
    title: "Pierre Chauty",
    src: Pierre,
    description: "Co-fondateur et administrateur de Benefactorum.",
    linkedin: "https://www.linkedin.com/in/pierre-chauty/",
  },
];

export default function Members() {
  return (
    <div className="bg-white">
      <div className="flex flex-row flex-wrap py-8 lg:py-16 2xl:container mx-auto px-2 sm:px-8 gap-x-16 gap-y-8 justify-center">
        {cofounders.map((cofounder, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row mx-auto items-center gap-4 sm:w-5/12"
          >
            <img
              src={cofounder.src}
              alt={cofounder.title}
              className="w-[100px]"
            />
            <div className="flex flex-col text-center lg:text-start">
              <a
                href={cofounder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-4 items-center mx-auto lg:mx-0"
              >
                <h3 className="underline hover:text-primary text-xl font-semibold">
                  {cofounder.title}
                </h3>
                <Linkedin className="w-5 h-5 fill-primary rounded-sm" />
              </a>
              <p className="">{cofounder.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
