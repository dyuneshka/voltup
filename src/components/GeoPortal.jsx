import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addObject, setCoordinates, addConstructionPlan } from '../redux/slices/geoPortalSlice';
import '../styles/geo-portal.scss';

const GeoPortal = () => {
  const dispatch = useDispatch();
  const [object, setObject] = useState({ id: '', cadastralNumber: '', address: '' });
  const [construction, setConstruction] = useState({ objectId: '', connectionPoint: '', type: '' });

  const handleGetCoordinates = () => {
    let coords = [0, 0];
    if (object.cadastralNumber) {
      coords = [55.7558, 37.6173]; // Эмуляция Росреестра (Москва)
    } else if (object.address) {
      coords = [55.7522, 37.6156]; // Эмуляция 2GIS (Красная площадь)
    }
    dispatch(setCoordinates(coords));
    alert(`Координаты получены: ${coords}`);
  };

  const handleAddObject = () => {
    dispatch(addObject({ id: object.id, cadastralNumber: object.cadastralNumber, address: object.address }));
    handleGetCoordinates();
  };

  const handleAddConstruction = () => {
    dispatch(addConstructionPlan({ objectId: construction.objectId, connectionPoint: construction.connectionPoint, type: construction.type }));
    alert(`Планирование строительства ${construction.type} добавлено`);
  };

  return (
    <div className="geo-portal">
      <h2>ГЕО-портал</h2>
      <section>
        <h3>Определение географических координат</h3>
        <input name="id" value={object.id} onChange={(e) => setObject({ ...object, id: e.target.value })} placeholder="ID объекта" />
        <input name="cadastralNumber" value={object.cadastralNumber} onChange={(e) => setObject({ ...object, cadastralNumber: e.target.value })} placeholder="Кадастровый номер" />
        <input name="address" value={object.address} onChange={(e) => setObject({ ...object, address: e.target.value })} placeholder="Адрес" />
        <button onClick={handleAddObject}>Добавить объект и получить координаты</button>
        <button onClick={handleGetCoordinates}>Получить координаты повторно</button>
      </section>
      <section>
        <h3>Планирование строительства</h3>
        <input name="objectId" value={construction.objectId} onChange={(e) => setConstruction({ ...construction, objectId: e.target.value })} placeholder="ID объекта" />
        <input name="connectionPoint" value={construction.connectionPoint} onChange={(e) => setConstruction({ ...construction, connectionPoint: e.target.value })} placeholder="Точка присоединения" />
        <select name="type" value={construction.type} onChange={(e) => setConstruction({ ...construction, type: e.target.value })}>
          <option value="">Выберите тип</option>
          <option value="ВЛ">Воздушная линия (ВЛ)</option>
          <option value="КЛ">Кабельная линия (КЛ)</option>
          <option value="ПС">Подстанция (ПС)</option>
        </select>
        <button onClick={handleAddConstruction}>Добавить объект строительства</button>
        <div className="map-placeholder">Карта (эмуляция: выберите тип и точку)</div>
      </section>
    </div>
  );
};

export default GeoPortal;