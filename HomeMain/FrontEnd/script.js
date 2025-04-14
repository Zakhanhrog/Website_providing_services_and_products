// --- Mobile Menu Toggle ---
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const closeMenu = document.getElementById('closeMenu'); // Nút đóng menu trong phiên bản mobile
const navLinkItems = document.querySelectorAll('.nav-links a'); // Lấy tất cả link trong nav

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.add('active');
        updateAuthButtonsInMobileMenu(); // Cập nhật nút auth khi mở menu
    });
}

if (closeMenu && navLinks) {
    closeMenu.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
}

// Close menu when clicking on a navigation link (cho mobile)
if (navLinks && navLinkItems.length > 0) {
    navLinkItems.forEach(link => {
        // Chỉ áp dụng cho link điều hướng section (href bắt đầu bằng #)
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) { // Chỉ đóng nếu menu đang mở
                    navLinks.classList.remove('active');
                }
                // Smooth scroll sẽ được xử lý ở phần dưới
            });
        }
    });
}

// --- Header Scroll Effect ---
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// --- Back to Top Button ---
const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- Scroll Indicator ---
const scrollIndicator = document.getElementById('scrollIndicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        // Tránh chia cho 0 nếu scrollHeight = 0
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        scrollIndicator.style.width = scrollPercentage + '%';
    });
}

// --- Fade-in Animation on Scroll ---
const fadeInElements = document.querySelectorAll('.fade-in');
if (fadeInElements.length > 0 && typeof IntersectionObserver !== 'undefined') {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    fadeInElements.forEach(el => {
        scrollObserver.observe(el);
    });
}

// --- Smooth Scrolling for Navigation Links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Chỉ xử lý nếu href không phải chỉ là "#" (back-to-top đã xử lý)
        if (href && href !== '#' && href.length > 1) {
            e.preventDefault();
            const targetElement = document.querySelector(href);

            if (targetElement) {
                const headerOffset = header ? header.offsetHeight : 0; // Lấy chiều cao header (nếu có)
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // Trừ chiều cao header và thêm khoảng đệm

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// --- Particles.js Initialization ---
// Kiểm tra xem particlesJS có tồn tại không trước khi gọi
if (typeof particlesJS === 'function') {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#ffffff" },
            "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 } },
            "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } },
            "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } },
            "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 4, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
            "modes": {
                "grab": { "distance": 400, "line_linked": { "opacity": 1 } },
                "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
                "repulse": { "distance": 100, "duration": 0.4 },
                "push": { "particles_nb": 4 },
                "remove": { "particles_nb": 2 }
            }
        },
        "retina_detect": true
    });
} else {
    console.warn("particles.js library not loaded or 'particles-js' element not found.");
}


// --- Contact Form Submission (Simulation) ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        console.log('Contact Form Data:', { name, email, subject, message });
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
        // Ở đây cần code backend để gửi mail thực sự
    });
}


// ============================================================
// --- Authentication & Modal Logic ---
// ============================================================

// --- Get Modal Elements ---
const modalOverlay = document.getElementById('modalOverlay');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');

// --- Get Header Buttons & User Info Elements ---
const loginBtnHeader = document.getElementById('loginBtnHeader');
const signupBtnHeader = document.getElementById('signupBtnHeader');
const authButtonsContainer = document.getElementById('authButtons'); // Container cho nút Login/Signup
const userInfoContainer = document.getElementById('userInfo');     // Container cho thông tin user đã đăng nhập
const usernameDisplay = document.getElementById('usernameDisplay');   // Span hiển thị tên user
const logoutBtn = document.getElementById('logoutBtn');           // Nút Logout

// --- Get Modal Internal Buttons & Links ---
const closeLoginModalBtn = document.getElementById('closeLoginModal');
const closeRegisterModalBtn = document.getElementById('closeRegisterModal');
const switchToRegisterLink = document.getElementById('switchToRegister'); // Link chuyển từ Login -> Register
const switchToLoginLink = document.getElementById('switchToLogin');     // Link chuyển từ Register -> Login

// --- Get Forms & Form Elements ---
const loginForm = document.getElementById('loginForm');               // Form đăng nhập
const registerForm = document.getElementById('registerForm');           // Form đăng ký
const forgotPasswordForm = document.getElementById('forgotPasswordForm'); // Form quên mật khẩu (mới)
const forgotPasswordLink = document.getElementById('forgotPasswordLink'); // Link mở form quên mật khẩu (mới)
const backToLoginLink = document.getElementById('backToLoginLink');     // Link quay lại login từ form quên mật khẩu (mới)
const sendResetLinkBtn = document.getElementById('sendResetLinkBtn');   // Nút gửi link reset trong form quên mật khẩu (mới)
const resetEmailInput = document.getElementById('resetEmailInput');     // Input email trong form quên mật khẩu (mới)

// Các input trong form đăng ký
const registerUsername = document.getElementById('registerUsername');
const registerEmail = document.getElementById('registerEmail');
const registerPhone = document.getElementById('registerPhone');         // Input số điện thoại (mới)
const registerPassword = document.getElementById('registerPassword');
const registerConfirmPassword = document.getElementById('registerConfirmPassword');
const passwordMatchError = document.getElementById('passwordMatchError'); // Thông báo lỗi trùng mật khẩu

// --- Get Social Login Buttons (mới) ---
const loginGoogleBtn = document.getElementById('loginGoogleBtn');
const loginFacebookBtn = document.getElementById('loginFacebookBtn');

// --- Authentication State Simulation ---
let isLoggedIn = false; // Biến toàn cục để theo dõi trạng thái đăng nhập (chỉ là giả lập)

// --- Modal Open/Close Functions ---
function openModal(modalElement) {
    if (!modalElement || !modalOverlay) return; // Kiểm tra tồn tại
    modalOverlay.classList.add('active');
    modalElement.classList.add('active');
    // Reset trạng thái hiển thị của các form bên trong login modal khi mở
    if (modalElement === loginModal && loginForm && forgotPasswordForm) {
        loginForm.style.display = 'block';
        forgotPasswordForm.style.display = 'none';
    }
}

function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    if (loginModal && loginModal.classList.contains('active')) {
        loginModal.classList.remove('active');
    }
    if (registerModal && registerModal.classList.contains('active')) {
        registerModal.classList.remove('active');
    }
    // Reset thông báo lỗi và trạng thái form khi đóng modal
    if (passwordMatchError) {
        passwordMatchError.style.display = 'none';
    }
    // Đảm bảo form login luôn hiển thị lại khi mở modal login lần sau
    if (loginForm && forgotPasswordForm) {
        loginForm.style.display = 'block';
        forgotPasswordForm.style.display = 'none';
    }
}

// --- Event Listeners for Opening Modals ---
if (loginBtnHeader) loginBtnHeader.addEventListener('click', () => openModal(loginModal));
if (signupBtnHeader) signupBtnHeader.addEventListener('click', () => openModal(registerModal));

// --- Event Listeners for Closing Modals ---
if (closeLoginModalBtn) closeLoginModalBtn.addEventListener('click', closeModal);
if (closeRegisterModalBtn) closeRegisterModalBtn.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal); // Đóng khi click ra ngoài

// --- Event Listeners for Switching Between Modals ---
if (switchToRegisterLink) {
    switchToRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(); // Đóng modal hiện tại (Login)
        // Dùng setTimeout để đợi hiệu ứng đóng modal hoàn thành một chút
        setTimeout(() => openModal(registerModal), 150);
    });
}

if (switchToLoginLink) {
    switchToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(); // Đóng modal hiện tại (Register)
        setTimeout(() => openModal(loginModal), 150);
    });
}

// --- Forgot Password Flow Logic (mới) ---
if (forgotPasswordLink && loginForm && forgotPasswordForm) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';       // Ẩn form đăng nhập thông thường
        forgotPasswordForm.style.display = 'block'; // Hiện form quên mật khẩu
    });
}

if (backToLoginLink && loginForm && forgotPasswordForm) {
    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordForm.style.display = 'none'; // Ẩn form quên mật khẩu
        loginForm.style.display = 'block';         // Hiện lại form đăng nhập
    });
}

// Xử lý khi submit form quên mật khẩu
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = resetEmailInput ? resetEmailInput.value : null;
        if (!email) {
            alert('Please enter your email address.');
            return;
        }
        console.log('Simulating sending password reset link to:', email);
        // --- !!! BACKEND REQUIRED HERE để gửi email thực sự !!! ---
        alert(`Password reset link simulation: An email has been sent to ${email} with instructions.`);
        closeModal(); // Đóng modal sau khi "gửi"
        forgotPasswordForm.reset(); // Reset input email
    });
}


// --- Update UI based on Login State ---
function showLoggedInState(username) {
    isLoggedIn = true;
    if (authButtonsContainer) authButtonsContainer.style.display = 'none'; // Ẩn nút Login/Signup
    if (userInfoContainer) {
        userInfoContainer.style.display = 'flex'; // Hiện thông tin user
        if (usernameDisplay) usernameDisplay.textContent = `Welcome, ${username}!`; // Cập nhật tên user
    }
    updateAuthButtonsInMobileMenu(); // Cập nhật trạng thái trong mobile menu
}

function showLoggedOutState() {
    isLoggedIn = false;
    if (userInfoContainer) userInfoContainer.style.display = 'none'; // Ẩn thông tin user
    if (authButtonsContainer) authButtonsContainer.style.display = 'flex'; // Hiện nút Login/Signup
    updateAuthButtonsInMobileMenu(); // Cập nhật trạng thái trong mobile menu
}

