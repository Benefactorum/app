import { ReactElement } from 'react'
import { FormProps } from '@/pages/Contribution/types'
import MyAsyncCreatableSelect from '@/components/shared/MyAsyncCreatableSelect'

export default function InterventionAreaAsyncCreatableSelect ({
  data,
  setData
}: Pick<FormProps, 'data' | 'setData'>): ReactElement {
  return (
    <MyAsyncCreatableSelect
      data={data}
      setData={setData}
      attributeName='osbls_intervention_areas_attributes'
      endpoint='intervention_areas'
      minInputLength={2}
      placeholder='pays, région, ...'
    />
  )
}
