
import {
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from 'react-router-dom';

import { useEffect, type ReactNode } from 'react';
import { useStore } from './store';

import Layout from './components/Layout';
import { Empty, ButtonLink } from './components/ui';

import { Overview, Supplier, Admin } from './pages/Dashboards';

import {
  Products,
  ProductDetails,
  ProductForm,
} from './pages/Products';

import {
  EvidencePage,
  EvidenceDetails,
  UploadEvidence,
} from './pages/Evidence';

import {
  Passports,
  PassportPreview,
  QRStudio,
  CustomerPassport,
  Retailer,
} from './pages/Passports';

import {
  SupplyChain,
  Suppliers,
  UsersPage,
  Invitations,
  Audit,
  SettingsPage,
} from './pages/Management';

import {
  PublicLayout,
  Landing,
  Auth,
} from './pages/Public';

// ------------------------------------
// Role-Based Access Control
// ------------------------------------

function Gate({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: string[];
}) {
  const { authenticated, role } = useStore();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return (
      <>
        <Empty text="This workspace requires a different demo role" />

        <p className="center">
          Use the role selector in the top bar to explore this workspace.
        </p>
      </>
    );
  }

  return children;
}

// ------------------------------------
// Main Application
// ------------------------------------

export default function App() {
  const { pathname } = useLocation();

  // Handle broken images
  useEffect(() => {
    const onImageError = (e: Event) => {
      const target = e.target;

      if (
        target instanceof HTMLImageElement &&
        !target.src.endsWith('/textile-fallback.svg')
      ) {
        target.src = '/textile-fallback.svg';
      }
    };

    document.addEventListener('error', onImageError, true);

    return () => {
      document.removeEventListener('error', onImageError, true);
    };
  }, []);

  // Scroll to top and update page title
  useEffect(() => {
    window.scrollTo(0, 0);

    document.title = `ThreadTrace — ${
      pathname
        .split('/')
        .filter(Boolean)
        .at(-1)
        ?.replaceAll('-', ' ') || 'Traceable Textiles. Trusted Stories.'
    }`;
  }, [pathname]);

  return (
    <Routes>

      {/* =====================================
          PUBLIC ROUTES
      ===================================== */}

      <Route element={<PublicLayout />}>
        <Route index element={<Landing />} />

        <Route
          path="about"
          element={<Landing about />}
        />

        <Route
          path="how-it-works"
          element={<Landing how />}
        />

        <Route
          path="discover"
          element={
            <main className="public-section">
              <Products publicView />
            </main>
          }
        />

        <Route
          path="passport/:id"
          element={<CustomerPassport />}
        />

        <Route
          path="passport/:id/:section"
          element={<CustomerPassport />}
        />
      </Route>

      {/* =====================================
          AUTHENTICATION ROUTES
      ===================================== */}

      <Route
        path="login"
        element={<Auth />}
      />

      <Route
        path="register"
        element={<Auth register />}
      />

      <Route
        path="forgot-password"
        element={<Auth forgot />}
      />

      {/* =====================================
          PROTECTED APPLICATION ROUTES
      ===================================== */}

      <Route
        path="app"
        element={
          <Gate>
            <Layout />
          </Gate>
        }
      >

        {/* Dashboard */}

        <Route
          index
          element={<Navigate to="overview" replace />}
        />

        <Route
          path="overview"
          element={<Overview />}
        />

        <Route
          path="sustainability"
          element={<Overview sustainability />}
        />

        {/* Products */}

        <Route
          path="products"
          element={<Products />}
        />

        <Route
          path="products/new"
          element={
            <Gate roles={['Manufacturer', 'Administrator']}>
              <ProductForm />
            </Gate>
          }
        />

        <Route
          path="products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="products/:id/edit"
          element={
            <Gate roles={['Manufacturer', 'Administrator']}>
              <ProductForm />
            </Gate>
          }
        />

        <Route
          path="products/:id/lifecycle"
          element={<SupplyChain lifecycle />}
        />

        {/* Digital Product Passports */}

        <Route
          path="passports"
          element={<Passports />}
        />

        <Route
          path="passports/:id"
          element={<PassportPreview />}
        />

        <Route
          path="qr"
          element={<QRStudio />}
        />

        {/* Supply Chain */}

        <Route
          path="supply-chain"
          element={<SupplyChain />}
        />

        <Route
          path="suppliers"
          element={<Suppliers />}
        />

        <Route
          path="events"
          element={<SupplyChain events />}
        />

        {/* Evidence and Certifications */}

        <Route
          path="evidence"
          element={<EvidencePage />}
        />

        <Route
          path="certifications"
          element={<EvidencePage certifications />}
        />

        <Route
          path="reviews"
          element={<EvidencePage review />}
        />

        <Route
          path="evidence/:id"
          element={<EvidenceDetails />}
        />

        {/* Supplier Workspace */}

        <Route
          path="supplier"
          element={
            <Gate roles={['Supplier', 'Administrator']}>
              <Supplier />
            </Gate>
          }
        />

        <Route
          path="requests"
          element={<Supplier requests />}
        />

        <Route
          path="upload"
          element={<UploadEvidence />}
        />

        {/* Retailer Workspace */}

        <Route
          path="retailer"
          element={
            <Gate roles={['Retailer', 'Administrator']}>
              <Retailer />
            </Gate>
          }
        />

        <Route
          path="analytics"
          element={<Retailer analytics />}
        />

        <Route
          path="retailer-products"
          element={<Products retailer />}
        />

        {/* Administrator Workspace */}

        {[
          ['admin', <Admin />],
          ['users', <UsersPage />],
          ['invitations', <Invitations />],
          ['audit', <Audit />],
        ].map(([path, element]) => (
          <Route
            key={String(path)}
            path={String(path)}
            element={
              <Gate roles={['Administrator']}>
                {element}
              </Gate>
            }
          />
        ))}

        {/* Settings */}

        <Route
          path="settings"
          element={<SettingsPage />}
        />

        <Route
          path="integrations"
          element={<SettingsPage integrations />}
        />

        <Route
          path="profile"
          element={<SettingsPage profile />}
        />

      </Route>

      {/* =====================================
          404 - PAGE NOT FOUND
      ===================================== */}

      <Route
        path="*"
        element={
          <div className="public-message">
            <Empty text="This thread doesn’t lead anywhere" />

            <ButtonLink to="/">
              Return home
            </ButtonLink>
          </div>
        }
      />

    </Routes>
  );
}
