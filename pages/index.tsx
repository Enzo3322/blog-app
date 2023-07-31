import { useEffect, useState } from "react";
import { getPosts } from "@/services/posts";
import { Inter } from "next/font/google";
import { useQuery } from "react-query";
import { useLocalStorage } from "@/utils/useLocalStorage";
import Spinner from "@/components/Spinner";

const inter = Inter({ subsets: ["latin"] });
const darkThemeClasses = "bg-gray-900 text-white";
const whiteThemeClasses = "bg-white text-black";

export default function Home() {
  const { data, isLoading, error } = useQuery("getPosts", getPosts, {
    retry: false,
  });

  const [darkTheme, setIsDarkTheme] = useLocalStorage("theme", "true");

  const [isDarkTheme, setIsDarkThemeState] = useState(false);

  useEffect(() => {
    const isDarkTheme = darkTheme === "true";

    setIsDarkThemeState(isDarkTheme);
  }, [darkTheme]);

  const handleSetTheme = () => {
    if (darkTheme === "true") return setIsDarkTheme("false");
    setIsDarkTheme("true");
  };

  const Template = ({ children }: any) => {
    return (
      <main
        className={`bg- flex min-h-screen flex-col items-center  md:p-24 p-5 pt-24 ${
          isDarkTheme ? darkThemeClasses : whiteThemeClasses
        } ${inter.className}`}
      >
        <button
          className="p-2 rounded-md absolute top-5 right-5"
          onClick={handleSetTheme}
        >
          {isDarkTheme ? "Claro" : "Escuro"}
        </button>

        {children}
      </main>
    );
  };

  if (isLoading) {
    return (
      <Template>
        <Spinner />
      </Template>
    );
  }

  if (error) {
    return (
      <Template>
        <div>
          <p className={`${inter.className}`}>Falha ao buscar posts</p>
        </div>
      </Template>
    );
  }

  if (!data?.length) {
    return (
      <Template>
        <h1 className={`text-3xl ${inter.className}`}>
          Ops... Parece que não temos nenhum post.
        </h1>
        <a href="/posts/create" className="underline">
          Que tal criar um post agora
        </a>
      </Template>
    );
  }

  return (
    <Template>
      <div className="flex flex-col gap-5 mb-10">
        <h1 className="text-3xl text-center">Bem-vindo ao Tech-Blog</h1>
        <p className="text-lg text-center">
          Conteúdo relacionado á todos os aspectos do desenvolvimento
        </p>
      </div>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-10">
        {data?.map((post, i) => (
          <a href={`/${post.id}`} key={i} className="">
            <div
              className={`border p-5 rounded-md hover:transition-all w-[100%] hover:border-gray-400 ${
                isDarkTheme ? "bg-slate-700" : "bg-slate-100"
              }`}
            >
              <p className="text-lg">{post.title}</p>
              <span className="text-sm">
                {new Date(post.createdAt).toLocaleString("pt-BR", {
                  dateStyle: "short",
                })}
              </span>
            </div>
          </a>
        ))}
      </div>
    </Template>
  );
}
