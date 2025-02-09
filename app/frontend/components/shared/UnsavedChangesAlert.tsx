import { ReactElement } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CircleAlert } from 'lucide-react'

interface UnsavedChangesAlertProps<T extends object> {
  originalData: T
  currentData: T
}

function UnsavedChangesAlert<T extends object> ({ originalData, currentData }: UnsavedChangesAlertProps<T>): ReactElement | null {
  // Check if there is unsaved change
  const hasChanges: boolean =
    Object.keys(originalData).length > 0 &&
    JSON.stringify(originalData) !== JSON.stringify(currentData)

  if (!hasChanges) {
    return null
  }

  return (
    <Alert className='mt-4 border-red-600'>
      <CircleAlert className='text-red-600' />
      <AlertDescription>
        Vos modifications doivent être validées pour être enregistrées.
      </AlertDescription>
    </Alert>
  )
}

export default UnsavedChangesAlert
