/* ============================
   JavaScript - Student Council BD2 (Updated for Clean & Flat Design)
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // =====================
    // Single Page View Navigation
    // =====================
    const navbar = document.getElementById('navbar');
    const pageSections = document.querySelectorAll('section.page-section');
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    const backToTop = document.getElementById('backToTop');

    function switchPage(targetPageId) {
        if (!targetPageId) targetPageId = 'home';

        // Clean up hash string (e.g., "#exams" -> "exams")
        targetPageId = targetPageId.replace(/^#/, '');

        // If target is news or home, set main target page view to home
        let mainTarget = targetPageId;
        if (mainTarget === 'news') {
            mainTarget = 'home';
        }

        // Validate if target section exists
        const targetSection = document.getElementById(mainTarget);
        if (!targetSection && mainTarget !== 'home') {
            mainTarget = 'home';
        }

        // Hide all sections, show active section(s)
        pageSections.forEach(sec => {
            sec.classList.remove('active-page');
        });

        if (mainTarget === 'home') {
            const homeSec = document.getElementById('home');
            const newsSec = document.getElementById('news');
            if (homeSec) homeSec.classList.add('active-page');
            if (newsSec) newsSec.classList.add('active-page');
        } else {
            const activeSec = document.getElementById(mainTarget);
            if (activeSec) activeSec.classList.add('active-page');
        }

        // Update Nav Links active state
        navLinks.forEach(link => {
            const sectionAttr = link.getAttribute('data-section');
            const hrefAttr = link.getAttribute('href');
            if (sectionAttr === mainTarget || (hrefAttr && hrefAttr === '#' + mainTarget)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Immediately trigger AOS animations for elements in active page
        document.querySelectorAll('.active-page [data-aos]').forEach(el => {
            el.classList.add('aos-animate');
        });

        // Scroll position management
        if (targetPageId === 'news' && document.getElementById('news')) {
            document.getElementById('news').scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }

    // Navbar Scrolled & Back to top status
    function handleScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 400) {
            if (backToTop) backToTop.classList.add('visible');
        } else {
            if (backToTop) backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Back to top
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Handle hash change & anchor clicks
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (hash) {
            switchPage(hash);
        }
    });

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            const href = link.getAttribute('href');
            if (href && href.length > 1) {
                e.preventDefault();
                const targetId = href.replace(/^#/, '');
                window.location.hash = targetId;
                switchPage(targetId);
            }
        }
    });

    // Initial page activation on load
    const initialHash = window.location.hash ? window.location.hash.replace(/^#/, '') : 'home';
    switchPage(initialHash);


    // =====================
    // Mobile Menu
    // =====================
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');
    const mobileOverlay = document.getElementById('mobileOverlay');

    function toggleMenu() {
        navToggle.classList.toggle('active');
        navLinksEl.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navLinksEl.classList.contains('active') ? 'hidden' : '';
    }

    if (navToggle && mobileOverlay) {
        navToggle.addEventListener('click', toggleMenu);
        mobileOverlay.addEventListener('click', toggleMenu);
    }

    if (navLinksEl) {
        navLinksEl.querySelectorAll('.nav-link').forEach(link => {
            // If it's a dropdown toggle in mobile, we might want to toggle the dropdown
            if (link.classList.contains('dropdown-toggle')) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        link.parentElement.classList.toggle('active');
                    }
                });
            } else {
                link.addEventListener('click', () => {
                    if (navLinksEl.classList.contains('active')) {
                        toggleMenu();
                    }
                });
            }
        });
    }

    // =====================
    // Scroll Animations (AOS-like)
    // =====================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

    // =====================
    // Counter Animation
    // =====================
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let statAnimated = false;

    function animateCounters() {
        if (statAnimated) return;
        statAnimated = true;

        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out quad
                const easeOut = 1 - (1 - progress) * (1 - progress);
                const current = Math.floor(easeOut * target);
                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);

    // =====================
    // Data Handling (Firestore & Local)
    // =====================
    const firestoreHandler = {
        db: null,
        async init() {
            if (this.db) return this.db;
            if (!window.APP_CONFIG || typeof window.APP_CONFIG.initFirebase !== 'function') {
                console.error("Firebase config is not available.");
                return null;
            }
            try {
                this.db = await window.APP_CONFIG.initFirebase();
                if (!window.db) window.db = this.db;
                console.log("Firestore initialized for main script.");
                this.attachAllListeners();
                return this.db;
            } catch (error) {
                console.error("Main script Firestore initialization failed:", error);
                return null;
            }
        },

        attachAllListeners() {
            if (!this.db) return;
            const { collection, orderBy, query, onSnapshot } = window.firebase;

            // Sync Exams
            const examsQuery = query(collection(this.db, 'exams'), orderBy('createdAt', 'desc'));
            onSnapshot(examsQuery, (snapshot) => {
                const exams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                renderExams(exams);
            }, (error) => console.error("Error fetching exams:", error));

            // Sync News
            const newsQuery = query(collection(this.db, 'news'), orderBy('createdAt', 'desc'));
            onSnapshot(newsQuery, (snapshot) => {
                const news = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if(window.renderNews) window.renderNews(news);
            }, (error) => console.error("Error fetching news:", error));

            // Sync Events
            const eventsQuery = query(collection(this.db, 'events'), orderBy('eventDate', 'asc'));
            onSnapshot(eventsQuery, (snapshot) => {
                const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                 if(window.renderEvents) window.renderEvents(events);
            }, (error) => console.error("Error fetching events:", error));
        },

        async saveReport(reportData) {
            if (!this.db) {
                console.error("Firestore is not initialized. Cannot save report.");
                return;
            }
            const { collection, addDoc, serverTimestamp } = window.firebase;
            try {
                await addDoc(collection(this.db, "reports"), {
                    ...reportData,
                    createdAt: serverTimestamp()
                });
                console.log("Report saved to Firestore.");
            } catch (error) {
                console.error("Error saving report to Firestore: ", error);
            }
        }
    };

    // Initialize Firestore
    firestoreHandler.init();


    // =====================
    // Exam Data & Rendering (Table List + Dropdown)
    // =====================
    const subjectMapping = {
        'math_basic': 'คณิตศาสตร์พื้นฐาน',
        'math_add': 'คณิตศาสตร์เพิ่มเติม',
        'science': 'วิทยาศาสตร์ฯ',
        'sci_physics': 'ฟิสิกส์',
        'sci_chem': 'เคมี',
        'sci_bio': 'ชีววิทยา',
        'sci_astro': 'ดาราศาสตร์',
        'thai': 'ภาษาไทย',
        'foreign': 'ภาษาต่างประเทศ',
        'social': 'สังคมศึกษาฯ'
    };

    const subjectBaseClass = {
        'math_basic': 'math',
        'math_add': 'math',
        'science': 'science',
        'sci_physics': 'science',
        'sci_chem': 'science',
        'sci_bio': 'science',
        'sci_astro': 'science',
        'thai': 'thai',
        'foreign': 'foreign',
        'social': 'social'
    };

    let activeGrade = 'all';
    let activeSubject = 'all';
    let allExamsCache = []; // Cache for exams from Firestore

    function renderExams(allExams) {
        allExamsCache = allExams || [];
        const tableBody = document.getElementById('examTableBody');
        const examTableWrapper = document.getElementById('examTableWrapper');
        const emptyState = document.getElementById('examEmpty');
        const countEl = document.getElementById('examCount');

        const filtered = allExamsCache.filter(exam => {
            const gradeMatch = activeGrade === 'all' || exam.grade === activeGrade;
            const subjectMatch = activeSubject === 'all' || exam.subject === activeSubject;
            return gradeMatch && subjectMatch;
        });

        if (filtered.length === 0) {
            if (examTableWrapper) examTableWrapper.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            if (countEl) countEl.textContent = 'ไม่พบข้อสอบ';
            return;
        }

        if (examTableWrapper) examTableWrapper.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';
        if (countEl) countEl.textContent = `พบข้อสอบที่ตรงตามเงื่อนไข ทั้งหมด ${filtered.length} รายการ`;

        if (tableBody) {
            tableBody.innerHTML = filtered.map((exam, index) => {
                const driveUrl = exam.driveLink || (exam.pdfLink && exam.pdfLink.startsWith('http') ? exam.pdfLink : '');
                
                let actionButtons = [];

                if (driveUrl) {
                    actionButtons.push(`
                        <a href="${escapeHtmlAttr(driveUrl.trim())}" target="_blank" rel="noopener noreferrer" class="btn-download btn-drive-link">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            Google Drive
                        </a>
                    `);
                } else {
                     actionButtons.push(`
                        <button class="btn-download btn-disabled">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            ไม่มีลิงก์
                        </button>
                    `);
                }


                return `
                <tr>
                    <td class="text-center">${index + 1}</td>
                    <td><strong>${escapeHtmlText(exam.title)}</strong></td>
                    <td class="text-center"><span class="badge badge-grade">${escapeHtmlText(exam.grade)}</span></td>
                    <td><span class="badge badge-subject badge-${subjectBaseClass[exam.subject] || exam.subject}">${subjectMapping[exam.subject] || escapeHtmlText(exam.subject)}</span></td>
                    <td class="text-center">${escapeHtmlText(exam.term || 'กลางภาค')}</td>
                    <td class="text-center"><div class="download-btns-flex">${actionButtons.join('')}</div></td>
                </tr>
                `;
            }).join('');
        }
    }

    // Helper functions
    function escapeHtmlText(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeHtmlAttr(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Filter Change Handlers
    const gradeSelect = document.getElementById('gradeSelectFilter');
    const subjectSelect = document.getElementById('subjectSelectFilter');

    if (gradeSelect) {
        gradeSelect.addEventListener('change', (e) => {
            activeGrade = e.target.value;
            renderExams(allExamsCache); // Re-render with cached data
        });
    }

    if (subjectSelect) {
        subjectSelect.addEventListener('change', (e) => {
            activeSubject = e.target.value;
            renderExams(allExamsCache); // Re-render with cached data
        });
    }

    // Initial render with empty state
    renderExams([]);

    // =====================
    // Contact Form
    // =====================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const isAnonymous = document.getElementById('contactAnonymous')?.checked || false;
            const reportData = {
                name: isAnonymous ? 'ไม่ระบุตัวตน (Anonymous)' : document.getElementById('contactName')?.value || 'ไม่ระบุตัวตน',
                classRoom: isAnonymous ? '-' : document.getElementById('contactClass')?.value || '',
                type: document.getElementById('contactType')?.value || 'other',
                subject: document.getElementById('contactSubject')?.value || '',
                message: document.getElementById('contactMessage')?.value || '',
                anonymous: isAnonymous,
                status: 'new',
                date: new Date().toISOString(),
            };

            // Show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="50" stroke-dashoffset="20"/>
                </svg>
                <span>กำลังส่ง...</span>
            `;
            submitBtn.style.opacity = '0.7';

            // Save to Firestore
            firestoreHandler.saveReport(reportData).then(() => {
                // UI feedback on success
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    <span>ส่งข้อความ</span>
                `;
                submitBtn.style.opacity = '1';

                // Show success modal
                document.getElementById('successModal').classList.add('active');
                contactForm.reset();
                // Manually reset anonymous fields if they were disabled
                const nameInput = document.getElementById('contactName');
                const classInput = document.getElementById('contactClass');
                if (nameInput.disabled) {
                    nameInput.disabled = false;
                    nameInput.placeholder = 'กรอกชื่อ-นามสกุล';
                    nameInput.required = true;
                     classInput.disabled = false;
                    classInput.placeholder = 'เช่น ม.4/1';
                    classInput.required = true;
                }
            });
        });
    }

    // Anonymous checkbox behavior
    const contactAnonymous = document.getElementById('contactAnonymous');
    if (contactAnonymous) {
        contactAnonymous.addEventListener('change', function() {
            const nameInput = document.getElementById('contactName');
            const classInput = document.getElementById('contactClass');
            if (this.checked) {
                nameInput.value = '';
                nameInput.disabled = true;
                nameInput.placeholder = 'ส่งแบบไม่ระบุตัวตน';
                nameInput.required = false;
                classInput.value = '';
                classInput.disabled = true;
                classInput.placeholder = 'ส่งแบบไม่ระบุตัวตน';
                classInput.required = false;
            } else {
                nameInput.disabled = false;
                nameInput.placeholder = 'กรอกชื่อ-นามสกุล';
                nameInput.required = true;
                classInput.disabled = false;
                classInput.placeholder = 'เช่น ม.4/1';
                classInput.required = true;
            }
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Check if this links to a dropdown or has a dropdown-menu parent
            if (this.classList.contains('dropdown-toggle')) return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// =====================
// Global Functions
// =====================
function downloadExam(id) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        padding: 14px 28px;
        background: #112d60;
        color: white;
        border-radius: 4px;
        font-family: 'Prompt', sans-serif;
        font-size: 0.9rem;
        z-index: 3000;
        border: 1px solid #2a7de1;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0;
        transition: all 0.3s ease;
    `;
    toast.textContent = '📄 กำลังเตรียมไฟล์ PDF สำหรับดาวน์โหลด...';
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

function resetFilters() {
    const gradeSelect = document.getElementById('gradeSelectFilter');
    const subjectSelect = document.getElementById('subjectSelectFilter');
    
    if (gradeSelect) gradeSelect.value = 'all';
    if (subjectSelect) subjectSelect.value = 'all';

    // Trigger change event to re-render
    if (gradeSelect) {
        const event = new Event('change', { bubbles: true });
        gradeSelect.dispatchEvent(event);
    }
}

// =====================================================
// ADMIN SYSTEM INTEGRATION (Appended — does not modify existing code)
// =====================================================

// --------------------------------------------------
// 1. Theme System — Apply saved theme on page load
// --------------------------------------------------
(function applyThemeOnLoad() {
    // Theme definitions (CSS variable overrides)
    const themeOverrides = {
        'default': {},
        'memorial': {
            '--navy-dark': '#1a1a1a',
            '--navy-primary': '#2c2c2c',
            '--navy-light': '#444444',
            '--sky-primary': '#777777',
            '--sky-light': '#f0f0f0',
            '--sky-dark': '#555555',
            '--success': '#555555',
            '--warning': '#777777',
            '--danger': '#999999'
        },
        'children': {
            '--navy-dark': '#7c1a00',
            '--navy-primary': '#e8450e',
            '--navy-light': '#ff6b35',
            '--sky-primary': '#ff8c42',
            '--sky-light': '#fff5eb',
            '--sky-dark': '#d4380d',
            '--success': '#52c41a',
            '--warning': '#faad14',
            '--danger': '#ff4d4f'
        },
        'newyear': {
            '--navy-dark': '#0a1628',
            '--navy-primary': '#1a2744',
            '--navy-light': '#263a5c',
            '--sky-primary': '#c8a951',
            '--sky-light': '#fdf6e3',
            '--sky-dark': '#b08d2a',
            '--success': '#2e7d32',
            '--warning': '#c8a951',
            '--danger': '#c62828'
        },
        'songkran': {
            '--navy-dark': '#004066',
            '--navy-primary': '#005b8a',
            '--navy-light': '#0277bd',
            '--sky-primary': '#0288d1',
            '--sky-light': '#e1f5fe',
            '--sky-dark': '#01579b',
            '--success': '#00796b',
            '--warning': '#e65100',
            '--danger': '#d32f2f'
        },
        'christmas': {
            '--navy-dark': '#14351f',
            '--navy-primary': '#1a472a',
            '--navy-light': '#2d6a3f',
            '--sky-primary': '#c62828',
            '--sky-light': '#fce4ec',
            '--sky-dark': '#b71c1c',
            '--success': '#2e7d32',
            '--warning': '#f9a825',
            '--danger': '#c62828'
        },
        'valentine': {
            '--navy-dark': '#560027',
            '--navy-primary': '#880e4f',
            '--navy-light': '#ad1457',
            '--sky-primary': '#e91e63',
            '--sky-light': '#fce4ec',
            '--sky-dark': '#c2185b',
            '--success': '#2e7d32',
            '--warning': '#e91e63',
            '--danger': '#d50000'
        }
    };

    try {
        const savedTheme = JSON.parse(localStorage.getItem('sc69_active_theme')) || 'default';
        const overrides = themeOverrides[savedTheme];
        if (overrides && Object.keys(overrides).length > 0) {
            const root = document.documentElement;
            Object.entries(overrides).forEach(([prop, value]) => {
                root.style.setProperty(prop, value);
            });
        }
    } catch (e) {
        // Silently fail — use default theme
    }
})();

// --------------------------------------------------
// 2. Contact Form — Logic is now integrated directly in the form's submit event listener
// --------------------------------------------------

// --------------------------------------------------
// 4. News & Calendar Dynamic Rendering
// --------------------------------------------------
(function setupNewsAndEvents() {

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function renderPromoCard(newsList) {
        const promoCard = document.getElementById('promoCard');
        const promoImage = document.getElementById('promoCardImage');
        const promoTag = document.getElementById('promoCardTag');
        const promoTitle = document.getElementById('promoCardTitle');
        const promoExcerpt = document.getElementById('promoCardExcerpt');

        if (!promoCard || !promoImage || !promoTag || !promoTitle || !promoExcerpt) return;

        if (newsList && newsList.length > 0) {
            const top = newsList[0];
            promoTag.textContent = top.tagText || 'ประชาสัมพันธ์';
            promoTitle.textContent = top.title || 'ข่าวประชาสัมพันธ์ล่าสุด';
            promoExcerpt.textContent = top.excerpt || 'ดูรายละเอียดเพิ่มเติมในรายการข่าวด้านล่าง';
            promoImage.src = top.imageUrl || 'images/hero-bg.jpg';
            promoImage.alt = top.title ? `รูปข่าว ${top.title}` : 'รูปประชาสัมพันธ์';
        } else {
            promoTag.textContent = 'ประชาสัมพันธ์';
            promoTitle.textContent = 'ยังไม่มีข่าวประชาสัมพันธ์ในขณะนี้';
            promoExcerpt.textContent = 'กรุณาเพิ่มข่าวสารผ่านระบบผู้ดูแลเพื่อให้ข้อมูลปรากฏบนหน้าเว็บไซต์';
            promoImage.src = 'images/hero-bg.jpg';
            promoImage.alt = 'รูปประชาสัมพันธ์';
        }
    }

    function renderNews(newsList) {
        const container = document.getElementById('newsListContainer');
        if (!container) return;

        renderPromoCard(newsList);

        if (newsList.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:2rem;color:var(--text-muted,#888);">
                    <p>ยังไม่มีข่าวประชาสัมพันธ์ในขณะนี้</p>
                </div>`;
            return;
        }

        container.innerHTML = newsList.map(news => `
            <div class="news-item-flat">
                <div class="news-item-date-box">
                    <span class="date-day">${escapeHtml(news.day)}</span>
                    <span class="date-month">${escapeHtml(news.monthYear)}</span>
                </div>
                <div class="news-item-info">
                    <span class="news-type-tag ${escapeHtml(news.tagClass || 'tag-project')}">${escapeHtml(news.tagText)}</span>
                    <h4 class="news-item-title-text"><a href="#">${escapeHtml(news.title)}</a></h4>
                    <p class="news-item-excerpt-text">${escapeHtml(news.excerpt)}</p>
                </div>
            </div>
        `).join('');
    }

    let activeCalendarDate = null;
    let eventsByDateCache = {};

    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const thaiWeekdays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

    function parseEventDate(event) {
        if (event.eventDate) {
            const parsed = new Date(event.eventDate);
            if (!isNaN(parsed.getTime())) return parsed;
        }
        return null;
    }

    function getEventsByDate(events) {
        const items = {};
        (events || []).forEach(event => {
            const date = parseEventDate(event);
            if (!date) return;
            const key = date.toISOString().slice(0, 10);
            if (!items[key]) items[key] = [];
            items[key].push(event);
        });
        return items;
    }

    function formatThaiDate(date) {
        return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
    }

    function renderCalendarGrid() {
        const grid = document.getElementById('calendarGrid');
        const title = document.getElementById('calendarTitle');
        if (!grid || !title) return;

        const current = activeCalendarDate || new Date();
        const year = current.getFullYear();
        const month = current.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const selectedKey = activeCalendarDate ? activeCalendarDate.toISOString().slice(0, 10) : '';

        title.textContent = `${thaiMonths[month]} ${year + 543}`;

        const cells = [];
        thaiWeekdays.forEach(weekday => {
            cells.push(`<div class="calendar-weekday">${weekday}</div>`);
        });

        for (let i = 0; i < firstDay; i += 1) {
            cells.push('<div class="calendar-day empty"></div>');
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const date = new Date(year, month, day);
            const key = date.toISOString().slice(0, 10);
            const hasEvent = Array.isArray(eventsByDateCache[key]) && eventsByDateCache[key].length > 0;
            const activeClass = key === selectedKey ? ' active' : '';
            let eventHtml = '';
            if (hasEvent) {
                const titleText = (eventsByDateCache[key][0] && eventsByDateCache[key][0].title) || '';
                const short = titleText.length > 28 ? titleText.slice(0, 28) + '…' : titleText;
                eventHtml = `<div class="calendar-event-pill">${escapeHtml(short)}</div>`;
            }

            cells.push(
                `<button type="button" class="calendar-day${activeClass}" data-date="${key}">
                    <div class="calendar-day-number">${day}</div>
                    ${eventHtml}
                </button>`
            );
        }

        grid.innerHTML = cells.join('');

        grid.querySelectorAll('.calendar-day:not(.empty)').forEach(cell => {
            cell.addEventListener('click', () => {
                const selected = cell.getAttribute('data-date');
                if (selected) {
                    activeCalendarDate = new Date(selected);
                    renderCalendarGrid();
                    renderEventsForSelectedDate();
                }
            });
        });
    }

    function renderEventsForSelectedDate() {
        const container = document.getElementById('eventListContainer');
        const selectedDateLabel = document.getElementById('calendarSelectedDate');
        if (!container || !selectedDateLabel) return;
        
        let selectedKey = null;
        if (activeCalendarDate) {
             selectedKey = activeCalendarDate.toISOString().slice(0, 10);
             selectedDateLabel.textContent = formatThaiDate(activeCalendarDate);
        } else {
            selectedDateLabel.textContent = '-';
        }

        const items = (eventsByDateCache[selectedKey] || []).slice();

        if (items.length === 0) {
            container.innerHTML = `
                <div class="calendar-event-empty">
                    <p>ยังไม่มีกิจกรรมในวันที่เลือก</p>
                </div>`;
            return;
        }

        container.innerHTML = items.map(ev => `
            <div class="calendar-event-item">
                <h4>${escapeHtml(ev.title)}</h4>
                <div class="calendar-event-meta">
                    <span>🕒 ${ev.time || '-'}</span>
                    <span>📍 ${ev.place || '-'}</span>
                </div>
            </div>
        `).join('');
    }

    function renderEvents(events) {
        eventsByDateCache = getEventsByDate(events);

        if (!activeCalendarDate) {
            activeCalendarDate = new Date();
        }
        
        // If the current date has no events, find the first date that does
        if (!eventsByDateCache[activeCalendarDate.toISOString().slice(0, 10)] && events.length > 0) {
            const firstEventDateKey = Object.keys(eventsByDateCache).sort()[0];
            if (firstEventDateKey) {
                activeCalendarDate = new Date(firstEventDateKey);
            }
        }

        renderCalendarGrid();
        renderEventsForSelectedDate();
    }
    
    // Make render functions global so Firestore handler can call them
    window.renderNews = renderNews;
    window.renderEvents = renderEvents;

    function changeCalendarMonth(offset) {
        if (!activeCalendarDate) activeCalendarDate = new Date();
        activeCalendarDate = new Date(activeCalendarDate.getFullYear(), activeCalendarDate.getMonth() + offset, 1);
        renderCalendarGrid();
        renderEventsForSelectedDate();
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderNews([]); // Initial empty render
        renderEvents([]); // Initial empty render

        const prevBtn = document.getElementById('calendarPrevMonth');
        const nextBtn = document.getElementById('calendarNextMonth');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => changeCalendarMonth(-1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => changeCalendarMonth(1));
        }
    });
})();

// --------------------------------------------------
// 3. Admin Login Modal Handler
// --------------------------------------------------
(function setupAdminLoginModal() {
    document.addEventListener('DOMContentLoaded', () => {
        const loginOverlay = document.getElementById('adminLoginModal');
        const loginForm = document.getElementById('adminLoginForm');
        const loginError = document.getElementById('loginErrorMsg');
        const adminBtns = document.querySelectorAll('.admin-login-trigger');

        if (!loginOverlay) return;

        // Open login modal
        adminBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Check if already logged in
                try {
                    const session = JSON.parse(localStorage.getItem('sc69_admin_session'));
                    const targetEmail = (window.APP_CONFIG && window.APP_CONFIG.ADMIN_EMAIL) || 'student69@gmail.com';
                    if (session && session.email === targetEmail) {
                        window.location.href = 'admin.html';
                        return;
                    }
                } catch (e) {}
                loginOverlay.classList.add('active');
            });
        });

        // Close on overlay click
        loginOverlay.addEventListener('click', (e) => {
            if (e.target === loginOverlay) {
                loginOverlay.classList.remove('active');
                if (loginError) loginError.classList.remove('visible');
            }
        });

        // Close button
        const closeBtn = loginOverlay.querySelector('.login-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                loginOverlay.classList.remove('active');
                if (loginError) loginError.classList.remove('visible');
            });
        }

        // Toggle password visibility
        const togglePasswordBtn = document.getElementById('togglePasswordBtn');
        const loginPasswordInput = document.getElementById('loginPassword');
        if (togglePasswordBtn && loginPasswordInput) {
            const eyeOpen = togglePasswordBtn.querySelector('.eye-open');
            const eyeClosed = togglePasswordBtn.querySelector('.eye-closed');

            togglePasswordBtn.addEventListener('click', () => {
                const isPassword = loginPasswordInput.getAttribute('type') === 'password';
                loginPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
                
                if (eyeOpen && eyeClosed) {
                    eyeOpen.style.display = isPassword ? 'none' : 'block';
                    eyeClosed.style.display = isPassword ? 'block' : 'none';
                }
                togglePasswordBtn.setAttribute('aria-label', isPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน');
            });
        }

        // Login form submit
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const email = document.getElementById('loginEmail').value.trim();
                const password = document.getElementById('loginPassword').value;

                const adminEmail = (window.APP_CONFIG && window.APP_CONFIG.ADMIN_EMAIL) || 'student69@gmail.com';
                const adminPassword = (window.APP_CONFIG && window.APP_CONFIG.ADMIN_PASSWORD) || '11222333344444';

                if (email === adminEmail && password === adminPassword) {
                    // Save session
                    localStorage.setItem('sc69_admin_session', JSON.stringify({
                        email: email,
                        loginTime: new Date().toISOString()
                    }));
                    // Redirect to admin dashboard
                    window.location.href = 'admin.html';
                } else {
                    if (loginError) {
                        loginError.textContent = '❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง';
                        loginError.classList.add('visible');
                    }
                }
            });
        }
    });

    // =====================
    // Camps / Camphub Integration
    // =====================
    const campsGrid = document.getElementById('campsGrid');
    if (campsGrid) {
        function renderCamps(camps) {
            if (!campsGrid) return;

            if (camps.length === 0) {
                campsGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                        <p style="color: #666; font-size: 15px;">ไม่พบข้อมูลค่ายในขณะนี้ โปรดลองอีกครั้งหรือเยี่ยมชม Camphub โดยตรง</p>
                    </div>
                `;
                return;
            }

            campsGrid.innerHTML = camps.map(camp => `
                <div class="camp-card" data-aos="fade-up" onclick="window.open('${camp.link || 'https://camphub.in.th'}', '_blank')">
                    <img src="${camp.image || 'https://via.placeholder.com/300x200/0e2240/ffffff?text=Camp'}" 
                         alt="${camp.name || 'ค่าย'}" 
                         class="camp-card-image"
                         onerror="this.src='https://via.placeholder.com/300x200/e0e0e0/999999?text=ไม่มีรูป'">
                    <div class="camp-card-body">
                        <div class="camp-card-category">${camp.category || 'ค่ายเรียน'}</div>
                        <h3 class="camp-card-title">${camp.name || 'ชื่อค่าย'}</h3>
                        <div class="camp-card-meta">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span class="${(camp.price === 'ฟรี' || camp.price === 0) ? 'camp-card-price-free' : ''}">${camp.price || 'ตามราคา'}</span>
                        </div>
                        <div class="camp-card-footer">
                            <div class="camp-card-venue">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <span>${camp.venue || 'สถาบันการศึกษา'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Fetch camps from Camphub WordPress REST API
        // ดึงข้อมูลค่ายและรูปจากเว็บ Camphub โดยตรง
        async function fetchCampsFromCamphub() {
            try {
                // ใช้ WordPress REST API เพื่อดึงโพสต์ที่มี featured image
                // เรียงตามวันที่สร้างใหม่สุดก่อน และจำกัด 9 รายการ
                const response = await fetch(
                    'https://camphub.in.th/wp-json/wp/v2/posts?per_page=9&orderby=date&order=desc&_embed',
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Camphub API ตอบกลับแบบ error: ' + response.status);
                }

                const posts = await response.json();
                if (!Array.isArray(posts)) {
                    throw new Error('Camphub API ตอบกลับแบบไม่ถูกต้อง');
                }

                // แปลงข้อมูลโพสต์ WordPress เป็นรูปแบบค่าย
                const camps = posts.map(post => {
                    // ดึงรูป featured image จาก _embedded
                    let imageUrl = 'https://via.placeholder.com/400x250?text=Camp';
                    if (post._embedded && post._embedded['wp:featuredmedia']) {
                        imageUrl = post._embedded['wp:featuredmedia'][0]?.source_url || imageUrl;
                    }

                    // ดึงชื่อหมวดหมู่จาก _embedded
                    let category = 'ค่ายศึกษา';
                    if (post._embedded && post._embedded['wp:term']) {
                        const categories = post._embedded['wp:term'][0] || [];
                        if (categories.length > 0) {
                            category = categories[0].name;
                        }
                    }

                    return {
                        id: post.id,
                        name: post.title.rendered,
                        category: category,
                        price: 'ตามรายละเอียดค่าย',
                        venue: 'จัดการโดย Camphub',
                        image: imageUrl,
                        link: post.link,
                        description: post.excerpt.rendered
                    };
                });

                if (camps.length > 0) {
                    renderCamps(camps);
                    console.log('✓ ดึงข้อมูลค่ายจาก Camphub สำเร็จ:', camps.length, 'รายการ');
                } else {
                    throw new Error('ไม่พบข้อมูลค่าย');
                }
            } catch (error) {
                console.warn('ไม่สามารถดึงข้อมูลจาก Camphub:', error.message);
                // ถ้าดึง API ไม่ได้ ให้ใช้ข้อมูลตัวอย่าง
                renderCampsFromLocal();
            }
        }

        // อัปเดตข้อมูลค่ายโดยอัตโนมัติทุก 5 นาที
        setInterval(() => {
            fetchCampsFromCamphub();
        }, 300000); // 300000 ms = 5 นาที

        // ฟังก์ชันรีเฟรชข้อมูลค่ายโดยผู้ใช้กด
        window.refreshCamps = async function() {
            const btn = document.getElementById('refreshCampsBtn');
            if (!btn) return;

            // ปิดใช้งานปุ่มขณะรีเฟรช
            btn.disabled = true;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64M3.51 15A9 9 0 0 0 18.36 18.36"></path></svg> กำลังอัปเดต...';

            // รอสักครู่แล้วอัปเดต
            await new Promise(resolve => setTimeout(resolve, 500));
            fetchCampsFromCamphub();

            // คืนค่าปุ่มหลังจากเสร็จ
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }, 1000);
        };

        // Fallback: ข้อมูลค่ายตัวอย่างจาก Camphub 
        // ดึงข้อมูลจากหน้า WordPress ของ Camphub เพื่อให้ได้รูปจริง
        function renderCampsFromLocal() {
            const localCamps = [
                {
                    id: 1,
                    name: 'BRAND\'S BRAIN CAMP 2026',
                    category: 'ค่ายการพัฒนาตัวเอง',
                    price: 'เรียนฟรี',
                    venue: 'องค์กรสุนทรี (Suntory)',
                    image: 'https://camphub.in.th/wp-content/uploads/2024/12/suntory_26-700x436.png',
                    link: 'https://camphub.in.th/brands-braincamp-2026-kickoff/'
                },
                {
                    id: 2,
                    name: 'บทบาทนักกายภาพบำบัดในสุขภาพสตรี',
                    category: 'สาขาสุขภาพ',
                    price: 'เรียนฟรี',
                    venue: 'มหาวิทยาลัยเทคโนโลยีธัญบุรี (TPUT)',
                    image: 'https://camphub.in.th/wp-content/uploads/2026/01/thaksinpt-700x437.png',
                    link: 'https://camphub.in.th/thaksinpt-2aug2026/'
                },
                {
                    id: 3,
                    name: 'Engineering Open House 2026 เปิดบ้านวิศวะ',
                    category: 'วิศวกรรม',
                    price: 'ฟรี',
                    venue: 'มหาวิทยาลัยพระจอมเกล้า KMUTT',
                    image: 'https://camphub.in.th/wp-content/uploads/2026/01/casio-engineering-kmutt-700x437.png',
                    link: 'https://camphub.in.th/casio-engineering-open-house-2026-kmutt/'
                },
                {
                    id: 4,
                    name: 'LINE MAN Wongnai Tech Camp 2026',
                    category: 'เทคโนโลยี/AI',
                    price: 'เรียนฟรี',
                    venue: 'LINE MAN Wongnai',
                    image: 'https://camphub.in.th/wp-content/uploads/2025/11/lmwn-techcamp-700x437.png',
                    link: 'https://camphub.in.th/lmwn-techcamp-2026/'
                },
                {
                    id: 5,
                    name: 'Marketing Camp 2026 ค่ายนักการตลาดรุ่นใหม่',
                    category: 'ธุรกิจ/การตลาด',
                    price: 'ตามระบุในประกาศ',
                    venue: 'สถาบันการศึกษา',
                    image: 'https://camphub.in.th/wp-content/uploads/2025/12/marketing-camp-2026-700x437.png',
                    link: 'https://camphub.in.th/marketing-camp-2026/'
                },
                {
                    id: 6,
                    name: 'Young Innovator Bootcamp ค่ายนวัตกรรมดิจิทัล',
                    category: 'นวัตกรรม/วิศวกรรม',
                    price: 'ตามระบุในประกาศ',
                    venue: 'สถาบันต่างๆ',
                    image: 'https://camphub.in.th/wp-content/uploads/2025/10/young-innovator-700x437.png',
                    link: 'https://camphub.in.th/young-innovator-bootcamp-4/'
                }
            ];

            renderCamps(localCamps);
        }

        // เริ่มดึงข้อมูล
        fetchCampsFromCamphub();
    }
})();
