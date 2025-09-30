import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function BookReadingTracker() {
  const [books, setBooks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [expandedBook, setExpandedBook] = useState(null);
  const [currentBook, setCurrentBook] = useState({
    title: '',
    image: '',
    quotes: []
  });
  const [currentQuote, setCurrentQuote] = useState({ text: '', page: '' });

  const addBook = () => {
    if (!currentBook.title.trim()) {
      alert('책 제목을 입력해주세요!');
      return;
    }
    setBooks([...books, { ...currentBook, id: Date.now() }]);
    setCurrentBook({ title: '', image: '', quotes: [] });
    setCurrentQuote({ text: '', page: '' });
    setShowAddForm(false);
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
    if (expandedBook === id) setExpandedBook(null);
  };

  const addQuoteToCurrentBook = () => {
    if (currentQuote.text.trim()) {
      setCurrentBook({
        ...currentBook,
        quotes: [...currentBook.quotes, { ...currentQuote, id: Date.now() }]
      });
      setCurrentQuote({ text: '', page: '' });
    }
  };

  const deleteQuote = (bookId, quoteId) => {
    setBooks(books.map(book =>
      book.id === bookId
        ? { ...book, quotes: book.quotes.filter(q => q.id !== quoteId) }
        : book
    ));
  };

  const startEditQuote = (bookId, quote) => {
    setEditingQuote({ bookId, quoteId: quote.id, text: quote.text, page: quote.page });
  };

  const saveEditQuote = () => {
    setBooks(books.map(book =>
      book.id === editingQuote.bookId
        ? {
            ...book,
            quotes: book.quotes.map(q =>
              q.id === editingQuote.quoteId
                ? { ...q, text: editingQuote.text, page: editingQuote.page }
                : q
            )
          }
        : book
    ));
    setEditingQuote(null);
  };

  const toggleBook = (bookId) => {
    setExpandedBook(expandedBook === bookId ? null : bookId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookOpen className="w-10 h-10 text-amber-700" />
            <h1 className="text-4xl font-bold text-amber-900">독서 기록 노트</h1>
          </div>
          <p className="text-amber-700">읽은 책과 인상적인 문구를 기록하세요</p>
        </div>

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="mb-6 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition flex items-center gap-2 mx-auto shadow-lg"
          >
            <Plus className="w-5 h-5" />
            새 책 추가하기
          </button>
        )}

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-xl p-6 mb-8 border-2 border-amber-200">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">새 책 추가</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">책 제목</label>
                <input
                  type="text"
                  value={currentBook.title}
                  onChange={(e) => setCurrentBook({ ...currentBook, title: e.target.value })}
                  placeholder="예: 어린왕자"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">책 이미지 URL</label>
                <input
                  type="text"
                  value={currentBook.image}
                  onChange={(e) => setCurrentBook({ ...currentBook, image: e.target.value })}
                  placeholder="이미지 URL을 입력하세요"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>

              {currentBook.image && (
                <img src={currentBook.image} alt="미리보기" className="w-32 h-auto rounded-lg shadow-md" />
              )}
            </div>

            <div className="border-t-2 border-gray-200 pt-4">
              <h3 className="text-lg font-bold text-amber-800 mb-3">인상적인 문구 추가</h3>
              <div className="space-y-3 mb-4">
                <textarea
                  value={currentQuote.text}
                  onChange={(e) => setCurrentQuote({ ...currentQuote, text: e.target.value })}
                  placeholder="인상적인 문구를 입력하세요"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none h-24 resize-none"
                />
                <input
                  type="text"
                  value={currentQuote.page}
                  onChange={(e) => setCurrentQuote({ ...currentQuote, page: e.target.value })}
                  placeholder="페이지 (예: 42)"
                  className="w-32 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                />
                <button
                  onClick={addQuoteToCurrentBook}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
                >
                  문구 추가
                </button>
              </div>

              {currentBook.quotes.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h4 className="font-semibold text-gray-700">추가된 문구들:</h4>
                  {currentBook.quotes.map((quote) => (
                    <div key={quote.id} className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <p className="text-gray-800 italic">"{quote.text}"</p>
                      {quote.page && <p className="text-sm text-amber-700 mt-1">- p.{quote.page}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={addBook}
                className="flex-1 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition font-semibold"
              >
                책 저장하기
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setCurrentBook({ title: '', image: '', quotes: [] });
                  setCurrentQuote({ text: '', page: '' });
                }}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                취소
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="group">
              <div
                onClick={() => toggleBook(book.id)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer transform hover:scale-105"
              >
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-amber-700" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-amber-900 text-center line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-amber-600 text-center mt-1">
                    {book.quotes.length}개의 문구
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {expandedBook && books.find(b => b.id === expandedBook) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setExpandedBook(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const book = books.find(b => b.id === expandedBook);
                return (
                  <>
                    <div className="sticky top-0 bg-white border-b-2 border-amber-200 p-6 flex justify-between items-start">
                      <div className="flex gap-4 items-start flex-1">
                        {book.image && (
                          <img src={book.image} alt={book.title} className="w-24 h-32 object-cover rounded-lg shadow-md" />
                        )}
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-amber-900">{book.title}</h2>
                          <p className="text-amber-600 mt-1">{book.quotes.length}개의 인상적인 문구</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="text-red-500 hover:text-red-700 transition p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setExpandedBook(null)}
                          className="text-gray-500 hover:text-gray-700 transition p-2"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      {book.quotes.length > 0 ? (
                        <div className="space-y-4">
                          {book.quotes.map((quote) => (
                            <div key={quote.id} className="bg-amber-50 p-5 rounded-lg border-2 border-amber-200">
                              {editingQuote?.quoteId === quote.id ? (
                                <div className="space-y-3">
                                  <textarea
                                    value={editingQuote.text}
                                    onChange={(e) => setEditingQuote({ ...editingQuote, text: e.target.value })}
                                    className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg text-sm focus:border-amber-500 focus:outline-none h-24"
                                  />
                                  <input
                                    type="text"
                                    value={editingQuote.page}
                                    onChange={(e) => setEditingQuote({ ...editingQuote, page: e.target.value })}
                                    className="w-24 px-3 py-2 border-2 border-amber-300 rounded-lg text-sm focus:border-amber-500 focus:outline-none"
                                    placeholder="페이지"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={saveEditQuote}
                                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                                    >
                                      <Check className="w-4 h-4" />
                                      저장
                                    </button>
                                    <button
                                      onClick={() => setEditingQuote(null)}
                                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition flex items-center gap-2"
                                    >
                                      <X className="w-4 h-4" />
                                      취소
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-gray-800 italic text-base leading-relaxed">"{quote.text}"</p>
                                  <div className="flex justify-between items-center mt-3">
                                    {quote.page && <p className="text-sm text-amber-700 font-semibold">p.{quote.page}</p>}
                                    <div className="flex gap-2 ml-auto">
                                      <button
                                        onClick={() => startEditQuote(book.id, quote)}
                                        className="text-amber-600 hover:text-amber-800 p-2 hover:bg-amber-100 rounded transition"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => deleteQuote(book.id, quote.id)}
                                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded transition"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 text-amber-300 mx-auto mb-3" />
                          <p className="text-gray-500 italic">아직 추가된 문구가 없습니다</p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {books.length === 0 && !showAddForm && (
          <div className="text-center py-16">
            <BookOpen className="w-20 h-20 text-amber-300 mx-auto mb-4" />
            <p className="text-amber-700 text-lg">아직 기록된 책이 없습니다</p>
            <p className="text-amber-600 text-sm">첫 번째 책을 추가해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
