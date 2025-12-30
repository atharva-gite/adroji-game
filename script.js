// Game State
const gameState = {
    wakeChoice: null,
    outfit: {
        hair: 0,
        top: 0,
        bottom: 0,
        shoes: 0,
        earrings: 0,
        necklace: 0,
        bangles: 0,
        bag: 0,
        eyes: 0,
        lips: 0
    }
};

// Scene Management
let currentScene = 'start-screen';

// Utility Functions
function showScene(sceneName) {
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });
    const scene = document.getElementById(sceneName);
    if (scene) {
        scene.classList.add('active');
        currentScene = sceneName;
    }
}

function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.add('hidden');
    }
}

function showElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove('hidden');
    }
}

// Start Screen
function initStartScreen() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => {
        // Fade out start screen
        const startScreen = document.getElementById('start-screen');
        startScreen.style.opacity = '0';
        
        setTimeout(() => {
            showScene('wake-up-scene');
            initWakeUp();
        }, 800);
    });
}

// Wake-Up Scene
function initWakeUp() {
    const alexa1 = document.getElementById('alexa-wake-up-1');
    const alexa2 = document.getElementById('alexa-wake-up-2');
    const alexa3 = document.getElementById('alexa-wake-up-3');
    const choiceTimeState = document.getElementById('choice-time-state');
    const choiceScreen = document.getElementById('choice-screen');
    
    // Reset all states
    hideElement('alexa-wake-up-1');
    hideElement('alexa-wake-up-2');
    hideElement('alexa-wake-up-3');
    hideElement('choice-time-state');
    hideElement('choice-screen');
    hideElement('option1-image');
    hideElement('option2-image');
    hideElement('option3-image');
    hideElement('option1-retry');
    hideElement('option2-video');
    hideElement('option3-video');
    hideElement('option2-alexa-first');
    hideElement('option2-alexa-second');
    hideElement('option3-alexa-first');
    hideElement('option3-alexa-second');
    
    // Step 0: Play sleeping.mp4 for 2 seconds
    const sleepingVideo = document.getElementById('sleeping-video');
    if (sleepingVideo) {
        sleepingVideo.currentTime = 0;
        sleepingVideo.classList.remove('hidden');
        sleepingVideo.onended = () => {
            sleepingVideo.classList.add('hidden');
    // Step 1: Show alexa__wake_up1.png (3 seconds)
    showElement('alexa-wake-up-1');
    
    // Step 2: After 3 seconds, show alexa__wake_up2.png (3 seconds)
    setTimeout(() => {
        hideElement('alexa-wake-up-1');
        showElement('alexa-wake-up-2');
        
        // Step 3: After 3 seconds, show alexa__wake_up3.png (3 seconds)
        setTimeout(() => {
            hideElement('alexa-wake-up-2');
            showElement('alexa-wake-up-3');
            
            // Step 4: After 3 seconds, show choice time with sleeping.png AND choice button at the same time
                    setTimeout(() => {
                        hideElement('alexa-wake-up-3');
                        showElement('choice-time-state');
                        showElement('choice-screen');
                        setupChoiceHandlers();
                    }, 3000);
                }, 3000);
            }, 3000);
        };
        sleepingVideo.play().catch(e => console.log('Sleeping video play failed:', e));
    } else {
        // Fallback if video element doesn't exist - proceed directly to alexa wake up
        showElement('alexa-wake-up-1');
        setTimeout(() => {
            hideElement('alexa-wake-up-1');
            showElement('alexa-wake-up-2');
            setTimeout(() => {
                hideElement('alexa-wake-up-2');
                showElement('alexa-wake-up-3');
            setTimeout(() => {
                hideElement('alexa-wake-up-3');
                showElement('choice-time-state');
                showElement('choice-screen');
                setupChoiceHandlers();
            }, 3000);
        }, 3000);
    }, 3000);
    }
}


// Choice Handlers
function setupChoiceHandlers() {
    const choiceAreaButtons = document.querySelectorAll('.choice-area-btn');
    const retryButton = document.getElementById('retry-button');
    
    // Remove existing listeners to prevent duplicates
    choiceAreaButtons.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    
    // Re-query after cloning
    document.querySelectorAll('.choice-area-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const choice = btn.dataset.choice;
            handleChoice(choice);
        });
    });
    
    // Retry button handler - loops back to alexa_wake_up_1
    if (retryButton) {
        retryButton.replaceWith(retryButton.cloneNode(true));
    }
    
    const newRetryButton = document.getElementById('retry-button');
    if (newRetryButton) {
        newRetryButton.addEventListener('click', () => {
            hideElement('option1-retry');
            // Loop back to choice screen (not sleeping video)
            setTimeout(() => {
                // Reset all states first
                    hideElement('alexa-wake-up-1');
                        hideElement('alexa-wake-up-2');
                            hideElement('alexa-wake-up-3');
                hideElement('option1-image');
                // Show choice screen again
                            showElement('choice-time-state');
                            showElement('choice-screen');
                            setupChoiceHandlers();
            }, 500);
        });
    }
}

function handleChoice(choice) {
    const choiceScreen = document.getElementById('choice-screen');
    const choiceTimeState = document.getElementById('choice-time-state');
    const option1Image = document.getElementById('option1-image');
    const option1Retry = document.getElementById('option1-retry');
    const option2Video = document.getElementById('option2-video');
    const option3Video = document.getElementById('option3-video');
    const option2AlexaFirst = document.getElementById('option2-alexa-first');
    const option2AlexaSecond = document.getElementById('option2-alexa-second');
    const option3AlexaFirst = document.getElementById('option3-alexa-first');
    const option3AlexaSecond = document.getElementById('option3-alexa-second');
    
    // Hide choice screen and choice time
    hideElement('choice-screen');
    hideElement('choice-time-state');
    
    if (choice === '1') {
        // Option 1 Flow: option1.png → option1_retry_bg + Retry → alexa_wake_up_1
        gameState.wakeChoice = 1;
        showElement('option1-image');
        setTimeout(() => {
            hideElement('option1-image');
            showElement('option1-retry');
        }, 2000);
    } else if (choice === '2') {
        // Option 2 Flow: option2_ani → option2.png → alexa_first → (2s) → alexa_second
        gameState.wakeChoice = 2;
        const option2Image = document.getElementById('option2-image');
        showElement('option2-video');
        // Reset and set up video handler
        option2Video.currentTime = 0;
        option2Video.onended = () => {
            hideElement('option2-video');
            showElement('option2-image');
            setTimeout(() => {
                hideElement('option2-image');
                showElement('option2-alexa-first');
                setTimeout(() => {
                    hideElement('option2-alexa-first');
                    showElement('option2-alexa-second');
                    // Transition to dress-up loading after 2 seconds
                    setTimeout(() => {
                        hideElement('option2-alexa-second');
                        showScene('dress-up-loading');
                        initDressUpLoading();
                    }, 2000);
                }, 2000);
            }, 2000);
        };
        option2Video.play().catch(e => console.log('Video play failed:', e));
    } else if (choice === '3') {
        // Option 3 Flow: option3_ani → option3.png → alexa_first → (2s) → alexa_second
        gameState.wakeChoice = 3;
        const option3Image = document.getElementById('option3-image');
        showElement('option3-video');
        // Reset and set up video handler
        option3Video.currentTime = 0;
        option3Video.onended = () => {
            hideElement('option3-video');
            showElement('option3-image');
            setTimeout(() => {
                hideElement('option3-image');
                showElement('option3-alexa-first');
                setTimeout(() => {
                    hideElement('option3-alexa-first');
                    showElement('option3-alexa-second');
                    // Transition to dress-up loading after 2 seconds
                    setTimeout(() => {
                        hideElement('option3-alexa-second');
                        showScene('dress-up-loading');
                        initDressUpLoading();
                    }, 2000);
                }, 2000);
            }, 2000);
        };
        option3Video.play().catch(e => console.log('Video play failed:', e));
    }
}

// Destroy Dress-Up (Remove Old Instance)
function destroyDressUp() {
    const old = document.getElementById('dressup-root');
    if (old) old.remove();
}

// Lock Dress-Up UI (Disable All Buttons)
function lockDressUpUI() {
    const uiLayer = document.getElementById('dressup-ui');
    if (!uiLayer) return;
    
    const buttons = uiLayer.querySelectorAll('.ui-btn');
    buttons.forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
}

// Play Dress-Up Loading Sequence
function playDressUpLoading(callback) {
    const loading = document.getElementById('dressup-loading');
    const loadingFrame = document.getElementById('loading-frame');
    
    if (!loading || !loadingFrame) {
        if (callback) callback();
        return;
    }
    
    loading.classList.remove('hidden');
    
    const loadingFrames = [
        'loading_final.png',
        'loading_final(1).png',
        'loading_final(2).png',
        'loading_final(3).png',
        'loading_final(4).png'
    ];
    
    let frameIndex = 0;
    const frameInterval = setInterval(() => {
        if (frameIndex < loadingFrames.length) {
            loadingFrame.src = `assets/adroji game/dress up pt 2/${loadingFrames[frameIndex]}`;
            frameIndex++;
        } else {
            clearInterval(frameInterval);
            if (callback) callback();
        }
    }, 400);
}