// --- Update Authentication Buttons/Info in Mobile Menu ---
// Hàm này đảm bảo các nút/thông tin đăng nhập cũng được hiển thị đúng trong menu mobile
function updateAuthButtonsInMobileMenu() {
    if (!navLinks || !navLinks.classList.contains('active')) return; // Chỉ thực thi khi menu mobile đang mở

    let authButtonsMobile = navLinks.querySelector('.auth-buttons-mobile');
    let userInfoMobile = navLinks.querySelector('.user-info-mobile');

    // --- Clone và thêm nút/info vào menu mobile nếu chưa có ---
    // Chỉ clone một lần duy nhất
    if (!authButtonsMobile && authButtonsContainer) {
        authButtonsMobile = authButtonsContainer.cloneNode(true);
        authButtonsMobile.id = ''; // Bỏ id gốc để tránh trùng lặp
        authButtonsMobile.classList.remove('auth-buttons'); // Bỏ class gốc
        authButtonsMobile.classList.add('auth-buttons-mobile'); // Thêm class mới cho mobile
        // Style lại cho phù hợp menu mobile
        authButtonsMobile.style.display = 'flex';
        authButtonsMobile.style.flexDirection = 'column';
        authButtonsMobile.style.marginTop = '2rem';
        authButtonsMobile.style.width = '80%';
        authButtonsMobile.style.alignItems = 'center';
        authButtonsMobile.querySelectorAll('button').forEach(btn => {
            btn.style.marginBottom = '1rem';
            btn.id = btn.id + 'Mobile'; // Thêm suffix 'Mobile' vào ID nút clone
        });
        navLinks.appendChild(authButtonsMobile);

        // --- Gắn lại Event Listener cho các nút vừa clone ---
        const loginBtnMobile = navLinks.querySelector('#loginBtnHeaderMobile');
        const signupBtnMobile = navLinks.querySelector('#signupBtnHeaderMobile');
        if (loginBtnMobile) loginBtnMobile.addEventListener('click', () => openModal(loginModal));
        if (signupBtnMobile) signupBtnMobile.addEventListener('click', () => openModal(registerModal));
    }

    if (!userInfoMobile && userInfoContainer) {
        userInfoMobile = userInfoContainer.cloneNode(true);
        userInfoMobile.id = ''; // Bỏ id gốc
        userInfoMobile.classList.remove('user-info');
        userInfoMobile.classList.add('user-info-mobile'); // Thêm class mới
        // Style lại
        userInfoMobile.style.display = 'flex';
        userInfoMobile.style.flexDirection = 'column';
        userInfoMobile.style.marginTop = '2rem';
        userInfoMobile.style.width = '80%';
        userInfoMobile.style.alignItems = 'center';
        const usernameSpanMobile = userInfoMobile.querySelector('span'); // Lấy span bên trong
        if(usernameSpanMobile) {
            usernameSpanMobile.id = 'usernameDisplayMobile'; // Đặt ID riêng
            usernameSpanMobile.style.marginBottom = '1rem';
            usernameSpanMobile.style.display = 'block';
            usernameSpanMobile.style.textAlign = 'center';
        }
        const logoutBtnMobileClone = userInfoMobile.querySelector('button');
        if(logoutBtnMobileClone) {
            logoutBtnMobileClone.id = 'logoutBtnMobile'; // Đặt ID riêng
            logoutBtnMobileClone.style.width = '100%';
            // --- Gắn lại Event Listener cho nút logout clone ---
            logoutBtnMobileClone.addEventListener('click', () => {
                console.log('Simulating logout from mobile menu');
                alert('Logged out (simulation)!');
                showLoggedOutState(); // Cập nhật UI
                closeModal(); // Đóng modal login/register nếu đang mở
                if (navLinks) navLinks.classList.remove('active'); // Đóng menu mobile
            });
        }
        navLinks.appendChild(userInfoMobile);
    }

    // --- Cập nhật hiển thị dựa trên trạng thái isLoggedIn ---
    if (authButtonsMobile) {
        authButtonsMobile.style.display = isLoggedIn ? 'none' : 'flex';
    }
    if (userInfoMobile) {
        userInfoMobile.style.display = isLoggedIn ? 'flex' : 'none';
        if (isLoggedIn) {
            // Cập nhật tên user trong menu mobile
            const usernameSpanMobile = userInfoMobile.querySelector('#usernameDisplayMobile');
            if (usernameSpanMobile && usernameDisplay) {
                usernameSpanMobile.textContent = usernameDisplay.textContent;
            }
        }
    }
}


// --- Form Submission Simulation ---

