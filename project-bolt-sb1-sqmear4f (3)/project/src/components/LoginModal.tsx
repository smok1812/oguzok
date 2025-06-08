import React from 'react';
import AuthModal from './AuthModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  return <AuthModal isOpen={isOpen} onClose={onClose} />;
};

export default LoginModal;