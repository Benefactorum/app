import { ReactElement } from 'react'
import { Label } from '@/components/ui/label'
import MyInput from '@/components/forms/MyInput'
import { Textarea } from '@/components/ui/textarea'
import { FormProps } from '@/pages/Contribution/types'
import HelpTooltip from '@/components/shared/HelpTooltip'

export default function OsblHeader ({ data, setData, errors, clearErrors }: FormProps): ReactElement {
  return (
    <div className='flex flex-wrap gap-16 mx-auto justify-center'>
      <div className='bg-white w-full sm:w-auto rounded-lg border p-4 sm:px-8 sm:py-8 gap-8 flex flex-col'>
        <h2 className='text-2xl font-semibold'>En-tête</h2>
        <div className='flex flex-col gap-8'>
          <MyInput
            id='name'
            type='text'
            labelText="Nom de l'association * :"
            required
            value={data.name}
            onChange={(e) => {
              setData('name', e.target.value)
              clearErrors('name')
            }}
            error={errors.name}
          />

          <MyInput
            id='website'
            type='text'
            labelText='Site internet :'
            value={data.website ?? ''}
            onChange={(e) => {
              setData('website', e.target.value)
              clearErrors('website')
            }}
            error={errors.website}
          />

          <MyInput
            id='logo'
            type='file'
            labelText={
              <p className='flex items-center gap-2'>
                Logo
                <HelpTooltip size='small'>
                  <p>Le format SVG est à privilégier.</p>
                  <p>À défaut, le format PNG, avec fond transparent, est aussi accepté.</p>
                </HelpTooltip>
                :
              </p>
          }
            onChange={(e) => {
              const files = e.target.files
              if (files === null) return
              setData('logo', files[0])
              clearErrors('logo')
            }}
            error={errors.logo}
          />

          <div>
            <div className='flex flex-col gap-4'>
              <Label htmlFor='description' className=''>
                Description de l'association :
              </Label>
              <Textarea
                id='description'
                placeholder='Mission, actions, ...'
                value={data.description}
                onChange={(e) => {
                  setData('description', e.target.value)
                  clearErrors('description')
                }}
                className='bg-white focus-visible:ring-0 focus-visible:border-primary placeholder:text-ellipsis placeholder:text-xs md:placeholder:text-sm focus-visible:ring-offset-0 w-auto flex-grow h-40'
              />
              <div className={`text-xs text-right ${(data.description ?? '').length > 300 ? 'text-red-600' : 'text-gray-500'}`}>
                {(data.description ?? '').length}/300 caractères
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