// ============================================
// BOBA TEA GAME - FROM SCRATCH
// ============================================

// Boba Game State
const bobaState = {
    phase: 'toppings', // 'toppings', 'drinks', 'sugar', 'ice', 'straw', 'done'
    teaBase: -1,      // Index in teaBases array (-1 = not selected)
    topping: -1,      // Index in toppings array (-1 = not selected)
    sugar: -1,        // Index in sugarLevels array (-1 = not selected)
    ice: false,       // Boolean - ice on/off
    straw: -1,        // Index in straws array (-1 = not selected)
    started: false,   // Has player clicked start?
    locked: false,    // Is game locked (after Done)?
    doneClicks: 0     // Track done button clicks
};

// Boba Game Assets - Tea Bases (in order: MS → RO → LBT → Lav)
const teaBases = [
    { name: 'matcha strawberry', base: 'matcha strawberry base.png', displayName: 'matcha strawberry .png', code: 'MS' },
    { name: 'roasted oolong', base: 'roasted oolong base.png', displayName: 'roasted oolong.png', code: 'RO' },
    { name: 'litchi black tea', base: 'litchi black tes base.png', displayName: 'litchi black tea.png', code: 'LBT' },
    { name: 'lavender', base: 'lavendar base.png', displayName: 'lavendar .png', code: 'Lav' }
];

// Boba Game Assets - Toppings (in order: boba → nata de coco → almond tofu → jinzou)
const toppings = [
    { name: 'boba', file: 'boba.png', code: 'boba', displayName: 'boba.png' },
    { name: 'nata de coco', file: 'nata de coco.png', code: 'NDC', displayName: 'nata de coco.png' },
    { name: 'almond tofu', file: 'almond tofu label.png', code: 'AT', displayName: 'almond tofu label.png' },
    { name: 'jinzou', file: 'jinzou.png', code: 'JZ', displayName: 'jinzou.png' }
];

// Get Combined Topping+Tea Image
function getCombinedToppingImage(teaIndex, toppingIndex) {
    const tea = teaBases[teaIndex];
    const topping = toppings[toppingIndex];
    if (!tea || !topping) return null;
    
    // Map to combined image names based on actual files in directory
    // Topping codes: boba, JZ (jinzou), NDC (nata de coco), AT (almond tofu)
    const combinedFiles = {
        'LBT': { 
            'boba': 'LBT BOBA.png', 
            'JZ': 'LBT jinzou.png', 
            'NDC': 'LBTndc.png', 
            'AT': 'LBT AT.png' 
        },
        'Lav': { 
            'boba': 'Lav boba.png', 
            'JZ': 'lav jinzou.png', 
            'NDC': 'Lav ndc.png', 
            'AT': 'Lav AT.png' 
        },
        'MS': { 
            'boba': 'matcha strawberry boba.png', 
            'JZ': 'MS JINZOU.png', 
            'NDC': 'MS Nata de coco.png', 
            'AT': 'MS almond tofu.png' 
        },
        'RO': { 
            'boba': 'RO boba.png', 
            'JZ': 'RO JINZOU.png', 
            'NDC': 'RO ndc.png', 
            'AT': 'RO AT.png' 
        }
    };
    
    const fileName = combinedFiles[tea.code]?.[topping.code];
    return fileName || null; // Return null if not found
}

// Boba Game Assets - Sugar Levels
const sugarLevels = [
    { name: '0%', file: '0 sugar.png' },
    { name: '25%', file: '25 sugar.png' },
    { name: '50%', file: '50 sugar.png' },
    { name: '100%', file: '100 sugar.png' }
];

// Boba Game Assets - Straws
const straws = [
    'straw 1.png',
    'straw 2.png',
    'straw 3.png',
    'straw 4.png'
];

// Start Boba Game
function startBobaGame() {
    // Destroy dress-up if it exists
    destroyDressUp();
    
    // Show boba scene
    showScene('boba-scene');
    
    // Initialize boba game
    initBobaGame();
}

// Initialize Boba Game (Render Once, Never Re-render)
function initBobaGame() {
    const bobaScene = document.getElementById('boba-scene');
    if (!bobaScene) return;
    
    // Clear any existing boba game
    const existing = document.getElementById('boba-root');
    if (existing) existing.remove();
    
    // Reset state - start with empty glass (no selections)
    bobaState.phase = 'toppings';
    bobaState.teaBase = -1;
    bobaState.topping = -1;
    bobaState.sugar = -1;
    bobaState.ice = false;
    bobaState.straw = -1;
    bobaState.started = false;
    bobaState.locked = false;
    bobaState.doneClicks = 0;
    
    // Create boba-root container (RENDER ONCE)
    const bobaRoot = document.createElement('div');
    bobaRoot.id = 'boba-root';
    
    // START SCREEN - bubble_tea_bg.png with start button
    const startScreen = document.createElement('div');
    startScreen.id = 'boba-start-screen';
    startScreen.className = 'boba-start-screen';
    const startBg = document.createElement('img');
    startBg.src = 'assets/adroji game/boba tea pt3/bubble_tea_bg.png';
    startBg.alt = 'Start Background';
    startBg.className = 'boba-start-bg';
    startScreen.appendChild(startBg);
    const startBtn = document.createElement('img');
    startBtn.src = 'assets/adroji game/boba tea pt3/bubble_tea_startbutton.png';
    startBtn.alt = 'Start';
    startBtn.className = 'boba-start-btn';
    startScreen.appendChild(startBtn);
    bobaRoot.appendChild(startScreen);
    
    // GAME SCREEN (hidden until start is clicked)
    const gameScreen = document.createElement('div');
    gameScreen.id = 'boba-game-screen';
    gameScreen.className = 'boba-game-screen hidden';
    
    // Game Background
    const gameBg = document.createElement('img');
    gameBg.src = 'assets/adroji game/boba tea pt3/game bg.png';
    gameBg.alt = 'Game Background';
    gameBg.className = 'boba-bg-layer';
    gameScreen.appendChild(gameBg);
    
    // Buttons Sprite Sheet (buttons.png contains all button graphics)
    const buttonsSheet = document.createElement('img');
    buttonsSheet.src = 'assets/adroji game/boba tea pt3/buttons.png';
    buttonsSheet.alt = 'Buttons';
    buttonsSheet.className = 'boba-buttons-sheet';
    buttonsSheet.id = 'boba-buttons-sheet';
    gameScreen.appendChild(buttonsSheet);
    
    // Done Button Image (top middle)
    const doneButtonImg = document.createElement('img');
    doneButtonImg.src = 'assets/adroji game/boba tea pt3/done button.png';
    doneButtonImg.alt = 'Done Button';
    doneButtonImg.className = 'boba-done-button-img';
    doneButtonImg.style.pointerEvents = 'none'; // Image itself not clickable
    gameScreen.appendChild(doneButtonImg);
    
    // CUP CONTAINER - Centered, Never Moves
    const cupContainer = document.createElement('div');
    cupContainer.id = 'boba-cup-container';
    cupContainer.className = 'boba-cup-container';
    
    // Cup Glass (always visible - starts empty)
    const cupGlass = document.createElement('img');
    cupGlass.id = 'boba-glass';
    cupGlass.src = 'assets/adroji game/boba tea pt3/boba glass.png';
    cupGlass.alt = 'Cup';
    cupGlass.className = 'boba-glass';
    cupContainer.appendChild(cupGlass);
    
    // Boba Seeds (hidden initially - only shown when topping is selected)
    const bobaSeeds = document.createElement('img');
    bobaSeeds.id = 'boba-seeds';
    bobaSeeds.src = 'assets/adroji game/boba tea pt3/boba_seeds.png';
    bobaSeeds.alt = 'Boba Seeds';
    bobaSeeds.className = 'boba-layer boba-seeds-layer hidden';
    cupContainer.appendChild(bobaSeeds);
    
    // CUP LAYERS (Bottom → Top order)
    // 1. Topping Layer
    const toppingLayer = document.createElement('img');
    toppingLayer.id = 'boba-topping';
    toppingLayer.className = 'boba-layer boba-topping-layer hidden';
    toppingLayer.alt = 'Topping';
    cupContainer.appendChild(toppingLayer);
    
    // 2. Tea Base Layer
    const teaBaseLayer = document.createElement('img');
    teaBaseLayer.id = 'boba-tea-base';
    teaBaseLayer.className = 'boba-layer boba-tea-layer hidden';
    teaBaseLayer.alt = 'Tea Base';
    cupContainer.appendChild(teaBaseLayer);
    
    // 3. Ice Layer (optional)
    const iceLayer = document.createElement('img');
    iceLayer.id = 'boba-ice';
    iceLayer.src = 'assets/adroji game/boba tea pt3/ice.png';
    iceLayer.className = 'boba-layer boba-ice-layer hidden';
    iceLayer.alt = 'Ice';
    cupContainer.appendChild(iceLayer);
    
    // 4. Straw Layer
    const strawLayer = document.createElement('img');
    strawLayer.id = 'boba-straw';
    strawLayer.className = 'boba-layer boba-straw-layer hidden';
    strawLayer.alt = 'Straw';
    cupContainer.appendChild(strawLayer);
    
    gameScreen.appendChild(cupContainer);
    
    // NAME DISPLAY LAYERS (outside cup, showing names)
    // Tea Base Name Display
    const teaBaseNameLayer = document.createElement('img');
    teaBaseNameLayer.id = 'boba-tea-name';
    teaBaseNameLayer.className = 'boba-name-layer boba-tea-name-layer hidden';
    teaBaseNameLayer.alt = 'Tea Name';
    gameScreen.appendChild(teaBaseNameLayer);
    
    // Topping Name Display
    const toppingNameLayer = document.createElement('img');
    toppingNameLayer.id = 'boba-topping-name';
    toppingNameLayer.className = 'boba-name-layer boba-topping-name-layer hidden';
    toppingNameLayer.alt = 'Topping Name';
    gameScreen.appendChild(toppingNameLayer);
    
    // Sugar Name Display (between option button)
    const sugarNameLayer = document.createElement('img');
    sugarNameLayer.id = 'boba-sugar-name';
    sugarNameLayer.className = 'boba-name-layer boba-sugar-name-layer hidden';
    sugarNameLayer.alt = 'Sugar Name';
    gameScreen.appendChild(sugarNameLayer);
    
    // Option Button (clickable, appears during customization)
    const optionButton = document.createElement('img');
    optionButton.id = 'boba-option-button';
    optionButton.src = 'assets/adroji game/boba tea pt3/option button.png';
    optionButton.alt = 'Option Button';
    optionButton.className = 'boba-option-button hidden';
    optionButton.style.cursor = 'pointer';
    gameScreen.appendChild(optionButton);
    
    // CLICKABLE BUTTON AREAS (positioned over buttons.png sprite sheet)
    // Topping - Top Left
    const toppingBtn = createButtonArea('topping', 'boba-topping-btn', 'top-left');
    gameScreen.appendChild(toppingBtn);
    
    // Sugar - Bottom Left
    const sugarBtn = createButtonArea('sugar', 'boba-sugar-btn', 'bottom-left');
    gameScreen.appendChild(sugarBtn);
    
    // Straw - Bottom Right
    const strawBtn = createButtonArea('straw', 'boba-straw-btn', 'bottom-right');
    gameScreen.appendChild(strawBtn);
    
    // Ice - Bottom Middle
    const iceBtn = createButtonArea('ice', 'boba-ice-btn', 'bottom-middle');
    gameScreen.appendChild(iceBtn);
    
    // Bubble Tea (Tea Base) - Top Right
    const teaBaseBtn = createButtonArea('tea-base', 'boba-tea-base-btn', 'top-right');
    gameScreen.appendChild(teaBaseBtn);
    
    // Done Button - positioned over done button in buttons.png
    const doneBtn = createButtonArea('done', 'boba-done-btn', 'done-position');
    gameScreen.appendChild(doneBtn);
    
    
    bobaRoot.appendChild(gameScreen);
    
    // FINAL SCREEN (hidden initially)
    const finalScreen = document.createElement('div');
    finalScreen.id = 'boba-final-screen';
    finalScreen.className = 'boba-final-screen hidden';
    const finalImg = document.createElement('img');
    finalImg.src = 'assets/adroji game/boba tea pt3/after done.png';
    finalImg.alt = 'Completed';
    finalScreen.appendChild(finalImg);
    bobaRoot.appendChild(finalScreen);
    
    bobaScene.appendChild(bobaRoot);
    
    // Setup event handlers (ONCE)
    setupBobaHandlers();
}

