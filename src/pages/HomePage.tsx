import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Users, Calendar, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import ContactModal from '../components/ContactModal';
import Gallery from '../components/Gallery';
import Comments from '../components/Comments';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
  const { user } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    if (user) {
      setIsContactModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleJoinClick = () => {
    if (user) {
      setShowAlreadyRegistered(true);
      setTimeout(() => setShowAlreadyRegistered(false), 3000);
    } else {
      setIsModalOpen(true);
    }
  };

  const galleryImages = [
    "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
    "https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg",
    "https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg",
    "https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg",
    "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg",
    "https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg"
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => setIsModalOpen(true)} />
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      {/* Already Registered Modal */}
      {showAlreadyRegistered && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">Вы уже зарегистрированы!</h3>
            <p className="text-gray-700">
              Добро пожаловать в наш клуб! Вы уже являетесь участником "Владивостокский Клев".
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="pt-20 min-h-screen flex items-center relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.pexels.com/photos/1115117/pexels-photo-1115117.jpeg")'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-wider">
            Владивостокский Клев
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Присоединяйтесь к сообществу настоящих ценителей рыбалки в Приморском крае
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleJoinClick}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-medium uppercase"
            >
              Присоединиться
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 font-medium uppercase"
            >
              Узнать больше
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black uppercase tracking-wide mb-4">О нашем клубе</h2>
            <div className="w-20 h-1 bg-black mx-auto"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-black uppercase">Мы объединяем рыбаков Владивостока с 2008 года</h3>
              <p className="text-gray-700 leading-relaxed">
                Владивостокский Клев - это сообщество единомышленников, страстно увлеченных рыбалкой. 
                Наш клуб объединяет как опытных профессионалов, так и начинающих рыбаков, желающих 
                освоить все тонкости этого древнего ремесла.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Мы организуем регулярные выезды на лучшие рыбные места Приморского края, проводим 
                мастер-классы и соревнования, а также создаем условия для обмена опытом между участниками клуба.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Наша миссия - сохранение рыболовных традиций, защита природных ресурсов и популяризация 
                рыбалки как активного отдыха и спорта.
              </p>
              <button
                onClick={() => scrollToSection('services')}
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase"
              >
                Наши услуги
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg"
                alt="Рыболовный клуб"
                className="w-full h-96 object-cover rounded-lg shadow-lg grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black uppercase tracking-wide mb-4">Наши услуги</h2>
            <div className="w-20 h-1 bg-black mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg"
                  alt="Мероприятия"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black uppercase mb-4">Мероприятия</h3>
                <p className="text-gray-700 mb-6">
                  Участвуйте в организованных выездах на лучшие рыбные места Приморского края. 
                  Наши члены сами организуют поездки, создавая уникальный опыт для каждого участника.
                </p>
                <Link
                  to="/events"
                  onClick={scrollToTop}
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase inline-block"
                >
                  Подробнее
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg"
                  alt="Обучение"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black uppercase mb-4">Обучение и мастер-классы</h3>
                <p className="text-gray-700 mb-6">
                  Курсы для начинающих и мастер-классы от опытных рыболовов. 
                  Освойте все техники ловли и правильного обращения со снастями.
                </p>
                <Link
                  to="/training"
                  onClick={scrollToTop}
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase inline-block"
                >
                  Подробнее
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg"
                  alt="Снаряжение"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black uppercase mb-4">Аренда снаряжения</h3>
                <p className="text-gray-700 mb-6">
                  Предоставляем в аренду качественные рыболовные снасти и экипировку. 
                  Для членов клуба - специальные условия.
                </p>
                <Link
                  to="/equipment"
                  onClick={scrollToTop}
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase inline-block"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black uppercase tracking-wide mb-4">Галерея</h2>
            <div className="w-20 h-1 bg-black mx-auto"></div>
          </div>
          <Gallery images={galleryImages} />
        </div>
      </section>

      {/* Comments Section */}
      <div id="comments">
        <Comments />
      </div>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black uppercase tracking-wide mb-4">Контакты</h2>
            <div className="w-20 h-1 bg-black mx-auto"></div>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-black uppercase">Свяжитесь с нами</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="text-black w-6 h-6 mt-1" />
                  <div>
                    <p className="text-gray-700">г. Владивосток, ул. Набережная, 15</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="text-black w-6 h-6 mt-1" />
                  <div>
                    <p className="text-gray-700">+7 (423) 245-67-89</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="text-black w-6 h-6 mt-1" />
                  <div>
                    <p className="text-gray-700">info@vladivostok-klev.ru</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="text-black w-6 h-6 mt-1" />
                  <div>
                    <p className="text-gray-700">Пн-Пт: 10:00 - 19:00</p>
                    <p className="text-gray-700">Сб-Вс: 9:00 - 17:00</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="text-black w-6 h-6 mt-1" />
                  <div>
                    <p className="text-gray-700">Более 500 участников клуба</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Calendar className="text-black w-6 h-6 mt-1" />
                  <div>
                    <p className="text-gray-700">Еженедельные выезды на рыбалку</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleContactClick}
                className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase"
              >
                Написать нам
              </button>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg grayscale hover:grayscale-0 transition-all duration-500">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2918.278715863947!2d131.8852113154387!3d43.01633397914736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5fb3920962d0f58d%3A0x4c7e7f0e1b8b5d1a!2z0JLQu9Cw0LTQuNCy0L7RgdGC0L7RjyDRg9C7Liwg0JLQu9Cw0LTQuNCy0L7RgdGC0L7RjyDQvtCx0LvQsNGB0YLRjA!5e0!3m2!1sru!2sru!4v1650000000000!5m2!1sru!2sru"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;