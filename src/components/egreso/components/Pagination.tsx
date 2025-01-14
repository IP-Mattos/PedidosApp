interface PaginationProps {
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  return (
    <div className='mt-8 flex justify-between items-center'>
      <button
        className='bg-blue-500 text-white px-4 py-2 rounded-md transition-transform duration-300 hover:bg-blue-600'
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1 || totalPages === 0}
      >
        Anterior
      </button>
      <span className='text-sm sm:text-base text-gray-600'>
        {totalPages > 0 ? `Página ${currentPage} de ${totalPages}` : 'No hay resultados'}
      </span>
      <button
        className='bg-blue-500 text-white px-4 py-2 rounded-md transition-transform duration-300 hover:bg-blue-600'
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        Siguiente
      </button>
    </div>
  )
}
