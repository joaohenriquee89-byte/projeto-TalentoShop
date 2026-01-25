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
    const [messages, setMessages] = React.useState<any[]>([]);

    const conversations: any[] = [];
    const activeConversation = conversations.find(c => c.active) || conversations[0];

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        setMessages([...messages, { id: Date.now(), text: inputText, sender: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setInputText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="h-[calc(100vh-12rem)] flex bg-white dark:bg-slate-900 rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden animate-fade-in">
            {conversations.length > 0 ? (
                <>
                    {/* Sidebar List */}
                    <div className="w-96 border-r border-slate-100 dark:border-white/5 flex flex-col hidden md:flex bg-slate-50/50 dark:bg-black/20">
                        <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">Mensagens</h2>
                            <div className="relative group">
                                <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">search</span>
                                <input className="w-full bg-slate-100 dark:bg-black/20 pl-12 pr-4 py-3.5 rounded-2xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/30" placeholder="Buscar nas conversas..." />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {conversations.map(c => (
                                <div
                                    key={c.id}
                                    onClick={() => setActiveConversationId(c.id)}
                                    className={`p-4 rounded-[1.5rem] flex gap-4 cursor-pointer transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg ${c.active ? 'bg-white dark:bg-slate-800 shadow-xl shadow-primary/5 ring-1 ring-primary/20' : ''}`}
                                >
                                    <div className="relative">
                                        <Avatar src={c.avatar} name={c.name} className="w-14 h-14 rounded-2xl" />
                                        {c.unread && <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-slate-800"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`text-base font-bold truncate ${c.active ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{c.name}</h3>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate font-medium">{c.lastMsg}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Chat */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
                        {/* Chat Header */}
                        <div className="p-6 md:p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 flex justify-between items-center z-10">
                            <div className="flex items-center gap-4">
                                <div className="md:hidden">
                                    <Link to="/dashboard/lojista/messages" className="text-slate-500 hover:text-primary transition-colors">
                                        <span className="material-icons-round">arrow_back</span>
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Avatar src={activeConversation?.avatar} name={activeConversation?.name || "Sem conversa"} className="w-12 h-12 rounded-2xl" />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{activeConversation?.name}</h3>
                                    <p className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                        Disponível Agora
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-primary transition-all flex items-center justify-center"><span className="material-icons-round text-lg">videocam</span></button>
                                <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-primary transition-all flex items-center justify-center"><span className="material-icons-round text-lg">call</span></button>
                                <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-primary transition-all flex items-center justify-center"><span className="material-icons-round text-lg">more_horiz</span></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-8 overflow-y-auto space-y-6 scrollbar-hide">
                            <div className="flex justify-center mb-8">
                                <span className="px-4 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest ring-1 ring-slate-200 dark:ring-white/5">
                                    Hoje, {new Date().toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })}
                                </span>
                            </div>

                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} group`}>
                                    <div className="flex flex-col gap-1.5 max-w-[75%] md:max-w-md">
                                        <div className={`${msg.sender === 'me' ? 'bg-primary text-white shadow-xl shadow-primary/20 font-medium' : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-white/5'} p-4 rounded-3xl ${msg.sender === 'me' ? 'rounded-tr-lg' : 'rounded-tl-lg'} text-sm leading-relaxed relative`}>
                                            {msg.text}
                                        </div>
                                        <span className={`text-[9px] font-black text-slate-400 uppercase tracking-widest mx-2 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                                            {msg.time || 'Entregue'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
                            <div className="bg-slate-50 dark:bg-black/20 p-2 rounded-[2rem] border border-slate-100 dark:border-white/5 flex gap-2 items-center focus-within:ring-4 focus-within:ring-primary/5 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all">
                                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"><span className="material-icons-round">sentiment_satisfied_alt</span></button>
                                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"><span className="material-icons-round">attach_file</span></button>
                                <input
                                    className="flex-1 bg-transparent px-2 py-3 text-sm focus:outline-none dark:text-white font-medium placeholder-slate-400"
                                    placeholder="Escreva sua mensagem profissional..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={!activeConversation}
                                />
                                <button
                                    className={`w-12 h-12 rounded-full ${inputText.trim() ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'bg-slate-200 dark:bg-white/5 text-slate-400'} transition-all flex items-center justify-center active:scale-90`}
                                    onClick={handleSendMessage}
                                    disabled={!activeConversation || !inputText.trim()}
                                >
                                    <span className="material-icons-round text-xl">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    <div className="relative mb-10">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="w-32 h-32 bg-slate-50 dark:bg-white/5 rounded-[3rem] flex items-center justify-center relative z-10 -rotate-6 group hover:rotate-0 transition-transform duration-500 ring-1 ring-border/50">
                            <span className="material-icons-round text-primary text-6xl">forum</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Sua caixa de entrada aguarda</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium leading-relaxed">
                        Inicie conversas com candidatos ou responda a dúvidas sobre suas vagas para acelerar seu recrutamento.
                    </p>
                    <Link to="/dashboard/lojista/candidates" className="mt-10 px-10 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black rounded-2xl shadow-2xl hover:-translate-y-1 transition-all active:scale-95 text-xs uppercase tracking-[0.2em]">
                        BUSCAR CANDIDATOS
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Messages;