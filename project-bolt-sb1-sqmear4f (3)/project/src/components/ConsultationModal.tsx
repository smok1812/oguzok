import React, { useState } from 'react';
import { X, Calendar, Clock, User, MessageSquare, Send } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    consultationType: '',
    preferredDate: '',
    preferredTime: '',
    topic: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const consultationTypes = [
    'Выбор снаряжения',
    'Техники ловли',
    'Места для рыбалки',
    'Подготовка к соревнованиям',
    'Обучение новичков',
    'Другое'
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'consultationRequests'), {
        ...formData,
        clientName: user.displayName || user.email,
        clientEmail: user.email,
        clientId: user.uid,
        requestedAt: new Date(),
        status: 'pending'
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          consultationType: '',
          preferredDate: '',
          preferredTime: '',
          topic: '',
          description: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Ошибка при отправке заявки:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setFormData({
      consultationType: '',
      preferredDate: '',
      preferredTime: '',
      topic: '',
      description: ''
    });
    onClose();
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-4">Заявка отправлена!</h3>
          <p className="text-gray-700 mb-4">
            Ваша заявка на консультацию успешно отправлена. Наш эксперт свяжется с вами 
            в течение 24 часов для подтверждения времени встречи.
          </p>
          <p className="text-sm text-gray-600">
            Консультация будет проведена {formData.preferredDate} в {formData.preferredTime}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-black hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-bold text-center mb-6 text-black uppercase flex items-center justify-center">
          <User className="w-6 h-6 mr-2" />
          Заявка на консультацию
        </h3>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <User className="w-4 h-4 mr-2 text-gray-600" />
            <span className="text-sm text-gray-600">Клиент: {user?.displayName || user?.email}</span>
          </div>
          <p className="text-sm text-gray-600">
            Получите персональную консультацию от наших экспертов по любым вопросам рыбалки
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Тип консультации
            </label>
            <select
              name="consultationType"
              value={formData.consultationType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              required
            >
              <option value="">Выберите тип консультации</option>
              {consultationTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Предпочитаемая дата
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Clock className="inline w-4 h-4 mr-2" />
                Предпочитаемое время
              </label>
              <select
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              >
                <option value="">Выберите время</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Тема консультации
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder="Кратко опишите тему"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <MessageSquare className="inline w-4 h-4 mr-2" />
              Подробное описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
              rows={4}
              placeholder="Опишите подробно ваши вопросы и что вы хотели бы узнать..."
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Информация о консультации:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Длительность: 60 минут</li>
              <li>• Стоимость: 2000 руб.</li>
              <li>• Формат: очно в клубе или онлайн</li>
              <li>• Подтверждение в течение 24 часов</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Отправляем заявку...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationModal;