document.addEventListener("DOMContentLoaded", function () {
    const specialCharacters = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~";
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    let password = '';
    let displayedPassword = '';
    let showPassword = false;
    let stage = 'input';
    let featureSupported = true;
    let copyIcon = 'fa-copy';
    let isOnline = navigator.onLine;
    let passwordStatus = null;
    let progress = 0;
    let progressMessage = '';

    const getRandomCharacter = (characters, rng) => {
        const randomIndex = Math.floor(rng() * characters.length);
        return characters[randomIndex];
    };

    const shuffleArray = (array, rng) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const generateRandomPassword = (key, site, salt, length) => {
        const combinedString = key + site + salt;
        const rng = new Math.seedrandom(combinedString);

        let passwordArray = [];

        setProgressMessage('Stage 1...');
        if (document.getElementById('includeSpecialCharacters').checked) {
            passwordArray.push(getRandomCharacter(specialCharacters, rng));
        }
        setProgress(20);

        setProgressMessage('Stage 2...');
        if (document.getElementById('includeUpperCase').checked) {
            passwordArray.push(getRandomCharacter(upperCase, rng));
        }
        setProgress(40);

        setProgressMessage('Stage 3...');
        if (document.getElementById('includeLowerCase').checked) {
            passwordArray.push(getRandomCharacter(lowerCase, rng));
        }
        setProgress(60);

        setProgressMessage('Stage 4...');
        if (document.getElementById('includeNumbers').checked) {
            passwordArray.push(getRandomCharacter(numbers, rng));
        }
        setProgress(80);

        const allCharacters = 
            (document.getElementById('includeSpecialCharacters').checked ? specialCharacters : '') + 
            (document.getElementById('includeUpperCase').checked ? upperCase : '') + 
            (document.getElementById('includeLowerCase').checked ? lowerCase : '') + 
            (document.getElementById('includeNumbers').checked ? numbers : '');

        setProgressMessage('Stage 5...');
        for (let i = passwordArray.length; i < length; i++) {
            passwordArray.push(getRandomCharacter(allCharacters, rng));
        }

        passwordArray = shuffleArray(passwordArray, rng);

        return passwordArray.join('');
    };

    const checkPasswordPwned = async (password) => {
        const sha1 = new jsSHA("SHA-1", "TEXT");
        sha1.update(password);
        const hash = sha1.getHash("HEX");
        const prefix = hash.substring(0, 5).toUpperCase();
        const suffix = hash.substring(5).toUpperCase();

        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const data = await response.text();
        const pwned = data.split('\n').some(line => line.startsWith(suffix));

        return pwned ? 'breached' : 'safe';
    };

    const generateFinalPassword = async (key, site, salt, length) => {
        setProgressMessage('Finishing.....');
        const finalPassword = generateRandomPassword(key, site, salt, length);
        const formattedPassword = formatPassword(finalPassword, length);
        setPassword(formattedPassword);
        setDisplayedPassword(formatPassword('*'.repeat(length)));

        setProgressMessage('Checking...');
        if (navigator.onLine) {
            console.log('Online: Checking password status...');
            const status = await checkPasswordPwned(finalPassword);
            setPasswordStatus(status);
            console.log('Password status:', status);
        } else {
            console.log('Offline: Skipping password check.');
            setPasswordStatus(null);
        }

        setTimeout(() => {
            setStage('final');
            setProgress(100);
            setProgressMessage('Done!');
        }, 500);
    };

    const animateHashGeneration = async (key, site, salt, length) => {
        setProgress(0);
        setProgressMessage('Initializing...');
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(10);

        await generateFinalPassword(key, site, salt, length);
    };

    const formatPassword = (password, length) => {
        return password.slice(0, length);
    };

    const handleUnlock = () => {
        const masterKeyInput = document.getElementById('masterKey');
        const siteInput = document.getElementById('site');
        const saltInput = document.getElementById('salt');
        const lengthInput = document.getElementById('length');
    
        if (!masterKeyInput.value || !siteInput.value || !saltInput.value) {
            if (!masterKeyInput.value) masterKeyInput.classList.add('input-error');
            if (!siteInput.value) siteInput.classList.add('input-error');
            if (!saltInput.value) saltInput.classList.add('input-error');
            return;
        }
    
        if (lengthInput.value < 8 || lengthInput.value > 128) {
            alert('Password length must be between 8 and 128 characters.');
            return;
        }
    
        if (!document.getElementById('includeLowerCase').checked && !document.getElementById('includeUpperCase').checked && !document.getElementById('includeNumbers').checked && !document.getElementById('includeSpecialCharacters').checked) {
            alert('At least one character type must be selected.');
            return;
        }
    
        setTimeout(() => {
            setStage('hash');
            animateHashGeneration(masterKeyInput.value, siteInput.value, saltInput.value, lengthInput.value);
        }, 0);
    };

    const handleClear = () => {
        document.getElementById('masterKey').value = '';
        document.getElementById('site').value = '';
        document.getElementById('salt').value = '';
        document.getElementById('length').value = 32;
        setPassword('');
        setDisplayedPassword('');
        setShowPassword(false);
        setStage('input');
        setPasswordStatus(null);
    };

    const handleCopy = () => {
        const password = document.getElementById('password-result').value;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(password.replace(/\n/g, ''))
                .then(() => {
                    setCopyIcon('fa-check');
                    setTimeout(() => {
                        setCopyIcon('fa-copy');
                    }, 2000);
                })
                .catch(err => {
                    console.log('Clipboard API failed, using execCommand fallback:', err);
                    fallbackCopyTextToClipboard(password.replace(/\n/g, ''));
                });
        } else {
            console.error('Clipboard API not supported, using execCommand fallback.');
            fallbackCopyTextToClipboard(password.replace(/\n/g, ''));
        }
    };

    const fallbackCopyTextToClipboard = (text) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);

        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.setAttribute('readonly', '');

        const range = document.createRange();
        range.selectNodeContents(textArea);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);

        try {
            document.execCommand('copy');
            setCopyIcon('fa-check');
            setTimeout(() => {
                setCopyIcon('fa-copy');
            }, 2000);
        } catch (err) {
            console.error('Fallback: Unable to copy', err);
        }

        document.body.removeChild(textArea);
    };

    const revealPassword = () => {
        let revealIndex = 0;
        const interval = setInterval(() => {
            let currentPassword = password.replace(/\n/g, '');
            if (revealIndex < currentPassword.length) {
                setDisplayedPassword(formatPassword(currentPassword.slice(0, revealIndex + 1) + '*'.repeat(Math.max(0, currentPassword.length - revealIndex - 1)), currentPassword.length));
                revealIndex++;
            } else {
                clearInterval(interval);
            }
        }, 10);
    };

    const hidePassword = () => {
        let hideIndex = password.length - 1;
        const interval = setInterval(() => {
            let currentPassword = password.replace(/\n/g, '');
            if (hideIndex >= 0) {
                setDisplayedPassword(formatPassword(currentPassword.slice(0, hideIndex) + '*'.repeat(Math.max(0, currentPassword.length - hideIndex)), currentPassword.length));
                hideIndex--;
            } else {
                clearInterval(interval);
            }
        }, 10);
    };

    const togglePasswordVisibility = () => {
        const eyeIcon = document.getElementById('eye-icon');
        if (showPassword) {
            eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
            hidePassword();
        } else {
            eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
            revealPassword();
        }
        setShowPassword(!showPassword);
    };

    const supportsRequiredFeatures = () => {
        return (
            'clipboard' in navigator &&
            CSS.supports('(--fake-var: 0)')
        );
    };

    const setStage = (newStage) => {
        stage = newStage;
        document.querySelector('.input-container').style.display = stage === 'input' ? 'block' : 'none';
        document.querySelector('.hash-container').style.display = stage === 'hash' ? 'block' : 'none';
        document.querySelector('.final-container').style.display = stage === 'final' ? 'block' : 'none';
    };

    const setProgress = (value) => {
        progress = value;
        document.getElementById('progress-container').innerHTML = Array.from({ length: 5 }).map((_, index) => `
            <div class="progress-stage ${progress >= (index + 1) * 20 ? 'active' : ''}"></div>
            ${index < 4 ? '<div class="progress-connector"></div>' : ''}
        `).join('');
    };

    const setProgressMessage = (message) => {
        progressMessage = message;
        document.getElementById('progress-message').textContent = message;
    };

    const setPassword = (newPassword) => {
        password = newPassword;
        document.getElementById('password-result').value = password;
    };

    const setDisplayedPassword = (newPassword) => {
        displayedPassword = newPassword;
        document.getElementById('password-result').value = displayedPassword;
    };

    const setShowPassword = (value) => {
        showPassword = value;
    };

    const setPasswordStatus = (status) => {
        passwordStatus = status;
        const statusElement = document.getElementById('password-status');
        if (status === 'safe') {
            statusElement.innerHTML = `&gt; STATUS: <span style="color: rgb(0, 95, 133);">SAFE</span> &lt;`;
        } else if (status === 'breached') {
            statusElement.innerHTML = `&gt; STATUS: <span style="color: red;">BREACHED</span> &lt;`;
        } else {
            statusElement.innerHTML = `&gt; STATUS: OFFLINE &lt;`;
        }
        statusElement.className = `yourPass ${status}`;
    };    

    const setCopyIcon = (icon) => {
        copyIcon = icon;
        document.getElementById('copy-password').innerHTML = `<i class="fas ${copyIcon}"></i>`;
    };

    // Add event listeners to remove the error class on focus
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.remove('input-error');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.classList.add('input-error');
            }
        });
    });

    document.getElementById('unlockBtn').addEventListener('click', handleUnlock);
    document.getElementById('clear-fields').addEventListener('click', handleClear);
    document.getElementById('copy-password').addEventListener('click', handleCopy);
    document.getElementById('toggle-password-visibility').addEventListener('click', togglePasswordVisibility);

    if (!supportsRequiredFeatures()) {
        document.getElementById('app').innerHTML = '<div class="unsupported-warning"><svg>...</svg><h1>Unsupported Browser</h1><p>Your browser does not support the essential features that are needed for Obfirmo to work properly. Please update your browser or switch to a newer browser.</p></div>';
    } else {
        setStage('input');
    }

    const checkInternetConnection = () => {
        if (navigator.onLine) {
            console.log('Currently online');
            isOnline = true;
        } else {
            console.log('Currently offline');
            isOnline = false;
        }
    };

    checkInternetConnection();
    const interval = setInterval(checkInternetConnection, 1500);

    window.addEventListener('online', async () => {
        console.log('Back online');
        isOnline = true;
        if (password && passwordStatus === null) {
            const status = await checkPasswordPwned(password);
            setPasswordStatus(status);
            console.log('Password status updated:', status);
        }
    });

    window.addEventListener('offline', () => {
        console.log('Went offline');
        isOnline = false;
        setPasswordStatus(null);
        console.log('Password status reset due to offline status');
    });

    console.log('%cDO NOT PASTE ANYTHING HERE!', 'font-size:40px;color:red;background-color:black;border:5px solid black;');
});
