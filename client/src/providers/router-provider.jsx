import { createContext, useContext, useMemo, useState } from "react"

const defaultValue = {
    path: "home",
    query: "",
    mode: "newest",
    qid: "",
    entry: "",
    _: 0
}
const RouterContext = createContext([
    defaultValue,
    (path, args=undefined, force=false) => {}
])

export default function RouterProvider({ children }) {
    const [route, setRoute] = useState(defaultValue)

    const navigate = useMemo(() => (newPath, args = undefined, force = false) => {
        const { _: __, ...newArgs } = args || {}
        setRoute(({ _, ...prev }) => ({
            ...prev,
            path: newPath,
            ...newArgs,
            _: force ? _ ^ 1 : _
        }))
    }, [])

    return (
        <RouterContext.Provider value={[route, navigate]}>
            {children}
        </RouterContext.Provider>
    )
}

export const useRouter = () => useContext(RouterContext)
