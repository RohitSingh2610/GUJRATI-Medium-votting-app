(() => {
            // --- DATA ---
            // Consolidated candidate data for all categories.
            const candidates = {
                'head-class': { // Updated 'head-class' data as provided by the user
                    male: [
                        { name: "બેલડિયા પંથ", logoUrl: "gujarati_Medium\\બેલડિયા પંથ   કિયા.png" },
                        { name: "સવાણી તીર્થ", logoUrl: "gujarati_Medium\\Untitled design (6).png" }
                        
                    ],
                    female: [
                        { name: "દેસાઈ કિયા", logoUrl: "gujarati_Medium\\દેસાઈ કિયા.png" },
                        { name: "નાવડિયા દ્રિવા", logoUrl: "gujarati_Medium\\નાવડિયા દ્રિવા.png" }
                    ]
                },
                'green-house': {
                    male: [
                        { name: "શેલાડિયા જીલ", logoUrl: "gujarati_Medium\\શેલાડિયા જીલ.png" },
                        { name: "મકવાણા પ્રતિક", logoUrl: "gujarati_Medium\\મકવાણા પ્રતિક.png" }
                    ],
                    female: [
                        { name: "પરમાર નવ્યા", logoUrl: "gujarati_Medium\\પરમાર નવ્યા.png" },
                        { name: "પ્રજાપતી હેના", logoUrl: "gujarati_Medium\\પ્રજાપતી હેના.png" }
                    ]
                },
                'yellow-house': {
                    male: [
                        { name: "પાંચાણી આરવ", logoUrl: "gujarati_Medium\\પાંચાણી આરવ.png" },
                        { name: "ઉમરાળીયા યુગ", logoUrl: "gujarati_Medium\\ઉમરાળીયા યુગ.png" }
                    ],
                    female: [
                        { name: "નાકરાણી આર્વી", logoUrl: "gujarati_Medium\\નાકરાણી આર્વી.png" },
                        { name: "માલવિયા જેલી", logoUrl: "gujarati_Medium\\માલવિયા જેલી.png" }
                    ]
                },
                'red-house': {
                    male: [
                        { name: "કુંભાણી આરવ", logoUrl: "gujarati_Medium\\કુંભાણી આરવ.png" },
                        { name: "માવાણી હેત", logoUrl: "gujarati_Medium\\માવાણી હેત.png" }
                    ],
                    female: [
                        { name: "પટેલ વિહા", logoUrl: "gujarati_Medium\\પટેલ વિહા.png" },
                        { name: "કાછડિયા પલ ", logoUrl: "gujarati_Medium\\કાછડિયા પલ.png" }
                    ]
                },
                'blue-house': {
                    male: [
                        { name: "લુણાગરિયા ક્રિશ", logoUrl: "gujarati_Medium\\લુણાગરિયા ક્રિશ.png" },
                        { name: "વિરાણી રોમિલ", logoUrl: "gujarati_Medium\\વિરાણી રોમિલ.png" }
                    ],
                    female: [
                        { name: "ગધેસરિયા મહેક", logoUrl: "gujarati_Medium\\ગધેસરિયા મહેક.png" },
                        { name: "માંગુકિયા નિવા", logoUrl: "gujarati_Medium\\માંગુકિયા નિવા.png" }
                    ]
                }
            };

            // Voting icons specifically for 'head-class' candidates (updated as per user).
            const maleVotingIcons = [
                'logo_eng/POWER (Bhimani Ayush).png',
                'logo_eng/MASHAL (Keval Vekariya).png',
                'logo_eng/headboy logo-1.png',
                'logo_eng/FREEDOM (Jash Khunt) .jpg',
                'logo_eng/Nisharg.jpg'
            ];

            const femaleVotingIcons = [
                'logo_eng/rahi.jpg',
                'logo_eng/angel.png',
                'logo_eng/mistry.jpg'
            ];
            
            // Admin password for protected actions
            const ADMIN_PASSWORD = "admin123";
            
            // State variables for the application
            let currentCategory = null;
            let categorySessionProgress = {}; // Tracks if male/female votes have been cast in current session
            let currentAction = null; // 'view-results' or 'reset-votes', for password modal context

            // --- DOM ELEMENTS (Cached for performance) ---
            const views = {
                home: document.getElementById('home-view'),
                gender: document.getElementById('gender-selection-view'),
                candidate: document.getElementById('candidate-view'),
                results: document.getElementById('results-view'),
            };
            const genderCategoryTitle = document.getElementById('gender-category-title');
            const genderButtonsContainer = document.getElementById('gender-buttons');
            const candidateCategoryTitle = document.getElementById('candidate-category-title');
            const candidatesListEl = document.getElementById('candidates-list');
            const infoMessageEl = document.getElementById('info-message-candidate');
            const resultsListEl = document.getElementById('results-list');
            
            const passwordModal = document.getElementById('password-modal');
            const passwordInput = document.getElementById('password-input');
            const cancelPasswordBtn = document.getElementById('cancel-password');
            const submitPasswordBtn = document.getElementById('submit-password');
            const modalTitle = document.getElementById('modal-title');

            /**
             * Preloads images to improve perceived performance.
             * @param {string[]} imageUrls - An array of image URLs to preload.
             */
            const preloadImages = (imageUrls) => {
                imageUrls.forEach(url => {
                    const img = new Image();
                    img.src = url;
                });
            };

            // Preload all candidate and voting icons on initial load
            document.addEventListener('DOMContentLoaded', () => {
                const allImageUrls = [];
                Object.values(candidates).forEach(categoryData => {
                    if (categoryData.male) allImageUrls.push(...categoryData.male.map(c => c.logoUrl));
                    if (categoryData.female) allImageUrls.push(...categoryData.female.map(c => c.logoUrl));
                });
                // Removed preloading of maleVotingIcons and femaleVotingIcons as they are no longer used visually.
                preloadImages(allImageUrls);
            });


            // --- VIEW MANAGEMENT ---
            /**
             * Switches the currently displayed view.
             * @param {HTMLElement} viewToShow - The DOM element of the view to display.
             */
            const switchView = (viewToShow) => {
              Object.values(views).forEach(view => view.style.display = 'none');
              viewToShow.style.display = 'flex';
            };

            /** Displays the home view and resets the session progress. */
            const showHome = () => { 
                currentCategory = null; 
                categorySessionProgress = {};
                switchView(views.home); 
            };
            
            /** Displays the gender selection view for the current category. */
            const showGenderSelection = () => {
                switchView(views.gender);
                const displayName = categoryDisplayName(currentCategory);
                genderCategoryTitle.textContent = `Vote for ${displayName}`;
                
                const maleBtn = genderButtonsContainer.querySelector('[data-gender="male"]');
                const femaleBtn = genderButtonsContainer.querySelector('[data-gender="female"]');
                
                // Disable gender buttons if already voted in this session
                maleBtn.disabled = categorySessionProgress.male || false;
                femaleBtn.disabled = categorySessionProgress.female || false;
                
                // Apply category-specific class for styling consistency on gender buttons
                [maleBtn, femaleBtn].forEach(btn => {
                    btn.className = 'btn ' + categoryClass(currentCategory);
                });
            };
            
            /**
             * Displays the candidates for the selected gender and category.
             * @param {string} gender - 'male' or 'female'.
             */
            const showCandidates = (gender) => {
                switchView(views.candidate);
                infoMessageEl.classList.remove('visible');
                infoMessageEl.textContent = '';
                const displayName = categoryDisplayName(currentCategory);
                candidateCategoryTitle.textContent = `Candidates for ${displayName} (${gender})`;

                // Use a DocumentFragment to minimize DOM reflows during card creation
                const fragment = document.createDocumentFragment();
                const candidateObjects = candidates[currentCategory]?.[gender] || [];

                if (candidateObjects.length === 0) {
                    infoMessageEl.textContent = "No candidates available for this category.";
                    infoMessageEl.classList.add('visible');
                    candidatesListEl.innerHTML = ''; // Ensure list is clear if no candidates
                    return; 
                }
                
                // Voting icons are no longer used visually for candidate cards.
                // const iconsToUse = (currentCategory === 'head-class') 
                //                    ? ((gender === 'male') ? maleVotingIcons : femaleVotingIcons)
                //                    : []; // No specific icons for other houses

                // Check if a vote has already been cast for this gender in this category session
                const hasVotedForThisGender = categorySessionProgress[gender];

                candidateObjects.forEach((candidate, index) => {
                    const card = document.createElement('div');
                    card.className = `candidate-card ${categoryClass(currentCategory)}`;
                    
                    const logo = document.createElement('img');
                    logo.src = candidate.logoUrl;
                    logo.alt = `Logo for ${candidate.name}`;
                    logo.className = 'candidate-logo';
                    // Fallback for missing images
                    logo.onerror = () => { logo.src = 'https://placehold.co/150x150/CCCCCC/FFFFFF?text=Candidate'; };
                    
                    const nameEl = document.createElement('div');
                    nameEl.className = 'candidate-name';
                    nameEl.textContent = candidate.name;

                    const voteBtn = document.createElement('button');
                    voteBtn.className = `btn vote-btn ${categoryClass(currentCategory)}`;
                    voteBtn.textContent = 'Vote';
                    
                    // Disable all vote buttons for this gender if a vote has already been cast
                    if (hasVotedForThisGender) {
                        voteBtn.disabled = true;
                        voteBtn.textContent = 'Voted!';
                    } else {
                        // Enable the button and set the onclick handler if no vote has been cast yet
                        voteBtn.disabled = false; // Ensure it's enabled if not voted
                        voteBtn.onclick = (event) => {
                            event.target.disabled = true; // Disable the clicked button immediately
                            event.target.textContent = 'Voted!'; // Optional: change button text

                            // Disable all other vote buttons for this gender after a vote is cast
                            const allVoteButtons = candidatesListEl.querySelectorAll('.vote-btn');
                            allVoteButtons.forEach(btn => {
                                btn.disabled = true;
                                if (btn !== event.target) { // Don't overwrite "Voted!" on the clicked one
                                    btn.textContent = 'Already Voted'; // Indicate to user why others are disabled
                                }
                            });
                            
                            castVote(gender, candidate.name);
                        };
                    }

                    // Removed the code that adds the voting icon
                    // if (iconsToUse.length > 0 && iconsToUse[index]) {
                    //     const votingIcon = document.createElement('img');
                    //     votingIcon.src = iconsToUse[index];
                    //     votingIcon.alt = `Voting Icon for ${candidate.name}`;
                    //     votingIcon.className = 'voting-icon';
                    //     votingIcon.onerror = () => { votingIcon.src = 'https://placehold.co/60x60/CCCCCC/FFFFFF?text=Icon'; };
                    //     card.appendChild(votingIcon);
                    // }

                    card.append(logo, nameEl, voteBtn);
                    fragment.appendChild(card);
                });
                candidatesListEl.innerHTML = ''; // Clear previous cards efficiently
                candidatesListEl.appendChild(fragment); // Append all cards at once
            };
            
            /** Displays the results view. */
            const showResults = () => {
              switchView(views.results);
              renderResults();
            };
            
            // --- RENDERING RESULTS ---
            /** Renders the voting results from localStorage. */
            const renderResults = () => {
                const votes = JSON.parse(localStorage.getItem('schoolVotes')) || {};
                resultsListEl.innerHTML = ''; // Clear previous results

                let hasAnyResults = false; // Flag to check if there are any results to display

                Object.keys(candidates).forEach(category => {
                    const categoryVotes = votes[category] || {};
                    let hasCategoryResults = false; // Flag to check if current category has votes

                    const tempCategoryWrapper = document.createElement('div'); 
                    tempCategoryWrapper.className = `result-category ${categoryClass(category)}`;
                    
                    const categoryTitle = document.createElement('h3');
                    categoryTitle.textContent = categoryDisplayName(category);
                    tempCategoryWrapper.appendChild(categoryTitle);

                    ['male', 'female'].forEach(gender => {
                        const genderVotes = categoryVotes[gender] || {};
                        const currentCandidatesForGender = candidates[category]?.[gender] || [];

                        // Only proceed if there are candidates defined AND there are votes for them
                        if (currentCandidatesForGender.length > 0 && Object.keys(genderVotes).length > 0) {
                            hasCategoryResults = true;
                            hasAnyResults = true; // Mark that at least one result exists

                            const genderGroup = document.createElement('div');
                            genderGroup.className = 'result-gender-group';

                            const genderTitle = document.createElement('h4');
                            genderTitle.textContent = gender.charAt(0).toUpperCase() + gender.slice(1);
                            genderGroup.appendChild(genderTitle);
                            
                            const candidatesContainer = document.createElement('div');
                            candidatesContainer.className = 'result-candidates';
                            
                            // Sort candidates by their vote count in descending order
                            const sortedCandidates = [...currentCandidatesForGender].sort((a, b) => {
                                const votesA = genderVotes[a.name] || 0;
                                const votesB = genderVotes[b.name] || 0;
                                return votesB - votesA; // Descending order
                            });

                            sortedCandidates.forEach(candidate => {
                                const count = genderVotes[candidate.name] || 0; // Get count for the specific candidate
                                const el = document.createElement('div');
                                el.className = 'result-candidate';
                                el.innerHTML = `<span>${candidate.name}</span><span class="vote-count">${count}</span>`;
                                candidatesContainer.appendChild(el);
                            });
                            genderGroup.appendChild(candidatesContainer);
                            tempCategoryWrapper.appendChild(genderGroup);
                        }
                    });

                    // Only append the category wrapper if it actually contains results
                    if (hasCategoryResults) {
                        resultsListEl.appendChild(tempCategoryWrapper);
                    }
                });

                // Display a message if no voting results are available for any category
                if (!hasAnyResults) {
                    resultsListEl.innerHTML = '<p style="text-align: center; font-size: 1.2rem; color: #666; margin-top: 50px;">No voting results available yet.</p>';
                }
            };

            // --- LOGIC & HELPERS ---
            
            /**
             * Displays a temporary, stylish message box on the screen.
             * @param {string} message The message to display.
             */
            const showCustomMessage = (message) => {
                // Remove any existing message boxes to prevent stacking
                const existingBox = document.querySelector('.custom-message-box');
                if (existingBox) existingBox.remove();

                // Create the new message box element
                const messageBox = document.createElement('div');
                messageBox.className = 'custom-message-box';
                messageBox.style.cssText = `
                    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.85); color: white; padding: 15px 25px;
                    border-radius: 10px; z-index: 2000; font-size: 1rem; text-align: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3); opacity: 0;
                    transition: all 0.4s ease;
                `;
                messageBox.textContent = message;
                document.body.appendChild(messageBox);

                // Animate the message box in
                setTimeout(() => { 
                    messageBox.style.opacity = '1'; 
                    messageBox.style.top = '30px'; 
                }, 10);

                // Animate the message box out and remove it after a delay
                setTimeout(() => {
                    messageBox.style.opacity = '0';
                    messageBox.style.top = '20px';
                    // Remove the element after the transition is complete
                    messageBox.addEventListener('transitionend', () => messageBox.remove(), { once: true });
                }, 2200); // Display for 2.2 seconds before fading out
            };


            /**
             * Casts a vote for a specific candidate and updates localStorage.
             * @param {string} gender - The gender of the candidate ('male' or 'female').
             * @param {string} name - The name of the candidate.
             */
            const castVote = (gender, name) => {
                let votes = JSON.parse(localStorage.getItem('schoolVotes')) || {};
                if (!votes[currentCategory]) votes[currentCategory] = {};
                if (!votes[currentCategory][gender]) votes[currentCategory][gender] = {};
                
                votes[currentCategory][gender][name] = (votes[currentCategory][gender][name] || 0) + 1;
                localStorage.setItem('schoolVotes', JSON.stringify(votes));
                
                categorySessionProgress[gender] = true; // Mark this gender as voted in current session
                
                // Show message and navigate based on completion
                if (categorySessionProgress.male && categorySessionProgress.female) {
                    showCustomMessage("Thank you! All votes for this category are cast.");
                    setTimeout(showHome, 2500); // Go home after a short delay
                } else {
                    showCustomMessage("Vote successful! Please vote for the other gender.");
                    // After a delay, go back to gender selection if not both voted
                    setTimeout(showGenderSelection, 2500);
                }
            };

            /** Resets all votes stored in localStorage. */
            const resetVotes = () => {
                localStorage.removeItem('schoolVotes');
                showCustomMessage("All votes have been successfully reset.");
                // If on results page, re-render to show it's empty
                if (views.results.style.display === 'flex') {
                    renderResults();
                }
            };
            
            /**
             * Helper to get CSS class name for a category.
             * @param {string} cat - The category ID.
             * @returns {string} The CSS class name.
             */
            const categoryClass = (cat) => cat || '';

            /**
             * Helper to get display name for a category.
             * @param {string} cat - The category ID.
             * @returns {string} The human-readable display name.
             */
            const categoryDisplayName = (cat) => {
                if (cat === 'head-class') return "Head Boy/Head Girl"; // Special name for head-class
                return (cat || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            };

            // --- PASSWORD MODAL FUNCTIONS ---
            /**
             * Shows the password modal for protected actions.
             * @param {string} action - The action being performed ('view-results' or 'reset-votes').
             */
            const showPasswordModal = (action) => {
                currentAction = action;
                modalTitle.textContent = (action === 'view-results') 
                                       ? "Enter Password to View Results"
                                       : "Enter Admin Password to Reset Votes";
                passwordInput.value = ''; // Clear previous input
                passwordModal.classList.add('active'); // Show modal
                passwordInput.focus(); // Focus on input for convenience
            };

            /** Hides the password modal. */
            const hidePasswordModal = () => {
                passwordModal.classList.remove('active'); // Hide modal
            };

            /** Checks the entered password against the ADMIN_PASSWORD. */
            const checkPassword = () => {
                const enteredPassword = passwordInput.value.trim();
                if (enteredPassword === ADMIN_PASSWORD) {
                    hidePasswordModal();
                    if (currentAction === 'view-results') {
                        showResults();
                    } else if (currentAction === 'reset-votes') {
                        resetVotes();
                    }
                } else {
                    showCustomMessage("Incorrect password. Please try again.");
                    passwordInput.value = ''; // Clear input on incorrect password
                    passwordInput.focus(); // Re-focus for retry
                }
            };

            // --- EVENT LISTENERS ---
            // Event listener for category buttons on the home view using event delegation
            document.querySelector('#home-view .button-grid').addEventListener('click', (e) => {
                const categoryButton = e.target.closest('[data-category]');
                if (categoryButton) {
                    currentCategory = categoryButton.dataset.category;
                    categorySessionProgress = {}; // Reset session progress for new category
                    showGenderSelection();
                }
            });
            
            // Event listener for gender selection buttons using event delegation
            genderButtonsContainer.addEventListener('click', (e) => {
                const genderButton = e.target.closest('[data-gender]');
                if (genderButton && !genderButton.disabled) { 
                    showCandidates(genderButton.dataset.gender);
                }
            });
            
            // Event listeners for navigation buttons
            document.querySelector('[data-action="go-home"]').addEventListener('click', showHome);
            document.querySelector('[data-action="go-to-gender-select"]').addEventListener('click', showGenderSelection);
            
            // Admin panel buttons (show password modal before action)
            document.getElementById('show-results-btn').addEventListener('click', () => showPasswordModal('view-results'));
            document.getElementById('reset-btn').addEventListener('click', () => showPasswordModal('reset-votes'));
            
            // Back button on results page
            document.getElementById('results-back-btn').addEventListener('click', showHome);
            
            // Password modal event listeners
            cancelPasswordBtn.addEventListener('click', hidePasswordModal);
            submitPasswordBtn.addEventListener('click', checkPassword);
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    checkPassword(); // Check password on Enter key press
                }
            });

            // --- INITIALIZATION ---
            showHome(); // Start the application on the home view
        })();