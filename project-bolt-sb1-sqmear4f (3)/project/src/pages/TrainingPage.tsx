import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Clock, Award, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import TrainingApplicationModal from '../components/TrainingApplicationModal';
import { useAuth } from '../hooks/useAuth';

const TrainingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { user } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplicationClick = (course: any) => {
    if (user) {
      setSelectedCourse(course);
      setIsApplicationModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const courses = [
    {
      id: 1,
      title: "Основы рыбалки для начинающих",
      duration: "2 дня (16 часов)",
      participants: "6-8 человек",
      price: "8500 руб.",
      level: "Начинающий",
      description: "Полный курс для тех, кто только начинает свой путь в рыбалке. Изучите основы, получите практические навыки и уверенность.",
      image: "https://images.pexels.com/photos/1537635/pexels-photo-1537635.jpeg",
      topics: [
        "Виды рыболовных снастей",
        "Техники заброса",
        "Выбор приманок и наживок",
        "Чтение водоема",
        "Правила безопасности",
        "Практическая рыбалка"
      ],
      includes: ["Учебные материалы", "Снасти на время обучения", "Сертификат", "Обед"]
    },
    {
      id: 2,
      title: "Мастер-класс по спиннинговой ловле",
      duration: "1 день (8 часов)",
      participants: "4-6 человек",
      price: "6500 руб.",
      level: "Продвинутый",
      description: "Углубленное изучение техник спиннинговой ловли от мастера спорта. Секреты успешной ловли хищной рыбы.",
      image: "https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg",
      topics: [
        "Выбор спиннинга и катушки",
        "Техники проводки",
        "Работа с воблерами",
        "Джиговая ловля",
        "Поиск хищника",
        "Практика на водоеме"
      ],
      includes: ["Мастер-класс от профи", "Тестирование снастей", "Видеоразбор", "Горячий обед"]
    },
    {
      id: 3,
      title: "Нахлыстовая рыбалка",
      duration: "3 дня (24 часа)",
      participants: "4-5 человек",
      price: "15000 руб.",
      level: "Специализированный",
      description: "Изучение искусства нахлыстовой ловли. От основ до продвинутых техник вязания мушек и презентации.",
      image: "https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg",
      topics: [
        "История и философия нахлыста",
        "Снаряжение для нахлыста",
        "Техники заброса",
        "Вязание мушек",
        "Чтение воды",
        "Практика на реке"
      ],
      includes: ["Набор для вязания мушек", "Нахлыстовые снасти", "Мастер-класс по вязанию", "3 дня практики"]
    },
    {
      id: 4,
      title: "Морская рыбалка с катера",
      duration: "1 день (10 часов)",
      participants: "8-10 человек",
      price: "5500 руб.",
      level: "Средний",
      description: "Обучение особенностям морской рыбалки. Техники ловли в открытом море, работа с морскими снастями.",
      image: "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg",
      topics: [
        "Морские снасти",
        "Техники морской ловли",
        "Безопасность на воде",
        "Виды морских рыб",
        "Работа с эхолотом",
        "Практическая рыбалка"
      ],
      includes: ["Аренда катера", "Морские снасти", "Инструктор", "Обед на борту"]
    },
    {
      id: 5,
      title: "Зимняя рыбалка",
      duration: "1 день (8 часов)",
      participants: "6-8 человек",
      price: "4500 руб.",
      level: "Начинающий",
      description: "Освойте зимнюю рыбалку со льда. Безопасность, снасти, техники ловли в зимних условиях.",
      image: "https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg",
      topics: [
        "Безопасность на льду",
        "Зимние снасти",
        "Техники зимней ловли",
        "Поиск рыбы подо льдом",
        "Зимние приманки",
        "Практика на льду"
      ],
      includes: ["Зимние снасти", "Теплая палатка", "Горячий чай", "Инструктор"]
    },
    {
      id: 6,
      title: "Карповая рыбалка",
      duration: "2 дня (20 часов)",
      participants: "4-6 человек",
      price: "12000 руб.",
      level: "Продвинутый",
      description: "Специализированный курс по ловле карпа. Современные методы, снасти и стратегии карпфишинга.",
      image: "https://images.pexels.com/photos/952670/pexels-photo-952670.jpeg",
      topics: [
        "Карповые снасти",
        "Прикормки и насадки",
        "Монтажи для карпа",
        "Стратегия ловли",
        "Вываживание крупной рыбы",
        "Ночная рыбалка"
      ],
      includes: ["Карповые снасти", "Палатка", "Прикормки", "2 дня практики"]
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Начинающий':
        return 'bg-green-100 text-green-800';
      case 'Средний':
        return 'bg-yellow-100 text-yellow-800';
      case 'Продвинутый':
        return 'bg-orange-100 text-orange-800';
      case 'Специализированный':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => setIsModalOpen(true)} />
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <TrainingApplicationModal 
        isOpen={isApplicationModalOpen} 
        onClose={() => setIsApplicationModalOpen(false)}
        course={selectedCourse}
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
              Обучение и мастер-классы
            </h1>
            <div className="w-20 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Изучите все секреты рыбалки с нашими опытными инструкторами. 
              От базовых навыков до продвинутых техник - мы поможем вам стать настоящим мастером.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                <div className="h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-black uppercase mb-3">{course.title}</h3>
                  
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{course.participants}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-black mb-2 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Программа курса:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {course.topics.slice(0, 3).map((topic, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                          {topic}
                        </li>
                      ))}
                      {course.topics.length > 3 && (
                        <li className="text-gray-500 text-xs">
                          +{course.topics.length - 3} дополнительных тем
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-black mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Включено:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {course.includes.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-black">{course.price}</span>
                  </div>

                  <button
                    onClick={() => handleApplicationClick(course)}
                    className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase text-sm"
                  >
                    Подать заявку
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black uppercase tracking-wide mb-4">
              Почему выбирают наше обучение
            </h2>
            <div className="w-20 h-1 bg-black mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black uppercase mb-2">Опытные инструкторы</h3>
              <p className="text-gray-700 text-sm">Мастера спорта и профессиональные рыболовы с многолетним опытом</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black uppercase mb-2">Малые группы</h3>
              <p className="text-gray-700 text-sm">Индивидуальный подход к каждому ученику в группах до 8 человек</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black uppercase mb-2">Практический подход</h3>
              <p className="text-gray-700 text-sm">80% времени - практика на водоеме в реальных условиях</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-black uppercase mb-2">Сертификаты</h3>
              <p className="text-gray-700 text-sm">Официальные сертификаты о прохождении курсов</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-black uppercase mb-6">
            Готовы начать обучение?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Присоединяйтесь к нашему клубу и получите доступ к лучшим курсам рыбалки 
            в Приморском крае. Станьте настоящим мастером рыболовного дела!
          </p>
          <div className="flex justify-center">
            <Link
              to="/"
              onClick={scrollToTop}
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase"
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

export default TrainingPage;