import { Head, Link, router } from '@inertiajs/react'
import { ReactElement } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import formattedDate from '@/lib/formattedDate'
import { Pencil, Eye, Trash } from 'lucide-react'
// @ts-expect-error
import Github from '@/assets/icons/github.svg?react'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { CurrentUserType } from '@/types/types'

interface Contribution {
  id: number
  contributable_type: string
  status: string
  created_at: string
  github_resource_url: string
  osbl_name: string
}

interface Props {
  currentUser: CurrentUserType
  contributions: Contribution[]
}

function getStatusBadgeVariant (status: string): { variant: BadgeProps['variant'] } {
  switch (status) {
    case 'validée':
      return { variant: 'default' }
    case 'non traitée':
      return { variant: 'secondary' }
    case 'ouvert':
      return { variant: 'outline' }
    case 'rejetée':
      return { variant: 'destructive' }
    default:
      return { variant: 'ghost' }
  }
}

export default function Index ({ currentUser, contributions }: Props): ReactElement {
  function handleDelete (id: number): void {
    router.delete(`/users/${currentUser.id}/contributions/${id}`)
  }

  function getTypeLabel (contribution: Contribution): string {
    switch (contribution.contributable_type) {
      case 'Contribution::OsblCreation':
        return `Ajouter ${contribution.osbl_name}`
      case 'Contribution::OsblUpdate':
        return `Modifier ${contribution.osbl_name}`
      case 'Contribution::Feedback':
        return 'Retour d\'expérience'
      case 'Contribution::FeatureRequest':
        return 'Suggestion'
      case 'Contribution::BugReport':
        return 'Rapport de bogue'
      case 'Contribution::CorrectionRequest':
        return 'Correctif'
      case 'Contribution::Other':
        return 'Autre'
      default:
        return contribution.contributable_type
    }
  }

  return (
    <>
      <Head title='Mes contributions' />
      <div className='2xl:container mx-auto w-full flex flex-col px-2 sm:px-8 md:px-16 pt-8 pb-16 gap-8'>
        <h1 className='text-2xl font-semibold sm:text-3xl'>Mon historique</h1>
        <ScrollArea className='bg-white rounded-md border p-2 sm:p-4'>
          <ScrollBar orientation='horizontal' forceMount />
          {contributions.length > 0
            ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='font-semibold'>
                        Date
                      </TableHead>
                      <TableHead className='font-semibold'>
                        Type de contribution
                      </TableHead>
                      <TableHead className='font-semibold'>
                        Statut
                      </TableHead>
                      <TableHead className='w-0 font-semibold'>
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributions.map((contribution, index) => (
                      <TableRow key={index}>
                        <TableCell>{formattedDate(contribution.created_at)}</TableCell>
                        <TableCell>{getTypeLabel(contribution)}</TableCell>
                        <TableCell>
                          <Badge {...getStatusBadgeVariant(contribution.status)}>
                            {contribution.status}
                          </Badge>
                        </TableCell>
                        <TableCell className='flex gap-2'>
                          {contribution.contributable_type.includes('Osbl') && (
                            <Link href={`/mes-contributions/${contribution.id}`} title='Voir'>
                              <Button variant='ghost' size='icon' className='bg-white'>
                                <Eye />
                              </Button>
                            </Link>
                          )}
                          <Link href={`/mes-contributions/${contribution.id}/modifier`} title='Modifier'>
                            <Button variant='ghost' size='icon' className='bg-white'>
                              <Pencil />
                            </Button>
                          </Link>
                          {contribution.status === 'brouillon'
                            ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant='ghost' size='icon' className='bg-white' title='Supprimer'>
                                    <Trash />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Vous êtes sur le point de supprimer votre contribution.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => { handleDelete(contribution.id) }}>
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              )
                            : (
                              <a href={contribution.github_resource_url} target='_blank' rel='noopener noreferrer' title='Aller sur GitHub'>
                                <Button variant='ghost' size='icon' className='bg-white'>
                                  <Github />
                                </Button>
                              </a>
                              )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>

              )
            : (
              <div className='text-center text-gray-500'>Aucune contribution.</div>
              )}
        </ScrollArea>
        <div className='ml-2 text-sm text-gray-500'>{`${contributions.length} ${contributions.length > 1 ? 'résultats.' : 'résultat.'}`}</div>
      </div>
    </>
  )
}
