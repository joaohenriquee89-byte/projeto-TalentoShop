import React, { useState, useRef, useEffect } from 'react';

interface ComboboxProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    allowCustom?: boolean;
    customLabel?: string;
    className?: string;
}

const Combobox: React.FC<ComboboxProps> = ({
    options,
    value,
    onChange,
    placeholder,
    allowCustom = true,
    customLabel = "Não encontrei na lista",
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Reset search term to current value if no selection was made
                setSearchTerm(value);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value]);

    const handleSelect = (option: string) => {
        onChange(option);
        setSearchTerm(option);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (!isOpen) setIsOpen(true);
                        // If typing something that doesn't match and allowCustom is true, 
                        // we still update the value so the parent knows what's being typed
                        if (allowCustom) onChange(e.target.value);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white p-3 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none text-sm"
                />
                <span className="material-icons-round absolute right-3 top-3 text-slate-400 pointer-events-none transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                    expand_more
                </span>
            </div>

            {isOpen && (
                <div className="absolute z-[100] mt-2 w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 max-h-60 overflow-y-auto animate-fade-in">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(option)}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${value === option ? 'text-primary font-bold bg-blue-50/50 dark:bg-primary/10' : 'text-slate-600 dark:text-slate-300'}`}
                            >
                                {option}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-slate-400 flex flex-col gap-2">
                            <span>Nenhum shopping encontrado.</span>
                            {allowCustom && searchTerm && (
                                <button
                                    onClick={() => handleSelect(searchTerm)}
                                    className="text-primary font-bold hover:underline text-left flex items-center gap-1"
                                >
                                    <span className="material-icons-round text-xs">add</span>
                                    Usar "{searchTerm}"
                                </button>
                            )}
                        </div>
                    )}

                    {allowCustom && filteredOptions.length > 0 && !options.includes(searchTerm) && searchTerm && (
                        <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                            <button
                                onClick={() => handleSelect(searchTerm)}
                                className="w-full text-left px-4 py-2.5 text-sm text-primary font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                <span className="material-icons-round text-xs">add</span>
                                Usar "{searchTerm}"
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Combobox;
