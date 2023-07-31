import { useEffect, useState } from 'react'
import { getPosts } from '@/services/posts';
import { Inter } from 'next/font/google';
import { useQuery } from 'react-query';
import { useLocalStorage } from '@/utils/useLocalStorage';

const inter = Inter({ subsets: ['latin'] });
const darkThemeClasses = 'bg-gray-900 text-white';
const whiteThemeClasses = 'bg-slate-100 text-black';

export default function Home() {
  const { data, isLoading, error } = useQuery('getPosts', getPosts, { retry: false });

  const [darkTheme, setIsDarkTheme] = useLocalStorage('theme', 'true');

  const [isDarkTheme, setIsDarkThemeState] = useState(false)

  useEffect(() => {
    const isDarkTheme = darkTheme === 'true'

    setIsDarkThemeState(isDarkTheme)

  }, [darkTheme])


  const handleSetTheme = () => {
    if (darkTheme === 'true') return setIsDarkTheme('false')
    setIsDarkTheme('true')
  }


  if (isLoading)
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-between md:p-24 pt-24 ${isDarkTheme ? darkThemeClasses : whiteThemeClasses
          } ${inter.className}`}
      >
        <div>Carregando posts</div>
      </main>
    );

  if (error)
    return (
      <main
        className={`flex min-h-screen flex-col items-center justify-between md:p-24 p-5 pt-24 ${isDarkTheme ? darkThemeClasses : whiteThemeClasses
          } ${inter.className}`}
      >

        <div>Falha ao buscar posts</div>
      </main>
    );

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between md:p-24 p-5 pt-24 ${isDarkTheme ? darkThemeClasses : whiteThemeClasses
        } ${inter.className}`}
    >
      <button
        className="p-2 rounded-md absolute top-5 right-5"
        onClick={handleSetTheme}
      >
        {isDarkTheme ? 'Claro' : 'Escuro'}
      </button>

      <div className='grid sm:grid-cols-2 grid-cols-1 gap-10'>
        {data?.map((post, i) => (
          <div key={i} className='border p-5 rounded-md hover:transition-all  '>
            <a href={`/${post.id}`}>
              <p>{post.title}</p>
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
