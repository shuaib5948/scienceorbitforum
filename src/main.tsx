import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/components-ui.css';
import './styles/layout.css';
import './styles/pages.css';
import './styles/site.css';

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);