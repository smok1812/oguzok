import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu, LogOut, CheckCircle, User } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import UserProfileModal from './UserProfileModal';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const handleJoinClick = () => {
    if (user) {
      setShowAlreadyRegistered(true);
      setTimeout(() => setShowAlreadyRegistered(false), 3000);
    } else {
      onLoginClick();
    }
  };

  const handleUserClick = () => {
    if (user) {
      setIsProfileModalOpen(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow-lg z-50 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="text-xl md:text-2xl font-bold text-black uppercase tracking-wide">
                Владивостокский Клев
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/"
                className="text-black font-medium hover:text-gray-600 transition-colors relative pb-1"
              >
                Главная
              </Link>
              <button
                onClick={() => scrollToSection('about')}
                className="text-black font-medium hover:text-gray-600 transition-colors relative pb-1"
              >
                О клубе
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="text-black font-medium hover:text-gray-600 transition-colors relative pb-1"
              >
                Наши услуги
              </button>
              <button
                onClick={() => scrollToSection('gallery')}
                className="text-black font-medium hover:text-gray-600 transition-colors relative pb-1"
              >
                Галерея
              </button>
              <button
                onClick={() => scrollToSection('comments')}
                className="text-black font-medium hover:text-gray-600 transition-colors relative pb-1"
              >
                Комментарии
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-black font-medium hover:text-gray-600 transition-colors relative pb-1"
              >
                Контакты
              </button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleUserClick}
                    className="text-sm text-gray-600 hover:text-black transition-colors flex items-center"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Привет, {user.displayName || user.email}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 text-white p-2 rounded-full hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300 border-2 border-gray-600"
                    title="Выйти"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleJoinClick}
                  className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300 border-2 border-gray-600"
                >
                  Присоединиться
                </button>
              )}
              
              <a
                href="https://chat.whatsapp.com/HAmz9HHB5t3L5wwp0ofFyf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 text-white p-2 rounded-full hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300 border-2 border-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.69"/>
                </svg>
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-black"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className="text-black font-medium text-left hover:text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Главная
                </Link>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-black font-medium text-left hover:text-gray-600"
                >
                  О клубе
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="text-black font-medium text-left hover:text-gray-600"
                >
                  Наши услуги
                </button>
                <button
                  onClick={() => scrollToSection('gallery')}
                  className="text-black font-medium text-left hover:text-gray-600"
                >
                  Галерея
                </button>
                <button
                  onClick={() => scrollToSection('comments')}
                  className="text-black font-medium text-left hover:text-gray-600"
                >
                  Комментарии
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-black font-medium text-left hover:text-gray-600"
                >
                  Контакты
                </button>
                
                {user ? (
                  <div className="space-y-2">
                    <button
                      onClick={handleUserClick}
                      className="text-sm text-gray-600 hover:text-black transition-colors flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Привет, {user.displayName || user.email}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300 border-2 border-gray-600 w-fit flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Выйти
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleJoinClick}
                    className="bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300 border-2 border-gray-600 w-fit"
                  >
                    Присоединиться
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

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
    </>
  );
};

export default Header;