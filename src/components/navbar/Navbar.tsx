'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import LogoutPage from '../logout/Logout'
import { parseCookies } from 'nookies'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    const cookies = parseCookies()
    const userRole = cookies.user_role
    setIsAdmin(userRole === 'admin')
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full ${
          scrolled ? 'bg-white/70 text-gray-800' : 'bg-transparent text-white'
        } backdrop-blur-md shadow-lg z-50 transition-all duration-300`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='relative flex items-center justify-between h-16'>
            {/* Logo */}
            <div className='flex-shrink-0'>
              <Link href='/home' className='text-2xl font-extrabold text-blue-500'>
                Egreso App
              </Link>
            </div>
            {/* Desktop Menu */}
            <div className='hidden sm:flex sm:items-center sm:space-x-8'>
              <Link
                href='/home'
                className='hover:text-blue-500 text-black px-3 py-2 rounded-md text-lg font-medium transition-colors duration-300'
              >
                Crear Egreso
              </Link>
              {isAdmin && (
                <Link
                  href='/home/ver_egreso'
                  className='hover:text-blue-500 text-black px-3 py-2 rounded-md text-lg font-medium transition-colors duration-300'
                >
                  Ver Egreso
                </Link>
              )}

              <LogoutPage />
            </div>
            {/* Mobile Menu Button */}
            <div className='absolute inset-y-0 right-0 flex items-center sm:hidden'>
              <button
                type='button'
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
                aria-controls='mobile-menu'
                aria-expanded={isOpen}
                onClick={toggleMenu}
              >
                <span className='sr-only'>Open main menu</span>
                {isOpen ? (
                  <svg
                    className='h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                ) : (
                  <svg
                    className='h-6 w-6'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16m-7 6h7' />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 left-0 z-[60] w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
        id='mobile-menu'
      >
        <div className='flex justify-end p-4'>
          <button
            type='button'
            className='text-gray-500 hover:text-blue-500'
            aria-controls='mobile-menu'
            aria-expanded={isOpen}
            onClick={toggleMenu}
          >
            <svg
              className='h-6 w-6'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
        <div className='flex flex-col items-center space-y-4 px-2 pt-2 pb-3'>
          <Link
            href='/home'
            className='text-black-600 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 w-full text-center'
            onClick={closeMenu}
          >
            Crear Egreso
          </Link>
          {isAdmin && (
            <Link
              href='/home/ver_egreso'
              className='hover:text-blue-500 text-black px-3 py-2 rounded-md text-lg font-medium transition-colors duration-300'
              onClick={closeMenu}
            >
              Ver Egreso
            </Link>
          )}
          <div onClick={closeMenu}>
            <LogoutPage />
          </div>
        </div>
      </div>
      {/* Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300'
          onClick={toggleMenu}
        ></div>
      )}
    </>
  )
}
