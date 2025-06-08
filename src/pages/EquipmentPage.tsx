import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Clock, Star, Shield, Truck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import ContactModal from '../components/ContactModal';
import EquipmentRentalModal from '../components/EquipmentRentalModal';
import { useAuth } from '../hooks/useAuth';

const EquipmentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  const handleRentalClick = (equipment?: any) => {
    if (user) {
      setSelectedEquipment(equipment);
      setIsRentalModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const categories = [
    { id: 'all', name: 'Все категории' },
    { id: 'rods', name: 'Удочки и спиннинги' },
    { id: 'reels', name: 'Катушки' },
    { id: 'lures', name: 'Приманки' },
    { id: 'gear', name: 'Экипировка' },
    { id: 'accessories', name: 'Аксессуары' }
  ];

  const equipment = [
    {
      id: 1,
      name: "Спиннинг Shimano Catana",
      category: "rods",
      price: "500 руб/день",
      weekPrice: "2500 руб/неделя",
      description: "Универсальный спиннинг для ловли хищной рыбы. Длина 2.4м, тест 10-30г.",
      image: "https://images.pexels.com/photos/3737787/pexels-photo-3737787.jpeg",
      rating: 4.8,
      features: ["Длина 2.4м", "Тест 10-30г", "Быстрый строй", "Карбон"]
    },
    {
      id: 2,
      name: "Фидерное удилище Daiwa",
      category: "rods",
      price: "400 руб/день",
      weekPrice: "2000 руб/неделя",
      description: "Профессиональное фидерное удилище для донной ловли. Длина 3.6м.",
      image: "https://images.pexels.com/photos/7018391/pexels-photo-7018391.jpeg",
      rating: 4.7,
      features: ["Длина 3.6м", "3 вершинки", "Фидерный строй", "Качественная фурнитура"]
    },
    {
      id: 3,
      name: "Катушка Shimano Stradic",
      category: "reels",
      price: "300 руб/день",
      weekPrice: "1500 руб/неделя",
      description: "Безынерционная катушка премиум класса. Размер 2500, 6 подшипников.",
      image: "https://images.pexels.com/photos/3737787/pexels-photo-3737787.jpeg",
      rating: 4.9,
      features: ["6 подшипников", "Размер 2500", "Плавный ход", "Надежный фрикцион"]
    },
    {
      id: 4,
      name: "Мультипликаторная катушка",
      category: "reels",
      price: "450 руб/день",
      weekPrice: "2200 руб/неделя",
      description: "Профессиональная мультипликаторная катушка для троллинга и джига.",
      image: "https://images.pexels.com/photos/7018391/pexels-photo-7018391.jpeg",
      rating: 4.6,
      features: ["Магнитный тормоз", "Счетчик лески", "Мощный фрикцион", "Металлический корпус"]
    },
    {
      id: 5,
      name: "Набор воблеров",
      category: "lures",
      price: "200 руб/день",
      weekPrice: "1000 руб/неделя",
      description: "Комплект из 10 воблеров разных размеров и расцветок для ловли щуки и окуня.",
      image: "https://images.pexels.com/photos/3737787/pexels-photo-3737787.jpeg",
      rating: 4.5,
      features: ["10 воблеров", "Разные размеры", "Проверенные модели", "Коробка в комплекте"]
    },
    {
      id: 6,
      name: "Силиконовые приманки",
      category: "lures",
      price: "150 руб/день",
      weekPrice: "750 руб/неделя",
      description: "Набор силиконовых приманок и джиг-головок для джиговой ловли.",
      image: "https://images.pexels.com/photos/7018391/pexels-photo-7018391.jpeg",
      rating: 4.4,
      features: ["Виброхвосты", "Твистеры", "Джиг-головки", "Разные веса"]
    },
    {
      id: 7,
      name: "Костюм для рыбалки",
      category: "gear",
      price: "350 руб/день",
      weekPrice: "1750 руб/неделя",
      description: "Водонепроницаемый костюм для рыбалки в любую погоду. Размеры S-XXL.",
      image: "https://images.pexels.com/photos/3737787/pexels-photo-3737787.jpeg",
      rating: 4.7,
      features: ["Водонепроницаемый", "Дышащий материал", "Все размеры", "Удобный крой"]
    },
    {
      id: 8,
      name: "Забродные сапоги",
      category: "gear",
      price: "250 руб/день",
      weekPrice: "1250 руб/неделя",
      description: "Высокие забродные сапоги с нескользящей подошвой. Размеры 39-46.",
      image: "https://images.pexels.com/photos/7018391/pexels-photo-7018391.jpeg",
      rating: 4.6,
      features: ["Высота до груди", "Нескользящая подошва", "Все размеры", "Прочный материал"]
    },
    {
      id: 9,
      name: "Рыболовный ящик",
      category: "accessories",
      price: "100 руб/день",
      weekPrice: "500 руб/неделя",
      description: "Многосекционный ящик для снастей с удобными отделениями.",
      image: "https://images.pexels.com/photos/3737787/pexels-photo-3737787.jpeg",
      rating: 4.3,
      features: ["Много отделений", "Прозрачные крышки", "Удобная ручка", "Компактный размер"]
    },
    {
      id: 10,
      name: "Подсачек",
      category: "accessories",
      price: "80 руб/день",
      weekPrice: "400 руб/неделя",
      description: "Складной подсачек с телескопической ручкой и прорезиненной сеткой.",
      image: "https://images.pexels.com/photos/7018391/pexels-photo-7018391.jpeg",
      rating: 4.5,
      features: ["Телескопическая ручка", "Прорезиненная сетка", "Складная конструкция", "Легкий вес"]
    },
    {
      id: 11,
      name: "Эхолот Garmin",
      category: "accessories",
      price: "800 руб/день",
      weekPrice: "4000 руб/неделя",
      description: "Портативный эхолот для поиска рыбы и изучения рельефа дна.",
      image: "https://images.pexels.com/photos/3737787/pexels-photo-3737787.jpeg",
      rating: 4.9,
      features: ["Цветной дисплей", "GPS навигация", "Карты глубин", "Водонепроницаемый"]
    },
    {
      id: 12,
      name: "Палатка для зимней рыбалки",
      category: "gear",
      price: "600 руб/день",
      weekPrice: "3000 руб/неделя",
      description: "Утепленная палатка для комфортной зимней рыбалки на льду.",
      image: "https://images.pexels.com/photos/7018391/pexels-photo-7018391.jpeg",
      rating: 4.8,
      features: ["Быстрая установка", "Ветрозащита", "Утепленные стенки", "Вентиляция"]
    }
  ];

  const filteredEquipment = selectedCategory === 'all' 
    ? equipment 
    : equipment.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => setIsModalOpen(true)} />
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      <EquipmentRentalModal 
        isOpen={isRentalModalOpen} 
        onClose={() => setIsRentalModalOpen(false)}
        equipment={selectedEquipment}
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
              Аренда снаряжения
            </h1>
            <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Качественное рыболовное снаряжение в аренду. От удочек до эхолотов - 
              все необходимое для успешной рыбалки по доступным ценам.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEquipment.map((item) => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(item.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({item.rating})</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-black mb-2">{item.name}</h3>
                  
                  <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mb-3">
                    <h4 className="font-semibold text-black mb-1 text-sm">Особенности:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {item.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Package className="w-3 h-3 mr-1 text-black" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <div className="text-lg font-bold text-black">{item.price}</div>
                    <div className="text-sm text-gray-600">{item.weekPrice}</div>
                  </div>

                  <button
                    onClick={() => handleRentalClick(item)}
                    className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase text-sm"
                  >
                    Арендовать
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black uppercase tracking-wide mb-4">
              Условия аренды
            </h2>
            <div className="w-20 h-1 bg-black mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black uppercase mb-2">Гибкие сроки</h3>
              <p className="text-gray-700 text-sm">От 1 дня до месяца. Специальные цены на длительную аренду</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black uppercase mb-2">Страхование</h3>
              <p className="text-gray-700 text-sm">Все снаряжение застраховано. Минимальный залог</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black uppercase mb-2">Доставка</h3>
              <p className="text-gray-700 text-sm">Бесплатная доставка по Владивостоку при аренде от 3 дней</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black uppercase mb-2">Качество</h3>
              <p className="text-gray-700 text-sm">Только проверенные бренды и регулярное обслуживание</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black uppercase tracking-wide mb-4">
              Специальные предложения
            </h2>
            <div className="w-20 h-1 bg-black mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
              <h3 className="text-xl font-bold text-black uppercase mb-4">Базовый комплект</h3>
              <div className="text-3xl font-bold text-black mb-4">1200 руб/день</div>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li>Удочка или спиннинг</li>
                <li>Катушка</li>
                <li>Базовый набор приманок</li>
                <li>Подсачек</li>
              </ul>
              <button
                onClick={() => handleRentalClick()}
                className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase"
              >
                Заказать
              </button>
            </div>
            
            <div className="bg-black rounded-lg p-6 text-center text-white transform scale-105">
              <h3 className="text-xl font-bold uppercase mb-4">Профессиональный</h3>
              <div className="text-3xl font-bold mb-4">2500 руб/день</div>
              <ul className="text-sm space-y-2 mb-6">
                <li>Премиум удилище</li>
                <li>Профессиональная катушка</li>
                <li>Расширенный набор приманок</li>
                <li>Экипировка</li>
                <li>Эхолот</li>
              </ul>
              <button
                onClick={() => handleRentalClick()}
                className="w-full bg-white text-black py-2 rounded-full hover:bg-gray-200 transition-colors font-medium uppercase"
              >
                Заказать
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
              <h3 className="text-xl font-bold text-black uppercase mb-4">Зимний комплект</h3>
              <div className="text-3xl font-bold text-black mb-4">1800 руб/день</div>
              <ul className="text-sm text-gray-700 space-y-2 mb-6">
                <li>Зимние удочки</li>
                <li>Ледобур</li>
                <li>Зимние приманки</li>
                <li>Теплая палатка</li>
              </ul>
              <button
                onClick={() => handleRentalClick()}
                className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase"
              >
                Заказать
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black uppercase mb-6">
            Нужна консультация?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Наши эксперты помогут подобрать идеальное снаряжение для ваших целей 
            и расскажут о всех особенностях аренды.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContactClick}
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase"
            >
              Получить консультацию
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

export default EquipmentPage;