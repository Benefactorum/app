import type { NewOsbl } from '@/pages/Contribution/types'
import { OsblTypeList, TaxReductionList, GeographicalScaleList } from '@/lib/constants'
import HelpTooltip from '@/components/shared/HelpTooltip'

interface Props {
  osbl: NewOsbl
}

interface DetailItemProps {
  label: string | React.ReactElement
  value: string | number
}

function DetailItem ({ label, value }: DetailItemProps): React.ReactElement {
  return (
    <div className='space-y-1'>
      <dt className='text-sm text-muted-foreground'>{label}</dt>
      <dd className='font-semibold'>{value}</dd>
    </div>
  )
}

function getSize (osbl: NewOsbl): string {
  const budget = osbl.annual_finances_attributes
    ?.filter(finance => typeof finance.budget === 'number')
    ?.sort((a, b) => b.year - a.year)?.[0]?.budget

  if (typeof budget !== 'number') return '-'

  if (budget < 10000) return 'Micro'
  if (budget < 100000) return 'Petite'
  if (budget < 1000000) return 'Moyenne'
  if (budget < 10000000) return 'Grande'
  return 'Très grande'
}

function getOsblType (osbl: NewOsbl): string {
  const type = OsblTypeList.find(t => t.value === osbl.osbl_type)
  return type?.label ?? '-'
}

function getTaxReduction (osbl: NewOsbl): string {
  const reduction = TaxReductionList.find(r => r.value === osbl.tax_reduction)
  return reduction?.label ?? '-'
}

function getGeographicalScale (osbl: NewOsbl): string {
  const scale = GeographicalScaleList.find(s => s.value === osbl.geographical_scale)
  return scale?.label ?? '-'
}

export default function DataSheetTab ({ osbl }: Props): React.ReactElement {
  return (
    <div className='container mx-auto p-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <DetailItem
          label={
            <span>
              Type d'OSBL
              <HelpTooltip className='ml-2 mb-1'>
                <p>
                  <span className='font-semibold'>O</span>rganisation{' '}
                  <span className='font-semibold'>S</span>ans{' '}
                  <span className='font-semibold'>B</span>ut{' '}
                  <span className='font-semibold'>L</span>ucratif.
                </p>
              </HelpTooltip>
            </span>
          }
          value={getOsblType(osbl)}
        />
        <DetailItem
          label={
            <span>
              Taille de l'association
              <HelpTooltip className='ml-2 mb-1'>
                <div className='space-y-2'>
                  <p className='font-medium'>Classification par budget annuel :</p>
                  <ul className='list-disc-none pl-4 space-y-1'>
                    <li><span className='font-semibold'>Micro :</span> moins de 10 000 €</li>
                    <li><span className='font-semibold'>Petite :</span> jusqu'à 100 000 €</li>
                    <li><span className='font-semibold'>Moyenne :</span> jusqu'à 1 M€</li>
                    <li><span className='font-semibold'>Grande :</span> jusqu'à 10 M€</li>
                    <li><span className='font-semibold'>Très grande :</span> plus de 10 M€</li>
                  </ul>
                </div>
              </HelpTooltip>
            </span>
          }
          value={getSize(osbl)}
        />

        <DetailItem
          label={osbl.osbls_causes_attributes?.length > 1 ? 'Causes' : 'Cause'}
          value={osbl.osbls_causes_attributes?.map(cause => cause.name).join(', ') ?? '-'}
        />
        <DetailItem
          label={(osbl.osbls_keywords_attributes ?? []).length > 1 ? 'Mots-clés' : 'Mot-clé'}
          value={osbl.osbls_keywords_attributes?.map(keyword => keyword.name).join(', ') ?? '-'}
        />

        <DetailItem
          label='Échelle géographique'
          value={getGeographicalScale(osbl)}
        />
        <DetailItem
          label={(osbl.osbls_intervention_areas_attributes ?? []).length > 1 ? 'Zones d\'action particulières' : 'Zone d\'action particulière'}
          value={osbl.osbls_intervention_areas_attributes?.map(area => area.name).join(', ') ?? '-'}
        />

        <DetailItem
          label={
            <span>
              Réduction d'impôts
              <HelpTooltip className='ml-2 mb-1'>
                <p>Vos dons sont déductibles de votre impôt sur le revenu,
                  <br />
                  jusqu'à 20% de votre revenu imposable.
                </p>
              </HelpTooltip>
            </span>
          }
          value={getTaxReduction(osbl)}
        />
        <DetailItem
          label='Date de création'
          value={osbl.creation_year ?? '-'}
        />
      </div>
    </div>
  )
}
