import React, { useState } from 'react';
import { X, BookOpen, Calendar, Users, Send, CheckCircle } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';

interface TrainingApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: any;
}

const TrainingApplicationModal: React.FC<TrainingApplicationModalProps> = ({ isOpen, onClose, course }) => {
  const [formData, setFormData] = useState({
    preferredDate: '',
    participants: 1,
    experience: '',
    goals: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const experienceLevels = [
    'Полный новичок',
    'Есть базовые навыки',
    'Средний уровень',
    'Опытный рыболов'
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
      await addDoc(collection(db, 'trainingApplications'), {
        ...formData,
        courseName: course?.title || 'Не указан',
        courseId: course?.id || null,
        coursePrice: course?.price || 'Уточняется',
        courseDuration: course?.duration || 'Уточняется',
        clientName: user.displayName || user.email,
        clientEmail: user.email,
        clientId: user.uid,
        appliedAt: new Date(),
        status: 'pending'
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          preferredDate: '',
          participants: 1,
          experience: '',
          goals: '',
          notes: ''
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
      preferredDate: '',
      participants: 1,
      experience: '',
      goals: '',
      notes: ''
    });
    onClose();
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-4">Заявка отправлена!</h3>
          <p className="text-gray-700 mb-4">
            Ваша заявка на курс "{course?.title}" успешно отправлена. Наш менеджер свяжется с вами 
            в течение 24 часов для подтверждения записи и уточнения деталей.
          </p>
          <p className="text-sm text-gray-600">
            Стоимость курса: {course?.price}
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
          <BookOpen className="w-6 h-6 mr-2" />
          Заявка на курс
        </h3>

        {course && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-black mb-2">{course.title}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{course.participants}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{course.duration}</span>
              </div>
            </div>
            <div className="text-lg font-bold text-black mt-2">
              Стоимость: {course.price}
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-sm text-blue-600">Участник: {user?.displayName || user?.email}</span>
          </div>
          <p className="text-sm text-blue-600">
            Заявка будет рассмотрена в течение 24 часов
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Предпочитаемая дата начала
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
              <Users className="inline w-4 h-4 mr-2" />
              Количество участников
            </label>
            <select
              name="participants"
              value={formData.participants}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              required
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'человек' : 'человека'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Уровень опыта в рыбалке
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              required
            >
              <option value="">Выберите уровень опыта</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Цели обучения
            </label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
              rows={3}
              placeholder="Что вы хотите изучить или улучшить в рыбалке?"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Дополнительные пожелания
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
              rows={3}
              placeholder="Особые требования, вопросы или пожелания..."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Важная информация:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Оплата производится после подтверждения записи</li>
              <li>• Возможна рассрочка платежа</li>
              <li>• При отмене за 48 часов - полный возврат средств</li>
              <li>• Все необходимые материалы включены в стоимость</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Отправляем заявку...' : 'Подать заявку'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainingApplicationModal;