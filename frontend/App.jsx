import 'react-toastify/dist/ReactToastify.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async';
import "./index.css"
import AppLayout from './components/AppLayout';
import Loader from './components/Loader';
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import CategoryProducts from './pages/CategoryProducts';
import ContactUs from './pages/ContactUs';
import OffersPage from './pages/OffersPage';
import OrderDetails from './pages/OrderDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserAuth from './pages/UserAuth';
import AdminLayout from './pages/AdminPanel/layout/AdminLayout';
import HomeTab from './pages/AdminPanel/tabs/HomeTab';
import CategoriesTab from './pages/AdminPanel/tabs/CategoriesTab';
import ProductsTab from './pages/AdminPanel/tabs/ProductsTab';
import OffersTab from './pages/AdminPanel/tabs/OffersTab';
import OrdersTab from './pages/AdminPanel/tabs/OrdersTab';
import ContactTab from './pages/AdminPanel/tabs/ContactTab';
import AdminLogin from './pages/AdminPanel/tabs/AdminLogin';
import SearchedProducts from './pages/SearchedProducts';
import CouponsTab from './pages/AdminPanel/tabs/CouponsTab';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentPage from './pages/PaymentPage';
import { ToastContainer } from 'react-toastify';
import CurrencyTab from './pages/AdminPanel/tabs/CurrencyTab';
import SocialMediaPage from './pages/SocialMediaPage';
import AboutUs from './pages/AboutUs';
import NoRoute from './pages/NoRoute';
import EMIDashboardPage from './pages/EMIDashboardPage';


// const router=createBrowserRouter([
//   {
//     element:<AppLayout></AppLayout>,
//     errorElement:<ErrorPage></ErrorPage>,
//     children:[
//       {
//         path:"/",
//         element:<HomePage></HomePage>,
//       },
//       {
//         path:"/menu",
//         element:<Menu></Menu>,
//         errorElement:<ErrorPage></ErrorPage>,
//         loader:menuLoader,
//       },
//       { 
//         path:"/cart",
//         element:<Cart></Cart>
//       },
//       {
//         path:"/new-order",
//         element:<OrderForm></OrderForm>,
//         action:formAction
//       },
//       {
//         path:"/order/:orderId",
//         element:<OrderDetails></OrderDetails>,
//         loader:orderLoader
//       },
//       {
//         path:"/orders",
//         element:<OrderList></OrderList>
//       }
//     ]
//   }
// ])
// function App(){
//   return <RouterProvider router={router}>

//   </RouterProvider>
// }
const router = createBrowserRouter([
  {
    element:<AppLayout></AppLayout>,
    errorElement:<ErrorPage></ErrorPage>,
    children:[
      {
        path:"/",
        element:<HomePage></HomePage>
      },
      {
        path:"/about-us",
        element:<AboutUs></AboutUs>
      },
      {
        path:"/route-not-found",
        element:<NoRoute></NoRoute>
      },
      {
        path:"/userAuth",
        element:<UserAuth></UserAuth>
      },
      {
        path:"/login",
        element:<Login></Login>
      },
      {
        path:"/signup",
        element:<Signup></Signup>
      },
      {
        path:"/product/:id",
        element:<ProductDetails></ProductDetails>,
      },
      {
        path:"/products",
        element:<SearchedProducts></SearchedProducts>,
      },
      {
        path:"/loader",
        element:<Loader></Loader>
      },
      {
        path:"/categories",
        element:<Categories></Categories>
      },
      {
        path:"/offers",
        element:<OffersPage></OffersPage>
      },
      {
        path:"/contact",
        element:<ContactUs></ContactUs>
      },
      {
        path:"/categories/:category",
        element:<CategoryProducts></CategoryProducts>
      },
      {
        path:"/profile",
        element:<Profile ></Profile>
      },
      {
        path:"/order/:orderId",
        element:<OrderDetails></OrderDetails>
      },
      {
        path:"/payment-success",
        element:<PaymentSuccess></PaymentSuccess>
      },
      {
        path:"/payment",
        element:<PaymentPage></PaymentPage>
      },
      {
        path:"/emi-dashboard",
        element:<EMIDashboardPage></EMIDashboardPage>
      },
      {
        path:"/social-media-redirected",
        element:<SocialMediaPage></SocialMediaPage>
      },
      //admin panel comes from here 
      {
        path:"/admin",
        element:<AdminLayout></AdminLayout>,
        children:[
          { index: true, element:<HomeTab></HomeTab>},
          { path: "login", element: <AdminLogin></AdminLogin>},
          { path: "categories", element: <CategoriesTab></CategoriesTab>},
          { path: "products", element: <ProductsTab></ProductsTab>},
          { path: "offers", element: <OffersTab></OffersTab>},
          { path: "coupons", element: <CouponsTab></CouponsTab>},
          { path: "orders", element: <OrdersTab></OrdersTab>},
          { path: "contact", element: <ContactTab></ContactTab>},
          { path: "currency", element: <CurrencyTab></CurrencyTab>}
        ]
      },
      
    ]
  }
]
)
function App() {
  return (
    <HelmetProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    <RouterProvider router={router}>

    </RouterProvider>
    </HelmetProvider>
  )
}

export default App

