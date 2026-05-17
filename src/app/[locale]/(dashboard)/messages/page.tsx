'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Smile, Image as ImageIcon, Paperclip, X, Download, Edit2, Trash2, Reply, Trash } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

interface Message {
  id: number;
  body: string;
  image?: string;
  file?: string;
  fileName?: string;
  createdAt: string;
  createdBy: number;
  replyTo?: number;
  seenBy: string;
  creator: { 
    fullName: string;
    avatar?: string;
  };
  replyToMessage?: {
    body: string;
    image?: string;
    creator: { fullName: string };
  };
}

const EMOJIS = ['😊', '👍', '❤️', '🎉', '🔥', '✅', '⚠️', '📌', '💡', '🚀', '👏', '🙏', '💪', '🎯', '📝', '📊', '💰', '🏆', '⭐', '✨'];

export default function MessagesPage() {
  const { data: session } = useSession();
  const { toasts, addToast, removeToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const [clearingChat, setClearingChat] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchMessages();
    // Har 500ms (0.5 soniya) da yangilash - juda tez!
    const interval = setInterval(fetchMessages, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
    markMessagesAsSeen();
  }, [messages]);

  // Tashqarida bosilganda menyuni yopish
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(null);
      setShowEmojiPicker(null);
    };
    
    if (showMenu !== null || showEmojiPicker !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenu, showEmojiPicker]);

  const markMessagesAsSeen = async () => {
    if (!session?.user?.id) return;
    
    const unseenMessages = messages.filter(msg => {
      const seenByIds = msg.seenBy ? msg.seenBy.split(',').filter(Boolean) : [];
      return msg.createdBy !== parseInt(session.user.id) && !seenByIds.includes(session.user.id);
    });

    for (const msg of unseenMessages) {
      try {
        await fetch(`/api/messages/${msg.id}/seen`, { method: 'PATCH' });
      } catch (error) {
        console.error('Error marking message as seen:', error);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 20 * 1024 * 1024) {
        console.error('Rasm hajmi 20MB dan oshmasligi kerak');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAttachmentFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        console.error('Fayl hajmi 20MB dan oshmasligi kerak');
        return;
      }
      setAttachmentFile(file);
      setImageFile(null);
      setImagePreview('');
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const removeAttachment = () => {
    setAttachmentFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if (!message.trim() && !imageFile && !attachmentFile) return;

    setSending(true);
    try {
      let imageUrl = '';
      let fileUrl = '';
      let fileName = '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        
        if (!uploadRes.ok) {
          console.error('Rasm yuklashda xatolik');
          setSending(false);
          return;
        }
        
        const { url } = await uploadRes.json();
        imageUrl = url;
      }

      if (attachmentFile) {
        const formData = new FormData();
        formData.append('file', attachmentFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        
        if (!uploadRes.ok) {
          console.error('Fayl yuklashda xatolik');
          setSending(false);
          return;
        }
        
        const { url } = await uploadRes.json();
        fileUrl = url;
        fileName = attachmentFile.name;
      }

      const url = editingId ? `/api/messages/${editingId}` : '/api/messages';
      const method = editingId ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: message || '',
          image: imageUrl || undefined,
          file: fileUrl || undefined,
          fileName: fileName || undefined,
          replyTo: replyingTo?.id || undefined,
        }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        
        // Darhol xabarni qo'shish
        if (editingId) {
          setMessages(prev => prev.map(m => m.id === editingId ? newMessage : m));
        } else {
          setMessages(prev => [...prev, newMessage]);
        }
        
        setMessage('');
        removeImage();
        removeAttachment();
        setShowEmoji(false);
        setEditingId(null);
        setReplyingTo(null);
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Xabar yuborishda xatolik:', error);
    } finally {
      setSending(false);
    }
  };

  const handleEdit = (msg: Message) => {
    setMessage(msg.body);
    setEditingId(msg.id);
    setShowMenu(null);
    textareaRef.current?.focus();
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMessages(); // Darhol yangilash
        addToast('Xabar o\'chirildi', 'success');
      } else {
        addToast('Xatolik yuz berdi', 'error');
      }
    } catch (error) {
      console.error('Xabarni o\'chirishda xatolik:', error);
      addToast('Xatolik yuz berdi', 'error');
    }
    setShowMenu(null);
  };

  const handleReply = (msg: Message) => {
    setReplyingTo(msg);
    setShowMenu(null);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  const addEmojiToMessage = async (msgId: number, emoji: string) => {
    try {
      const msg = messages.find(m => m.id === msgId);
      if (!msg) return;
      
      const newBody = msg.body + ' ' + emoji;
      const res = await fetch(`/api/messages/${msgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newBody }),
      });

      if (res.ok) {
        await fetchMessages();
        setShowEmojiPicker(null);
      }
    } catch (error) {
      console.error('Emoji qo\'shishda xatolik:', error);
    }
  };

  const handleClearChat = async () => {
    setClearingChat(true);
    try {
      const res = await fetch('/api/messages', { method: 'DELETE' });
      if (res.ok) {
        fetchMessages(); // Darhol yangilash
        addToast('Chat tozalandi', 'success');
      } else {
        addToast('Xatolik yuz berdi', 'error');
      }
    } catch (error) {
      console.error('Xabarlarni o\'chirishda xatolik:', error);
      addToast('Xatolik yuz berdi', 'error');
    } finally {
      setClearingChat(false);
    }
  };

  const isMyMessage = (msg: Message) => msg.createdBy === parseInt(session?.user?.id || '0');

  const isMessageSeen = (msg: Message) => {
    if (!msg.seenBy) return false;
    const seenByIds = msg.seenBy.split(',').filter(Boolean);
    return seenByIds.length > 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-50 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Xabarlar</h1>
            <p className="text-sm text-gray-500 mt-1">{messages.length} ta xabar</p>
          </div>
          <button
            onClick={handleClearChat}
            disabled={clearingChat || messages.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash size={18} />
            <span className="text-sm font-medium">Chatni tozalash</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Send size={48} className="mb-4 opacity-30" />
            <p className="text-lg">Hali xabar yo'q</p>
            <p className="text-sm">Birinchi xabarni yuboring!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = isMyMessage(msg);
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex gap-3 max-w-[70%] ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isMine && (
                    <div className="flex-shrink-0">
                      {msg.creator.avatar ? (
                        <img
                          src={msg.creator.avatar}
                          alt={msg.creator.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {msg.creator.fullName[0]}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col">
                    {!isMine && (
                      <span className="text-xs text-gray-500 mb-1 px-3">{msg.creator.fullName}</span>
                    )}
                    
                    <div className="relative">
                      {/* Xabarga bosilganda menyu ochiladi */}
                      <div
                        onClick={(e) => {
                          // Menyu joylashuvini aniqlash
                          const rect = e.currentTarget.getBoundingClientRect();
                          const windowHeight = window.innerHeight;
                          const spaceBelow = windowHeight - rect.bottom;
                          const spaceAbove = rect.top;
                          
                          // Agar pastda joy kam bo'lsa, tepaga ochilsin
                          if (spaceBelow < 200 && spaceAbove > spaceBelow) {
                            setMenuPosition('top');
                          } else {
                            setMenuPosition('bottom');
                          }
                          
                          setShowMenu(showMenu === msg.id ? null : msg.id);
                        }}
                        className={`cursor-pointer rounded-2xl px-4 py-3 shadow-sm ${
                          isMine
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-white text-gray-900 rounded-tl-sm border border-gray-200'
                        }`}
                      >
                        {/* Reply Preview */}
                        {msg.replyToMessage && (
                          <div className={`mb-2 p-2 rounded-lg border-l-2 ${
                            isMine ? 'bg-blue-700 border-blue-400' : 'bg-gray-100 border-gray-400'
                          }`}>
                            <p className={`text-xs font-semibold ${isMine ? 'text-blue-200' : 'text-gray-600'}`}>
                              {msg.replyToMessage.creator.fullName}
                            </p>
                            <p className={`text-xs ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                              {msg.replyToMessage.body ? msg.replyToMessage.body.substring(0, 50) + '...' : '[Rasm]'}
                            </p>
                          </div>
                        )}

                        {/* Image */}
                        {msg.image && (
                          <div className="mb-2" onClick={(e) => e.stopPropagation()}>
                            <img
                              src={msg.image}
                              alt="Rasm"
                              className="rounded-lg w-full max-h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => window.open(msg.image, '_blank')}
                            />
                          </div>
                        )}

                        {/* File */}
                        {msg.file && (
                          <a
                            href={msg.file}
                            download={msg.fileName}
                            onClick={(e) => e.stopPropagation()}
                            className={`flex items-center gap-2 p-3 rounded-lg mb-2 ${
                              isMine ? 'bg-blue-700' : 'bg-gray-100'
                            } hover:opacity-80 transition-opacity`}
                          >
                            <Paperclip size={18} />
                            <span className="text-sm font-medium flex-1 truncate">
                              {msg.fileName || 'Fayl'}
                            </span>
                            <Download size={16} />
                          </a>
                        )}

                        {/* Text */}
                        {msg.body && (
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.body}</p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatDateTime(msg.createdAt)}
                          </p>
                          
                          {isMine && (
                            <div className="flex items-center gap-1 ml-2">
                              {isMessageSeen(msg) ? (
                                <div className="flex">
                                  <span className="text-blue-200 text-lg">✓</span>
                                  <span className="text-blue-200 text-lg -ml-2">✓</span>
                                </div>
                              ) : (
                                <span className="text-blue-300 text-lg">✓</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Menyu dropdown */}
                      {showMenu === msg.id && (
                        <div 
                          className={`absolute ${isMine ? 'right-0' : 'left-0'} ${
                            menuPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                          } bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30 w-44`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Menyu joylashuvini aniqlash
                              const rect = e.currentTarget.closest('.relative')?.getBoundingClientRect();
                              if (rect) {
                                const windowHeight = window.innerHeight;
                                const spaceBelow = windowHeight - rect.bottom;
                                const spaceAbove = rect.top;
                                
                                if (spaceBelow < 250 && spaceAbove > spaceBelow) {
                                  setMenuPosition('top');
                                } else {
                                  setMenuPosition('bottom');
                                }
                              }
                              
                              setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id);
                              setShowMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Smile size={14} /> Emoji qo'shish
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReply(msg);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Reply size={14} /> Javob berish
                          </button>
                          
                          {isMine && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(msg);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Edit2 size={14} /> Tahrirlash
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(msg.id);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                              >
                                <Trash2 size={14} /> O'chirish
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {/* Emoji picker */}
                      {showEmojiPicker === msg.id && (
                        <div 
                          className={`absolute ${isMine ? 'right-0' : 'left-0'} ${
                            menuPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                          } bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-30`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-gray-700">Emoji tanlang</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowEmojiPicker(null);
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-8 gap-1">
                            {EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addEmojiToMessage(msg.id, emoji);
                                }}
                                className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        {replyingTo && (
          <div className="mb-3 p-3 bg-blue-50 rounded-lg flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-blue-700">
                Javob: {replyingTo.creator.fullName}
              </p>
              <p className="text-sm text-gray-600">{replyingTo.body.substring(0, 50)}...</p>
            </div>
            <button onClick={() => setReplyingTo(null)} className="text-gray-500 hover:text-gray-700">
              <X size={16} />
            </button>
          </div>
        )}

        {editingId && (
          <div className="mb-3 p-2 bg-yellow-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-yellow-700">Tahrirlash rejimi</span>
            <button onClick={() => setEditingId(null)} className="text-yellow-700 hover:text-yellow-900">
              <X size={16} />
            </button>
          </div>
        )}

        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-20 rounded-lg border-2 border-blue-500" />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {attachmentFile && (
          <div className="mb-3 inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
            <Paperclip size={16} className="text-gray-600" />
            <span className="text-sm text-gray-700">{attachmentFile.name}</span>
            <button
              onClick={removeAttachment}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {showEmoji && (
          <div className="mb-3 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
            <div className="grid grid-cols-10 gap-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
            type="button"
          >
            <Smile size={22} />
          </button>

          <button
            onClick={() => imageInputRef.current?.click()}
            className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
            type="button"
          >
            <ImageIcon size={22} />
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
            type="button"
          >
            <Paperclip size={22} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Xabar yozing..."
            rows={1}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />

          <button
            onClick={handleSend}
            disabled={sending || (!message.trim() && !imageFile && !attachmentFile)}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 ml-2"
            type="button"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <Send size={22} />
            )}
          </button>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
