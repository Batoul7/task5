import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './Pages/Auth/Register.tsx'
import Login from './Pages/Auth/Login.tsx'
import Dashboard from './Pages/Dashboard/Dashboard.tsx'
import Items from './Pages/Dashboard/Items/Items.tsx'
import Logout from './Pages/Auth/Logout.tsx'
import ShowItem from './Pages/Dashboard/Items/ShowItem.tsx'
import AddItem from './Pages/Dashboard/Items/AddItem.tsx'
import EditItem from './Pages/Dashboard/Items/EditItem.tsx'


const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  },
  {
    path: "/logout",
    element: <Logout/>
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
    children: [
      {
        path: "items",
        element: <Items />
      },
      {
        path: "item/show/:id",
        element: <ShowItem />
      },
      {
        path: "add",
        element: <AddItem />
      },
      {
        path: "item/edit/:id",
        element: <EditItem />
      },
    ]
  },
]) 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routes}/>
  </StrictMode>,
)
