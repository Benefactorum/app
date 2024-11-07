import ActionContreLaFaim from "/assets/images/homepage/logos/action-contre-la-faim.png";
import Adie from "/assets/images/homepage/logos/adie.png";
import AfmTelethon from "/assets/images/homepage/logos/afm-telethon.png";
import AideAuxJeunesDiabetiques from "/assets/images/homepage/logos/aide-aux-jeunes-diabetiques.png";
import Boomforest from "/assets/images/homepage/logos/boomforest.png";
import CroixRouge from "/assets/images/homepage/logos/croix-rouge.png";
import EmmausFrance from "/assets/images/homepage/logos/emmaus-france.png";
import Greenpeace from "/assets/images/homepage/logos/greenpeace.png";
import Msf from "/assets/images/homepage/logos/msf.png";
import RestosDuCoeur from "/assets/images/homepage/logos/restos-du-coeur.svg";
import SecoursCatholique from "/assets/images/homepage/logos/secours-catholique.png";
import Snc from "/assets/images/homepage/logos/snc.svg";

export default function CharityCarousel() {
  const logos = [
    { src: ActionContreLaFaim, alt: "Action Contre La Faim" },
    { src: Adie, alt: "Adie" },
    { src: AfmTelethon, alt: "AFM Telethon" },
    { src: AideAuxJeunesDiabetiques, alt: "Aide Aux Jeunes Diabetiques" },
    { src: Boomforest, alt: "Boomforest" },
    { src: CroixRouge, alt: "Croix Rouge" },
    { src: EmmausFrance, alt: "Emmaus France" },
    { src: Greenpeace, alt: "Greenpeace" },
    { src: Msf, alt: "Médecins Sans Frontières" },
    { src: RestosDuCoeur, alt: "Restos Du Coeur" },
    { src: SecoursCatholique, alt: "Secours Catholique" },
    { src: Snc, alt: "SNC" },
  ];

  return (
    <div className="flex justify-center gap-8 animate-marquee">
      {logos.map((logo, index) => (
        <img
          key={index}
          className="object-contain"
          src={logo.src}
          alt={`Logo de ${logo.alt}`}
          title={`Logo de ${logo.alt}`}
        />
      ))}
      {logos.map((logo, index) => (
        <img
          key={`dupl-${index}`}
          className="object-contain"
          src={logo.src}
          alt={logo.alt}
        />
      ))}
      {logos.map((logo, index) => (
        <img
          key={`dupl-2-${index}`}
          className="object-contain"
          src={logo.src}
          alt={logo.alt}
        />
      ))}
    </div>
  );
}
