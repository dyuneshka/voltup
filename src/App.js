import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './redux/store';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ApplicationForm from './components/ApplicationForm';
import Dashboard from './components/Dashboard';
import ApplicationReview from './components/ApplicationReview';
import TechnicalConditions from './components/TechnicalConditions';
import TechnicalApproval from './components/TechnicalApproval';
import SsoProcess from './components/SsoProcess';
import ContractProcess from './components/ContractProcess';
import DiscrepancyProcess from './components/DiscrepancyProcess';
import ConstructionControl from './components/ConstructionControl';
import TuExecutionCheck from './components/TuExecutionCheck';
import HighVoltageTuCheck from './components/HighVoltageTuCheck';
import OtherApplicantsTuCheck from './components/OtherApplicantsTuCheck';
import HighPowerTuCheck from './components/HighPowerTuCheck';
import MegaPowerTuCheck from './components/MegaPowerTuCheck';
import ContractAmendment from './components/ContractAmendment';
import TariffManagement from './components/TariffManagement';
import CapitalConstruction from './components/CapitalConstruction';
import PrintForms from './components/PrintForms';
import PowerCalculation from './components/PowerCalculation';
import Integration from './components/Integration';
import GeoPortal from './components/GeoPortal';
import ChatBot from './components/ChatBot';
import Payment from './components/Payment';
import FeedbackForm from './components/FeedbackForm';
import EmployeePanel from './components/EmployeePanel'
import './styles/home.scss';
import './styles/auth.scss';
import './styles/dashboard.scss';
import './styles/application.scss';
import './styles/chat-bot.scss';
import './styles/payment.scss';
import './styles/feedback.scss';
import './styles/technical.scss';
import './styles/contract.scss';

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
          <Route path="/review" element={<ApplicationReview />} />
          <Route path="/technical" element={<TechnicalConditions />} />
          <Route path="/approval" element={<TechnicalApproval />} />
          <Route path="/sso" element={<SsoProcess />} />
          <Route path="/contract" element={<ContractProcess />} />
          <Route path="/discrepancy" element={<DiscrepancyProcess />} />
          <Route path="/construction" element={<ConstructionControl />} />
          <Route path="/tu-execution" element={<TuExecutionCheck />} />
          <Route path="/high-voltage-tu" element={<HighVoltageTuCheck />} />
          <Route path="/other-applicants-tu" element={<OtherApplicantsTuCheck />} />
          <Route path="/high-power-tu" element={<HighPowerTuCheck />} />
          <Route path="/mega-power-tu" element={<MegaPowerTuCheck />} />
          <Route path="/contract-amendment" element={<ContractAmendment />} />
          <Route path="/tariff-management" element={<TariffManagement />} />
          <Route path="/capital-construction" element={<CapitalConstruction />} />
          <Route path="/print-forms" element={<PrintForms />} />
          <Route path="/power-calculation" element={<PowerCalculation />} />
          <Route path="/integration" element={<Integration />} />
          <Route path="/geo-portal" element={<GeoPortal />} />
          <Route path="/chat-bot" element={<ChatBot />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/feedback" element={<FeedbackForm />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;