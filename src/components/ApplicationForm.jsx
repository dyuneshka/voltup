import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitApplication } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/application.scss';

const ApplicationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    counterpartyName: '',
    inn: '',
    kpp: '',
    egrul: '',
    registryDate: '',
    legalAddress: '',
    actualAddress: '',
    postalAddress: '',
    phone: '',
    reason: '',
    object: '',
    objectAddress: '',
    okved: '',
    power: '',
    voltage: '',
    supplyCompany: '',
    reliabilityCategory: '',
    isLegal: true, // По умолчанию юридическое лицо
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleTypeChange = (e) => setFormData({ ...formData, isLegal: e.target.value === 'legal', inn: '', kpp: '', egrul: '', registryDate: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user && user.role === 'applicant') {
      const newApplication = {
        ...formData,
        id: Date.now(),
        status: 'Подана',
        userId: user.id,
        submittedAt: new Date().toISOString(),
      };
      dispatch(submitApplication(newApplication));
      alert('Заявка подана!');
      navigate('/dashboard');
    }
  };

  if (!user || user.role !== 'applicant') {
    navigate('/');
    return null;
  }

  return (
    <div className="application-form">
      <h2>Подать заявку на ТП</h2>
      <div className="form-type-toggle">
        <label>
          <input
            type="radio"
            name="type"
            value="legal"
            checked={formData.isLegal}
            onChange={handleTypeChange}
          /> Юридическое лицо
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="individual"
            checked={!formData.isLegal}
            onChange={handleTypeChange}
          /> Физическое лицо
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {formData.isLegal && (
            <>
              <input
                type="text"
                name="counterpartyName"
                value={formData.counterpartyName}
                onChange={handleChange}
                placeholder="Наименование контрагента"
                className="form-input"
                required
              />
              <input
                type="text"
                name="inn"
                value={formData.inn}
                onChange={handleChange}
                placeholder="ИНН"
                className="form-input"
                required
              />
              <input
                type="text"
                name="kpp"
                value={formData.kpp}
                onChange={handleChange}
                placeholder="КПП"
                className="form-input"
                required
              />
              <input
                type="text"
                name="egrul"
                value={formData.egrul}
                onChange={handleChange}
                placeholder="ЕГРЮЛ"
                className="form-input"
                required
              />
              <input
                type="date"
                name="registryDate"
                value={formData.registryDate}
                onChange={handleChange}
                placeholder="Дата внесения в реестр"
                className="form-input"
                required
              />
            </>
          )}
          <input
            type="text"
            name="legalAddress"
            value={formData.legalAddress}
            onChange={handleChange}
            placeholder="Юридический адрес"
            className="form-input"
            required
          />
          <input
            type="text"
            name="actualAddress"
            value={formData.actualAddress}
            onChange={handleChange}
            placeholder="Фактический адрес"
            className="form-input"
            required
          />
          <input
            type="text"
            name="postalAddress"
            value={formData.postalAddress}
            onChange={handleChange}
            placeholder="Почтовый адрес"
            className="form-input"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Телефон"
            className="form-input"
            required
          />
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Причина обращения"
            className="form-input"
            required
          />
          <input
            type="text"
            name="object"
            value={formData.object}
            onChange={handleChange}
            placeholder="Объект"
            className="form-input"
            required
          />
          <input
            type="text"
            name="objectAddress"
            value={formData.objectAddress}
            onChange={handleChange}
            placeholder="Адрес объекта ТП"
            className="form-input"
            required
          />
          {formData.isLegal && (
            <input
              type="text"
              name="okved"
              value={formData.okved}
              onChange={handleChange}
              placeholder="ОКВЭД"
              className="form-input"
              required
            />
          )}
          <input
            type="text"
            name="power"
            value={formData.power}
            onChange={handleChange}
            placeholder="Присоединяемая мощность"
            className="form-input"
            required
          />
          <input
            type="text"
            name="voltage"
            value={formData.voltage}
            onChange={handleChange}
            placeholder="Присоединяемое напряжение"
            className="form-input"
            required
          />
          <input
            type="text"
            name="supplyCompany"
            value={formData.supplyCompany}
            onChange={handleChange}
            placeholder="Сбытовая компания"
            className="form-input"
            required
          />
          <input
            type="text"
            name="reliabilityCategory"
            value={formData.reliabilityCategory}
            onChange={handleChange}
            placeholder="Категория надежности"
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="form-submit">Отправить заявку</button>
      </form>
    </div>
  );
};

export default ApplicationForm;