import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './redux/store';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ApplicationForm from './components/ApplicationForm';
import Dashboard from './components/Dashboard';
import TechnicalConditions from './components/TechnicalConditions';
import TechnicalApproval from './components/TechnicalApproval';
import TuApprovalRes from './components/TuApprovalRes';
import TuApprovalIa from './components/TuApprovalIa';
import OtrPreparation from './components/OtrPreparation';
import SsoProcess from './components/SsoProcess';
import ContractProcess from './components/ContractProcess';
import PurProcess from './components/PurProcess'; // Новый компонент
import DiscrepancyProcess from './components/DiscrepancyProcess';
import ConstructionControl from './components/ConstructionControl';
import ContractFormation from './components/ContractFormation';
import TuExecutionCheck from './components/TuExecutionCheck';
import HighVoltageTuCheck from './components/HighVoltageTuCheck';
import OtherApplicantsTuCheck from './components/OtherApplicantsTuCheck';
import ContractAmendment from './components/ContractAmendment';
import TariffManagement from './components/TariffManagement';
import CapitalConstruction from './components/CapitalConstruction';
import PrintForms from './components/PrintForms';
import PowerCalculation from './components/PowerCalculation';
import GeoPortal from './components/GeoPortal';
import FeedbackForm from './components/FeedbackForm';
import EmployeePanel from './components/EmployeePanel';
import './styles/home.scss';
import './styles/auth.scss';
import './styles/dashboard.scss';
import './styles/application.scss';
import './styles/feedback.scss';
import './styles/technical.scss';
import './styles/technical-approval.scss';
import './styles/tu-approval-res.scss';
import './styles/tu-approval-ia.scss';
import './styles/otr-preparation.scss';
import './styles/contract.scss';
import './styles/contract-preparation.scss';
import './styles/estimate-preparation.scss';
import './styles/discrepancy-protocol.scss';
import './styles/construction-control.scss';
import './styles/contract-formation.scss';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review" element={<EmployeePanel />} />
          <Route path="/application" element={<ApplicationForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/technical/:appId" element={<TechnicalConditions />} />
          <Route path="/approval/:appId" element={<TechnicalApproval />} />
          <Route path="/tu-approval-res/:appId" element={<TuApprovalRes />} />
          <Route path="/tu-approval-ia/:appId" element={<TuApprovalIa />} />
          <Route path="/otr/:appId" element={<OtrPreparation />} />
          <Route path="/sso/:appId" element={<SsoProcess />} />
          <Route path="/contract/:appId" element={<ContractProcess />} />
          <Route path="/pur/:appId" element={<PurProcess />} /> {/* Новый маршрут */}
          <Route path="/discrepancy" element={<DiscrepancyProcess />} />
          <Route path="/construction/:appId" element={<ConstructionControl />} />
          <Route path="/contract-formation/:appId" element={<ContractFormation />} />
          <Route path="/tu-execution" element={<TuExecutionCheck />} />
          <Route path="/high-voltage-tu" element={<HighVoltageTuCheck />} />
          <Route path="/other-applicants-tu" element={<OtherApplicantsTuCheck />} />
          <Route path="/contract-amendment" element={<ContractAmendment />} />
          <Route path="/tariff-management" element={<TariffManagement />} />
          <Route path="/capital-construction" element={<CapitalConstruction />} />
          <Route path="/print-forms" element={<PrintForms />} />
          <Route path="/power-calculation" element={<PowerCalculation />} />
          <Route path="/geo-portal" element={<GeoPortal />} />
          <Route path="/feedback" element={<FeedbackForm />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;