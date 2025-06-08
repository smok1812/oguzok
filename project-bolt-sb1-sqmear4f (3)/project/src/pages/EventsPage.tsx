import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Fish, Plus, Trash2 } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import ContactModal from '../components/ContactModal';
import EventRegistrationModal from '../components/EventRegistrationModal';

interface MemberEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  organizerId: string;
  createdAt: any;
}

const EventsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [memberEvents, setMemberEvents] = useState<MemberEvent[]>([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  });
  const { user } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactClick = () => {
    if (user) {
      setIsContactModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  // Загрузка мероприятий от участников
  useEffect(() => {
    const q = query(collection(db, 'memberEvents'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData: MemberEvent[] = [];
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() } as MemberEvent);
      });
      setMemberEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'memberEvents'), {
        ...newEvent,
        organizer: user.displayName || user.email,
        organizerId: user.uid,
        createdAt: new Date()
      });
      
      setNewEvent({ title: '', date: '', time: '', location: '', description: '' });
      setShowAddEventForm(false);
    } catch (error) {
      console.error('Ошибка при добавлении мероприятия:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string, organizerId: string) => {
    if (!user || user.uid !== organizerId) return;

    if (window.confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      try {
        await deleteDoc(doc(db, 'memberEvents', eventId));
      } catch (error) {
        console.error('Ошибка при удалении мероприятия:', error);
      }
    }
  };

  const handleRegistration = (event: any) => {
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    setSelectedEvent(event);
    setIsRegistrationModalOpen(true);
  };

  const events = [
    {
      id: 1,
      title: "Морская рыбалка на катере",
      date: "15 декабря 2023",
      time: "06:00 - 18:00",
      location: "Бухта Золотой Рог",
      participants: "8-12 человек",
      price: "3500 руб.",
      description: "Выезд на морскую рыбалку с опытным капитаном. Ловля трески, минтая и других морских рыб. В стоимость включены снасти, наживка и горячий обед.",
      image: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
      features: ["Опытный капитан", "Снасти включены", "Горячий обед", "Обработка улова"]
    },
    {
      id: 2,
      title: "Речная рыбалка на горных реках",
      date: "22 декабря 2023",
      time: "07:00 - 19:00",
      location: "Река Партизанская",
      participants: "6-10 человек",
      price: "2800 руб.",
      description: "Поход на горные реки Приморья. Ловля хариуса, форели и других пресноводных рыб в живописных местах.",
      image: "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg",
      features: ["Горные пейзажи", "Чистые реки", "Трансфер включен", "Инструктор"]
    },
    {
      id: 3,
      title: "Зимняя рыбалка на льду",
      date: "29 декабря 2023",
      time: "08:00 - 16:00",
      location: "Озеро Ханка",
      participants: "10-15 человек",
      price: "2200 руб.",
      description: "Зимняя рыбалка на знаменитом озере Ханка. Ловля щуки, окуня и карася со льда. Теплая палатка и горячий чай включены.",
      image: "https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg",
      features: ["Теплая палатка", "Горячий чай", "Зимние снасти", "Безопасность на льду"]
    },
    {
      id: 4,
      title: "Соревнования по спиннингу",
      date: "5 января 2024",
      time: "09:00 - 17:00",
      location: "Залив Петра Великого",
      participants: "20-30 человек",
      price: "1500 руб.",
      description: "Ежегодные соревнования клуба по спиннинговой ловле. Призы для победителей, дружеская атмосфера и обмен опытом.",
      image: "https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg",
      features: ["Призы победителям", "Судейство", "Фотоотчет", "Награждение"]
    },
    {
      id: 5,
      title: "Ночная рыбалка на карпа",
      date: "12 января 2024",
      time: "18:00 - 08:00",
      location: "Пруд Лесной",
      participants: "8-12 человек",
      price: "3200 руб.",
      description: "Ночная рыбалка на карпа в специально оборудованном месте. Палатки, костер и ночное освещение обеспечены.",
      image: "https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg",
      features: ["Ночное освещение", "Палатки", "Костер", "Карповые снасти"]
    },
    {
      id: 6,
      title: "Мастер-класс по нахлысту",
      date: "19 января 2024",
      time: "10:00 - 16:00",
      location: "Река Кедровая",
      participants: "6-8 человек",
      price: "4500 руб.",
      description: "Обучение технике нахлыстовой ловли от мастера спорта. Индивидуальный подход к каждому участнику.",
      image: "https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg",
      features: ["Мастер спорта", "Индивидуальное обучение", "Снасти для нахлыста", "Сертификат"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => setIsModalOpen(true)} />
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <EventRegistrationModal 
        isOpen={isRegistrationModalOpen} 
        onClose={() => setIsRegistrationModalOpen(false)}
        event={selectedEvent}
      />

      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link
              to="/"
              onClick={scrollToTop}
              className="flex items-center text-black hover:text-gray-600 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад на главную
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black uppercase tracking-wide mb-4">
              Мероприятия клуба
            </h1>
            <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Присоединяйтесь к нашим увлекательным рыболовным мероприятиям. 
              От морской рыбалки до горных рек - выберите приключение по душе!
            </p>
          </div>
        </div>
      </section>

      {/* Official Events Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black uppercase tracking-wide mb-4">
              Официальные мероприятия клуба
            </h2>
            <div className="w-20 h-1 bg-black mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black uppercase mb-3">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{event.participants}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-black mb-2">Включено:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {event.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Fish className="w-3 h-3 mr-2 text-black" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-black">{event.price}</span>
                    <button
                      onClick={() => handleRegistration(event)}
                      className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase text-sm"
                    >
                      Записаться
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Events Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black uppercase tracking-wide mb-4">
              Мероприятия от участников
            </h2>
            <div className="w-20 h-1 bg-black mx-auto mb-4"></div>
            <p className="text-gray-600 mb-8">Бесплатные мероприятия, организованные участниками клуба</p>
            
            {user && (
              <button
                onClick={() => setShowAddEventForm(!showAddEventForm)}
                className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Добавить мероприятие
              </button>
            )}
          </div>

          {/* Add Event Form */}
          {showAddEventForm && user && (
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 mb-8">
              <h3 className="text-xl font-bold text-black uppercase mb-4">Добавить новое мероприятие</h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Название</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Место</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Дата</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Время</label>
                    <input
                      type="text"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      placeholder="например: 08:00 - 16:00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Описание</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase"
                  >
                    Добавить
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddEventForm(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-colors font-medium uppercase"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Member Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memberEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      БЕСПЛАТНО
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        от {event.organizer}
                      </span>
                      {user && user.uid === event.organizerId && (
                        <button
                          onClick={() => handleDeleteEvent(event.id, event.organizerId)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Удалить мероприятие"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-black uppercase mb-3">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    {event.description}
                  </p>

                  <button
                    onClick={() => handleRegistration({...event, price: 'Бесплатно'})}
                    className="w-full bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-colors font-medium uppercase text-sm"
                  >
                    Записаться
                  </button>
                </div>
              </div>
            ))}
          </div>

          {memberEvents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Пока нет мероприятий от участников.</p>
              {user && (
                <p className="text-gray-500 mt-2">Будьте первым, кто организует мероприятие!</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black uppercase mb-6">
            Не нашли подходящее мероприятие?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Свяжитесь с нами, и мы поможем организовать индивидуальную рыбалку 
            или подберем мероприятие под ваши предпочтения.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContactClick}
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase"
            >
              Связаться с нами
            </button>
            <Link
              to="/"
              onClick={scrollToTop}
              className="bg-transparent border-2 border-black text-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 font-medium uppercase"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventsPage;