import { createContext, useContext } from "react"
import Model from "../model"

const model = new Model()

const ModelContext = createContext(model)

export default function ModelProvider({ children }) {
    return (
        <ModelContext.Provider value={model}>
            {children}
        </ModelContext.Provider>
    )
}

export const useModel = () => useContext(ModelContext)
