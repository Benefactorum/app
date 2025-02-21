import { NewOsbl, OsblUpdate } from '@/pages/Contribution/types'
import { numberInput } from '@/lib/numberInput'

export function getOsblData (osbl: OsblUpdate): NewOsbl {
  return {
    ...osbl,
    creation_year: numberInput(osbl.creation_year),
    public_utility: Boolean(osbl.public_utility),
    osbls_causes_attributes: Object.values(osbl.osbls_causes_attributes),
    osbls_keywords_attributes: osbl.osbls_keywords_attributes !== undefined
      ? Object.values(osbl.osbls_keywords_attributes)
      : undefined,
    osbls_intervention_areas_attributes: osbl.osbls_intervention_areas_attributes !== undefined
      ? Object.values(osbl.osbls_intervention_areas_attributes)
      : undefined,
    osbls_labels_attributes: osbl.osbls_labels_attributes !== undefined
      ? Object.values(osbl.osbls_labels_attributes)
      : undefined,
    annual_finances_attributes: osbl.annual_finances_attributes !== undefined
      ? Object.values(osbl.annual_finances_attributes).map(finance => ({
        year: Number(finance.year),
        budget: numberInput(finance.budget),
        treasury: numberInput(finance.treasury),
        employees_count: numberInput(finance.employees_count),
        certified: Boolean(finance.certified),
        fund_sources_attributes: finance.fund_sources_attributes !== undefined
          ? Object.values(finance.fund_sources_attributes).map(source => ({
            type: source.type,
            percent: Number(source.percent),
            amount: numberInput(source.amount)
          }))
          : undefined,
        fund_allocations_attributes: finance.fund_allocations_attributes !== undefined
          ? Object.values(finance.fund_allocations_attributes).map(allocation => ({
            type: allocation.type,
            percent: Number(allocation.percent),
            amount: numberInput(allocation.amount)
          }))
          : undefined
      }))
      : undefined,
    document_attachments_attributes: osbl.document_attachments_attributes !== undefined
      ? Object.values(osbl.document_attachments_attributes).map(doc => ({
        document_attributes: {
          ...doc.document_attributes,
          year: numberInput(doc.document_attributes.year)
        }
      }))
      : undefined,
    locations_attributes: osbl.locations_attributes !== undefined
      ? Object.values(osbl.locations_attributes).map(location => ({
        ...location,
        address_attributes: {
          ...location.address_attributes,
          city: location.address_attributes.city,
          latitude: numberInput(location.address_attributes.latitude) as number,
          longitude: numberInput(location.address_attributes.longitude) as number
        }
      }))
      : undefined
  }
}
