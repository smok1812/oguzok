import React, { useState } from 'react';
import { X, Send, Mail, MessageSquare } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        subject: subject.trim(),
        message: message.trim(),
        senderName: user.displayName || user.email,
        senderEmail: user.email,
        senderId: user.uid,
        sentAt: new Date(),
        status: 'new'
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setSubject('');
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setSubject('');
    setMessage('');
    onClose();
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-4">Сообщение отправлено!</h3>
          <p className="text-gray-700">Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.</p>
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

        <h3 className="text-2xl font-bold text-center mb-6 text-black uppercase flex items-center justify-center">
          <MessageSquare className="w-6 h-6 mr-2" />
          Связаться с нами
        </h3>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Mail className="w-4 h-4 mr-2 text-gray-600" />
            <span className="text-sm text-gray-600">От: {user?.displayName || user?.email}</span>
          </div>
          <p className="text-sm text-gray-600">
            Ваше сообщение будет отправлено администраторам клуба
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Тема сообщения
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder="Укажите тему вашего обращения"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Сообщение
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
              rows={6}
              placeholder="Опишите ваш вопрос или предложение подробно..."
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Время ответа:</strong> Мы отвечаем на сообщения в течение 24 часов в рабочие дни.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !subject.trim() || !message.trim()}
            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Отправляем...' : 'Отправить сообщение'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;