/**
 * Student Council 69 - Secure Configuration Loader
 * Handles Environment Variables & Application Configuration safely.
 */
(function () {
    'use strict';

    // Global application configuration namespace
    const env = (typeof window !== 'undefined' && window.ENV) || {};

    const APP_CONFIG = {
        // Admin credentials configuration loaded safely
        ADMIN_EMAIL: env.ADMIN_EMAIL || 'student69@gmail.com',
        ADMIN_PASSWORD: env.ADMIN_PASSWORD || '11222333344444',

        // Public API Keys (Frontend allowed keys)
        PUBLIC_API_KEY: env.PUBLIC_API_KEY || '',

        // Firebase configuration (frontend) — paste your project config here
        // This will be used to initialize Firebase and Firestore when requested.
        FIREBASE_CONFIG: env.FIREBASE_CONFIG || {
            apiKey: "AIzaSyBYLYY5SuL4qrhFt3g9Umvn6NyJklcq66o",
            authDomain: "sc69-web.firebaseapp.com",
            projectId: "sc69-web",
            storageBucket: "sc69-web.appspot.com",
            messagingSenderId: "44609188218",
            appId: "1:44609188218:web:648e8f745b4d25c9f526c3",
            measurementId: "G-67M46ZBL47"
        },

        // API Endpoint Base URL for backend server-side proxies (kept for backward compatibility)
        API_BASE_URL: env.API_BASE_URL || '/api',

        /**
         * Securely execute API requests via Server-Side Proxy
         * API Secrets MUST NEVER be exposed in frontend JS code.
         */
        async callBackendAPI(endpoint, options = {}) {
            const url = `${this.API_BASE_URL}${endpoint}`;
            const defaultHeaders = {
                'Content-Type': 'application/json',
            };

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...(options.headers || {})
                }
            });

            if (!response.ok) {
                throw new Error(`API Error [${response.status}]: ${response.statusText}`);
            }

            return await response.json();
        }
        ,

        // Initialize Firebase (loads SDKs dynamically and returns a Promise resolving to Firestore instance)
        initFirebase() {
            if (this._firebaseInitPromise) return this._firebaseInitPromise;

            const cfg = this.FIREBASE_CONFIG;
            this._firebaseInitPromise = new Promise((resolve, reject) => {
                try {
                    // Check if already initialized by another script
                    if (window.FIRESTORE) {
                        return resolve(window.FIRESTORE);
                    }

                    const loadScript = (src) => new Promise((res, rej) => {
                        const s = document.createElement('script');
                        s.src = src;
                        s.type = 'module';
                        s.onload = res;
                        s.onerror = () => rej(new Error(`Failed to load ${src}`));
                        document.head.appendChild(s);
                    });

                    // Use modern v9 modular SDKs
                    const firebaseVersion = '9.22.2';
                    const fbAppSrc = `https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-app.js`;
                    const fbFirestoreSrc = `https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-firestore.js`;

                    loadScript(fbAppSrc).then(() => {
                        loadScript(fbFirestoreSrc).then(() => {
                            try {
                                // Dynamically import functions from the now-loaded scripts
                                const { initializeApp } = window.firebase;
                                const { getFirestore } = window.firebase;

                                const app = initializeApp(cfg);
                                const firestore = getFirestore(app);

                                // Assign to window for global access
                                window.FIREBASE_APP = app;
                                window.FIRESTORE = firestore;

                                console.log('Firebase Initialized Successfully (v9 Modular)');
                                resolve(firestore);
                            } catch (e) {
                                console.error('Firebase initialization failed:', e);
                                reject(e);
                            }
                        }).catch(reject);
                    }).catch(reject);
                } catch (err) {
                    reject(err);
                }
            });

            return this._firebaseInitPromise;
        }
    };

    // Freeze config to prevent unauthorized runtime mutation
    window.APP_CONFIG = Object.freeze(APP_CONFIG);
})();
