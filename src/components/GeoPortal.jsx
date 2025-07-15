import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addObject, setCoordinates, addConstructionPlan } from '../redux/slices/geoPortalSlice';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/geo-portal.scss';

const GeoPortal = () => {
  const dispatch = useDispatch();
  const { objects, coordinates } = useSelector(state => state.geoPortal);
  const [object, setObject] = useState({ id: '', cadastralNumber: '', address: '' });
  const [construction, setConstruction] = useState({ objectId: '', connectionPoint: '', type: '' });
  const [map, setMap] = useState(null);
  const [activeTab, setActiveTab] = useState('coordinates');

  useEffect(() => {
    if (!map) {
      const newMap = L.map('map').setView([55.7558, 37.6173], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(newMap);
      setMap(newMap);
    }
    if (map && objects.length > 0) {
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
      });
      objects.forEach(obj => {
        const coords = obj.cadastralNumber ? 
          ({
            '01:01:123456:789': [55.7558, 37.6173],
            '02:02:234567:890': [43.3171, 45.6980],
          }[obj.cadastralNumber] || [55.7522, 37.6156]) : 
          ({
            'ул. Энергетиков, 10, Москва': [55.7558, 37.6173],
            'пр. Мира, 5, Грозный': [43.3171, 45.6980],
          }[obj.address] || [55.7522, 37.6156]);
        L.marker(coords).addTo(map)
          .bindPopup(`<b>${obj.cadastralNumber || obj.address}</b><br>ID: ${obj.id}`);
      });
    }
  }, [map, objects]);

  const handleGetCoordinates = () => {
    let coords = [0, 0];
    if (object.cadastralNumber) {
      const emulatedCoords = {
        '01:01:123456:789': [55.7558, 37.6173],
        '02:02:234567:890': [43.3171, 45.6980],
      };
      coords = emulatedCoords[object.cadastralNumber] || [55.7522, 37.6156];
    } else if (object.address) {
      const emulatedAddresses = {
        'ул. Энергетиков, 10, Москва': [55.7558, 37.6173],
        'пр. Мира, 5, Грозный': [43.3171, 45.6980],
      };
      coords = emulatedAddresses[object.address] || [55.7522, 37.6156];
    }
    dispatch(setCoordinates(coords));
    alert(`Координаты получены: [${coords}]`);
  };

  const handleAddObject = () => {
    dispatch(addObject({ 
      id: object.id || `OBJ_${Date.now()}`, 
      cadastralNumber: object.cadastralNumber, 
      address: object.address 
    }));
    handleGetCoordinates();
  };

  const handleAddConstruction = () => {
    dispatch(addConstructionPlan({ 
      objectId: construction.objectId || (objects.length > 0 ? objects[objects.length - 1].id : `OBJ_${Date.now()}`),
      connectionPoint: construction.connectionPoint || 'Main Grid',
      type: construction.type || 'ВЛ'
    }));
    alert(`Планирование строительства ${construction.type || 'ВЛ'} добавлено`);
  };

  return (
    <div className="geo-portal">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="material-icons">map</span>
            ГЕО-портал
          </h1>
          <p className="page-subtitle">
            Определение географических координат и планирование строительства энергетических объектов
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="portal-container">
          {/* Боковая панель */}
          <div className="sidebar-panel">
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'coordinates' ? 'active' : ''}`}
                onClick={() => setActiveTab('coordinates')}
              >
                <span className="material-icons">location_on</span>
                Координаты
              </button>
              <button 
                className={`tab-btn ${activeTab === 'construction' ? 'active' : ''}`}
                onClick={() => setActiveTab('construction')}
              >
                <span className="material-icons">construction</span>
                Строительство
              </button>
              <button 
                className={`tab-btn ${activeTab === 'objects' ? 'active' : ''}`}
                onClick={() => setActiveTab('objects')}
              >
                <span className="material-icons">list</span>
                Объекты
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'coordinates' && (
                <div className="coordinates-tab">
                  <h3 className="tab-title">
                    <span className="material-icons">location_on</span>
                    Определение координат
                  </h3>
                  
                  <div className="form-group">
                    <label>ID объекта</label>
                    <input
                      type="text"
                      value={object.id}
                      onChange={(e) => setObject({ ...object, id: e.target.value })}
                      placeholder="Введите ID объекта"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Кадастровый номер</label>
                    <input
                      type="text"
                      value={object.cadastralNumber}
                      onChange={(e) => setObject({ ...object, cadastralNumber: e.target.value })}
                      placeholder="01:01:123456:789"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Адрес</label>
                    <input
                      type="text"
                      value={object.address}
                      onChange={(e) => setObject({ ...object, address: e.target.value })}
                      placeholder="ул. Энергетиков, 10, Москва"
                      className="form-input"
                    />
                  </div>

                  <div className="button-group">
                    <button onClick={handleAddObject} className="action-btn primary-btn">
                      <span className="material-icons">add_location</span>
                      Добавить объект
                    </button>
                    <button onClick={handleGetCoordinates} className="action-btn secondary-btn">
                      <span className="material-icons">my_location</span>
                      Получить координаты
                    </button>
                  </div>

                  {coordinates.length > 0 && (
                    <div className="coordinates-display">
                      <h4>Текущие координаты:</h4>
                      <div className="coords-box">
                        [{coordinates.join(', ')}]
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'construction' && (
                <div className="construction-tab">
                  <h3 className="tab-title">
                    <span className="material-icons">construction</span>
                    Планирование строительства
                  </h3>
                  
                  <div className="form-group">
                    <label>ID объекта</label>
                    <input
                      type="text"
                      value={construction.objectId}
                      onChange={(e) => setConstruction({ ...construction, objectId: e.target.value })}
                      placeholder="Введите ID объекта"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Точка присоединения</label>
                    <input
                      type="text"
                      value={construction.connectionPoint}
                      onChange={(e) => setConstruction({ ...construction, connectionPoint: e.target.value })}
                      placeholder="Введите точку присоединения"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Тип объекта</label>
                    <select
                      value={construction.type}
                      onChange={(e) => setConstruction({ ...construction, type: e.target.value })}
                      className="form-input"
                    >
                      <option value="">Выберите тип</option>
                      <option value="ВЛ">Воздушная линия (ВЛ)</option>
                      <option value="КЛ">Кабельная линия (КЛ)</option>
                      <option value="ПС">Подстанция (ПС)</option>
                    </select>
                  </div>

                  <button onClick={handleAddConstruction} className="action-btn primary-btn">
                    <span className="material-icons">add_circle</span>
                    Добавить объект строительства
                  </button>
                </div>
              )}

              {activeTab === 'objects' && (
                <div className="objects-tab">
                  <h3 className="tab-title">
                    <span className="material-icons">list</span>
                    Список объектов
                  </h3>
                  
                  <div className="objects-list">
                    {objects.length === 0 ? (
                      <p className="no-objects">Объекты не найдены</p>
                    ) : (
                      objects.map(obj => (
                        <div key={obj.id} className="object-item">
                          <div className="object-icon">
                            <span className="material-icons">location_on</span>
                          </div>
                          <div className="object-info">
                            <div className="object-name">
                              {obj.cadastralNumber || obj.address}
                            </div>
                            <div className="object-id">ID: {obj.id}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Карта */}
          <div className="map-container">
            <div className="map-header">
              <h3>Интерактивная карта</h3>
              <div className="map-controls">
                <button className="map-btn" onClick={() => map?.setView([55.7558, 37.6173], 6)}>
                  <span className="material-icons">my_location</span>
                  Центр
                </button>
                <button className="map-btn" onClick={() => map?.zoomIn()}>
                  <span className="material-icons">zoom_in</span>
                </button>
                <button className="map-btn" onClick={() => map?.zoomOut()}>
                  <span className="material-icons">zoom_out</span>
                </button>
              </div>
            </div>
            <div id="map" className="map"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoPortal;