import { Link } from '@inertiajs/react'
import { ReactElement } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import Environment from '@/assets/images/pages/home/causes/environment.webp'
import ChildCare from '@/assets/images/pages/home/causes/childcare.webp'
import Health from '@/assets/images/pages/home/causes/health.webp'
import Poverty from '@/assets/images/pages/home/causes/poverty.webp'
import Education from '@/assets/images/pages/home/causes/education.webp'
import AnimalRights from '@/assets/images/pages/home/causes/animal-rights.webp'
import Research from '@/assets/images/pages/home/causes/research.webp'
import ArtsCulture from '@/assets/images/pages/home/causes/arts-culture.webp'
import InternationalAid from '@/assets/images/pages/home/causes/international-aid.webp'
import Disability from '@/assets/images/pages/home/causes/disability.webp'
import SocialJustice from '@/assets/images/pages/home/causes/social-justice.webp'
import Beliefs from '@/assets/images/pages/home/causes/beliefs.webp'
import Others from '@/assets/images/pages/home/causes/others.webp'

const causes = [
  {
    title: 'Environnement',
    src: Environment,
    alt: 'Un arbre verdoyant protégé dans une sphère de verre craquelée, symbolisant la fragilité de la nature et la nécessité de la préserver face aux menaces environnementales',
    description:
      'Lutte contre le réchauffement climatique, protection des écosystèmes menacés, ...'
  },
  {
    title: 'Protection de l’enfance',
    src: ChildCare,
    alt: "Deux jeunes enfants debout parmi des matériaux de construction, symbolisant l'innocence et la résilience dans un environnement difficile",
    description:
      'Prévention de la maltraitance, solutions de placement pour les enfants isolés, ...'
  },
  {
    title: 'Santé',
    src: Health,
    alt: "Une main tenant délicatement le poignet d'une autre personne, symbolisant le soin, l'empathie et le soutien dans un moment de besoin",
    description:
      "Amélioration de l'accès aux soins de base, soutien à la recherche médicale, ..."
  },
  {
    title: 'Lutte contre la précarité',
    src: Poverty,
    alt: 'Un homme sans-abri assis seul avec son chien, entouré de ses affaires dans un abri improvisé, symbolisant la solitude et la précarité de la vie dans la rue.',
    description: 'Banques alimentaires, aide au logement, accès à l’emploi ...'
  },
  {
    title: 'Éducation',
    src: Education,
    alt: "Des enfants concentrés devant des ordinateurs dans une salle de classe, illustrant l'apprentissage des nouvelles technologies et le développement des compétences numériques dès le jeune âge",
    description:
      "Accès à l'éducation pour les populations défavorisées, lutte contre la fracture numérique, ..."
  },
  {
    title: 'Protection Animale',
    src: AnimalRights,
    alt: "Deux chats blottis l'un contre l'autre, symbolisant la tendresse, l'amitié et le réconfort entre compagnons.",
    description:
      'Lutte contre la cruauté animale, sauvegarde des espèces en danger, ...'
  },
  {
    title: 'Recherche',
    src: Research,
    alt: "Vue rapprochée d'un microscope en action, symbolisant la précision et la curiosité scientifique dans la recherche et l'exploration du monde microscopique.",
    description: 'Soutien à la recherche médicale, technologique, ...'
  },
  {
    title: 'Arts, Culture, Patrimoine',
    src: ArtsCulture,
    alt: "Statue d'une guerrière brandissant une lance, symbolisant la force, la détermination et l'esprit combatif.",
    description:
      'Accessibilité à la culture, soutien aux artistes, préservation du patrimoine ...'
  },
  {
    title: 'Aide internationale',
    src: InternationalAid,
    alt: "Deux jeunes enfants debout dans un environnement de construction, symbolisant l'innocence et la curiosité face au monde qui les entoure.",
    description:
      'Urgence humanitaire, accès à l’eau potable, soutien à l’agriculture locale, ...'
  },
  {
    title: 'Handicap',
    src: Disability,
    alt: "Une personne en fauteuil roulant électrique confrontée à une barrière sur un sentier, symbolisant les défis d'accessibilité et les obstacles rencontrés par les personnes en situation de handicap.",
    description:
      'Inclusion des publics handicapés dans la vie économique et sociale, ...'
  },
  {
    title: 'Justice sociale',
    src: SocialJustice,
    alt: "Portrait en noir et blanc d'une femme levant le poing et s'exprimant avec passion, symbolisant la lutte pour la justice sociale et la détermination dans l'activisme.",
    description:
      'Lutte contre toutes les formes de discriminations, défense des droits humains, ...'
  },
  {
    title: 'Religion',
    src: Beliefs,
    alt: "Portrait en noir et blanc d'un homme regardant vers le haut, symbolisant la spiritualité, la quête de réponses.",
    description: 'Soutien aux associations confessionnelles, spiritualité, ...'
  },
  {
    title: 'Autre',
    src: Others,
    alt: 'Un tas de pièces de puzzle mélangées, symbolisant la diversité, le défi de reconstituer un tout ou la recherche de solutions.',
    description: 'Causes diverses et variées.'
  }
]

export default function CharityCarousel (): ReactElement {
  return (
    <div className='min-[432px]:px-16 max-[431px]:pt-8'>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
          slidesToScroll: 'auto'
        }}
      >
        <CarouselContent className='pb-3'>
          {causes.map((cause, index) => (
            <CarouselItem
              key={index}
              className='basis-full min-[752px]:basis-1/2 min-[1072px]:basis-1/3 min-[1392px]:basis-1/4 flex justify-center min-w-[320px]'
            >
              <div className='w-[304px] h-[450px] flex flex-col'>
                <img
                  src={cause.src}
                  alt={cause.alt}
                  title={cause.alt}
                  className='rounded-t-3xl'
                />
                <Card className='flex-grow bg-background rounded-t-none rounded-b-3xl flex flex-col shadow-md border-t-none'>
                  <CardHeader className='my-4 text-center'>
                    <CardTitle className='text-xl font-semibold'>
                      <h3>{cause.title}</h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='flex-1'>
                    <p>{cause.description}</p>
                  </CardContent>
                  <CardFooter className='my-4 ml-auto'>
                    <Link
                      href='/associations'
                      className='text-primary text-right hover:underline'
                    >
                      Voir les associations
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          size='lg'
          variant='secondary'
          className='-top-8 left-auto right-1/2 -translate-x-[86px] min-[432px]:hidden'
        />
        <CarouselNext
          size='lg'
          variant='secondary'
          className='-top-8 left-1/2 translate-x-[86px] min-[432px]:hidden'
        />
        <CarouselPrevious
          variant='secondary'
          className='hidden min-[432px]:flex'
        />
        <CarouselNext variant='secondary' className='hidden min-[432px]:flex' />
      </Carousel>
    </div>
  )
}
