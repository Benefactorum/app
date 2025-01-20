import { ReactElement } from 'react'
import { FormProps } from '@/pages/Contribution/types'
import MyAsyncCreatableSelect from '@/components/shared/MyAsyncCreatableSelect'

export default function KeywordAsyncCreatableSelect ({
  data,
  setData
}: Pick<FormProps, 'data' | 'setData'>): ReactElement {
  return (
    <MyAsyncCreatableSelect
      data={data}
      setData={setData}
      attributeName='osbls_keywords_attributes'
      resource='keywords'
      placeholder='droits des femmes, ...'
    />
  )
}
