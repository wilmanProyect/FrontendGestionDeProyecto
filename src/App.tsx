import { RouterProvider } from 'react-router-dom';
import { router } from '@/config/router';
import { ToastProvider } from '@/shared/components/Toast';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
