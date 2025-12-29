import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Avatar: React.FC<{ src?: string; name: string; className?: string }> = ({ src, name, className = "" }) => {
    const [imageError, setImageError] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const colors = [
        'bg-red-100 text-red-600',
        'bg-green-100 text-green-600',
        'bg-blue-100 text-blue-600',
        'bg-yellow-100 text-yellow-600',
        'bg-purple-100 text-purple-600',
        'bg-pink-100 text-pink-600',
    ];

    const colorIndex = name.length % colors.length;

    if (!src || imageError) {
        return (
            <div className={`flex items-center justify-center font-bold ${colors[colorIndex]} ${className}`}>
                {getInitials(name)}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={name}
            className={`object-cover ${className}`}
            onError={() => setImageError(true)}
        />
    );
};

const Messages: React.FC = () => {
    const [activeConversationId, setActiveConversationId] = React.useState(1);
    const [inputText, setInputText] = React.useState('');
    const [messages, setMessages] = React.useState([
        { id: 1, text: 'Olá, bom dia! Vi a vaga de Vendedora Sênior e gostaria de me candidatar.', sender: 'other' },
        { id: 2, text: 'Tenho 5 anos de experiência em lojas de alto padrão.', sender: 'other' },
        { id: 3, text: 'Olá Mariana! Obrigado pelo interesse. Seu perfil parece ótimo.', sender: 'me' }
    ]);

    const conversations = [
        { id: 1, name: 'Mariana Costa', lastMsg: 'Olá, gostaria de saber mais sobre a vaga...', time: '10:30', active: activeConversationId === 1, avatar: 'https://picsum.photos/seed/mari/50' },
        { id: 2, name: 'Pedro Silva', lastMsg: 'Obrigado pela oportunidade!', time: 'Ontem', active: activeConversationId === 2, avatar: '' }, // Simulating no photo
        { id: 3, name: 'Ana Oliveira', lastMsg: 'Posso enviar meu portfólio?', time: 'Ontem', active: activeConversationId === 3, avatar: 'https://picsum.photos/seed/ana/50' },
    ];

    const activeConversation = conversations.find(c => c.active) || conversations[0];

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        setMessages([...messages, { id: Date.now(), text: inputText, sender: 'me' }]);
        setInputText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden animate-fade-in">
            {/* Sidebar List */}
            <div className="w-80 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden md:flex">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                        <Link to="/dashboard/lojista" className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
                            <span className="material-icons-round">arrow_back</span>
                        </Link>
                        <h2 className="font-bold text-gray-800 dark:text-white">Mensagens</h2>
                    </div>
                    <div className="relative">
                        <span className="material-icons-round absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
                        <input className="w-full bg-slate-100 dark:bg-slate-800 pl-10 pr-3 py-2 rounded-lg text-sm dark:text-white focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Buscar conversa..." />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(c => (
                        <div key={c.id} onClick={() => setActiveConversationId(c.id)} className={`p-4 flex gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${c.active ? 'bg-blue-50 dark:bg-slate-800/80 border-l-4 border-primary' : ''}`}>
                            <Avatar src={c.avatar} name={c.name} className="w-10 h-10 rounded-full" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className={`text-sm font-semibold truncate ${c.active ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>{c.name}</h3>
                                    <span className="text-xs text-slate-400">{c.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* active Chat */}
            <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
                {/* Chat Header */}
                <div className="p-4 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden">
                            <Link to="/dashboard/lojista/messages" className="text-slate-500"><span className="material-icons-round">arrow_back</span></Link>
                        </div>
                        <Avatar src={activeConversation.avatar} name={activeConversation.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-white">{activeConversation.name}</h3>
                            <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                            </p>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-primary"><span className="material-icons-round">more_vert</span></button>
                </div>

                {/* Messages Amount */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.map((msg, i) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`${msg.sender === 'me' ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'} p-3 rounded-2xl shadow-sm max-w-md text-sm animate-fade-in`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-700">
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-icons-round">attach_file</span></button>
                        <input
                            className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                            placeholder="Digite sua mensagem..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="bg-primary text-white p-2 rounded-lg hover:bg-opacity-90 transition-all shadow-sm" onClick={handleSendMessage}>
                            <span className="material-icons-round">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
