import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CircleAlert } from 'lucide-react'

interface UnsavedChangesAlertProps {
  originalData: Object
  currentData: Object
}

const UnsavedChangesAlert: React.FC<UnsavedChangesAlertProps> = ({ originalData, currentData }) => {
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
