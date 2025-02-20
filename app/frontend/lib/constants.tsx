import { Baby, Stethoscope, Coins, BookMarked, PawPrint, Trees, Church, Microscope, Globe, Accessibility, Scale, Shuffle, Brush } from 'lucide-react'

export const CausesList = [
  { label: 'Environnement', icon: Trees, value: '1' },
  { label: 'Protection de l\'enfance', icon: Baby, value: '2' },
  { label: 'Santé', icon: Stethoscope, value: '3' },
  { label: 'Lutte contre la précarité', icon: Coins, value: '4' },
  { label: 'Éducation', icon: BookMarked, value: '5' },
  { label: 'Protection animale', icon: PawPrint, value: '6' },
  { label: 'Recherche', icon: Microscope, value: '7' },
  { label: 'Arts, Culture, Patrimoine', icon: Brush, value: '8' },
  { label: 'Aide internationale', icon: Globe, value: '9' },
  { label: 'Handicap', icon: Accessibility, value: '10' },
  { label: 'Justice sociale', icon: Scale, value: '11' },
  { label: 'Religion', icon: Church, value: '12' },
  { label: 'Autre', icon: Shuffle, value: '13' }
]

export const GeographicalScaleList = [
  { value: 'local', label: 'Locale' },
  { value: 'regional', label: 'Régionale' },
  { value: 'national', label: 'Nationale' },
  { value: 'international', label: 'Internationale' }
]

export const OsblTypeList = [
  { value: 'association', label: 'Association d\'intérêt général' },
  { value: 'fonds_de_dotation', label: 'Fonds de dotation' },
  { value: 'fondation', label: 'Fondation' }
]

export const TaxReductionList = [
  {
    value: 'intérêt_général',
    label: '66 %',
    tooltip: {
      title: 'Les organismes d\'intérêt général.',
      description: 'Elles ouvrent le droit à une réduction d\'impôt de 66 %.'
    }
  },
  {
    value: 'aide_aux_personnes_en_difficulté',
    label: '75 %',
    tooltip: {
      title: 'Les organismes d\'aide aux personnes en difficulté.',
      description: (
        <p>
          Elles ouvrent le droit à une réduction d'impôt de 75 %, jusqu'à 1 000 € de dons.
          <br />
          Le régime de réduction à 66 % s'applique ensuite.
        </p>
      )
    }
  }
]

export const LabelList = [
  { value: '1', label: 'Don en confiance' },
  { value: '2', label: 'Label IDEAS' }
]