// Create Button Area Helper (invisible clickable regions over buttons.png)
function createButtonArea(category, id, position) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.className = `boba-button-area boba-${position}`;
    btn.dataset.category = category;
    return btn;
}

// Setup Boba Event Handlers
function setupBobaHandlers() {
    // Start Button
    const startBtn = document.querySelector('.boba-start-btn');
    if (startBtn) {
        startBtn.onclick = () => {
            if (bobaState.locked) return;
            bobaState.started = true;
            bobaState.phase = 'toppings';
            const startScreen = document.getElementById('boba-start-screen');
            if (startScreen) startScreen.classList.add('hidden');
            const gameScreen = document.getElementById('boba-game-screen');
            if (gameScreen) gameScreen.classList.remove('hidden');
        };
    }
    
    // Buttons.png clickable area - triggers current phase action
    const buttonsSheet = document.getElementById('boba-buttons-sheet');
    if (buttonsSheet) {
        buttonsSheet.style.pointerEvents = 'auto';
        buttonsSheet.style.cursor = 'pointer';
        buttonsSheet.onclick = () => {
            if (!bobaState.started || bobaState.locked) return;
            handleBobaPhaseClick();
        };
    }
    
    // Option Button - cycles to next option in current phase
    const optionButton = document.getElementById('boba-option-button');
    if (optionButton) {
        optionButton.onclick = () => {
            if (!bobaState.started || bobaState.locked) return;
            handleOptionButtonClick();
        };
    }
    
    // Done Button
    const doneBtn = document.getElementById('boba-done-btn');
    if (doneBtn) {
        doneBtn.onclick = () => {
            if (!bobaState.started || bobaState.locked) return;
            handleDoneButton();
        };
    }
}

// Handle click on buttons.png based on current phase
function handleBobaPhaseClick() {
    if (bobaState.phase === 'toppings') {
        // Start toppings selection - show first topping
        if (bobaState.topping === -1) {
            bobaState.topping = 0;
        }
        updateBobaDisplay();
    } else if (bobaState.phase === 'drinks') {
        // Start drinks selection - show first drink
        if (bobaState.teaBase === -1) {
            bobaState.teaBase = 0;
        }
        updateBobaDisplay();
    } else if (bobaState.phase === 'sugar') {
        // Start sugar selection - show first sugar level
        if (bobaState.sugar === -1) {
            bobaState.sugar = 0;
        }
        updateBobaDisplay();
    } else if (bobaState.phase === 'ice') {
                // Toggle ice
                bobaState.ice = !bobaState.ice;
        updateBobaDisplay();
    } else if (bobaState.phase === 'straw') {
        // Start straw selection - show first straw
        if (bobaState.straw === -1) {
            bobaState.straw = 0;
        }
        updateBobaDisplay();
    }
}

// Handle option button click - cycles to next option
function handleOptionButtonClick() {
    if (bobaState.phase === 'toppings') {
        // Cycle to next topping
        const prevTopping = bobaState.topping;
        bobaState.topping = (bobaState.topping + 1) % toppings.length;
        updateBobaDisplay();
        // If we've cycled back to first topping, move to drinks phase
        if (bobaState.topping === 0 && prevTopping === toppings.length - 1) {
            bobaState.phase = 'drinks';
            bobaState.teaBase = -1; // Reset for drinks phase
            const optionButton = document.getElementById('boba-option-button');
            if (optionButton) optionButton.classList.add('hidden');
        }
    } else if (bobaState.phase === 'drinks') {
        // Cycle to next drink
        const prevTeaBase = bobaState.teaBase;
        bobaState.teaBase = (bobaState.teaBase + 1) % teaBases.length;
        updateBobaDisplay();
        // If we've cycled back to first drink, move to sugar phase
        if (bobaState.teaBase === 0 && prevTeaBase === teaBases.length - 1) {
            bobaState.phase = 'sugar';
            bobaState.sugar = -1; // Reset for sugar phase
            const optionButton = document.getElementById('boba-option-button');
            if (optionButton) optionButton.classList.add('hidden');
        }
    } else if (bobaState.phase === 'sugar') {
        // Cycle to next sugar level
        const prevSugar = bobaState.sugar;
        bobaState.sugar = (bobaState.sugar + 1) % sugarLevels.length;
        updateBobaDisplay();
        // If we've cycled back to first sugar, move to ice phase
        if (bobaState.sugar === 0 && prevSugar === sugarLevels.length - 1) {
            bobaState.phase = 'ice';
            const optionButton = document.getElementById('boba-option-button');
            if (optionButton) optionButton.classList.add('hidden');
        }
    } else if (bobaState.phase === 'straw') {
        // Cycle to next straw
        bobaState.straw = (bobaState.straw + 1) % straws.length;
        updateBobaDisplay();
    }
}

