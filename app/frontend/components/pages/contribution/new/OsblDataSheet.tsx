import { ReactElement } from 'react'
import { Label } from '@/components/ui/label'
import MyInput from '@/components/forms/MyInput'
import {
  MultiSelect
} from '@/components/ui/multi-select'
import { FormProps } from '@/pages/Contribution/types'
import { Baby, Stethoscope, Coins, BookMarked, PawPrint, Trees, Church, Microscope, Globe, Accessibility, Scale, Shuffle, Brush } from 'lucide-react'
import InputError from '@/components/forms/InputError'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { usePage } from '@inertiajs/react'
import KeywordAsyncCreatableSelect from './KeywordAsyncCreatableSelect'
import HelpTooltip from '@/components/shared/HelpTooltip'
import InterventionAreaAsyncCreatableSelect from './InterventionAreaAsyncCreatableSelect'
import MyNumberInput from '@/components/forms/MyNumberInput'
import MyCheckbox from '@/components/forms/MyCheckbox'

const CausesList = [
  { value: 'environnement', label: 'Environnement', icon: Trees },
  { value: 'protection-de-l-enfance', label: 'Protection de l\'enfance', icon: Baby },
  { value: 'sante', label: 'Santé', icon: Stethoscope },
  { value: 'lutte-contre-la-précarité', label: 'Lutte contre la précarité', icon: Coins },
  { value: 'education', label: 'Éducation', icon: BookMarked },
  { value: 'protection-animale', label: 'Protection animale', icon: PawPrint },
  { value: 'recherche', label: 'Recherche', icon: Microscope },
  { value: 'arts-culture-patrimoine', label: 'Arts, Culture, Patrimoine', icon: Brush },
  { value: 'aide-internationale', label: 'Aide internationale', icon: Globe },
  { value: 'handicap', label: 'Handicap', icon: Accessibility },
  { value: 'justice-sociale', label: 'Justice sociale', icon: Scale },
  { value: 'religion', label: 'Religion', icon: Church },
  { value: 'autre', label: 'Autre', icon: Shuffle }
]

const GeographicalScaleList = [
  { value: 'local', label: 'Locale' },
  { value: 'regional', label: 'Régionale' },
  { value: 'national', label: 'Nationale' },
  { value: 'international', label: 'Internationale' }
]

const OsblTypeList = [
  { value: 'association', label: 'Association' },
  { value: 'fonds_de_dotation', label: 'Fonds de dotation' },
  { value: 'fondation', label: 'Fondation' }
]

export default function OsblDataSheet ({ data, setData, errors, clearErrors }: FormProps): ReactElement {
  const causes = usePage().props.causes as Record<string, number>

  const syncedCausesList = CausesList.map(cause => ({
    ...cause,
    value: String(causes[cause.value])
  }))

  return (
    <div className='flex flex-wrap gap-16 mx-auto justify-center'>
      <div className='bg-white w-full sm:w-auto rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col'>
        <h2 className='text-2xl font-semibold'>Fiche technique</h2>

        <div className='flex flex-col gap-8'>
          <div className='flex flex-col gap-4'>
            <Label>Causes * :</Label>
            <MultiSelect
              options={syncedCausesList}
              onValueChange={(value) => {
                setData('osbls_causes_attributes', value.map(cause => ({ cause_id: cause })))
                clearErrors('osbls_causes_attributes')
              }}
              placeholder=''
              variant='secondary'
              animation={0}
              maxCount={1}
            />
            {Boolean(errors.osbls_causes_attributes) && <InputError>{errors.osbls_causes_attributes}</InputError>}
          </div>

          <div className='flex flex-col gap-4'>
            <Label>Réduction d'impôt * :</Label>
            <RadioGroup
              required
              value={String(data.tax_reduction)} onValueChange={(value) => {
                setData('tax_reduction', value)
                clearErrors('tax_reduction')
              }}
            >
              <div className='flex items-center justify-between'>
                <Label htmlFor='option-one' className='flex items-center justify-between w-16'>
                  66 %
                  <HelpTooltip>
                    <h2 className='font-semibold mb-4'>Les associations d'intérêt général, ou reconnues d'utilité publique (ARUP).</h2>
                    <p>Elles ouvrent le droit à une réduction d'impôt de 66 %.</p>
                  </HelpTooltip>
                </Label>
                <RadioGroupItem value='intérêt_général' />
              </div>
              <div className='flex items-center justify-between'>
                <Label htmlFor='option-two' className='flex items-center justify-between w-16'>
                  75 %
                  <HelpTooltip>
                    <h2 className='font-semibold mb-4'>Les organismes d'aide aux personnes en difficulté.</h2>
                    <p>Elles ouvrent le droit à une réduction d'impôt de 75 %, jusqu'à 1 000 € de dons.</p>
                    <p>Le régime standard de réduction à 66 % s'applique ensuite.</p>
                  </HelpTooltip>
                </Label>
                <RadioGroupItem value='aide_aux_personnes_en_difficulté' />
              </div>
            </RadioGroup>
            {Boolean(errors.tax_reduction) && <InputError>{errors.tax_reduction}</InputError>}
          </div>

          <div className='flex flex-col gap-4'>
            <Label>Mots-clés :</Label>
            <KeywordAsyncCreatableSelect
              data={data}
              setData={setData}
            />
          </div>

          <div className='flex flex-col gap-4'>
            <Label>Échelle :</Label>
            <Select onValueChange={(value) => setData('geographical_scale', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GeographicalScaleList.map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-4'>
            <Label>Zones d'action :</Label>
            <InterventionAreaAsyncCreatableSelect
              data={data}
              setData={setData}
            />
          </div>

          <div className='flex flex-col gap-4'>
            <Label className='flex items-center gap-2'>
              Type d'OSBL
              <HelpTooltip size='small'>
                <p>Organisation Sans But Lucratif.</p>
              </HelpTooltip>
              :
            </Label>
            <Select onValueChange={(value) => setData('osbl_type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OsblTypeList.map((item) => (
                  <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {data.osbl_type === 'association' && (
              <MyCheckbox
                id='public_utility'
                checked={data.public_utility ?? false}
                onCheckedChange={checked => setData('public_utility', checked)}
              >
                Reconnue d'utilité publique (ARUP)
              </MyCheckbox>
            )}
          </div>

          <MyNumberInput
            id='creation_year'
            labelText='Année de création :'
            min={1000}
            max={new Date().getFullYear()}
            value={data.creation_year ?? ''}
            onChange={(e) => {
              setData('creation_year', Number(e.target.value))
            }}
            onReset={() => {
              setData('creation_year', undefined)
            }}
          />

          <MyInput
            id='osbl_email'
            type='email'
            labelText='Email de contact :'
            value={data.contact_email ?? ''}
            onChange={(e) => {
              setData('contact_email', e.target.value)
              clearErrors('contact_email')
            }}
            error={errors.contact_email}
          />
        </div>
      </div>
    </div>
  )
}