// Login Form Submit
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailOrUsername = document.getElementById('loginEmail')?.value; // Lấy email/username
        const password = document.getElementById('loginPassword')?.value; // Lấy password
        console.log('Simulating login attempt for:', emailOrUsername);
        // --- !!! BACKEND REQUIRED HERE để xác thực thực sự !!! ---
        // Giả lập thành công
        alert('Login successful (simulation)!');
        closeModal(); // Đóng modal
        // Lấy phần tên từ email hoặc username làm tên hiển thị (ví dụ)
        const displayName = emailOrUsername ? (emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername) : 'User';
        showLoggedInState(displayName); // Cập nhật UI sang trạng thái đăng nhập
        loginForm.reset(); // Reset form
    });
}

// Register Form Submit
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Lấy giá trị từ các input, kiểm tra null trước khi truy cập .value
        const username = registerUsername ? registerUsername.value : null;
        const email = registerEmail ? registerEmail.value : null;
        const phone = registerPhone ? registerPhone.value : ''; // Lấy số điện thoại (mới), để trống nếu không nhập
        const password = registerPassword ? registerPassword.value : null;
        const confirmPassword = registerConfirmPassword ? registerConfirmPassword.value : null;

        // Kiểm tra các trường bắt buộc
        if (!username || !email || !password || !confirmPassword) {
            alert('Please fill in all required fields.');
            return;
        }

        // Kiểm tra trùng mật khẩu (Client-side)
        if (password !== confirmPassword) {
            if (passwordMatchError) passwordMatchError.style.display = 'block';
            if (registerConfirmPassword) registerConfirmPassword.focus();
            return; // Dừng submit nếu mật khẩu không khớp
        } else {
            if (passwordMatchError) passwordMatchError.style.display = 'none'; // Ẩn lỗi nếu khớp
        }

        console.log('Simulating registration for:', { username, email, phone }); // Log cả số điện thoại
        // --- !!! BACKEND REQUIRED HERE để tạo user thực sự !!! ---
        // Giả lập thành công
        alert('Registration successful (simulation)! You are now logged in.');
        closeModal(); // Đóng modal
        showLoggedInState(username); // Cập nhật UI (đăng nhập luôn sau khi đăng ký - giả lập)
        registerForm.reset(); // Reset form
    });
}

// --- Password Match Check while typing in Register Form ---
if (registerConfirmPassword && registerPassword && passwordMatchError) {
    registerConfirmPassword.addEventListener('input', () => {
        if (registerPassword.value === registerConfirmPassword.value) {
            passwordMatchError.style.display = 'none';
        } else if (registerConfirmPassword.value !== '') { // Chỉ hiện lỗi nếu đã nhập gì đó
            passwordMatchError.style.display = 'block';
        }
    });
    // Kiểm tra lại khi thay đổi cả ô password gốc
    registerPassword.addEventListener('input', () => {
        if (registerConfirmPassword.value !== '' && registerPassword.value !== registerConfirmPassword.value) {
            passwordMatchError.style.display = 'block';
        } else {
            passwordMatchError.style.display = 'none';
        }
    });
}


// --- Social Login Button Click Simulation (mới) ---
if (loginGoogleBtn) {
    loginGoogleBtn.addEventListener('click', () => {
        console.log('Simulating Login with Google...');
        // --- !!! BACKEND & Google OAuth REQUIRED HERE !!! ---
        alert('Simulating Google Login. This requires server-side integration with Google OAuth.');
        // Giả lập đăng nhập thành công
        closeModal();
        showLoggedInState('Google User'); // Hiển thị tên tạm
    });
}

if (loginFacebookBtn) {
    loginFacebookBtn.addEventListener('click', () => {
        console.log('Simulating Login with Facebook...');
        // --- !!! BACKEND & Facebook SDK/OAuth REQUIRED HERE !!! ---
        alert('Simulating Facebook Login. This requires server-side integration with Facebook Login.');
        // Giả lập đăng nhập thành công
        closeModal();
        showLoggedInState('Facebook User'); // Hiển thị tên tạm
    });
}


// --- Logout Button Click ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        console.log('Simulating logout from header');
        // --- !!! BACKEND REQUIRED HERE để xóa session/token thực sự !!! ---
        alert('Logged out (simulation)!');
        showLoggedOutState(); // Cập nhật UI về trạng thái chưa đăng nhập
    });
}

// --- Initial State Check ---
// Đảm bảo trạng thái UI đúng khi trang vừa tải xong (mặc định là chưa đăng nhập)
document.addEventListener('DOMContentLoaded', () => {
    showLoggedOutState();
    // Trong ứng dụng thực tế, bạn có thể kiểm tra session/token ở đây
    // để xác định trạng thái đăng nhập thực sự và gọi showLoggedInState nếu cần.
    // Ví dụ: checkLoginStatusFromServer().then(user => { if(user) showLoggedInState(user.name); });
});