// Handle done button
function handleDoneButton() {
    if (bobaState.phase === 'straw' && bobaState.straw >= 0) {
        // Show final screen
        const finalScreen = document.getElementById('boba-final-screen');
        if (finalScreen) {
            finalScreen.classList.remove('hidden');
            // Make final screen clickable to go to place 4.1
            finalScreen.style.cursor = 'pointer';
            finalScreen.onclick = () => {
                startPlaceSelection();
            };
        }
    }
}

// Update Boba Display based on current phase
function updateBobaDisplay() {
    const optionButton = document.getElementById('boba-option-button');
    const toppingNameLayer = document.getElementById('boba-topping-name');
    const sugarNameLayer = document.getElementById('boba-sugar-name');
    const teaBaseNameLayer = document.getElementById('boba-tea-name');
    
    if (bobaState.phase === 'toppings') {
        // Show topping in glass + topping name + option button
        if (bobaState.topping >= 0) {
            const topping = toppings[bobaState.topping];
            // Show topping image in glass
            const toppingLayer = document.getElementById('boba-topping');
            if (toppingLayer && topping.file) {
                toppingLayer.src = `assets/adroji game/boba tea pt3/${topping.file}`;
                toppingLayer.classList.remove('hidden');
            }
            // Show topping name between option button
            if (toppingNameLayer && topping.displayName) {
                toppingNameLayer.src = `assets/adroji game/boba tea pt3/${topping.displayName}`;
                toppingNameLayer.classList.remove('hidden');
            }
            // Show option button
            if (optionButton) {
                optionButton.classList.remove('hidden');
            }
        }
    } else if (bobaState.phase === 'drinks') {
        // Show combined image + base + drink name
        if (bobaState.topping >= 0 && bobaState.teaBase >= 0) {
            const combinedFile = getCombinedToppingImage(bobaState.teaBase, bobaState.topping);
            const toppingLayer = document.getElementById('boba-topping');
            const teaBaseLayer = document.getElementById('boba-tea-base');
            const teaBase = teaBases[bobaState.teaBase];
            
            if (combinedFile && toppingLayer) {
                toppingLayer.src = `assets/adroji game/boba tea pt3/${combinedFile}`;
                toppingLayer.classList.remove('hidden');
            }
            if (teaBase && teaBaseLayer) {
                teaBaseLayer.src = `assets/adroji game/boba tea pt3/${teaBase.base}`;
                teaBaseLayer.classList.remove('hidden');
            }
            if (teaBase && teaBaseNameLayer && teaBase.displayName) {
                teaBaseNameLayer.src = `assets/adroji game/boba tea pt3/${teaBase.displayName}`;
                teaBaseNameLayer.classList.remove('hidden');
            }
            // Keep topping name visible
            if (toppingNameLayer) {
                const topping = toppings[bobaState.topping];
                if (topping && topping.displayName) {
                    toppingNameLayer.src = `assets/adroji game/boba tea pt3/${topping.displayName}`;
                    toppingNameLayer.classList.remove('hidden');
                }
            }
            if (optionButton) {
                optionButton.classList.remove('hidden');
            }
        }
    } else if (bobaState.phase === 'sugar') {
        // Show sugar name between option button
        if (bobaState.sugar >= 0) {
            const sugar = sugarLevels[bobaState.sugar];
            if (sugarNameLayer && sugar.file) {
                sugarNameLayer.src = `assets/adroji game/boba tea pt3/${sugar.file}`;
                sugarNameLayer.classList.remove('hidden');
            }
            if (optionButton) {
                optionButton.classList.remove('hidden');
            }
            // Keep previous selections visible
            updatePreviousSelections();
        }
    } else if (bobaState.phase === 'ice') {
        // Ice toggle - keep previous selections visible
        updatePreviousSelections();
        const iceLayer = document.getElementById('boba-ice');
        if (iceLayer) {
            if (bobaState.ice) {
                iceLayer.classList.remove('hidden');
            } else {
                iceLayer.classList.add('hidden');
            }
        }
        // After ice is toggled, automatically move to straw phase
        if (bobaState.ice) {
            bobaState.phase = 'straw';
            bobaState.straw = -1; // Reset for straw phase
        }
    } else if (bobaState.phase === 'straw') {
        // Show straw
        updatePreviousSelections();
        const strawLayer = document.getElementById('boba-straw');
        if (strawLayer && bobaState.straw >= 0) {
            const straw = straws[bobaState.straw];
            if (straw) {
                strawLayer.src = `assets/adroji game/boba tea pt3/${straw}`;
                strawLayer.classList.remove('hidden');
            }
        }
        if (optionButton) {
            optionButton.classList.remove('hidden');
        }
    }
}

// Update previous selections to remain visible
function updatePreviousSelections() {
    // Keep topping visible
    if (bobaState.topping >= 0) {
        const combinedFile = getCombinedToppingImage(bobaState.teaBase, bobaState.topping);
        const toppingLayer = document.getElementById('boba-topping');
        const teaBaseLayer = document.getElementById('boba-tea-base');
        
        if (combinedFile && toppingLayer) {
            toppingLayer.src = `assets/adroji game/boba tea pt3/${combinedFile}`;
            toppingLayer.classList.remove('hidden');
        }
        if (bobaState.teaBase >= 0 && teaBaseLayer) {
            const teaBase = teaBases[bobaState.teaBase];
            if (teaBase) {
                teaBaseLayer.src = `assets/adroji game/boba tea pt3/${teaBase.base}`;
                teaBaseLayer.classList.remove('hidden');
            }
        }
    }
    // Keep drink name visible
    if (bobaState.teaBase >= 0) {
        const teaBaseNameLayer = document.getElementById('boba-tea-name');
        const teaBase = teaBases[bobaState.teaBase];
        if (teaBaseNameLayer && teaBase && teaBase.displayName) {
            teaBaseNameLayer.src = `assets/adroji game/boba tea pt3/${teaBase.displayName}`;
            teaBaseNameLayer.classList.remove('hidden');
        }
    }
    // Keep topping name visible
    if (bobaState.topping >= 0) {
        const toppingNameLayer = document.getElementById('boba-topping-name');
        const topping = toppings[bobaState.topping];
        if (toppingNameLayer && topping && topping.displayName) {
            toppingNameLayer.src = `assets/adroji game/boba tea pt3/${topping.displayName}`;
            toppingNameLayer.classList.remove('hidden');
        }
    }
    // Keep sugar visible
    if (bobaState.sugar >= 0) {
        const sugarNameLayer = document.getElementById('boba-sugar-name');
        const sugar = sugarLevels[bobaState.sugar];
        if (sugarNameLayer && sugar && sugar.file) {
            sugarNameLayer.src = `assets/adroji game/boba tea pt3/${sugar.file}`;
            sugarNameLayer.classList.remove('hidden');
        }
    }
}


// Legacy function - replaced by updateBobaDisplay, but kept for compatibility
function updateBobaLayers() {
    updateBobaDisplay();
}

// Dress-Up Loading (Initial)
function initDressUpLoading() {
    // Destroy any existing dress-up
    destroyDressUp();
    
    const loadingFrame = document.getElementById('loading-progress-frame');
    if (!loadingFrame) return;
    
    const loadingFrames = [
        'loading_1.png',
        'loading_2.png',
        'loading_3.png',
        'loading_4.png'
    ];
    
    // Loop the frames a few times (3 times) with increasing size
    let loopCount = 0;
    let frameIndex = 0;
    const maxLoops = 3;
    let currentScale = 1;
    const scaleIncrement = 0.3;
    
    // Reset scale initially
    loadingFrame.style.transform = 'scale(1)';
    
    const frameInterval = setInterval(() => {
        if (frameIndex < loadingFrames.length) {
            loadingFrame.src = `assets/adroji game/dress up pt 2/${loadingFrames[frameIndex]}`;
            // Increase size gradually
            currentScale = 1 + (loopCount * scaleIncrement) + (frameIndex * scaleIncrement / loadingFrames.length);
            loadingFrame.style.transform = `scale(${currentScale})`;
            frameIndex++;
        } else {
            frameIndex = 0;
            loopCount++;
            if (loopCount >= maxLoops) {
            clearInterval(frameInterval);
                // Reset scale
                loadingFrame.style.transform = 'scale(1)';
                // After loops, immediately transition to dress-up scene
            setTimeout(() => {
                showScene('dress-up-scene');
                initDressUp();
            }, 250);
            }
        }
    }, 250);
}

