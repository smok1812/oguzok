import React, { useState, useEffect } from 'react';
import { X, Users, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({ isOpen, onClose, event }) => {
  const [participants, setParticipants] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && event && user) {
      checkExistingRegistration();
    }
  }, [isOpen, event, user]);

  const checkExistingRegistration = async () => {
    if (!user || !event) return;

    try {
      const q = query(
        collection(db, 'eventRegistrations'),
        where('eventId', '==', event.id),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      setAlreadyRegistered(!querySnapshot.empty);
    } catch (error) {
      console.error('Ошибка при проверке регистрации:', error);
    }
  };

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (alreadyRegistered) {
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'eventRegistrations'), {
        eventId: event.id,
        eventTitle: event.title,
        userEmail: user.email,
        userName: user.displayName || user.email,
        userId: user.uid,
        participants: participants,
        registeredAt: new Date(),
        eventDate: event.date,
        eventLocation: event.location
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setParticipants(1);
        setAlreadyRegistered(true);
      }, 2000);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setParticipants(1);
    setAlreadyRegistered(false);
    onClose();
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-4">Успешно записаны!</h3>
          <p className="text-gray-700">Вы успешно записались на мероприятие. Мы свяжемся с вами для уточнения деталей.</p>
        </div>
      </div>
    );
  }

  if (alreadyRegistered) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-black hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">Вы уже зарегистрированы!</h3>
            <p className="text-gray-700 mb-6">
              Вы уже записаны на это мероприятие. Мы свяжемся с вами для уточнения деталей.
            </p>
            <button
              onClick={handleClose}
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase"
            >
              Понятно
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-black hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold text-center mb-6 text-black uppercase">
          Запись на мероприятие
        </h3>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold text-black mb-2">{event.title}</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.location}</span>
            </div>
            {event.price && (
              <div className="text-lg font-bold text-black mt-2">
                Стоимость: {event.price}
              </div>
            )}
          </div>
        </div>

        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Ваш email
              </label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Users className="inline w-4 h-4 mr-2" />
                Количество участников
              </label>
              <select
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'человек' : 'человека'}</option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Обратите внимание:</strong> После подачи заявки мы свяжемся с вами для подтверждения участия и уточнения деталей.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Записываем...' : 'Записаться на мероприятие'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Для записи на мероприятие необходимо войти в систему
            </p>
            <button
              onClick={handleClose}
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase"
            >
              Войти в систему
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationModal;