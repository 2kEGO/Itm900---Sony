import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './components/webpages/Login/Login'
import Register from './components/webpages/Register/Register'
import AdminPage from "./components/webpages/AdminPage/AdminPage"
import ChannelPage from "./components/webpages/UserPage/channelPage"
import ProtectedRoutes from "./utils/ProtectedRoutes"
import Channel1 from './components/webpages/UserPage/channel1'
import Channel2 from './components/webpages/UserPage/channel2'
import SelectProject from '../src/components/webpages/UserPage/selectProject.jsx'
import UserManagementDashboard from "../src/components/webpages/AdminPage/UserList.jsx"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Login/>}></Route>         

          <Route element={<ProtectedRoutes/>}>
            <Route path='/home' element={<ChannelPage/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/home/artist' element={<SelectProject/>}></Route>
            <Route path='/home/admin' element={<AdminPage/>}></Route>
            <Route path='/home/admin/userlist' element={<UserManagementDashboard/>}></Route>
            <Route path='/home/artist/channel1' element={<Channel1/>}></Route>
            
          </Route>
        
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App


