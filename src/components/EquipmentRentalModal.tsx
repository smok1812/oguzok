import React, { useState } from 'react';
import { X, Package, Calendar, Clock, Send, CheckCircle } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';

interface EquipmentRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment?: any;
}

const EquipmentRentalModal: React.FC<EquipmentRentalModalProps> = ({ isOpen, onClose, equipment }) => {
  const [formData, setFormData] = useState({
    rentalType: 'daily',
    startDate: '',
    endDate: '',
    quantity: 1,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

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
      await addDoc(collection(db, 'equipmentRentals'), {
        ...formData,
        equipmentName: equipment?.name || 'Не указано',
        equipmentId: equipment?.id || null,
        clientName: user.displayName || user.email,
        clientEmail: user.email,
        clientId: user.uid,
        requestedAt: new Date(),
        status: 'pending',
        totalPrice: calculatePrice()
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          rentalType: 'daily',
          startDate: '',
          endDate: '',
          quantity: 1,
          notes: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Ошибка при отправке заявки:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!equipment) return 'Уточняется';
    
    const basePrice = parseInt(equipment.price.replace(/\D/g, ''));
    const days = formData.rentalType === 'weekly' ? 7 : 1;
    return `${basePrice * days * formData.quantity} руб.`;
  };

  const handleClose = () => {
    setSuccess(false);
    setFormData({
      rentalType: 'daily',
      startDate: '',
      endDate: '',
      quantity: 1,
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
            Ваша заявка на аренду снаряжения успешно отправлена. Мы свяжемся с вами 
            в течение 24 часов для подтверждения и уточнения деталей.
          </p>
          <p className="text-sm text-gray-600">
            Предварительная стоимость: {calculatePrice()}
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
          <Package className="w-6 h-6 mr-2" />
          Заявка на аренду
        </h3>

        {equipment && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-black mb-2">{equipment.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{equipment.description}</p>
            <div className="text-lg font-bold text-black">
              {equipment.price} / {equipment.weekPrice}
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Package className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-sm text-blue-600">Клиент: {user?.displayName || user?.email}</span>
          </div>
          <p className="text-sm text-blue-600">
            Заявка будет обработана в течение 24 часов
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Тип аренды
            </label>
            <select
              name="rentalType"
              value={formData.rentalType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              required
            >
              <option value="daily">Посуточно</option>
              <option value="weekly">Понедельно</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Дата начала
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Дата окончания
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Количество
            </label>
            <select
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              required
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} шт.</option>
              ))}
            </select>
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
              placeholder="Укажите дополнительные требования или пожелания..."
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Предварительная стоимость:</h4>
            <p className="text-lg font-bold text-green-800">{calculatePrice()}</p>
            <p className="text-sm text-green-700 mt-1">
              Окончательная стоимость будет подтверждена при обработке заявки
            </p>
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

export default EquipmentRentalModal;