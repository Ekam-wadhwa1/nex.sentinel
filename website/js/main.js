/**
 * Main Application Orchestrator
 * Coordinates card clicks, fullscreen technical blueprints details dialog slides,
 * specification templates injection, keyboard handlers, and content editing persistence.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Robot Specification Dataset (Default fallback)
    const defaultSpecsData = {
        vector: {
            title: 'NEX.Vector',
            tagline: 'Reconnaissance Unit // Forward Scout Node',
            platform: 'LEGO WeDo 2.0 / Bluetooth Smart',
            objective: 'Disaster flood mapping & route safety inspection',
            comm: 'Bluetooth Low Energy (BLE) Client',
            payload: '0.3 Kg Max (Sensor modules)',
            blueprint: 'assets/images/vector-blueprint.png',
            blueprintFilter: false,
            badge: 'SCOUT_UNIT',
            figNumber: '// FIG_01.A_BLE_ROVER',
            features: [
                'Micro-clearance chassis engineered for narrow passage exploration.',
                'Ultrasonic distance scanner logs flood barricades and dynamic debris grid markers.',
                'Rugged direct-drive wheel assemblies excel in slippery aquatic conditions.',
                'Bluetooth pings transmit real-time telemetry straight to command nodes.'
            ]
        },
        core: {
            title: 'NEX.Core',
            tagline: 'Mission Command Unit // System Decision Node',
            platform: 'LEGO Mindstorms EV3 / Wi-Fi Client',
            objective: 'Mission dispatch queue & supply sorting',
            comm: 'TCP/IP Socket Client / command router',
            payload: '0.8 Kg (Gripper assembly & smartphone array)',
            blueprint: 'assets/images/core-blueprint.png',
            blueprintFilter: false,
            badge: 'COMMAND_NODE',
            figNumber: '// FIG_02.B_HUB_SOLUTIONS',
            features: [
                'Motorized robotic gripper coordinates package positioning and logistics loading.',
                'Universal mobile dock integrates high-resolution cameras for remote visual inspection.',
                'Parses command maps and routes instructions to other active field rovers.',
                'Intelligent EV3 processor runs distributed queue managers locally.'
            ]
        },
        rescue: {
            title: 'NEX.Rescue',
            tagline: 'Emergency Logistics Unit // Payload Utility Node',
            platform: 'LEGO Mindstorms EV3 / Treads Platform',
            objective: 'Supply transport & barrier clearance operations',
            comm: 'TCP/IP Socket Client Node',
            payload: '1.5 Kg (High-capacity storage bed)',
            blueprint: 'assets/images/rescue-concept.png',
            blueprintFilter: true, // Special aesthetic styling: applies blue rendering blueprint layout on image
            badge: 'LOGISTICS_UNIT',
            figNumber: '// FIG_03.C_TRANS_SCHEMATIC',
            features: [
                'Heavily treaded tank caterpillar drive plows through muddy, broken terrain.',
                'High-torque forward scraper scraper lifts and pushes blocking debris tiles off roads.',
                'Large payload bed delivers medical packs, clean water rations, and emergency tools.',
                'Coordinates with scouting feedback to clear blocked paths before Vector continues.'
            ]
        }
    };

    // Load specs data from localStorage if existing
    let robotSpecsData = JSON.parse(localStorage.getItem('sentinel_robot_specs'));
    if (!robotSpecsData) {
        robotSpecsData = defaultSpecsData;
    }

    // 2. DOM Elements Selection
    const robotCards = document.querySelectorAll('.robot-card');
    const overlay = document.getElementById('robot-overlay');
    const closeBtn = document.querySelector('.overlay-close');

    // Overlay template targets
    const bpImage = document.getElementById('overlay-blueprint');
    const figNum = document.getElementById('overlay-diag-number');
    const badgeText = document.getElementById('overlay-label');
    const titleText = document.getElementById('overlay-title');
    const taglineText = document.getElementById('overlay-tagline');
    const specPlatform = document.getElementById('spec-platform');
    const specObjective = document.getElementById('spec-objective');
    const specComm = document.getElementById('spec-comm');
    const specPayload = document.getElementById('spec-payload');
    const featuresList = document.getElementById('overlay-features-list');

    // 3. Card Click Handlers
    robotCards.forEach(card => {
        card.addEventListener('click', () => {
            const robotKey = card.getAttribute('data-robot');
            const data = robotSpecsData[robotKey];

            if (data) {
                // Set data-active-robot tracker on overlay
                overlay.setAttribute('data-active-robot', robotKey);

                // Populate Overlay specifications
                titleText.innerText = data.title;
                taglineText.innerText = data.tagline;
                specPlatform.innerText = data.platform;
                specObjective.innerText = data.objective;
                specComm.innerText = data.comm;
                specPayload.innerText = data.payload;
                badgeText.innerText = data.badge;
                figNum.innerText = data.figNumber;

                // Load blueprint image and apply special filters
                bpImage.src = data.blueprint;
                bpImage.alt = `${data.title} technical schematic CAD diagram`;
                if (data.blueprintFilter) {
                    bpImage.classList.add('blueprint-blue-filter');
                } else {
                    bpImage.classList.remove('blueprint-blue-filter');
                }

                // Render features checklist items
                featuresList.innerHTML = '';
                data.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.innerText = feature;
                    
                    // If in edit mode, make list features editable
                    if (document.body.classList.contains('edit-enabled')) {
                        li.setAttribute('contenteditable', 'true');
                    }
                    
                    featuresList.appendChild(li);
                });

                // Set overlay fields editable if editing was enabled
                if (document.body.classList.contains('edit-enabled')) {
                    titleText.setAttribute('contenteditable', 'true');
                    taglineText.setAttribute('contenteditable', 'true');
                    specPlatform.setAttribute('contenteditable', 'true');
                    specObjective.setAttribute('contenteditable', 'true');
                    specComm.setAttribute('contenteditable', 'true');
                    specPayload.setAttribute('contenteditable', 'true');
                } else {
                    titleText.removeAttribute('contenteditable');
                    taglineText.removeAttribute('contenteditable');
                    specPlatform.removeAttribute('contenteditable');
                    specObjective.removeAttribute('contenteditable');
                    specComm.removeAttribute('contenteditable');
                    specPayload.removeAttribute('contenteditable');
                }

                // Display slide-in overlays
                const bpWrapper = document.querySelector('.overlay-blueprint-wrapper');
                if (bpWrapper) bpWrapper.classList.add('skeleton');
                overlay.classList.add('active');
                
                // Block body scrolling
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // 4. Close Overlay click handlers
    function closeOverlay() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('skeleton');
        
        // Short delay before resetting images
        setTimeout(() => {
            bpImage.src = '';
            overlay.setAttribute('data-active-robot', '');
        }, 300);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
    }

    // Close overlay by clicking outer backdrop area
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeOverlay();
        }
    });

    // 5. Close overlay with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeOverlay();
        }
    });

    // 6. Security Bypass Key Listener (404 View)
    const keyInput = document.getElementById('override-key');
    if (keyInput) {
        keyInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const value = keyInput.value.trim();
                const errFeedback = document.getElementById('error-feedback');
                const successFeedback = document.getElementById('success-feedback');

                if (value === 'nexus2026') {
                    if (errFeedback) errFeedback.classList.add('hidden');
                    if (successFeedback) {
                        successFeedback.classList.remove('hidden');
                        successFeedback.innerText = 'ACCESS_GRANTED // INITIALIZING SYSTEM_EDITOR...';
                    }

                    // Store unlocked key and load editor
                    localStorage.setItem('sentinel_unlocked', 'true');
                    setTimeout(() => {
                        window.location.hash = '#edit';
                    }, 1200);
                } else {
                    if (successFeedback) successFeedback.classList.add('hidden');
                    if (errFeedback) {
                        errFeedback.classList.remove('hidden');
                        errFeedback.innerText = 'ACCESS_DENIED // INVALID_SECURITY_KEY';
                    }
                    
                    // Input shake animation
                    keyInput.parentElement.style.animation = 'none';
                    setTimeout(() => {
                        keyInput.parentElement.style.animation = 'shake 0.4s ease';
                    }, 10);
                }
            }
        });
    }

    // Add Shake keyframe styling inline if not present
    if (!document.getElementById('shake-style-element')) {
        const style = document.createElement('style');
        style.id = 'shake-style-element';
        style.innerText = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-6px); }
                40%, 80% { transform: translateX(6px); }
            }
        `;
        document.head.appendChild(style);
    }

    // 7. Visual Editor Operations (Save and Exit)
    const btnSave = document.getElementById('btn-save-config');
    const btnExit = document.getElementById('btn-exit-editor');

    if (btnSave) {
        btnSave.addEventListener('click', () => {
            // Save standard text edits
            const textConfigs = {};
            const editables = document.querySelectorAll('[data-edit-id]');
            
            editables.forEach(el => {
                const editId = el.getAttribute('data-edit-id');
                if (el.tagName.toLowerCase() === 'img') {
                    textConfigs[editId] = el.getAttribute('src');
                } else if (el.tagName.toLowerCase() === 'text') {
                    textConfigs[editId] = el.textContent;
                } else {
                    textConfigs[editId] = el.innerHTML;
                }
            });

            localStorage.setItem('sentinel_text_configs', JSON.stringify(textConfigs));

            // Sync specification details if the overlay specs drawer is open
            const activeRobotKey = overlay.getAttribute('data-active-robot');
            if (activeRobotKey && robotSpecsData[activeRobotKey]) {
                robotSpecsData[activeRobotKey].title = titleText.innerText;
                robotSpecsData[activeRobotKey].tagline = taglineText.innerText;
                robotSpecsData[activeRobotKey].platform = specPlatform.innerText;
                robotSpecsData[activeRobotKey].objective = specObjective.innerText;
                robotSpecsData[activeRobotKey].comm = specComm.innerText;
                robotSpecsData[activeRobotKey].payload = specPayload.innerText;

                // Sync features checklist
                const updatedFeatures = [];
                featuresList.querySelectorAll('li').forEach(li => {
                    updatedFeatures.push(li.innerText || li.textContent);
                });
                robotSpecsData[activeRobotKey].features = updatedFeatures;
            }

            // Save specification dataset
            localStorage.setItem('sentinel_robot_specs', JSON.stringify(robotSpecsData));

            // Feedback visual notification
            showSaveConfirmationToast();
        });
    }

    if (btnExit) {
        btnExit.addEventListener('click', () => {
            localStorage.removeItem('sentinel_unlocked');
            window.location.hash = '#home';
        });
    }

    // 8. Image Picker inside Edit Mode
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('edit-enabled')) {
            const target = e.target;
            if (target.tagName.toLowerCase() === 'img' && target.hasAttribute('data-edit-id')) {
                e.preventDefault();
                const currentUrl = target.getAttribute('src');
                const newUrl = prompt('Modify visual component - Enter new image URL:', currentUrl);
                if (newUrl !== null && newUrl.trim() !== '') {
                    target.src = newUrl;
                }
            }
        }
    });

    // Helper: Toast Alert
    function showSaveConfirmationToast() {
        const oldToast = document.querySelector('.save-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'save-toast';
        toast.innerHTML = `<span class="pulse-dot-green"></span> TELEMETRY SYNCED // SYSTEMS ONLINE`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 3000);
    }

    // 9. Load Content Configuration from Local Storage
    const loadSavedContent = () => {
        const savedTexts = JSON.parse(localStorage.getItem('sentinel_text_configs'));
        if (savedTexts) {
            Object.keys(savedTexts).forEach(key => {
                const elements = document.querySelectorAll(`[data-edit-id="${key}"]`);
                elements.forEach(el => {
                    if (el.tagName.toLowerCase() === 'img') {
                        el.src = savedTexts[key];
                    } else if (el.tagName.toLowerCase() === 'text') {
                        el.textContent = savedTexts[key];
                    } else {
                        el.innerHTML = savedTexts[key];
                    }
                });
            });
        }
    };

    loadSavedContent();
});
