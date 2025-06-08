import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';

interface Comment {
  id: string;
  text: string;
  authorName: string;
  authorId: string;
  createdAt: any;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const commentsData: Comment[] = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const commentData = docSnapshot.data();
        let authorName = commentData.authorName;
        
        // Если имя автора не сохранено или это email, получаем имя из профиля пользователя
        if (!authorName || authorName.includes('@')) {
          try {
            const userDoc = await getDoc(doc(db, 'users', commentData.authorId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              authorName = userData.name || 'Участник клуба';
            } else {
              authorName = 'Участник клуба';
            }
          } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
            authorName = 'Участник клуба';
          }
        }
        
        commentsData.push({ 
          id: docSnapshot.id, 
          ...commentData,
          authorName 
        } as Comment);
      }
      
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      // Получаем имя пользователя из базы данных
      let userName = 'Участник клуба';
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userName = userData.name || user.displayName || 'Участник клуба';
        } else {
          userName = user.displayName || 'Участник клуба';
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        userName = user.displayName || 'Участник клуба';
      }

      await addDoc(collection(db, 'comments'), {
        text: newComment.trim(),
        authorName: userName,
        authorId: user.uid,
        createdAt: new Date()
      });
      setNewComment('');
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string, authorId: string) => {
    if (!user || user.uid !== authorId) return;

    try {
      await deleteDoc(doc(db, 'comments', commentId));
    } catch (error) {
      console.error('Ошибка при удалении комментария:', error);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-black uppercase tracking-wide mb-4 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 mr-3" />
            Комментарии участников
          </h2>
          <div className="w-20 h-1 bg-black mx-auto"></div>
        </div>

        {user ? (
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Поделитесь своими впечатлениями о клубе:
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
                  rows={4}
                  placeholder="Напишите ваш комментарий..."
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Комментарий от: {user.displayName || 'Участник клуба'}
                </span>
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Отправка...' : 'Отправить'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 mb-8 text-center">
            <p className="text-gray-600 mb-4">
              Войдите в систему, чтобы оставить комментарий
            </p>
          </div>
        )}

        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Пока нет комментариев. Будьте первым!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-black">{comment.authorName}</h4>
                    <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                  </div>
                  {user && user.uid === comment.authorId && (
                    <button
                      onClick={() => handleDelete(comment.id, comment.authorId)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Удалить комментарий"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Comments;