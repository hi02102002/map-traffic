import { createBrowserRouter } from 'react-router-dom';
import MapProvider from '~/context/map.context';
import { HomeView } from '~/views';

export const ROUTES = {
  HOME: '/',
};

const router = createBrowserRouter([
  {
    element: <MapProvider />,
    children: [{ path: ROUTES.HOME, element: <HomeView /> }],
  },
]);

export default router;