// Dress-Up Scene - Category Options (All Categories) - FINAL AUTHORITATIVE MAPPING
const outfitCategories = {
    // Top Row Categories
    top: [
        'dress_up_game default shirt.png',
        'dress_up_game top1.png',
        'dress_up_game top2.png',
        'dress_up_game fendershirt.png',
        'dress_up_game red sweater.png'
    ],
    bottom: [
        'dress_up_game defaultpants.png',
        'dress_up_game blackjeans.png',
        'dress_up_game_blue_pants.png',
        'dress_up_game plaid skirt.png',
        'dress_up_game slitskirt.png'
    ],
    necklace: [
        null,
        'dress_up_game heart necklace.png',
        'dress_up_game necklace 2.png',
        'dress_up_game necklace 3.png'
    ],
    bangles: [
        null,
        'dress_up_game bangle lefthand.png',
        'dress_up_game bangle right hand.png',
        'dress_up_game bangle both.png'
    ],
    // Right Panel Categories
    hair: [
        'dress_up_game_defaulthair.png',
        'dress_up_game-hair open.png',
        'dress_up_game braids.png',
        'dress_up_game hair tied up.png',
        'dress_up_game hairband.png',
        'dress_up_game star clips.png',
    ],
    eyes: [
        null,
        'dress_up_game eye1.png',
        'dress_up_game eye2.png',
        'dress_up_game eye3.png'
    ],
    lips: [
        null,
        'dress_up_game lip1.png',
        'dress_up_game lip2.png',
        'dress_up_game lip3.png'
    ],
    star: [
        null,
        'dress_up_game headphones.png'
    ],
    outerwear: [
        null
    ],
    shoes: [
        null,
        'dress_up_ game- black shoes.png',
        'dress_up_game shoes2.png',
        'dress_up_game_red shoes.png',
        'dress_up_game speedcat puma shoes.png',
        'dress_up_game- boots.png'
    ],
    // Additional categories
    earrings: [
        null,
        'dress_up_game strawberry earring.png',
        'dress_up_game silver earring.png',
        'dress_up_game square earring.png'
    ],
    bag: [
        null,
        'dress_up_game black bag.png',
        'dress_up_game cat totebag.png',
        'dress_up_game bag1.png'
    ]
};

// Arrow mapping - each category has a corresponding arrow PNG
const arrowMap = {
    top: 'dress_up_game-tops arrow.png',
    bottom: 'dress_up_game-bottoms arrow.png',
    necklace: 'dress_up_game-necklace arroe.png',
    bangles: 'dress_up_game-bangles arrow.png',
    hair: 'dress_up_game-hair arrow.png',
    eyes: 'dress_up_game-eye arrow.png',
    lips: 'dress_up_game-lip arrow.png',
    star: 'dress_up_game-bag arriw.png',
    shoes: 'dress_up_game-shoes arrow.png',
    earrings: 'dress_up_game-earrings arrow.png',
    bag: 'dress_up_game-bag arriw.png',
    outerwear: 'dress_up_game-tops arrow.png'
};

// Active category and arrow state
let activeCategory = null;
let activeArrow = null;

// Dress-Up Scene - Render Once, Never Re-render (FINAL AUTHORITATIVE)
function initDressUp() {
    // Destroy any existing dress-up first
    destroyDressUp();
    
    const dressUpScene = document.getElementById('dress-up-scene');
    if (!dressUpScene) return;
    
    // Create dressup-root container (RENDER ONCE)
    const dressupRoot = document.createElement('div');
    dressupRoot.id = 'dressup-root';
    
    // Background
    const bg = document.createElement('img');
    bg.id = 'dressup-bg';
    bg.src = 'assets/adroji game/dress up pt 2/dress_up_game bg.png';
    bg.alt = 'Background';
    bg.className = 'dressup-bg-layer';
    dressupRoot.appendChild(bg);
    
    // CHARACTER ZONE: Character Stack (Centered, Fixed Scale)
    // All layers share the same origin point for perfect alignment
    // Character never moves, never resizes, never re-renders
    const characterStack = document.createElement('div');
    characterStack.id = 'character-stack';
    
    // Base: skeleton.png (MANDATORY - bottom layer, nude character)
    const skeleton = document.createElement('img');
    skeleton.className = 'character-layer';
    skeleton.id = 'dressup-skeleton';
    skeleton.src = 'assets/adroji game/dress up pt 2/dress_up_game skeleton.png';
    skeleton.alt = 'Skeleton';
    characterStack.appendChild(skeleton);
    
    // Default layers (MANDATORY - always visible, cover nude skeleton)
    // These start with default src to cover nude skeleton, then updateOutfitLayer will change them when cycling
    // Layer order: bottom to top (z-index order)
    const defaultLayers = [
        { id: 'dressup-bottom', category: 'bottom', defaultSrc: 'dress_up_game defaultpants.png' },
        { id: 'dressup-top', category: 'top', defaultSrc: 'dress_up_game default shirt.png' },
        { id: 'dressup-hair', category: 'hair', defaultSrc: 'dress_up_game_defaulthair.png' }
    ];
    
    // Optional layers (hidden by default)
    const optionalLayers = [
        { id: 'dressup-outerwear', category: 'outerwear' },
        { id: 'dressup-shoes', category: 'shoes' },
        { id: 'dressup-necklace', category: 'necklace' },
        { id: 'dressup-earrings', category: 'earrings' },
        { id: 'dressup-bangles', category: 'bangles' },
        { id: 'dressup-bag', category: 'bag' },
        { id: 'dressup-eyes', category: 'eyes' },
        { id: 'dressup-lips', category: 'lips' },
        { id: 'dressup-star', category: 'star' },
        { id: 'dressup-hair-accessory', category: 'hair-accessory' } // For hairband and star clips on top of default hair
    ];
    
    // Create default layers (always visible)
    // These start with default src to cover nude skeleton, then updateOutfitLayer will change them when cycling
    defaultLayers.forEach(layer => {
        const img = document.createElement('img');
        img.className = 'character-layer';
        img.id = layer.id;
        img.dataset.category = layer.category;
        img.alt = layer.category;
        // Start with default src to cover nude skeleton (index 0)
        img.src = `assets/adroji game/dress up pt 2/${layer.defaultSrc}`;
        characterStack.appendChild(img);
    });
    
    // Create optional layers (hidden by default)
    optionalLayers.forEach(layer => {
        const img = document.createElement('img');
        img.className = 'character-layer';
        img.id = layer.id;
        img.dataset.category = layer.category;
        img.alt = layer.category;
        img.classList.add('hidden');
        characterStack.appendChild(img);
    });
    
    dressupRoot.appendChild(characterStack);
    
    // UI Layer (Screen Space - Never Mixes with Character)
    const uiLayer = document.createElement('div');
    uiLayer.id = 'dressup-ui';
    
    // BUTTON SPRITE SHEET: dress_up_game buttons.png
    // This image contains all UI buttons visually
    const buttonSpriteSheet = document.createElement('img');
    buttonSpriteSheet.id = 'button-sprite-sheet';
    buttonSpriteSheet.src = 'assets/adroji game/dress up pt 2/dress_up_game buttons.png';
    buttonSpriteSheet.alt = 'Button Sprite Sheet';
    buttonSpriteSheet.className = 'button-sprite-sheet';
    uiLayer.appendChild(buttonSpriteSheet);
    
    // TOP ZONE: Category Selectors (Top Row)
    // These buttons select category and activate arrows
    const topRow = document.createElement('div');
    topRow.id = 'top-zone';
    topRow.className = 'dressup-zone';
    const topCategories = ['top', 'bottom', 'earrings', 'necklace', 'bangles'];
    
    topCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'ui-btn category-selector';
        btn.dataset.category = cat;
        btn.setAttribute('aria-label', cat);
        topRow.appendChild(btn);
    });
    uiLayer.appendChild(topRow);
    
    // RIGHT PANEL: Appearance Controls (Right Side)
    // These buttons activate arrows
    const rightColumn = document.createElement('div');
    rightColumn.id = 'right-panel';
    rightColumn.className = 'dressup-zone';
    const rightCategories = ['hair', 'bag', 'eyes', 'lips', 'star', 'shoes'];
    
    rightCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'ui-btn appearance-control';
        btn.dataset.category = cat;
        btn.setAttribute('aria-label', cat);
        rightColumn.appendChild(btn);
    });
    uiLayer.appendChild(rightColumn);
    
    // ARROW CONTAINER: Only one arrow visible at a time
    const arrowContainer = document.createElement('div');
    arrowContainer.id = 'arrow-container';
    arrowContainer.className = 'arrow-container hidden';
    const arrowImg = document.createElement('img');
    arrowImg.id = 'active-arrow';
    arrowImg.className = 'arrow-img';
    arrowImg.alt = 'Active Arrow';
    arrowContainer.appendChild(arrowImg);
    uiLayer.appendChild(arrowContainer);
    
    // BOTTOM ZONE: Reset / Done Buttons (Visual only, logic later)
    const bottomZone = document.createElement('div');
    bottomZone.id = 'bottom-zone';
    bottomZone.className = 'dressup-zone';
    
    const resetBtn = document.createElement('button');
    resetBtn.id = 'reset-btn';
    resetBtn.className = 'ui-btn action-btn';
    resetBtn.dataset.action = 'reset';
    resetBtn.setAttribute('aria-label', 'Reset');
    bottomZone.appendChild(resetBtn);
    
    const doneBtn = document.createElement('button');
    doneBtn.id = 'done-btn';
    doneBtn.className = 'ui-btn action-btn';
    doneBtn.dataset.action = 'done';
    doneBtn.setAttribute('aria-label', 'Done');
    bottomZone.appendChild(doneBtn);
    
    uiLayer.appendChild(bottomZone);
    
    dressupRoot.appendChild(uiLayer);
    dressUpScene.appendChild(dressupRoot);
    
    // Initialize outfit state to defaults (index 0 = default)
    gameState.outfit = {
        hair: 0,
        top: 0,
        bottom: 0,
        shoes: 0,
        necklace: 0,
        bangles: 0,
        bag: 0,
        eyes: 0,
        lips: 0,
        earrings: 0,
        outerwear: 0,
        star: 0,
        makeup: 0
    };
    
    activeCategory = null;
    activeArrow = null;
    
    // Render all layers (ONCE) - update based on gameState
    // This ensures default layers use the correct initial state
    defaultLayers.forEach(layer => {
        updateOutfitLayer(layer.category);
    });
    optionalLayers.forEach(layer => {
        updateOutfitLayer(layer.category);
    });
    
    // Force update to ensure layers reflect current gameState
    // This is important for default layers that should start at index 0
    updateOutfitLayer('hair');
    updateOutfitLayer('top');
    updateOutfitLayer('bottom');
    // Initialize hair-accessory layer as hidden
    const hairAccessoryLayer = document.getElementById('dressup-hair-accessory');
    if (hairAccessoryLayer) {
        hairAccessoryLayer.classList.add('hidden');
    }
    
    // Setup button handlers (ONCE)
    setupDressUpButtons();
}

