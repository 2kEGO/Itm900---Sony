import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './components/webpages/Login/Login'
import Register from './components/webpages/Register/Register'
import AdminPage from "./components/webpages/AdminPage/AdminPage"
import UserPage from "./components/webpages/UserPage/UserPage"
import ProtectedRoutes from "./utils/ProtectedRoutes"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/login' element={<Login/>}></Route>
          
          <Route element={<ProtectedRoutes allowedRoles={["admin", "manager"]}/>}>
            <Route path='/register' element={<Register/>}></Route>
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["admin", "manager", "user"]}/>}>
            <Route path='/user' element={<UserPage/>}></Route>
          </Route>
        
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
