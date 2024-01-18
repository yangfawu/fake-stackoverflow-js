import "./stylesheets/header.css"
import "./stylesheets/sidebar.css"
import "./stylesheets/form.css"
import "./stylesheets/question.css"
import "./stylesheets/tags.css"
import "./stylesheets/home.css"
import Header from "./components/header"
import Sidebar from "./components/sidebar"
import RouterProvider from "./providers/router-provider"
import Outlet from "./pages/outlet"
import ModelProvider from "./providers/model-provider"

export default function App() {
    return (
        <RouterProvider>
            <Header/>
            <div id="main">
                <Sidebar/>
                <ModelProvider>
                    <Outlet/>
                </ModelProvider>
            </div>
        </RouterProvider>
    )
}
