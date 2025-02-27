import { ReactElement } from 'react'
import { Label } from '@/components/ui/label'
import {
  MultiSelect
} from '@/components/ui/multi-select'
import { FormProps } from '@/pages/Contribution/types'
import InputError from '@/components/shared/InputError'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import KeywordAsyncCreatableSelect from '@/components/pages/contribution/new/OsblDatasheet/KeywordAsyncCreatableSelect'
import HelpTooltip from '@/components/shared/HelpTooltip'
import InterventionAreaAsyncCreatableSelect from '@/components/pages/contribution/new/OsblDatasheet/InterventionAreaAsyncCreatableSelect'
import MyNumberInput from '@/components/shared/MyNumberInput'
import MyCheckbox from '@/components/shared/MyCheckbox'
import { CausesList, GeographicalScaleList, OsblTypeList, TaxReductionList, LabelList } from '@/lib/constants'

export default function OsblDatasheet ({ data, setData, errors, clearErrors }: Omit<FormProps, 'setError'>): ReactElement {
  return (
    <div className='bg-white rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col w-full'>
      <h2 className='text-2xl font-semibold'>Fiche technique</h2>

      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <Label>Causes * :</Label>
          <MultiSelect
            options={CausesList}
            defaultValue={data.osbls_causes_attributes?.map(cause => cause.cause_id)}
            onValueChange={(value) => {
              setData('osbls_causes_attributes', value.map(id => ({ cause_id: id, name: CausesList.find(c => c.value === id)?.label })))
              clearErrors('osbls_causes_attributes')
            }}
            placeholder=''
            variant='secondary'
            animation={0}
            maxCount={1}
            className={errors.osbls_causes_attributes !== undefined ? 'border-red-600' : ''}
          />
          {Boolean(errors.osbls_causes_attributes) && <InputError>{errors.osbls_causes_attributes}</InputError>}
        </div>

        <div className='flex flex-col gap-4'>
          <Label>Réduction d'impôt * :</Label>
          <RadioGroup
            required // doesn't work. Comment kept for reference
            value={data.tax_reduction}
            onValueChange={(value) => {
              setData('tax_reduction', value)
              clearErrors('tax_reduction')
            }}
          >
            {TaxReductionList.map((item) => (
              <div className='flex items-center justify-between' key={item.value}>
                <Label
                  htmlFor={item.value}
                  className='flex items-center justify-between w-16 cursor-pointer'
                >
                  {item.label}
                  <HelpTooltip>
                    <h2 className='font-semibold'>{item.tooltip.title}</h2>
                    {item.tooltip.description}
                  </HelpTooltip>
                </Label>
                <RadioGroupItem value={item.value} id={item.value} />
              </div>
            ))}
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
          <Select value={data.geographical_scale} onValueChange={(value) => setData('geographical_scale', value)}>
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
            <HelpTooltip>
              <p><span className='font-semibold'>O</span>rganisation{' '}
                <span className='font-semibold'>S</span>ans{' '}
                <span className='font-semibold'>B</span>ut{' '}
                <span className='font-semibold'>L</span>ucratif.
              </p>
            </HelpTooltip>
            :
          </Label>
          <Select
            value={data.osbl_type} onValueChange={(value) => {
              if (value !== 'association') {
                data.public_utility = undefined
              }
              setData('osbl_type', value)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OsblTypeList.map((item) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(data.osbl_type === 'association' || data.osbl_type === 'fondation') && (
            <MyCheckbox
              id='public_utility'
              checked={data.public_utility ?? false}
              onCheckedChange={checked => setData('public_utility', checked)}
            >
              Reconnue d'utilité publique
              {data.osbl_type === 'association' ? ' (ARUP)' : ' (FRUP)'}
            </MyCheckbox>
          )}
        </div>

        <MyNumberInput
          id='creation_year'
          labelText='Année de création :'
          min={1000}
          max={new Date().getFullYear()}
          value={data.creation_year ?? ''}
          onChange={(value) => { setData('creation_year', value) }}
        />

        <div className='flex flex-col gap-4'>
          <Label>Labels :</Label>
          <MultiSelect
            defaultValue={data.osbls_labels_attributes?.map(label => label.label_id)}
            options={LabelList}
            onValueChange={(value) => {
              setData('osbls_labels_attributes', value.map(id => ({ label_id: id, name: LabelList.find(l => l.value === id)?.label })))
            }}
            placeholder=''
            variant='default'
            animation={0}
            maxCount={2}
          />
        </div>
      </div>
    </div>
  )
}
