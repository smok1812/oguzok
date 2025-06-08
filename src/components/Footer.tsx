import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    window.location.href = `/#${sectionId}`;
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-bold uppercase mb-4">Владивостокский Клев</h4>
            <p className="text-gray-300 mb-4">
              Рыболовный клуб для настоящих ценителей рыбалки в Приморском крае. 
              Присоединяйтесь к нашему сообществу!
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <span className="text-sm font-bold">VK</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <span className="text-sm font-bold">TG</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <span className="text-sm font-bold">YT</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <span className="text-sm font-bold">IG</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold uppercase mb-4">Навигация</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  О клубе
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Наши услуги
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('gallery')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Галерея
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('comments')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Отзывы
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Контакты
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold uppercase mb-4">Наши услуги</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  Мероприятия
                </Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-white transition-colors">
                  Обучение и мастер-классы
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="hover:text-white transition-colors">
                  Аренда снаряжения
                </Link>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Соревнования</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Членство в клубе</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold uppercase mb-4">Контакты</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>г. Владивосток, ул. Набережная, 15</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+7 (423) 245-67-89</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@vladivostok-klev.ru</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2023 Владивостокский Клев. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;