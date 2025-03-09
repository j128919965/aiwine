import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WelcomePage from '../pages/WelcomePage';
import InputPage from '../pages/InputPage';
import LoadingPage from '../pages/LoadingPage';
import ResultPage from '../pages/ResultPage';
import InitPage from '../pages/InitPage';
import WaitingPage from '../pages/WaitingPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <InitPage />
    },
    {
        path: '/waiting',
        element: <WaitingPage />
    },
    {
        path: '/welcome',
        element: <WelcomePage />,
    },
    {
        path: '/input',
        element: <InputPage />,
    },
    {
        path: '/loading',
        element: <LoadingPage />,
    },
    {
        path: '/result',
        element: <ResultPage />,
    },
]);

export const Router: React.FC = () => {
    return <RouterProvider router={router} />;
};