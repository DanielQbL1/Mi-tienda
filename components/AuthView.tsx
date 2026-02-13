
import React, { useState } from 'react';
import Icon from './Icon';
import { User, StoreSettings } from '../types';
import { useStore } from './StoreContext'; // Import context hook

interface AuthViewProps {
  onLogin: (user: User) => void;
  onClose: () => void;
  settings?: StoreSettings;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onClose, settings }) => {
  const { loginUser, registerUser, user } = useStore(); // Use global actions
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password || (isRegistering && !name)) {
        setError('Por favor, rellena todos los campos.');
        setIsLoading(false);
        return;
    }

    if (isRegistering && password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        setIsLoading(false);
        return;
    }

    try {
        let success = false;
        
        if (isRegistering) {
            success = await registerUser(name, email, password);
            if (!success) setError('Este correo ya está registrado o hubo un error.');
        } else {
            success = await loginUser(email, password);
            if (!success) setError('Credenciales incorrectas.');
        }

        if (success) {
            // El usuario ya se seteó en el contexto dentro de loginUser/registerUser
            // pero necesitamos notificar al App que el proceso terminó para cerrar el modal
            // Usamos un timeout corto para que se vea el spinner un momento
             setTimeout(() => {
                 // Recuperamos el usuario del contexto (aunque AuthView se desmontará, llamamos al prop)
                 // Como setUser es asíncrono en React batching, pasamos un objeto dummy para que App cierre el modal
                 // El App.tsx lee el user del context de todas formas.
                 onLogin({ id: 'temp', name: name || 'User', email, role: 'user', avatar: '', settings: {location:''} }); 
             }, 500);
        } else {
             setIsLoading(false);
        }
    } catch (err) {
        setError('Ocurrió un error inesperado.');
        setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-gray-300 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      
      <div className="bg-white w-full max-w-[400px] rounded-[2.5rem] p-8 shadow-2xl relative animate-slide-up overflow-hidden">
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors z-20"
        >
            <Icon name="X" size={20} className="text-gray-500" />
        </button>

        {/* Decorative Circles */}
        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-gray-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-48 h-48 bg-gray-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>

        <div className="relative z-10">
            <div className="text-center mb-8">
            
            {/* Logo Logic */}
            {settings?.logo ? (
                <div className="mb-6 flex justify-center">
                    <img 
                        src={settings.logo} 
                        alt={settings.name || "Logo"} 
                        className="h-16 w-auto object-contain drop-shadow-md"
                    />
                </div>
            ) : (
                <div 
                    className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-2xl mb-6 shadow-xl shadow-black/10"
                    style={{ backgroundColor: settings?.primaryColor || '#000' }}
                >
                    <span className="text-white font-black text-3xl select-none">
                        {settings?.name?.substring(0,1) || 'S'}
                    </span>
                </div>
            )}

            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
                {isRegistering ? 'Crear Cuenta' : 'Bienvenido de nuevo'}
            </h1>
            <p className="text-gray-500 text-xs">
                {isRegistering ? 'Únete a la comunidad exclusiva.' : 'Inicia sesión para ver tu colección.'}
            </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
            {isRegistering && (
                <div className="animate-slide-up">
                <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Nombre Completo</label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                    <Icon name="User" size={18} />
                    </div>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Pérez"
                    className={inputClass}
                    />
                </div>
                </div>
            )}

            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Correo Electrónico</label>
                <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                    <Icon name="Mail" size={18} />
                </div>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@ejemplo.com"
                    className={inputClass}
                />
                </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Contraseña</label>
                <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
                    <Icon name="Lock" size={18} />
                </div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClass}
                />
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl flex items-center gap-2 animate-shake">
                    <Icon name="AlertCircle" size={16} />
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white font-bold h-12 rounded-xl shadow-xl shadow-black/20 hover:bg-gray-900 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: settings?.primaryColor, color: settings?.secondaryColor }}
            >
                {isLoading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Procesando...
                    </>
                ) : (
                    <>
                        {isRegistering ? 'Crear Cuenta' : 'Entrar'}
                        <Icon name="ArrowRight" size={18} />
                    </>
                )}
            </button>
            </form>

            <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs font-medium">
                {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                <button
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError(null);
                }}
                className="text-black font-bold ml-1 hover:underline"
                style={{ color: settings?.primaryColor }}
                >
                {isRegistering ? 'Entrar' : 'Regístrate'}
                </button>
            </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