// Update Outfit Layer - Swaps images only, no re-render
function updateOutfitLayer(category) {
    const layerId = `dressup-${category}`;
    const layer = document.getElementById(layerId);
    if (!layer) return;
    
    const index = gameState.outfit[category] || 0;
    const options = outfitCategories[category];
    if (!options || options.length === 0) {
        // If no options, hide the layer (except required defaults)
        if (category !== 'hair' && category !== 'top' && category !== 'bottom') {
            layer.classList.add('hidden');
        }
        return;
    }
    
    const asset = options[index];
    
    // For required defaults (hair, top, bottom): show default only at index 0, otherwise show selected
    if (category === 'hair' || category === 'top' || category === 'bottom') {
        // Special handling for hair: if hairband or star clips are selected, keep default hair visible
        if (category === 'hair') {
            const isHairAccessory = asset && (asset.includes('hairband') || asset.includes('star clips'));
            
            if (isHairAccessory) {
                // Show default hair as base, and accessory on top
                layer.src = 'assets/adroji game/dress up pt 2/dress_up_game_defaulthair.png';
                layer.classList.remove('hidden');
                
                // Show the accessory in the hair-accessory layer
                const accessoryLayer = document.getElementById('dressup-hair-accessory');
                if (accessoryLayer && asset) {
                    accessoryLayer.src = `assets/adroji game/dress up pt 2/${asset}`;
                    accessoryLayer.classList.remove('hidden');
                }
            } else {
                // Normal hair option - show selected hair, hide accessory
                if (asset) {
                    layer.src = `assets/adroji game/dress up pt 2/${asset}`;
                    layer.classList.remove('hidden');
                } else {
                    layer.src = 'assets/adroji game/dress up pt 2/dress_up_game_defaulthair.png';
                    layer.classList.remove('hidden');
                }
                
                // Hide hair accessory layer
                const accessoryLayer = document.getElementById('dressup-hair-accessory');
                if (accessoryLayer) {
                    accessoryLayer.classList.add('hidden');
                }
            }
        } else {
            // For top and bottom, normal behavior
            if (asset) {
                layer.src = `assets/adroji game/dress up pt 2/${asset}`;
                layer.classList.remove('hidden');
            } else {
                // Fallback to default only if asset is null (shouldn't happen, but safety)
                if (category === 'top') {
                    layer.src = 'assets/adroji game/dress up pt 2/dress_up_game default shirt.png';
                } else if (category === 'bottom') {
                    layer.src = 'assets/adroji game/dress up pt 2/dress_up_game defaultpants.png';
                }
                layer.classList.remove('hidden');
            }
        }
    } else if (category === 'hair-accessory') {
        // Hair accessory layer - handled in hair category logic above
        return;
    } else {
        // For optional items, show only if asset exists
        if (asset) {
            layer.src = `assets/adroji game/dress up pt 2/${asset}`;
            layer.classList.remove('hidden');
        } else {
            layer.classList.add('hidden');
        }
    }
}

// Show Arrow - Only one arrow visible at a time
function showArrow(category) {
    const arrowContainer = document.getElementById('arrow-container');
    const arrowImg = document.getElementById('active-arrow');
    
    if (!arrowContainer || !arrowImg) return;
    
    const arrowFile = arrowMap[category];
    if (!arrowFile) {
        arrowContainer.classList.add('hidden');
        activeArrow = null;
        return;
    }
    
    arrowImg.src = `assets/adroji game/dress up pt 2/${arrowFile}`;
    arrowContainer.classList.remove('hidden');
    activeArrow = category;
}

// Hide Arrow
function hideArrow() {
    const arrowContainer = document.getElementById('arrow-container');
    if (arrowContainer) {
        arrowContainer.classList.add('hidden');
    }
    activeArrow = null;
}

// Cycle Category - Swaps images only, no re-render
function cycleCategory(category) {
    const options = outfitCategories[category];
    if (!options || options.length === 0) return;
    
    const currentIndex = gameState.outfit[category] || 0;
    let nextIndex;
    
    // For hair, top, bottom: once arrow is clicked, never return to default (index 0)
    if (category === 'hair' || category === 'top' || category === 'bottom') {
        if (currentIndex === 0) {
            // First click: go from default (0) to first non-default (1)
            nextIndex = 1;
        } else {
            // Already past default: cycle through non-default options, skip 0
            nextIndex = (currentIndex + 1) % options.length;
            if (nextIndex === 0) {
                nextIndex = 1; // Skip default, loop to first non-default option
            }
        }
    } else {
        // Normal cycling for other categories
        nextIndex = (currentIndex + 1) % options.length;
    }
    
    gameState.outfit[category] = nextIndex;
    
    // Swap image only - no re-render
    updateOutfitLayer(category);
}

// Setup Dress-Up Buttons (ONCE)
function setupDressUpButtons() {
    // TOP ZONE: Category Selectors
    // Clicking selects category and activates arrow (does not change character)
    document.querySelectorAll('.category-selector[data-category]').forEach(btn => {
        btn.onclick = () => {
            const category = btn.dataset.category;
            activeCategory = category;
            showArrow(category);
        };
    });
    
    // RIGHT PANEL: Appearance Controls
    // Clicking activates arrow (does not change character)
    document.querySelectorAll('.appearance-control[data-category]').forEach(btn => {
        btn.onclick = () => {
            const category = btn.dataset.category;
            activeCategory = category;
            showArrow(category);
        };
    });
    
    // ARROW: Clicking cycles through options for active category
    const arrowContainer = document.getElementById('arrow-container');
    if (arrowContainer) {
        arrowContainer.onclick = () => {
            if (activeArrow) {
                cycleCategory(activeArrow);
            }
        };
    }
    
    // BOTTOM ZONE: Reset button - Reset to defaults (skeleton + default hair, top, bottom)
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.onclick = () => {
            // Reset to defaults: skeleton + default hair + default shirt + default pants
            gameState.outfit = {
                hair: 0,
                top: 0,
                bottom: 0,
                shoes: 0,
                necklace: 0,
                bangles: 0,
                bag: 0,
                eyes: 0,
                lips: 0,
                earrings: 0,
                outerwear: 0,
                star: 0,
                makeup: 0
            };
            
            activeCategory = null;
            hideArrow();
            
            // Update all layers (swaps images only, no re-render)
            // Reset to default state: skeleton + default hair, top, bottom
            updateOutfitLayer('hair');
            updateOutfitLayer('top');
            updateOutfitLayer('bottom');
            updateOutfitLayer('shoes');
            updateOutfitLayer('necklace');
            updateOutfitLayer('earrings');
            updateOutfitLayer('bangles');
            updateOutfitLayer('bag');
            updateOutfitLayer('eyes');
            updateOutfitLayer('lips');
            updateOutfitLayer('outerwear');
            updateOutfitLayer('star');
            
            // Hide hair accessory layer
            const hairAccessoryLayer = document.getElementById('dressup-hair-accessory');
            if (hairAccessoryLayer) {
                hairAccessoryLayer.classList.add('hidden');
            }
        };
    }
    
    // BOTTOM ZONE: Done button (logic for later)
    const doneBtn = document.getElementById('done-btn');
    if (doneBtn) {
        doneBtn.onclick = () => {
            onDoneDressUp();
        };
    }
}

