import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPowerCenter, addTpApplication, addOtherApplication, addIntegrationLog } from '../redux/slices/integrationSlice';
import '../styles/integration.scss';

const Integration = () => {
  const dispatch = useDispatch();
  const [powerCenter, setPowerCenter] = useState({ id: '', type: '' });
  const [tpApplication, setTpApplication] = useState({ id: '', status: '' });
  const [otherApplication, setOtherApplication] = useState({ id: '', status: '' });

  const handleP1Submit = (type) => {
    dispatch(addPowerCenter({ id: powerCenter.id, type }));
    dispatch(addIntegrationLog({ message: `П1: ${type} центра питания ${powerCenter.id} отправлен`, status: 'OK' }));
    alert(`П1: ${type} центра питания ${powerCenter.id} обработан`);
  };

  const handleP2Submit = () => {
    dispatch(addTpApplication({ id: tpApplication.id, status: tpApplication.status }));
    dispatch(addIntegrationLog({ message: `П2: Заявка ${tpApplication.id} получена`, status: 'OK' }));
    alert(`П2: Заявка ${tpApplication.id} обработана`);
  };

  const handleP3Submit = () => {
    dispatch(addTpApplication({ id: tpApplication.id, status: tpApplication.status }));
    dispatch(addIntegrationLog({ message: `П3: Изменения в заявке ${tpApplication.id} отправлены`, status: 'OK' }));
    alert(`П3: Изменения в заявке ${tpApplication.id} обработаны`);
  };

  const handleP9Submit = () => {
    dispatch(addOtherApplication({ id: otherApplication.id, status: otherApplication.status }));
    dispatch(addIntegrationLog({ message: `П9: Прочая заявка ${otherApplication.id} получена`, status: 'OK' }));
    alert(`П9: Прочая заявка ${otherApplication.id} обработана`);
  };

  const handleP10Submit = () => {
    dispatch(addOtherApplication({ id: otherApplication.id, status: otherApplication.status }));
    dispatch(addIntegrationLog({ message: `П10: Прочая заявка ${otherApplication.id} отправлена`, status: 'OK' }));
    alert(`П10: Прочая заявка ${otherApplication.id} обработана`);
  };

  return (
    <div className="integration">
      <h2>Интеграция с Энербас</h2>
      <section>
        <h3>Поток П1: Центры питания</h3>
        <input name="id" value={powerCenter.id} onChange={(e) => setPowerCenter({ ...powerCenter, id: e.target.value })} placeholder="ID центра питания" />
        <select name="type" value={powerCenter.type} onChange={(e) => setPowerCenter({ ...powerCenter, type: e.target.value })}>
          <option value="">Выберите тип</option>
          <option value="CreateOrUpdate">CreateOrUpdate</option>
          <option value="Delete">Delete</option>
        </select>
        <button onClick={() => handleP1Submit(powerCenter.type)}>Отправить П1</button>
      </section>
      <section>
        <h3>Поток П2: Заявки на ТП</h3>
        <input name="id" value={tpApplication.id} onChange={(e) => setTpApplication({ ...tpApplication, id: e.target.value })} placeholder="ID заявки" />
        <input name="status" value={tpApplication.status} onChange={(e) => setTpApplication({ ...tpApplication, status: e.target.value })} placeholder="Статус" />
        <button onClick={handleP2Submit}>Получить П2</button>
      </section>
      <section>
        <h3>Поток П3: Заявки на ТП (изменения)</h3>
        <input name="id" value={tpApplication.id} onChange={(e) => setTpApplication({ ...tpApplication, id: e.target.value })} placeholder="ID заявки" />
        <input name="status" value={tpApplication.status} onChange={(e) => setTpApplication({ ...tpApplication, status: e.target.value })} placeholder="Статус" />
        <button onClick={handleP3Submit}>Отправить П3</button>
      </section>
      <section>
        <h3>Поток П9: Прочие заявки</h3>
        <input name="id" value={otherApplication.id} onChange={(e) => setOtherApplication({ ...otherApplication, id: e.target.value })} placeholder="ID заявки" />
        <input name="status" value={otherApplication.status} onChange={(e) => setOtherApplication({ ...otherApplication, status: e.target.value })} placeholder="Статус" />
        <button onClick={handleP9Submit}>Получить П9</button>
      </section>
      <section>
        <h3>Поток П10: Прочие заявки (выгрузка)</h3>
        <input name="id" value={otherApplication.id} onChange={(e) => setOtherApplication({ ...otherApplication, id: e.target.value })} placeholder="ID заявки" />
        <input name="status" value={otherApplication.status} onChange={(e) => setOtherApplication({ ...otherApplication, status: e.target.value })} placeholder="Статус" />
        <button onClick={handleP10Submit}>Отправить П10</button>
      </section>
    </div>
  );
};

export default Integration;