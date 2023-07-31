import { useEffect, useState } from "react";
import { PartialPost, deletePost, getPosts } from "@/services/posts";
import { Inter } from "next/font/google";
import { useMutation, useQuery } from "react-query";
import { useLocalStorage } from "@/utils/useLocalStorage";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });
const darkThemeClasses = "bg-gray-900 text-white";
const whiteThemeClasses = "bg-white text-black";

export default function Delete() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery("getPosts", getPosts, {
    retry: false,
  });
  const { mutate: deleteMutation } = useMutation("deletePosts", deletePost, {
    retry: false,
    onSuccess: (data) => {
      toast.success(`Post: ${data.id} deletado com sucesso`, {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });
    },
    onError: () => {
      toast.error(`Não foi possivel deletar o post`, {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "colored",
      });
    },
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

  const handleDelete = (post: PartialPost) => {
    deleteMutation(post.id);
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

        <button
          className="p-2 rounded-md absolute top-5 left-5"
          onClick={() => router.push("/posts")}
        >
          Menu
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
        <h1 className={`text-3xl ${inter.className} mb-10`}>
          Falha ao buscar posts
        </h1>
      </Template>
    );
  }

  if (!data?.length) {
    return (
      <Template>
        <h1 className={`text-3xl ${inter.className} mb-10`}>
          Nenhum post encontrado
        </h1>
      </Template>
    );
  }

  return (
    <Template>
      <h1 className={`text-3xl ${inter.className} mb-10`}>
        Selecione o post que deseja excluir
      </h1>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-10">
        {data?.map((post, i) => (
          <button key={i} onClick={() => handleDelete(post)}>
            <div
              className={`border p-5 rounded-md hover:transition-all flex flex-col justify-start ${
                isDarkTheme ? "bg-slate-700" : "bg-slate-200"
              }`}
            >
              <p className="text-left mb-3 text-2xl">{post.title}</p>
              <p className="text-left mb-3">{post.createdAt}</p>
              <p className="text-left mb-3">{post.id}</p>
            </div>
          </button>
        ))}
      </div>
    </Template>
  );
}
