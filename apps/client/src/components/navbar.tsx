'use client'
import { 
  Menu, 
  Mail, 
  MapPin, 
  UserRound,
  Search,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Determine initial theme: saved preference -> system preference -> light
    try {
      const saved = localStorage.getItem('theme')
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial = saved ? (saved === 'dark' ? 'dark' : 'light') : (prefersDark ? 'dark' : 'light')
      setTheme(initial)
      applyTheme(initial)
    } catch (e) {
      // If access to localStorage or matchMedia is blocked, fall back to light
      setTheme('light')
      applyTheme('light')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function applyTheme(t: 'light' | 'dark') {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (t === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try {
      localStorage.setItem('theme', t)
    } catch (e) {
      // ignore write errors
    }
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
  }
  return (
    <header className="relative">
      {/** Info bar */}
      <div className="bg-zinc-800 py-2">
        <div className="container mx-auto flex flex-wrap items-center justify-center md:justify-between gap-y-2 gap-x-8 px-8 py-2">
          <ul className="flex gap-4">
            <li>
              <a href="mailto:info@homeverse.com" className="text-sm font-serif font-semibold text-white hover:text-accent flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <span>info@homeverse.com</span>
              </a>
            </li>
            <li>
              <a href="#" className="text-sm font-serif font-semibold text-white hover:text-accent flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <address className="not-italic">15/A, Nest Tower, NYC</address>
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-4">
            <ul className="flex gap-2">
              {/**Facebook */}
              <li>
                <a href="#" className="text-white">
                  <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480,257.35c0-123.7-100.3-224-224-224s-224,100.3-224,224c0,111.8,81.9,204.47,189,221.29V322.12H164.11V257.35H221V208c0-56.13,33.45-87.16,84.61-87.16,24.51,0,50.15,4.38,50.15,4.38v55.13H327.5c-27.81,0-36.51,17.26-36.51,35v42h62.12l-9.92,64.77H291V478.66C398.1,461.85,480,369.18,480,257.35Z" /></svg>                
                </a>
              </li>
              {/**X (Twitter) */}
              <li>
                <a href="#" className="text-white">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.33349 6.92867L14.5459 1H13.3109L8.78291 6.14671L5.16908 1H1L6.46604 8.78342L1 15H2.235L7.01369 9.56363L10.8309 15H15L9.33349 6.92867ZM7.64142 8.85175L7.08675 8.07621L2.68037 1.91103H4.57759L8.13472 6.88838L8.68705 7.66391L13.3103 14.1334H11.4131L7.64142 8.85175Z" />
                  </svg>
                </a>
              </li>
              {/**Instagram */}
              <li>
                <a href="#" className="text-white">
                  <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M349.33,69.33a93.62,93.62,0,0,1,93.34,93.34V349.33a93.62,93.62,0,0,1-93.34,93.34H162.67a93.62,93.62,0,0,1-93.34-93.34V162.67a93.62,93.62,0,0,1,93.34-93.34H349.33m0-37.33H162.67C90.8,32,32,90.8,32,162.67V349.33C32,421.2,90.8,480,162.67,480H349.33C421.2,480,480,421.2,480,349.33V162.67C480,90.8,421.2,32,349.33,32Z"/><path d="M377.33,162.67a28,28,0,1,1,28-28A27.94,27.94,0,0,1,377.33,162.67Z"/><path d="M256,181.33A74.67,74.67,0,1,1,181.33,256,74.75,74.75,0,0,1,256,181.33M256,144A112,112,0,1,0,368,256,112,112,0,0,0,256,144Z"/></svg>
                </a>
              </li>
              <li>
                <a href="#" className="text-white">
                  <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256.05,32c-123.7,0-224,100.3-224,224,0,91.7,55.2,170.5,134.1,205.2-.6-15.6-.1-34.4,3.9-51.4,4.3-18.2,28.8-122.1,28.8-122.1s-7.2-14.3-7.2-35.4c0-33.2,19.2-58,43.2-58,20.4,0,30.2,15.3,30.2,33.6,0,20.5-13.1,51.1-19.8,79.5-5.6,23.8,11.9,43.1,35.4,43.1,42.4,0,71-54.5,71-119.1,0-49.1-33.1-85.8-93.2-85.8-67.9,0-110.3,50.7-110.3,107.3,0,19.5,5.8,33.3,14.8,43.9,4.1,4.9,4.7,6.9,3.2,12.5-1.1,4.1-3.5,14-4.6,18-1.5,5.7-6.1,7.7-11.2,5.6-31.3-12.8-45.9-47-45.9-85.6,0-63.6,53.7-139.9,160.1-139.9,85.5,0,141.8,61.9,141.8,128.3,0,87.9-48.9,153.5-120.9,153.5-24.2,0-46.9-13.1-54.7-27.9,0,0-13,51.6-15.8,61.6-4.7,17.3-14,34.5-22.5,48a225.13,225.13,0,0,0,63.5,9.2c123.7,0,224-100.3,224-224S379.75,32,256.05,32Z"/></svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/** Header proper */}
      <div className="z-[10] sticky top-0 py-6 bg-surface">
        <div className="container mx-auto flex items-center justify-between px-4">
          <a href="#" className="block">
            <img src="/images/brand.svg" alt="Logo" className="h-8 md:h-10" />
          </a>

          <div onClick={()=>setOpen(false)} className={`${open? 'flex md:hidden' : 'hidden'} z-[25] fixed top-0 left-0 w-full h-full bg-foreground/50`} />
          
          <nav className={`${open? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-surface flex flex-col px-4 md:p-0 md:flex-row z-[30] fixed left-0 bottom-0 h-full w-2xs md:w-auto md:static gap-8 md:gap-6 duration-300 ease-linear`}>
            <div className="flex gap-2 items-center justify-between w-full py-10 md:hidden border-b border-border">
              <img src="/images/brand.svg" alt="Logo" className="max-w-[150px]" />
              <button onClick={()=>setOpen(false)} className="hover:text-accent">
                <X className="text-xl" />
              </button>
            </div>

            <a href="#about" className="uppercase md:normal-case text-foreground/80 md:text-foreground hover:text-accent">About</a>
            <a href="#properties" className="uppercase md:normal-case text-foreground/80 md:text-foreground hover:text-accent">Properties</a>
            <a href="#blog" className="uppercase md:normal-case text-foreground/80 md:text-foreground hover:text-accent">Blog</a>
            <a href="#contact" className="uppercase md:normal-case text-foreground/80 md:text-foreground hover:text-accent">Contact</a>
          </nav>

          <div className="bg-surface flex z-[20] fixed left-0 bottom-0 w-full justify-around py-4 md:py-0 md:justify-start md:static md:w-auto gap-4 shadow-md md:shadow-none">
            <button className="hover:text-accent">
              <Search className="text-xl" />
            </button>
            <button className="hover:text-accent">
              <UserRound className="text-xl" />
            </button>
            <button
              aria-label="Toggle theme"
            >
              <img src="/images/ani.gif" alt="Logo" className="h-8" />
            </button>
            <button onClick={()=>setOpen(true)} className="hover:text-accent md:hidden">
              <Menu name="menu-outline" className="text-xl" />
            </button>
            <button
              aria-label="Toggle theme"
              title="Toggle theme"
              onClick={toggleTheme}
              className="hidden md:inline-block hover:text-accent"
            >
              {theme === 'dark' ? (
                <Sun className="text-xl" />
              ) : (
                <Moon className="text-xl" />
              )}
            </button>
          </div>

          <div className="md:hidden mr-2">
            <button
              aria-label="Toggle theme"
              title="Toggle theme"
              onClick={toggleTheme}
              className="hover:text-accent"
            >
              {theme === 'dark' ? (
                <Sun className="w-5" />
              ) : (
                <Moon className="w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
