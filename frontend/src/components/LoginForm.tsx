import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Usuário ou senha incorretos.');
      }
    } catch {
      setError('Erro ao tentar fazer login. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
 width="120" height="60" viewBox="0 0 1200.000000 403.000000"
 preserveAspectRatio="xMidYMid meet">

<g transform="translate(0.000000,403.000000) scale(0.100000,-0.100000)"
fill="#2563EB" stroke="none">
<path d="M1526 4008 c-16 -6 -66 -32 -112 -58 -45 -26 -329 -186 -630 -356
-774 -433 -728 -405 -753 -457 -20 -41 -21 -58 -21 -376 0 -428 -17 -388 236
-534 71 -41 249 -144 395 -229 145 -85 413 -240 594 -344 418 -239 375 -233
615 -93 90 53 169 104 175 113 7 11 7 21 -1 34 -9 15 -408 251 -1248 740 -121
70 -237 144 -258 166 -51 51 -74 127 -58 187 22 80 63 109 584 410 574 331
543 320 673 249 43 -24 163 -92 267 -152 104 -60 195 -112 202 -115 12 -4 14
37 14 242 0 194 3 245 13 239 9 -6 9 -5 -1 8 -6 8 -136 86 -287 173 -292 168
-327 181 -399 153z"/>
<path d="M6700 3729 c-75 -30 -151 -108 -175 -178 -22 -66 -17 -189 9 -239 68
-131 230 -203 391 -173 116 22 199 81 245 176 19 40 24 66 24 135 1 73 -3 92
-26 136 -31 60 -84 109 -147 138 -70 31 -246 34 -321 5z"/>
<path d="M5053 3479 c-173 -16 -321 -57 -454 -124 -200 -100 -339 -266 -389
-461 -24 -95 -27 -269 -5 -362 39 -166 148 -298 326 -396 112 -62 237 -103
533 -176 385 -95 484 -136 545 -225 48 -70 37 -177 -25 -245 -74 -82 -214
-122 -424 -121 -278 0 -570 85 -777 224 l-51 35 -96 -213 c-53 -117 -96 -217
-96 -223 0 -6 30 -29 67 -53 340 -215 924 -298 1352 -193 283 70 480 212 585
421 49 98 69 187 69 313 0 119 -18 200 -62 287 -110 219 -316 331 -816 447
-346 81 -450 120 -518 195 -67 74 -73 166 -17 255 36 56 101 99 195 129 61 19
92 22 245 22 236 -1 352 -28 582 -138 59 -28 109 -49 111 -46 15 19 175 435
169 440 -20 19 -198 100 -278 127 -224 75 -518 106 -771 81z"/>
<path d="M1490 2952 c-133 -72 -295 -170 -304 -185 -17 -26 2 -47 90 -98 43
-25 372 -216 729 -424 358 -208 665 -392 684 -409 44 -41 61 -83 61 -152 0
-84 -31 -131 -123 -187 -132 -82 -911 -530 -947 -545 -76 -32 -91 -25 -575
255 -861 498 -1028 593 -1052 600 -16 3 -28 1 -34 -8 -5 -8 -9 -105 -9 -217 0
-217 5 -248 51 -288 27 -24 1446 -839 1499 -862 75 -31 99 -21 507 208 700
395 1040 587 1064 604 14 9 35 33 47 55 21 38 22 47 22 380 0 371 0 369 -57
423 -15 14 -356 217 -758 449 -685 397 -733 423 -785 427 -46 3 -64 -1 -110
-26z"/>
<path d="M8610 2875 c-144 -31 -259 -85 -364 -171 l-66 -54 0 105 0 105 -265
0 -265 0 0 -960 0 -960 280 0 280 0 0 528 c0 490 1 534 19 605 25 97 52 148
108 208 85 91 210 135 363 127 139 -7 243 -66 295 -168 60 -118 59 -105 63
-727 l3 -573 275 0 275 0 -4 663 c-3 644 -4 664 -25 738 -78 273 -253 454
-507 524 -83 23 -375 30 -465 10z"/>
<path d="M10835 2876 c-221 -42 -400 -131 -544 -270 -132 -128 -219 -277 -263
-452 -32 -126 -32 -390 0 -509 30 -110 111 -270 181 -357 242 -301 683 -438
1120 -348 180 37 357 133 468 254 61 67 124 163 127 193 1 12 -54 47 -204 130
-113 62 -209 112 -215 113 -5 0 -22 -20 -38 -44 -89 -141 -259 -225 -432 -213
-188 13 -339 112 -414 271 -42 88 -55 158 -54 271 4 311 199 516 493 519 167
1 296 -63 396 -197 l48 -66 31 18 c16 10 112 62 213 116 100 53 182 101 182
107 0 15 -50 99 -98 161 -96 126 -283 242 -462 288 -108 27 -423 36 -535 15z"/>
<path d="M6570 1900 l0 -960 280 0 280 0 0 960 0 960 -280 0 -280 0 0 -960z"/>
</g>
</svg>

        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Login
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

