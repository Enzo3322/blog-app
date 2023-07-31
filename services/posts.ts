const API_URL = 'http://localhost:5000/posts'

interface Post {
    id: string,
    createdAt: string,
    updatedAt: string,
    title: string,
    content: string,
    labels: string[],
    related: string
}

interface PartialPost {
    id: string,
    createdAt: string,
    title: string,
}

export const getPosts = async (): Promise<PartialPost[]> => {
    const res = await fetch(`${API_URL}`)

    if (!res.ok) throw new Error()

    const json = await res.json()

    return json
}

export const getPostById = async ({ id }: { id: string }): Promise<Post> => {
    const res = await fetch(`${API_URL}/${id}`)

    if (!res.ok) throw new Error()

    const json = await res.json()

    return json
}

interface CreatePostProps {
    title: string
    content: string
    labels?: string[]
    related?: string[]
}

export const createPost = async (data: CreatePostProps): Promise<Post> => {
    const res = await fetch(`${API_URL}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!res.ok) throw new Error()

    const json = await res.json()

    return json
}

interface UpdatePostProps {
    id: string
    newPost: {
        title: string
        content: string
        labels?: string[]
        related?: string[]
    }
}

export const updatePost = async (data: UpdatePostProps): Promise<Post> => {
    const res = await fetch(`${API_URL}/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data.newPost),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!res.ok) throw new Error()

    const json = await res.json()

    return json
}