// DONE Button Handler
function onDoneDressUp() {
    // Lock UI to prevent further interactions
    lockDressUpUI();
    
    // Hide button sprite sheet (dress_up_game buttons.png)
    const buttonSpriteSheet = document.getElementById('button-sprite-sheet');
    if (buttonSpriteSheet) {
        buttonSpriteSheet.style.display = 'none';
    }
    
    // Show final header button (dress_up_game final header button.png)
    const uiLayer = document.getElementById('dressup-ui');
    if (uiLayer) {
        const finalHeader = document.createElement('img');
        finalHeader.id = 'dressup-final-header';
        finalHeader.src = 'assets/adroji game/dress up pt 2/dress_up_game final header button.png';
        finalHeader.alt = 'Final Header';
        finalHeader.className = 'dressup-final-header';
        finalHeader.style.position = 'fixed';
        finalHeader.style.left = '50%';
        finalHeader.style.top = '50%';
        finalHeader.style.transform = 'translate(-50%, -50%)';
        finalHeader.style.zIndex = '100';
        finalHeader.style.pointerEvents = 'none';
        uiLayer.appendChild(finalHeader);
    }
        
    // Show completed outfit on background for a moment, then transition
        setTimeout(() => {
            // Show dress-up loading screen (same as beginning)
            showScene('dress-up-loading');
            playDressUpLoadingSequence(() => {
            // After loading, transition to boba section
                destroyDressUp();
                startBobaGame();
            });
    }, 2000); // Show completed outfit for 2 seconds
}

// Play Dress-Up Loading Sequence (same as initial loading)
function playDressUpLoadingSequence(callback) {
    const loadingFrame = document.getElementById('loading-progress-frame');
    if (!loadingFrame) {
        if (callback) callback();
        return;
    }
    
    const loadingFrames = [
        'loading_1.png',
        'loading_2.png',
        'loading_3.png',
        'loading_4.png'
    ];
    
    // Reset to first frame
    loadingFrame.src = `assets/adroji game/dress up pt 2/${loadingFrames[0]}`;
    
    let frameIndex = 1;
    const frameInterval = setInterval(() => {
        if (frameIndex < loadingFrames.length) {
            loadingFrame.src = `assets/adroji game/dress up pt 2/${loadingFrames[frameIndex]}`;
            frameIndex++;
        } else {
            clearInterval(frameInterval);
            // After loading_4, call callback
            setTimeout(() => {
                if (callback) callback();
            }, 250);
        }
    }, 250);
}

// ============================================
// PART 4 - PLACES SYSTEM
// ============================================

// Place State
const placeState = {
    currentPlace: null, // 'luxembourg', 'palais', 'seine', 'vosges'
    inboxOpen: false,
    currentVideo: null
};

// Place Configuration
const placeConfig = {
    luxembourg: {
        name: 'luxembourg',
        displayName: 'Jardin du Luxembourg',
        bg: 'Luxembourg_garden-bg.png',
        card: 'Luxembourg_garden-cardholder.png',
        names: [
            { img: 'proj 1.png', audio: 'proj.ogg', video: 'redpandacompress_1767001630.MP4' },
            { img: 'ma1.png', audio: 'ma.ogg', video: 'redpandacompress_1767001630.MP4' }
        ],
        folder: 'luxembourg gardens'
    },
    palais: {
        name: 'palais',
        displayName: 'Palais Royal Garden',
        bg: 'palais_royal-bg.png',
        card: 'palais_royal-namecard.png',
        names: [
            { img: 'shraddha 1.png', audio: 'shraddha.ogg', video: 'redpandacompress_1767002444.MP4' },
            { img: 'mummum 1.png', audio: 'mummum.ogg', video: 'redpandacompress_1767002444.MP4' },
            { img: 'mummum 1.png', audio: 'mummum 2.ogg', video: 'redpandacompress_1767002444.MP4' }
        ],
        folder: 'palais royal garden'
    },
    seine: {
        name: 'seine',
        displayName: 'La Seine',
        bg: 'la_seine-bg.png',
        card: 'la_seine-cardname.png',
        names: [
            { img: 'bhavna1.png', audio: 'bhavna.ogg', video: 'redpandacompress_1767002021.MP4' },
            { img: 'selin1.png', audio: 'selin.ogg', video: 'redpandacompress_1767002021.MP4' }
        ],
        folder: 'seine'
    },
    vosges: {
        name: 'vosges',
        displayName: 'Place des Vosges',
        bg: 'place_des_vosges-bg.png',
        card: 'place_des_vosges.namecard.png',
        names: [
            { img: 'abonti 1.png', audio: null, video: 'redpandacompress_1767002235.MP4' },
            { img: 'abonti 1.png', audio: null, video: 'redpandacompress_1767002235.MP4' },
            { img: 'abonti 1.png', audio: null, video: 'redpandacompress_1767002235.MP4' },
            { img: 'adi 1.png', audio: 'adi.ogg', video: 'redpandacompress_1767002235.MP4' }
        ],
        folder: 'vosges'
    }
};

// Start Place Selection (PART 4.1)
function startPlaceSelection() {
    // Stop any playing media from place detail
    const video = document.getElementById('place-video');
    const audio = document.getElementById('place-audio');
    if (video && !video.paused) {
        video.pause();
        video.currentTime = 0;
    }
    if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
    }
    placeState.currentVideo = null;
    
    showScene('place-selection-scene');
    initPlaceSelection();
}

// Initialize Place Selection Hub (PART 4.1)
function initPlaceSelection() {
    const placeScene = document.getElementById('place-selection-scene');
    if (!placeScene) return;

    // Clear any existing content
    const existing = document.getElementById('place-selection-root');
    if (existing) existing.remove();

    // Create root container
    const root = document.createElement('div');
    root.id = 'place-selection-root';

    // Background (not clickable)
    const bg = document.createElement('img');
    bg.src = 'assets/adroji game/place pt 4.1/bg.png';
    bg.alt = 'Background';
    bg.className = 'place-selection-bg';
    root.appendChild(bg);

    // Place Buttons (clickable)
    const placeButtons = document.createElement('img');
    placeButtons.src = 'assets/adroji game/place pt 4.1/place buttons.png';
    placeButtons.alt = 'Place Buttons';
    placeButtons.className = 'place-buttons-img';
    placeButtons.style.pointerEvents = 'none'; // Image itself not clickable
    root.appendChild(placeButtons);

    // Audrija Dialogue (non-clickable overlay)
    const dialogue = document.createElement('img');
    dialogue.src = 'assets/adroji game/place pt 4.1/audrija_dialogue.png';
    dialogue.alt = 'Dialogue';
    dialogue.className = 'place-dialogue-img';
    root.appendChild(dialogue);

    // Clickable areas for 4 places
    // Based on place buttons.png layout - need to create invisible clickable regions
    // Assuming buttons are arranged in a grid or specific layout
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'place-buttons-container';

    // Create 4 clickable areas (positions will be adjusted via CSS)
    const places = ['luxembourg', 'palais', 'seine', 'vosges'];
    places.forEach((place, index) => {
        const btn = document.createElement('button');
        btn.className = 'place-button-area';
        btn.dataset.place = place;
        btn.setAttribute('aria-label', placeConfig[place].displayName);
        buttonContainer.appendChild(btn);
    });

    root.appendChild(buttonContainer);
    placeScene.appendChild(root);

    // Setup handlers
    setupPlaceSelectionHandlers();

    // Screen stays visible for 4 seconds (no auto-transition, just stays)
    // Only place buttons are interactive
}

// Setup Place Selection Handlers
function setupPlaceSelectionHandlers() {
    document.querySelectorAll('.place-button-area').forEach(btn => {
        btn.onclick = () => {
            const place = btn.dataset.place;
            startPlaceDetail(place);
        };
    });
}

// Start Place Detail (PART 4.2)
function startPlaceDetail(placeName) {
    // Stop any previously playing media
    const video = document.getElementById('place-video');
    const audio = document.getElementById('place-audio');
    if (video && !video.paused) {
        video.pause();
        video.currentTime = 0;
    }
    if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
    }
    placeState.currentVideo = null;
    
    placeState.currentPlace = placeName;
    placeState.inboxOpen = false;
    showScene('place-detail-scene');
    initPlaceDetail(placeName);
}

