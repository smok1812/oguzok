import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Package, BookOpen, Users, Clock, LogOut, Trash2 } from 'lucide-react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EventRegistration {
  id: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  participants: number;
  registeredAt: any;
}

interface EquipmentRental {
  id: string;
  equipmentName: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalPrice: string;
  status: string;
  requestedAt: any;
}

interface TrainingApplication {
  id: string;
  courseName: string;
  coursePrice: string;
  courseDuration: string;
  preferredDate: string;
  participants: number;
  status: string;
  appliedAt: any;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [equipmentRentals, setEquipmentRentals] = useState<EquipmentRental[]>([]);
  const [trainingApplications, setTrainingApplications] = useState<TrainingApplication[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !isOpen) return;

    // Загрузка регистраций на мероприятия
    const eventsQuery = query(
      collection(db, 'eventRegistrations'),
      where('userId', '==', user.uid)
    );
    
    const unsubscribeEvents = onSnapshot(eventsQuery, (querySnapshot) => {
      const registrations: EventRegistration[] = [];
      querySnapshot.forEach((doc) => {
        registrations.push({ id: doc.id, ...doc.data() } as EventRegistration);
      });
      setEventRegistrations(registrations);
    });

    // Загрузка аренды снаряжения
    const equipmentQuery = query(
      collection(db, 'equipmentRentals'),
      where('clientId', '==', user.uid)
    );
    
    const unsubscribeEquipment = onSnapshot(equipmentQuery, (querySnapshot) => {
      const rentals: EquipmentRental[] = [];
      querySnapshot.forEach((doc) => {
        rentals.push({ id: doc.id, ...doc.data() } as EquipmentRental);
      });
      setEquipmentRentals(rentals);
    });

    // Загрузка заявок на обучение
    const trainingQuery = query(
      collection(db, 'trainingApplications'),
      where('clientId', '==', user.uid)
    );
    
    const unsubscribeTraining = onSnapshot(trainingQuery, (querySnapshot) => {
      const applications: TrainingApplication[] = [];
      querySnapshot.forEach((doc) => {
        applications.push({ id: doc.id, ...doc.data() } as TrainingApplication);
      });
      setTrainingApplications(applications);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeEquipment();
      unsubscribeTraining();
    };
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const handleDeleteRegistration = async (id: string, type: string) => {
    if (!window.confirm('Вы уверены, что хотите отменить эту заявку?')) return;

    try {
      let collectionName = '';
      switch (type) {
        case 'event':
          collectionName = 'eventRegistrations';
          break;
        case 'equipment':
          collectionName = 'equipmentRentals';
          break;
        case 'training':
          collectionName = 'trainingApplications';
          break;
      }
      
      if (collectionName) {
        await deleteDoc(doc(db, collectionName, id));
      }
    } catch (error) {
      console.error('Ошибка при удалении заявки:', error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает подтверждения';
      case 'confirmed':
        return 'Подтверждено';
      case 'cancelled':
        return 'Отменено';
      default:
        return 'Неизвестно';
    }
  };

  const isRentalActive = (endDate: string) => {
    const today = new Date();
    const rental = new Date(endDate);
    return rental >= today;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="bg-black text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold uppercase">Личный кабинет</h2>
              <p className="text-gray-300 mt-1">
                Добро пожаловать, {user.displayName || user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors font-medium uppercase flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-4 font-medium text-sm uppercase ${
                activeTab === 'events'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Мероприятия ({eventRegistrations.length})
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-6 py-4 font-medium text-sm uppercase ${
                activeTab === 'equipment'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Аренда ({equipmentRentals.length})
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`px-6 py-4 font-medium text-sm uppercase ${
                activeTab === 'training'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Обучение ({trainingApplications.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black uppercase mb-4">
                Мои регистрации на мероприятия
              </h3>
              {eventRegistrations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Вы пока не записаны ни на одно мероприятие</p>
                </div>
              ) : (
                eventRegistrations.map((registration) => (
                  <div key={registration.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-black mb-2">{registration.eventTitle}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{registration.eventDate}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{registration.eventLocation}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{registration.participants} участников</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Записались: {formatDate(registration.registeredAt)}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteRegistration(registration.id, 'event')}
                        className="text-red-500 hover:text-red-700 transition-colors ml-4"
                        title="Отменить регистрацию"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black uppercase mb-4">
                Аренда снаряжения
              </h3>
              {equipmentRentals.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">У вас нет активных заявок на аренду</p>
                </div>
              ) : (
                equipmentRentals.map((rental) => (
                  <div key={rental.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-black">{rental.equipmentName}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(rental.status)}`}>
                              {getStatusText(rental.status)}
                            </span>
                            {isRentalActive(rental.endDate) && rental.status === 'confirmed' && (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                Активна
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              {new Date(rental.startDate).toLocaleDateString('ru-RU')} - {new Date(rental.endDate).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            <span>{rental.quantity} шт.</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold">Стоимость: {rental.totalPrice}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Заявка подана: {formatDate(rental.requestedAt)}</span>
                          </div>
                          {isRentalActive(rental.endDate) && rental.status === 'confirmed' && (
                            <div className="text-blue-600 font-medium">
                              Окончание аренды: {new Date(rental.endDate).toLocaleDateString('ru-RU')}
                            </div>
                          )}
                        </div>
                      </div>
                      {rental.status === 'pending' && (
                        <button
                          onClick={() => handleDeleteRegistration(rental.id, 'equipment')}
                          className="text-red-500 hover:text-red-700 transition-colors ml-4"
                          title="Отменить заявку"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Training Tab */}
          {activeTab === 'training' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-black uppercase mb-4">
                Заявки на обучение
              </h3>
              {trainingApplications.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">У вас нет заявок на курсы обучения</p>
                </div>
              ) : (
                trainingApplications.map((application) => (
                  <div key={application.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-black">{application.courseName}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Предпочитаемая дата: {new Date(application.preferredDate).toLocaleDateString('ru-RU')}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{application.participants} участников</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Длительность: {application.courseDuration}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-semibold">Стоимость: {application.coursePrice}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>Заявка подана: {formatDate(application.appliedAt)}</span>
                          </div>
                        </div>
                      </div>
                      {application.status === 'pending' && (
                        <button
                          onClick={() => handleDeleteRegistration(application.id, 'training')}
                          className="text-red-500 hover:text-red-700 transition-colors ml-4"
                          title="Отменить заявку"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;