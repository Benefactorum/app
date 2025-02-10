import { Head } from '@inertiajs/react'
import { ReactElement } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
// Sample data structure
const historique = [
  {
    date: '05/12/2024',
    type: 'Ajouter une association',
    statut: 'non traitée'
  },
  {
    date: '05/12/2024',
    type: 'Amender une association',
    statut: 'validée'
  },
  {
    date: '05/12/2024',
    type: 'rapport de bogue',
    statut: 'ouvert'
  },
  {
    date: '05/12/2024',
    type: "correction d'erreur",
    statut: 'ouvert'
  },
  {
    date: '01/12/2024',
    type: 'suggestion',
    statut: 'fermée'
  }
]

export default function Index (): ReactElement {
  return (
    <>
      <Head title='Mes contributions' />
      <div className='2xl:container mx-auto flex flex-col px-2 sm:px-8 md:px-16 pt-8 pb-16 gap-8'>
        <h1 className='text-2xl font-semibold sm:text-3xl'>Mon historique</h1>
        <div className='bg-white rounded-md border p-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[150px] font-semibold'>
                  <div className='flex items-center gap-2'>
                    Date
                  </div>
                </TableHead>
                <TableHead className='font-semibold'>
                  <div className='flex items-center gap-2'>
                    Type de contribution
                  </div>
                </TableHead>
                <TableHead className='font-semibold'>
                  <div className='flex items-center gap-2'>
                    Statut
                  </div>
                </TableHead>
                <TableHead className='w-[100px] font-semibold' />
              </TableRow>
            </TableHeader>
            <TableBody>
              {historique.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-sm ${
                        item.statut === 'validée'
                          ? 'bg-green-100 text-green-800'
                          : item.statut === 'non traitée'
                          ? 'bg-gray-100 text-gray-800'
                          : item.statut === 'ouvert'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.statut}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant='ghost' className='hover:text-primary'>
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className='mt-2 text-sm text-gray-500'>1-5 sur 5 résultats</div>
      </div>
    </>
  )
}