// Initialize Place Detail Screen (PART 4.2)
function initPlaceDetail(placeName) {
    const placeScene = document.getElementById('place-detail-scene');
    if (!placeScene) return;

    const config = placeConfig[placeName];
    if (!config) return;

    // Clear any existing content
    const existing = document.getElementById('place-detail-root');
    if (existing) existing.remove();

    // Create root container
    const root = document.createElement('div');
    root.id = 'place-detail-root';

    // Background (not clickable)
    const bg = document.createElement('img');
    bg.src = `assets/adroji game/place pt 4.2/${config.folder}/${config.bg}`;
    bg.alt = 'Background';
    bg.className = 'place-detail-bg';
    root.appendChild(bg);

    // Name Card (not clickable)
    const card = document.createElement('img');
    card.src = `assets/adroji game/place pt 4.2/${config.folder}/${config.card}`;
    card.alt = 'Name Card';
    card.className = 'place-name-card';
    root.appendChild(card);

    // Name Images (clickable)
    config.names.forEach((nameData, index) => {
        const nameImg = document.createElement('img');
        nameImg.src = `assets/adroji game/place pt 4.2/${config.folder}/${nameData.img}`;
        nameImg.alt = `Name ${index + 1}`;
        nameImg.className = 'place-name-img';
        nameImg.dataset.nameIndex = index;
        nameImg.style.cursor = 'pointer';
        root.appendChild(nameImg);
    });

    // Use for all 4 button (clickable)
    const useButton = document.createElement('img');
    useButton.src = 'assets/adroji game/place pt 4.2/use for all 4.png';
    useButton.alt = 'Use Button';
    useButton.className = 'place-use-button';
    useButton.style.cursor = 'pointer';
    root.appendChild(useButton);

    // Back button (top left, clickable)
    const backButton = document.createElement('img');
    backButton.src = 'assets/adroji game/place pt 4.2/back button.png';
    backButton.alt = 'Back Button';
    backButton.className = 'place-back-button';
    backButton.id = 'place-back-button';
    backButton.style.cursor = 'pointer';
    root.appendChild(backButton);

    // Forward button (top right, clickable)
    const forwardButton = document.createElement('img');
    forwardButton.src = 'assets/adroji game/place pt 4.2/forward.png';
    forwardButton.alt = 'Forward Button';
    forwardButton.className = 'place-forward-button';
    forwardButton.id = 'place-forward-button';
    forwardButton.style.cursor = 'pointer';
    root.appendChild(forwardButton);

    // Inbox (hidden initially)
    const inbox = document.createElement('img');
    inbox.id = 'place-inbox';
    inbox.src = 'assets/adroji game/place pt 4.2/open inbox (all).png';
    inbox.alt = 'Inbox';
    inbox.className = 'place-inbox hidden';
    root.appendChild(inbox);

    // Video element (hidden initially)
    const video = document.createElement('video');
    video.id = 'place-video';
    video.className = 'place-video hidden';
    video.playsInline = true;
    root.appendChild(video);

    // Audio element (hidden)
    const audio = document.createElement('audio');
    audio.id = 'place-audio';
    audio.className = 'place-audio hidden';
    root.appendChild(audio);

    placeScene.appendChild(root);

    // Setup handlers
    setupPlaceDetailHandlers(placeName);
}

// Setup Place Detail Handlers
function setupPlaceDetailHandlers(placeName) {
    const config = placeConfig[placeName];
    if (!config) return;

    // Use button - show inbox
    const useButton = document.querySelector('.place-use-button');
    if (useButton) {
        useButton.onclick = () => {
            const inbox = document.getElementById('place-inbox');
            if (inbox) {
                inbox.classList.remove('hidden');
                placeState.inboxOpen = true;
            }
        };
    }

    // Name images - play audio and video
    document.querySelectorAll('.place-name-img').forEach(img => {
        img.onclick = () => {
            const nameIndex = parseInt(img.dataset.nameIndex);
            const nameData = config.names[nameIndex];
            if (!nameData) return;

            // Stop any currently playing media
            const currentVideo = document.getElementById('place-video');
            const currentAudio = document.getElementById('place-audio');
            if (currentVideo && !currentVideo.paused) {
                currentVideo.pause();
                currentVideo.currentTime = 0;
            }
            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Play audio if available (simultaneously with video)
            if (currentAudio && nameData.audio) {
                currentAudio.src = `assets/adroji game/place pt 4.2/${config.folder}/${nameData.audio}`;
                currentAudio.currentTime = 0;
                currentAudio.play().catch(e => console.log('Audio play failed:', e));
            }

            // Play video (simultaneously with audio)
            if (currentVideo && nameData.video) {
                currentVideo.src = `assets/adroji game/place pt 4.2/${config.folder}/${nameData.video}`;
                currentVideo.currentTime = 0;
                currentVideo.classList.remove('hidden');
                placeState.currentVideo = currentVideo;

                // When video ends, return to setup
                currentVideo.onended = () => {
                    currentVideo.classList.add('hidden');
                    placeState.currentVideo = null;
                    // Stop audio when video ends
                    if (currentAudio && !currentAudio.paused) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    // Inbox remains visible
                    // All buttons remain clickable
                };

                currentVideo.play().catch(e => console.log('Video play failed:', e));
            }
        };
    });

    // Back button (top left) - Back to Map, then disappears
    const backButton = document.getElementById('place-back-button');
    if (backButton) {
        backButton.onclick = () => {
            // Hide the back button
            backButton.classList.add('hidden');
            // Back to Map (PART 4.1)
            startPlaceSelection();
        };
    }

    // Forward button (top right) - Go Home (Ending)
    const forwardButton = document.getElementById('place-forward-button');
    if (forwardButton) {
        forwardButton.onclick = () => {
            // Go Home (Ending)
            startEnding();
        };
    }
}

// Start Ending
function startEnding() {
    showScene('ending-scene');
    // Show loading sequence first, then ending
    playEndingLoadingSequence(() => {
        initEnding();
    });
}

// Play Ending Loading Sequence
function playEndingLoadingSequence(callback) {
    const endingScene = document.getElementById('ending-scene');
    if (!endingScene) {
        if (callback) callback();
        return;
    }

    // Clear any existing content
    const existing = document.getElementById('ending-loading-root');
    if (existing) existing.remove();

    // Create loading root
    const loadingRoot = document.createElement('div');
    loadingRoot.id = 'ending-loading-root';

    // Background for loading sequence
    const loadingBg = document.createElement('img');
    loadingBg.src = 'assets/adroji game/ending/place_loading_final_bg.png';
    loadingBg.alt = 'Loading Background';
    loadingBg.className = 'ending-loading-bg';
    loadingRoot.appendChild(loadingBg);

    const loadingFrame = document.createElement('img');
    loadingFrame.id = 'ending-loading-frame';
    loadingFrame.className = 'ending-loading-frame';
    loadingRoot.appendChild(loadingFrame);

    endingScene.appendChild(loadingRoot);

    // Loading frames sequence
    const loadingFrames = [
        'place_loading_final-1.png',
        'place_loading_final-2.png',
        'place_loading_final-3.png',
        'place_loading_final-4.png',
        'place_loading_final-5.png',
        'place_loading_final-6.png',
        'place_loading_final-7.png'
    ];

    let frameIndex = 0;
    const frameInterval = setInterval(() => {
        if (frameIndex < loadingFrames.length) {
            loadingFrame.src = `assets/adroji game/ending/${loadingFrames[frameIndex]}`;
            frameIndex++;
        } else {
            clearInterval(frameInterval);
            // Remove loading root
            loadingRoot.remove();
            // Call callback to show ending
            if (callback) callback();
        }
    }, 400); // 400ms per frame
}

// Initialize Ending
function initEnding() {
    const endingScene = document.getElementById('ending-scene');
    if (!endingScene) return;

    // Clear any existing content
    const existing = document.getElementById('ending-root');
    if (existing) existing.remove();

    // Create root container
    const root = document.createElement('div');
    root.id = 'ending-root';

    // Background for ending slides
    const endBg = document.createElement('img');
    endBg.src = 'assets/adroji game/ending/end_slide-bg.png';
    endBg.alt = 'End Background';
    endBg.className = 'ending-bg';
    root.appendChild(endBg);

    // Show first end slide
    const endSlide = document.createElement('img');
    endSlide.src = 'assets/adroji game/ending/end_slide-1.png';
    endSlide.alt = 'End';
    endSlide.className = 'ending-slide';
    endSlide.style.cursor = 'pointer';
    root.appendChild(endSlide);

    // Clicking end slide shows second slide
    endSlide.onclick = () => {
        endSlide.src = 'assets/adroji game/ending/end_slide-2.png';
        endSlide.onclick = null; // Disable further clicks
    };

    endingScene.appendChild(root);
}

// Fix viewport height for iOS devices (iPhone 13, etc.)
function fixViewportHeight() {
    // Set CSS custom property for actual viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Also set safe area insets if available
    const safeAreaBottom = window.safeArea?.bottom || 0;
    document.documentElement.style.setProperty('--safe-area-bottom', `${safeAreaBottom}px`);
}

// Initialize game on load
document.addEventListener('DOMContentLoaded', () => {
    // Fix viewport height for mobile devices
    fixViewportHeight();
    
    // Recalculate on resize/orientation change
    window.addEventListener('resize', fixViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(fixViewportHeight, 100);
    });
    
    initStartScreen();
});
