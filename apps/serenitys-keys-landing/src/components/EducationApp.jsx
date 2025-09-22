import React, { useState, useEffect } from 'react';
import './EducationApp.css';
import { sendKeymasterEnrollment, sendEducationInquiry, sendFormspreeSubmission } from '../utils/EmailService';
import SharedFooter from './SharedFooter';

const EducationApp = () => {
  // Main navigation state
  const [currentView, setCurrentView] = useState('home'); // 'home', 'curriculum', 'assessment', 'pricing', 'onboarding', 'contact'
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle URL changes for proper routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validViews = ['home', 'curriculum', 'assessment', 'pricing', 'onboarding', 'contact'];

      // Handle new URL structure: /serenitys-keys/view
      if (hash.startsWith('/serenitys-keys/')) {
        const view = hash.replace('/serenitys-keys/', '');
        if (validViews.includes(view)) {
          setCurrentView(view);
        }
      } else if (hash === '/serenitys-keys' || hash === '' || hash === '/') {
        setCurrentView('home');
      } else if (validViews.includes(hash)) {
        // Legacy support for old hash format
        setCurrentView(hash);
      }
    };

    // Set initial view based on URL
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  // Assessment state
  const [assessmentStep, setAssessmentStep] = useState(1); // 1: Age Selection, 2: Skills Test, 3: Results
  const [selectedAge, setSelectedAge] = useState('');
  const [typingText, setTypingText] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [assessmentResults, setAssessmentResults] = useState(null);

  // Enhanced typing assessment state
  const [currentWPM, setCurrentWPM] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [characterFeedback, setCharacterFeedback] = useState([]);
  const [timerInterval, setTimerInterval] = useState(null);

  // Typing assessment helper functions
  const calculateWPM = (typedText, timeInSeconds) => {
    const words = typedText.trim().split(/\s+/).length;
    const minutes = timeInSeconds / 60;
    return minutes > 0 ? Math.round(words / minutes) : 0;
  };

  const calculateAccuracy = (typedText, targetText) => {
    if (typedText.length === 0) return 100;
    let correctChars = 0;
    for (let i = 0; i < Math.min(typedText.length, targetText.length); i++) {
      if (typedText[i] === targetText[i]) correctChars++;
    }
    return Math.round((correctChars / typedText.length) * 100);
  };

  const generateCharacterFeedback = (typedText, targetText) => {
    const feedback = [];
    const maxLength = Math.max(typedText.length, targetText.length);

    for (let i = 0; i < maxLength; i++) {
      const typedChar = typedText[i] || '';
      const targetChar = targetText[i] || '';

      if (i < typedText.length) {
        if (typedChar === targetChar) {
          feedback.push({ char: typedChar, status: 'correct' });
        } else {
          feedback.push({ char: typedChar, status: 'incorrect' });
        }
      } else {
        feedback.push({ char: targetChar, status: 'pending' });
      }
    }
    return feedback;
  };

  const startTypingTest = () => {
    setTestStarted(true);
    setStartTime(Date.now());
    setElapsedTime(0);

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    setTimerInterval(interval);
  };

  const stopTypingTest = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTestCompleted(true);
    setEndTime(Date.now());
  };

  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState(1); // 1: Program Selection, 2: Schedule, 3: Parent Info, 4: Payment & Confirmation
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedPricingOption, setSelectedPricingOption] = useState('trial'); // 'trial', 'private', 'group', 'package'
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('in-person'); // 'in-person', 'online'
  const [selectedLocation, setSelectedLocation] = useState('decatur');
  const [preferredTimes, setPreferredTimes] = useState([]);
  const [enrollmentSubmitted, setEnrollmentSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isTrialSession, setIsTrialSession] = useState(false);

  // Contact form state
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactFormStatus, setContactFormStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  // Contact form handling functions
  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();

    setContactFormStatus({
      submitting: true,
      success: false,
      error: null
    });

    try {
      // Format the data for submission
      const submissionData = {
        name: contactFormData.name,
        email: contactFormData.email,
        subject: contactFormData.subject,
        message: contactFormData.message,
        submission_date: new Date().toLocaleString(),
        form_type: 'education_inquiry'
      };

      // Send to our custom email service
      const emailResponse = await sendEducationInquiry(submissionData);

      // Send to Formspree as backup only if the primary method fails
      if (!emailResponse.success) {
        console.warn('Custom email service had issues, falling back to Formspree...');
        const formspreeResponse = await sendFormspreeSubmission(submissionData, 'xjkyqwjd');

        if (!formspreeResponse.success) {
          throw new Error('Both primary and backup submission methods failed');
        }
      }

      // Clear form
      setContactFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      setContactFormStatus({
        submitting: false,
        success: true,
        error: null
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setContactFormStatus(prev => ({ ...prev, success: false }));
      }, 5000);

    } catch (error) {
      console.error('Error submitting contact form:', error);
      setContactFormStatus({
        submitting: false,
        success: false,
        error: error.message || 'Something went wrong. Please try again.'
      });
    }
  };

  // Body class management for independent styling
  useEffect(() => {
    document.body.classList.add('education-app-active');
    
    return () => {
      document.body.classList.remove('education-app-active');
    };
  }, []);

  // Form data
  const [parentData, setParentData] = useState({
    parentName: '',
    email: '',
    phone: '',
    childName: '',
    childAge: '',
    currentTypingLevel: 'beginner',
    specialNeeds: '',
    goals: '',
    preferredContact: 'email',
    emergencyContact: '',
    emergencyPhone: '',
    hearAboutUs: ''
  });
  
  // UI state
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');
  const [showEncouragement, setShowEncouragement] = useState(false);

  // Typing.com Platform Features
  const typingComFeatures = {
    instructorTools: [
      'Real-time student progress monitoring',
      'Customizable lesson plans and assignments',
      'Detailed performance analytics and reports',
      'Class management and student organization',
      'Automated progress tracking and grading',
      'Interactive games and engaging activities'
    ],
    studentBenefits: [
      'Gamified learning experience with badges and rewards',
      'Adaptive difficulty that adjusts to skill level',
      'Comprehensive curriculum from beginner to advanced',
      'Interactive lessons with immediate feedback',
      'Progress tracking and personal achievement goals',
      'Safe, ad-free learning environment'
    ],
    platformAdvantages: [
      'Used by over 30 million students worldwide',
      'Trusted by schools and educators globally',
      'Research-based curriculum design',
      'Cross-platform compatibility (web, tablet, mobile)',
      'Regular content updates and improvements',
      'Professional instructor dashboard and tools'
    ]
  };

  // Serenity's Keys Curriculum Structure (Enhanced with Typing.com)
  const curriculumPrograms = {
    toddlers: {
      id: 'toddlers',
      name: 'Toddlers (Ages 3–5)',
      icon: '🧸',
      title: 'Fun & Gentle Introduction',
      duration: '30 minutes',
      focus: 'Learn the keyboard through games and songs',
      outcomes: [
        'Learn the keyboard through games and songs',
        'Develop fine motor skills and hand–eye coordination',
        'Build comfort with technology in a stress-free way'
      ],
      typingSkills: ['Keyboard familiarity', 'Basic motor skills', 'Hand-eye coordination'],
      computerSafety: ['Introduction to basic online safety concepts'],
      lessonStructure: [
        'Warm-Up: Interactive games and activities on Typing.com',
        'Main Activity: Guided typing exercises focusing on home row keys',
        'Safety Talk: Age-appropriate online safety fundamentals',
        'Cool-Down: Fun typing games and achievement celebration'
      ],
      typingComActivities: [
        'Jungle Junior typing games',
        'Letter recognition activities',
        'Simple word formation exercises',
        'Finger placement practice'
      ],
      testText: 'a s d f g h j k l',
      pricing: {
        private: '$40/hour',
        group: '$25/student',
        package: '$120 (5 lessons)',
        trial: '$20'
      },
      startingPrice: 'Starting at $20/session'
    },
    earlyElementary: {
      id: 'earlyElementary',
      name: 'Early Elementary (Ages 6–8)',
      icon: '✏️',
      title: 'Foundations for School Success',
      duration: '45 minutes',
      focus: 'Build correct finger placement and posture',
      outcomes: [
        'Build correct finger placement and posture',
        'Learn basic words and sentences',
        'Boost accuracy while keeping it fun and playful'
      ],
      typingSkills: ['Building speed and accuracy', 'Upper row keys', 'Number keys'],
      computerSafety: ['Understanding strong passwords', 'Recognizing safe websites'],
      lessonStructure: [
        'Warm-Up: Typing.com skill-building drills and games',
        'Main Activity: Structured lessons with real-time feedback',
        'Practice: Timed typing exercises with progress tracking',
        'Safety Talk: Password security and website safety',
        'Review: Achievement badges and progress celebration'
      ],
      typingComActivities: [
        'Beginner typing lessons with proper finger placement',
        'Interactive games like "Keyboard Climber" and "Type-a-Balloon"',
        'Word and sentence typing practice',
        'Speed and accuracy challenges with instant feedback'
      ],
      testText: 'The cat sat on the mat. Dogs run fast in the park.',
      pricing: {
        private: '$40/hour',
        group: '$25/student',
        package: '$120 (5 lessons)',
        trial: '$20'
      },
      startingPrice: 'Starting at $20/session',
      ageNote: 'Perfect age to build lasting typing habits'
    },
    upperElementary: {
      id: 'upperElementary',
      name: 'Upper Elementary (Ages 9–11)',
      icon: '🚀',
      title: 'Speed & Accuracy Growth',
      duration: '60 minutes',
      focus: 'Strengthen accuracy and speed with structured drills',
      outcomes: [
        'Strengthen accuracy and speed with structured drills',
        'Begin short paragraph typing',
        'Introduce light "typing challenges" for motivation'
      ],
      typingSkills: ['30-40 WPM target', 'Accuracy focus', 'Touch typing basics'],
      computerSafety: ['Recognizing phishing attempts', 'Understanding digital footprints'],
      lessonStructure: [
        'Warm-Up: Advanced Typing.com challenges and speed tests',
        'Skill Building: Touch typing lessons with proper technique',
        'Practice: Varied typing exercises and real-world applications',
        'Safety Education: Digital footprints and phishing awareness',
        'Assessment: Progress tracking and goal setting'
      ],
      typingComActivities: [
        'Intermediate typing courses with touch typing focus',
        'Speed building exercises and timed tests',
        'Paragraph and story typing practice',
        'Advanced games like "Nitro Type" style challenges',
        'Custom assignments tailored to student progress'
      ],
      testText: 'The quick brown fox jumps over the lazy dog every morning. Students learn typing skills to improve their homework efficiency.',
      pricing: {
        private: '$40/hour',
        group: '$25/student',
        package: '$120 (5 lessons)',
        trial: '$20'
      },
      startingPrice: 'Starting at $20/session',
      ageNote: 'Great for school projects and online learning'
    },
    middleSchool: {
      id: 'middleSchool',
      name: 'Middle School (Ages 12–14)',
      icon: '💻',
      title: 'Typing for School & Beyond',
      duration: '75 minutes',
      focus: 'Focus on essays, research projects, and test prep',
      outcomes: [
        'Focus on essays, research projects, and test prep',
        'Increase typing stamina with longer timed drills',
        'Sharpen speed and accuracy for real-world needs'
      ],
      typingSkills: ['50+ WPM target', 'Touch typing mastery', 'Advanced techniques'],
      computerSafety: ['Understanding cyberbullying', 'Privacy settings on social media'],
      lessonStructure: [
        'Warm-Up: Advanced Typing.com drills and competitive challenges',
        'Technique Focus: Professional touch typing methods and ergonomics',
        'Application Practice: Real-world typing scenarios and document creation',
        'Digital Citizenship: Cyberbullying prevention and social media safety',
        'Performance Review: Detailed analytics and improvement strategies'
      ],
      typingComActivities: [
        'Advanced typing courses with professional techniques',
        'Competitive typing challenges and leaderboards',
        'Document formatting and professional writing practice',
        'Coding and programming typing exercises',
        'Custom assessments and progress monitoring'
      ],
      testText: 'Technology has revolutionized the way we communicate, learn, and work in the modern digital age. Students must develop strong typing skills to succeed in academic and professional environments.',
      pricing: {
        private: '$40/hour',
        group: '$25/student',
        package: '$120 (5 lessons)',
        trial: '$20'
      },
      startingPrice: 'Starting at $20/session',
      ageNote: 'Bridge to high school academic demands'
    },
    highSchool: {
      id: 'highSchool',
      name: 'High School (Ages 15–18)',
      icon: '🎓',
      title: 'College & Career Ready',
      duration: '90 minutes',
      focus: 'Master fast, accurate typing for assignments & exams',
      outcomes: [
        'Master fast, accurate typing for assignments & exams',
        'Prepare for coding, professional emails, and digital work',
        'Develop confidence with professional typing standards'
      ],
      typingSkills: ['60+ WPM mastery', 'Professional typing standards', 'Complex document creation'],
      computerSafety: ['Advanced topics like social engineering', 'Data privacy laws'],
      lessonStructure: [
        'Warm-Up: Professional-level typing tests and speed challenges',
        'Advanced Techniques: Ergonomics, efficiency, and professional standards',
        'Real-World Applications: Academic writing, coding, and business documents',
        'Digital Security: Social engineering awareness and data privacy laws',
        'Career Preparation: Professional typing skills for college and workplace'
      ],
      typingComActivities: [
        'Professional typing certification preparation',
        'Advanced coding and programming typing practice',
        'Business document creation and formatting',
        'Academic writing and research paper typing',
        'Industry-specific typing scenarios and assessments'
      ],
      testText: 'In today\'s interconnected world, digital literacy encompasses not only the ability to type efficiently but also the critical thinking skills necessary to navigate complex information systems, evaluate digital sources, and maintain cybersecurity awareness in professional environments.',
      pricing: {
        private: '$40/hour',
        group: '$25/student',
        package: '$120 (5 lessons)',
        trial: '$20'
      },
      startingPrice: 'Starting at $20/session',
      ageNote: 'Typing = A lifelong skill for success'
    }
  };

  // Pricing Structure
  const pricingStructure = {
    privateSession: {
      name: 'Private Session',
      rate: '$40/hour',
      description: '👩‍🏫 One-on-one personalized attention',
      icon: '👨‍🏫',
      features: ['Custom lessons tailored to your child\'s needs', 'Flexible scheduling around your availability', 'Perfect for learners who need extra support']
    },
    groupSession: {
      name: 'Group Session',
      rate: '$25/student',
      description: '👥 Small groups (2–4 students) for peer motivation',
      icon: '👥',
      features: ['Fun, collaborative learning environment', 'Affordable option with accountability', 'Great for siblings or friends']
    },
    packageDeal: {
      name: 'Package Deal',
      rate: 'Save More',
      description: '📦 Commitment = Consistent Progress',
      icon: '📦',
      features: ['5 Lessons = $120 ($24/lesson)', '10 Lessons = $220 ($22/lesson, best value)', 'Includes progress tracking + parent updates']
    },
    trialLesson: {
      name: 'Trial Lesson',
      rate: '$20',
      description: '🎯 Risk-Free Starter',
      icon: '🎯',
      features: ['45-minute introductory lesson', 'Includes assessment + goal setting', 'Meet the instructor and see if it\'s a good fit']
    }
  };

  // Service Locations
  const serviceLocations = [
    {
      city: 'Decatur',
      state: 'Alabama',
      type: 'Primary Location',
      icon: '🏢',
      services: ['In-person classes', 'Computer lab access', 'Group sessions', 'Private tutoring']
    },
    {
      city: 'Madison',
      state: 'Alabama',
      type: 'Service Area',
      icon: '🚗',
      services: ['Home visits', 'Private tutoring', 'Online sessions']
    },
    {
      city: 'Huntsville',
      state: 'Alabama',
      type: 'Service Area',
      icon: '🚗',
      services: ['Home visits', 'Private tutoring', 'Online sessions']
    }
  ];

  // Safety and Compliance Features
  const safetyFeatures = [
    {
      title: 'Background Checks',
      description: 'Conducted for all instructors to ensure child safety',
      icon: '🛡️'
    },
    {
      title: 'Digital Safety Curriculum',
      description: 'Incorporates resources from the Children\'s Trust Fund of Alabama and Family Services of North Alabama',
      icon: '🔒'
    },
    {
      title: 'Parental Involvement',
      description: 'Regular updates and resources provided to parents to reinforce learning at home',
      icon: '👨‍👩‍👧‍👦'
    }
  ];

  // Progress Tracking Features
  const progressFeatures = [
    {
      title: 'Weekly Updates',
      description: 'Progress reports detailing typing speed, accuracy, and safety awareness',
      icon: '📊',
      frequency: 'Weekly'
    },
    {
      title: 'Goal Setting',
      description: 'Individualized goals set at the beginning of each term',
      icon: '🎯',
      frequency: 'Per Term'
    },
    {
      title: 'Feedback Sessions',
      description: 'Monthly meetings with parents to discuss progress and adjust learning plans',
      icon: '💬',
      frequency: 'Monthly'
    }
  ];

  // Refined Schedule Options - Specific Time Slots
  const scheduleOptions = {
    weekdays: [
      { value: 'monday-10am', label: '10:00 AM', day: 'Monday', time: '10:00 AM', duration: '45-60 min' },
      { value: 'monday-1pm', label: '1:00 PM', day: 'Monday', time: '1:00 PM', duration: '45-60 min' },
      { value: 'monday-3pm', label: '3:00 PM', day: 'Monday', time: '3:00 PM', duration: '45-60 min' },

      { value: 'tuesday-10am', label: '10:00 AM', day: 'Tuesday', time: '10:00 AM', duration: '45-60 min', isTrialSlot: true },
      { value: 'tuesday-1pm', label: '1:00 PM', day: 'Tuesday', time: '1:00 PM', duration: '45-60 min' },
      { value: 'tuesday-3pm', label: '3:00 PM', day: 'Tuesday', time: '3:00 PM', duration: '45-60 min' },

      { value: 'wednesday-10am', label: '10:00 AM', day: 'Wednesday', time: '10:00 AM', duration: '45-60 min' },
      { value: 'wednesday-1pm', label: '1:00 PM', day: 'Wednesday', time: '1:00 PM', duration: '45-60 min' },
      { value: 'wednesday-3pm', label: '3:00 PM', day: 'Wednesday', time: '3:00 PM', duration: '45-60 min' },

      { value: 'thursday-10am', label: '10:00 AM', day: 'Thursday', time: '10:00 AM', duration: '45-60 min' },
      { value: 'thursday-1pm', label: '1:00 PM', day: 'Thursday', time: '1:00 PM', duration: '45-60 min' },
      { value: 'thursday-3pm', label: '3:00 PM', day: 'Thursday', time: '3:00 PM', duration: '45-60 min' },

      { value: 'friday-10am', label: '10:00 AM', day: 'Friday', time: '10:00 AM', duration: '45-60 min' },
      { value: 'friday-1pm', label: '1:00 PM', day: 'Friday', time: '1:00 PM', duration: '45-60 min', isTrialSlot: true },
      { value: 'friday-3pm', label: '3:00 PM', day: 'Friday', time: '3:00 PM', duration: '45-60 min' }
    ],
    sunday: [
      { value: 'sunday-1pm', label: '1:00 PM', day: 'Sunday', time: '1:00 PM', duration: '45-60 min', virtualOnly: true },
      { value: 'sunday-230pm', label: '2:30 PM', day: 'Sunday', time: '2:30 PM', duration: '45-60 min', virtualOnly: true }
    ],
    trialSlots: [
      { value: 'tuesday-10am', label: 'Tuesday @ 10:00 AM', day: 'Tuesday', time: '10:00 AM' },
      { value: 'friday-1pm', label: 'Friday @ 1:00 PM', day: 'Friday', time: '1:00 PM' }
    ]
  };

  // Location Options
  const locationOptions = [
    {
      value: 'decatur',
      label: 'Decatur Community Center',
      description: 'Equipped with full computer lab',
      note: 'Professional learning environment with dedicated equipment'
    },
    {
      value: 'madison',
      label: 'Madison Library',
      description: 'Quiet and structured learning space',
      note: 'Peaceful environment perfect for focused learning'
    },
    {
      value: 'huntsville',
      label: 'Huntsville Library',
      description: 'Quiet and structured learning space',
      note: 'Convenient location with excellent learning facilities'
    }
  ];

  // Success Stats
  const successStats = [
    { label: "Students Taught", value: "50+", icon: "👥", description: "Across all age groups" },
    { label: "Average Speed Increase", value: "3×", icon: "🚀", description: "In 4-6 weeks" },
    { label: "Parent Satisfaction", value: "98%", icon: "⭐", description: "Would recommend" },
    { label: "Years Experience", value: "10+", icon: "🎓", description: "Teaching digital literacy" },
    { label: "Age Range", value: "3-18", icon: "📚", description: "Comprehensive curriculum" },
    { label: "Service Areas", value: "3", icon: "📍", description: "Cities in Alabama" }
  ];

  // Helper Functions
  const getSelectedProgram = () => {
    if (!selectedAge) return null;

    const age = parseInt(selectedAge);
    if (age >= 3 && age <= 5) return curriculumPrograms.toddlers;
    if (age >= 6 && age <= 8) return curriculumPrograms.earlyElementary;
    if (age >= 9 && age <= 11) return curriculumPrograms.upperElementary;
    if (age >= 12 && age <= 14) return curriculumPrograms.middleSchool;
    if (age >= 15 && age <= 18) return curriculumPrograms.highSchool;

    return curriculumPrograms.earlyElementary; // Default fallback
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setMenuOpen(false); // Close mobile menu when navigating

    // Update URL hash for proper routing within education app
    // Keep the serenitys-keys prefix to maintain app context
    if (view === 'home') {
      window.location.hash = '/serenitys-keys';
    } else {
      window.location.hash = `/serenitys-keys/${view}`;
    }

    // Reset progress bar for certain views
    if (view === 'home') {
      setShowProgressBar(false);
    } else if (view === 'assessment' || view === 'onboarding') {
      setShowProgressBar(true);
    }

    // Reset onboarding step when navigating to onboarding
    if (view === 'onboarding') {
      setOnboardingStep(1);
      setFormErrors({});
    }

    // Reset assessment step when navigating to assessment
    if (view === 'assessment') {
      setAssessmentStep(1);
      setTypingText('');
      setTestStarted(false);
      setTestCompleted(false);
      setCurrentWPM(0);
      setCurrentAccuracy(100);
      setElapsedTime(0);
      setProgressPercentage(0);
      if (timerInterval) clearInterval(timerInterval);
    }
  };

  const handleParentDataChange = (field, value) => {
    setParentData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Helper function to get program by age
  const getProgramByAge = (age) => {
    const ageNum = parseInt(age);
    if (ageNum >= 3 && ageNum <= 5) return curriculumPrograms.toddlers;
    if (ageNum >= 6 && ageNum <= 8) return curriculumPrograms.earlyElementary;
    if (ageNum >= 9 && ageNum <= 11) return curriculumPrograms.upperElementary;
    if (ageNum >= 12 && ageNum <= 14) return curriculumPrograms.middleSchool;
    if (ageNum >= 15 && ageNum <= 18) return curriculumPrograms.highSchool;
    return null;
  };

  // Form validation
  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1:
        if (!selectedProgram) errors.program = 'Please select a program';
        if (!selectedPricingOption) errors.pricing = 'Please select a pricing option';
        break;
      case 2:
        if (!deliveryMethod) errors.delivery = 'Please select delivery method';
        if (deliveryMethod === 'in-person' && !selectedLocation) errors.location = 'Please select a location';
        if (preferredTimes.length === 0) errors.schedule = 'Please select at least one preferred time';
        break;
      case 3:
        if (!parentData.parentName.trim()) errors.parentName = 'Parent name is required';
        if (!parentData.email.trim()) errors.email = 'Email is required';
        if (!parentData.phone.trim()) errors.phone = 'Phone number is required';
        if (!parentData.childName.trim()) errors.childName = 'Child name is required';
        if (!parentData.childAge.trim()) errors.childAge = 'Child age is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (parentData.email && !emailRegex.test(parentData.email)) {
          errors.email = 'Please enter a valid email address';
        }

        // Phone validation (basic)
        const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
        if (parentData.phone && !phoneRegex.test(parentData.phone.replace(/\D/g, ''))) {
          errors.phone = 'Please enter a valid phone number';
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle step navigation
  const handleNextStep = () => {
    if (validateStep(onboardingStep)) {
      if (onboardingStep < 4) {
        setOnboardingStep(onboardingStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  // Handle time selection
  const handleTimeSelection = (timeValue) => {
    setPreferredTimes(prev => {
      if (prev.includes(timeValue)) {
        return prev.filter(time => time !== timeValue);
      } else {
        return [...prev, timeValue];
      }
    });
  };

  // Get pricing for selected program and option
  const getCurrentPricing = () => {
    if (!selectedProgram || !selectedPricingOption) return null;
    return selectedProgram.pricing[selectedPricingOption];
  };

  // Handle enrollment submission
  const handleEnrollmentSubmit = async () => {
    if (!validateStep(3)) return;

    const enrollmentData = {
      // Program Information
      selectedProgram: selectedProgram?.name,
      programDuration: selectedProgram?.duration,
      programFocus: selectedProgram?.focus,
      pricingOption: selectedPricingOption,
      pricing: getCurrentPricing(),

      // Schedule Information
      deliveryMethod,
      selectedLocation: deliveryMethod === 'in-person' ? selectedLocation : 'online',
      preferredTimes: preferredTimes.map(time => {
        const option = [...scheduleOptions.weekdays, ...scheduleOptions.sunday, ...scheduleOptions.trialSlots]
          .find(opt => opt.value === time);
        return `${option?.day} @ ${option?.time}` || time;
      }),

      // Parent Information
      ...parentData,

      // Assessment Results (if available)
      assessmentResults,

      // Submission Details
      submittedAt: new Date().toISOString(),
      source: 'Serenity\'s Keys Website - Onboarding Form'
    };

    console.log('Enrollment submitted:', enrollmentData);

    try {
      // Try to send via email service
      const emailResult = await sendKeymasterEnrollment(enrollmentData);

      if (emailResult.success) {
        console.log('Enrollment email sent successfully');
      } else {
        console.warn('Email service failed, using fallback');

        // Fallback to mailto
        const emailSubject = `Serenity's Keys Enrollment - ${parentData.childName}`;
        const emailBody = `
Hello Djuvane,

New enrollment request from Serenity's Keys website:

PROGRAM SELECTION:
- Program: ${selectedProgram?.name}
- Duration: ${selectedProgram?.duration}
- Focus: ${selectedProgram?.focus}
- Pricing Option: ${selectedPricingOption}
- Rate: ${getCurrentPricing()}

SCHEDULE & DELIVERY:
- Delivery Method: ${deliveryMethod}
- Location: ${deliveryMethod === 'in-person' ? locationOptions.find(loc => loc.value === selectedLocation)?.label : 'Online'}
- Preferred Times: ${preferredTimes.map(time => {
  const option = [...scheduleOptions.weekdays, ...scheduleOptions.sunday, ...scheduleOptions.trialSlots]
    .find(opt => opt.value === time);
  return `${option?.day} @ ${option?.time}` || time;
}).join(', ')}

PARENT INFORMATION:
- Parent Name: ${parentData.parentName}
- Email: ${parentData.email}
- Phone: ${parentData.phone}
- Preferred Contact: ${parentData.preferredContact}
- Emergency Contact: ${parentData.emergencyContact}
- Emergency Phone: ${parentData.emergencyPhone}

CHILD INFORMATION:
- Child Name: ${parentData.childName}
- Age: ${parentData.childAge}
- Current Typing Level: ${parentData.currentTypingLevel}
- Goals: ${parentData.goals}
- Special Needs: ${parentData.specialNeeds || 'None'}
- How they heard about us: ${parentData.hearAboutUs || 'Not specified'}

ASSESSMENT RESULTS:
${assessmentResults ? `
- Typing Speed: ${assessmentResults.wpm} WPM
- Accuracy: ${assessmentResults.accuracy}%
- Skill Level: ${assessmentResults.skillLevel}
- Recommended Program: ${assessmentResults.recommendedProgram?.name}
` : 'No assessment completed'}

Please contact the family to confirm enrollment and schedule the first session.

Best regards,
Serenity's Keys Website
        `;

        window.location.href = `mailto:keyboard@djuvanemartin.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      }

      // Mark as submitted and move to confirmation
      setEnrollmentSubmitted(true);
      setOnboardingStep(4);

    } catch (error) {
      console.error('Enrollment submission error:', error);
      alert('There was an error submitting your enrollment. Please try again or contact us directly at keyboard@djuvanemartin.com');
    }
  };

  // Testimonials
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Parent of Emma (7 years old)",
      text: "Serenity's Keys transformed Emma's relationship with technology! The calm, patient approach helped her go from hunt-and-peck to 25 WPM in 6 weeks. Mr. Martin's gentle guidance made learning feel like play, not pressure.",
      rating: 5,
      beforeSpeed: "5 WPM",
      afterSpeed: "25 WPM",
      avatar: "👩",
      program: "Early Elementary",
      location: "Decatur, AL"
    },
    {
      name: "Michael R.",
      role: "Parent of Alex (12 years old)",
      text: "The mindful approach at Serenity's Keys was perfect for Alex. He went from homework stress to confident 45 WPM typing. The focus on calm mastery rather than speed pressure made all the difference in his learning journey.",
      rating: 5,
      beforeSpeed: "8 WPM",
      afterSpeed: "45 WPM",
      avatar: "👨",
      program: "Middle School",
      location: "Madison, AL"
    },
    {
      name: "Jennifer L.",
      role: "Parent of Sofia (5 years old)",
      text: "Sofia found her zen with typing at Serenity's Keys! At only 5, she's already mastering the keyboard with such calm confidence. Mr. Martin's peaceful teaching style makes every lesson feel like a meditation in learning.",
      rating: 5,
      beforeSpeed: "0 WPM",
      afterSpeed: "15 WPM",
      avatar: "👩‍🦱",
      program: "Toddlers",
      location: "Huntsville, AL"
    },
    {
      name: "David K.",
      role: "Parent of Marcus (16 years old)",
      text: "Serenity's Keys prepared Marcus for college with both skill and serenity. He achieved 65 WPM while learning to approach technology with mindfulness and focus. The calm mastery approach builds lifelong habits.",
      rating: 5,
      beforeSpeed: "22 WPM",
      afterSpeed: "65 WPM",
      avatar: "👨‍💼",
      program: "High School",
      location: "Decatur, AL"
    }
  ];

  // Value Propositions
  const valuePropositions = [
    {
      icon: "🌸",
      title: "Calm, Focused Learning",
      description: "Named after my daughter Serenity, our approach emphasizes peaceful, mindful learning that builds confidence and mastery."
    },
    {
      icon: "⌨️",
      title: "Powered by Typing.com",
      description: "Professional instruction using the world's most trusted typing platform, with expert guidance that makes learning serene and effective."
    },
    {
      icon: "🧘‍♀️",
      title: "Mindful Mastery Approach",
      description: "We teach typing as a meditative practice, helping students develop focus, patience, and precision in a stress-free environment."
    },
    {
      icon: "📊",
      title: "Gentle Progress Tracking",
      description: "Celebrate every milestone with encouraging analytics and progress reports that build confidence rather than pressure."
    },
    {
      icon: "🏠",
      title: "Flexible, Peaceful Sessions",
      description: "Choose calm in-person sessions in Alabama or serene online learning from the comfort of your home."
    },
    {
      icon: "🛡️",
      title: "Safe, Nurturing Environment",
      description: "Background-checked instruction in a secure, ad-free platform where children can learn without stress or distraction."
    },
    {
      icon: "🎯",
      title: "Patient, Personalized Guidance",
      description: "Every child learns at their own pace with adaptive curriculum that honors their unique learning journey."
    },
    {
      icon: "👶",
      title: "Age-Appropriate Serenity",
      description: "From toddlers to teens, each program is designed to bring calm confidence to digital literacy and typing mastery."
    }
  ];

  // FAQ Data
  const faqs = [
    {
      question: "What makes Serenity's Keys different from other typing programs?",
      answer: "Named after my daughter Serenity, our approach emphasizes calm, focused learning over speed pressure. We use Typing.com with mindful instruction that builds confidence and mastery through patience and gentle guidance."
    },
    {
      question: "What is Typing.com and how do you use it at Serenity's Keys?",
      answer: "Typing.com is the world's most trusted typing platform. As a certified instructor, I create a peaceful learning environment using professional tools for progress monitoring and custom lessons that honor each child's learning pace."
    },
    {
      question: "Will my child need to create an account on Typing.com?",
      answer: "Yes! Each student gets their own managed Typing.com account. This allows for personalized, stress-free assignments and progress tracking in a safe, ad-free environment where children can learn with serenity."
    },
    {
      question: "What age groups do you serve at Serenity's Keys?",
      answer: "We serve children ages 3-18 with age-appropriate, calming curricula: Toddlers (3-5), Early Elementary (6-8), Upper Elementary (9-11), Middle School (12-14), and High School (15-18)."
    },
    {
      question: "How does the 'calm mastery' approach work?",
      answer: "We teach typing as a mindful practice, focusing on proper technique, breathing, and patience. Students learn to approach the keyboard with serenity, building muscle memory and confidence without stress or pressure."
    },
    {
      question: "What's included in your digital wellness curriculum?",
      answer: "Beyond typing, we teach mindful technology use: password security, recognizing safe websites, digital citizenship, and healthy screen time habits - all integrated with peaceful typing practice."
    },
    {
      question: "Do you offer both in-person and online sessions?",
      answer: "Yes! We provide serene in-person sessions in Decatur, Madison, and Huntsville, or peaceful online sessions via Zoom. Both formats maintain our calm, focused learning environment."
    },
    {
      question: "How do you track progress without creating pressure?",
      answer: "We celebrate every milestone! Through gentle progress monitoring, parents receive encouraging reports that highlight growth and achievements, focusing on the journey rather than just speed metrics."
    },
    {
      question: "How do I get started with Serenity's Keys?",
      answer: "Begin with our peaceful $20 trial lesson where I'll assess your child's current skills, set up their Typing.com account, and demonstrate our calm mastery approach. Then choose the option that feels right for your family."
    }
  ];

  return (
    <div className="serenity-keys">
      {/* Navigation */}
      <nav className="academy-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <img 
              src="/serenity-keys-logo.png" 
              alt="Serenity's Keys" 
              className="logo-image"
            />
          </div>
          
          <div
            id="academy-menu"
            className={`nav-links ${menuOpen ? 'open' : ''}`}
          >
            <a
              href="#/serenitys-keys"
              className={currentView === 'home' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleViewChange('home');
              }}
            >
              Home
            </a>
            <a
              href="#/serenitys-keys/curriculum"
              className={currentView === 'curriculum' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleViewChange('curriculum');
              }}
            >
              Curriculum
            </a>
            <a
              href="#/serenitys-keys/assessment"
              className={currentView === 'assessment' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleViewChange('assessment');
              }}
            >
              Assessment
            </a>
            <a
              href="#/serenitys-keys/pricing"
              className={currentView === 'pricing' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleViewChange('pricing');
              }}
            >
              Pricing
            </a>
            <a
              href="#/serenitys-keys/onboarding"
              className={currentView === 'onboarding' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleViewChange('onboarding');
              }}
            >
              Enroll
            </a>
            <a
              href="#/serenitys-keys/contact"
              className={currentView === 'contact' ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                handleViewChange('contact');
              }}
            >
              Contact
            </a>
          </div>

          <button
            className={`nav-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-controls="academy-menu"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="academy-main">
        {currentView === 'home' && renderHome()}
        {currentView === 'curriculum' && renderCurriculum()}
        {currentView === 'assessment' && renderAssessment()}
        {currentView === 'pricing' && renderPricing()}
        {currentView === 'onboarding' && renderOnboarding()}
        {currentView === 'contact' && renderContact()}
      </main>

      {/* Shared Footer */}
      <SharedFooter currentApp="education" />
    </div>
  );

  // Render Functions
  function renderHome() {
    return (
      <div className="home-section">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content interactive-glow">
            <div className="serenity-hero-badge">
              🌸 Serenity's Keys by Djuvane Martin
            </div>

            <h1 className="serenity-hero-title typing-effect">
              Where Calm Meets Mastery in Typing Education
            </h1>

            <p className="serenity-hero-subtitle">
              Named after my daughter, <strong>Serenity's Keys</strong> brings peaceful, focused learning to typing education. Using <strong>Typing.com</strong> with expert guidance, we help children ages 3-18 develop digital literacy, computer safety, and typing mastery in a calm, supportive environment. Serving Decatur, Madison, and Huntsville, Alabama.
            </p>

            <div className="serenity-hero-stats">
              {successStats.map((stat, index) => (
                <div key={index} className="serenity-stat-item interactive-glow">
                  <span className="serenity-stat-icon stat-icon">{stat.icon}</span>
                  <span className="serenity-stat-value stat-value">{stat.value}</span>
                  <span className="serenity-stat-label stat-label">{stat.label}</span>
                  <span className="serenity-stat-description stat-description">{stat.description}</span>
                </div>
              ))}
            </div>

            <div className="serenity-hero-cta">
              <button
                className="serenity-btn-primary pulse-glow"
                onClick={() => handleViewChange('onboarding')}
              >
                🎯 Start $20 Trial Lesson
              </button>
              <button
                className="serenity-btn-secondary slide-in-right"
                onClick={() => handleViewChange('assessment')}
              >
                📊 Free Skills Assessment
              </button>
            </div>

            <div className="trust-indicators">
              <span className="trust-item">✅ Calm, Focused Learning Environment</span>
              <span className="trust-item">✅ Certified Typing.com Instructor</span>
              <span className="trust-item">✅ 50+ Students Achieved Mastery</span>
            </div>
          </div>
        </section>

        {/* Value Propositions Section */}
        <section className="value-props-section">
          <h2>Why Choose Serenity's Keys</h2>
          <div className="value-props-grid">
            {valuePropositions.map((prop, index) => (
              <div
                key={index}
                className="value-prop-card interactive-glow"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="prop-icon stat-icon">{prop.icon}</div>
                <h3 className="prop-title">{prop.title}</h3>
                <p className="prop-description">{prop.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Typing.com Platform Section */}
        <section className="typing-platform-section">
          <div className="platform-content">
            <div className="platform-header">
              <h2>Powered by Typing.com</h2>
              <p>Professional instruction using the world's most trusted typing education platform</p>
            </div>

            <div className="platform-features-grid">
              <div className="platform-feature-category">
                <h3>🎓 Instructor Tools</h3>
                <ul>
                  {typingComFeatures.instructorTools.map((tool, index) => (
                    <li key={index}>{tool}</li>
                  ))}
                </ul>
              </div>

              <div className="platform-feature-category">
                <h3>🎮 Student Benefits</h3>
                <ul>
                  {typingComFeatures.studentBenefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="platform-feature-category">
                <h3>🌟 Platform Advantages</h3>
                <ul>
                  {typingComFeatures.platformAdvantages.map((advantage, index) => (
                    <li key={index}>{advantage}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="platform-cta">
              <div className="platform-highlight">
                <h3>Why Instructor-Led Typing.com?</h3>
                <p>While Typing.com is available to everyone, our instructor account provides exclusive features:</p>
                <div className="instructor-benefits">
                  <span className="benefit-item">📊 Real-time progress monitoring</span>
                  <span className="benefit-item">🎯 Custom lesson assignments</span>
                  <span className="benefit-item">📈 Detailed analytics and reports</span>
                  <span className="benefit-item">👨‍🏫 Professional guidance and feedback</span>
                  <span className="benefit-item">🛡️ Safe, supervised learning environment</span>
                  <span className="benefit-item">🎓 Digital safety education integration</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2>Real Results from Real Families</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card"
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.role}</p>
                    <div className="testimonial-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="star">⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="speed-improvement">
                  <div className="speed-before">
                    <span className="speed-label">Before:</span>
                    <span className="speed-value">{testimonial.beforeSpeed}</span>
                  </div>
                  <div className="speed-arrow">→</div>
                  <div className="speed-after">
                    <span className="speed-label">After:</span>
                    <span className="speed-value">{testimonial.afterSpeed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="faq-item"
              >
                <h4 className="faq-question">{faq.question}</h4>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta-section">
          <div className="cta-content">
            <h2>Ready to Bring Serenity to Your Child's Learning?</h2>
            <p>Join 10+ families who've discovered the calm path to typing mastery with Serenity's Keys.</p>

            <div className="cta-highlight">
              <h3>What You Get in Your Trial Lesson:</h3>
              <div className="trial-benefits">
                <span>⌨️ Typing.com account setup</span>
                <span>📊 Skills assessment</span>
                <span>🎯 Personalized learning plan</span>
                <span>👨‍🏫 Expert instruction</span>
              </div>
            </div>

            <div className="cta-buttons">
              <button
                className="primary-cta-btn large"
                onClick={() => handleViewChange('onboarding')}
              >
                🎯 Start $20 Trial Lesson Today
              </button>
              <button
                className="secondary-cta-btn large"
                onClick={() => handleViewChange('assessment')}
              >
                📊 Free Skills Assessment First
              </button>
            </div>

            <div className="contact-banner">
              <p>Questions? Contact us directly:</p>
              <div className="contact-methods">
                <a href="mailto:keyboard@djuvanemartin.com" className="contact-method">
                  📧 keyboard@djuvanemartin.com
                </a>
                <a href="tel:+12566946682" className="contact-method">
                  📞 (256) 694-6682
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  function renderCurriculum() {
    return (
      <div className="serenity-section">
        <div className="serenity-container">
          <div className="serenity-section-header">
            <h2 className="serenity-section-title">Peaceful Learning Paths by Age</h2>
            <p className="serenity-section-subtitle">Calm, focused digital literacy education that honors each child's developmental journey</p>
          </div>

          <div className="serenity-grid serenity-grid-2">
            {Object.values(curriculumPrograms).map((program, index) => (
              <div
                key={program.id}
                className="serenity-card serenity-program-card"
              >
                <div className="serenity-program-header">
                  <span className="serenity-program-icon">{program.icon}</span>
                  <h3 className="serenity-program-name">{program.name}</h3>
                  <span className="serenity-program-duration">{program.duration}</span>
                </div>

                <div className="serenity-program-focus">
                  <h4 className="serenity-program-section-title">Focus Areas:</h4>
                  <p className="serenity-program-text">{program.focus}</p>
                </div>

                <div className="serenity-program-skills">
                  <h4 className="serenity-program-section-title">Typing Skills:</h4>
                  <ul className="serenity-program-list">
                    {program.typingSkills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>

                <div className="serenity-program-safety">
                  <h4 className="serenity-program-section-title">Computer Safety:</h4>
                  <ul className="serenity-program-list">
                    {program.computerSafety.map((safety, i) => (
                      <li key={i}>{safety}</li>
                    ))}
                  </ul>
                </div>

                <div className="serenity-program-structure">
                  <h4 className="serenity-program-section-title">Lesson Structure:</h4>
                  <ul className="serenity-program-list">
                    {program.lessonStructure.map((structure, i) => (
                      <li key={i}>{structure}</li>
                    ))}
                  </ul>
                </div>

                {program.typingComActivities && (
                  <div className="serenity-program-typing-activities">
                    <h4 className="serenity-program-section-title">⌨️ Typing.com Activities:</h4>
                    <ul className="serenity-program-list">
                      {program.typingComActivities.map((activity, i) => (
                        <li key={i}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="serenity-program-pricing">
                  <h4 className="serenity-program-section-title">Pricing Options:</h4>
                  <div className="serenity-pricing-options">
                    <span>Private: {program.pricing.private}</span>
                    <span>Group: {program.pricing.group}</span>
                    <span>Package: {program.pricing.package}</span>
                    <span>Trial: {program.pricing.trial}</span>
                  </div>
                </div>

                <button
                  className="serenity-btn-primary"
                  onClick={() => {
                    setSelectedProgram(program);
                    handleViewChange('onboarding');
                  }}
                >
                  Select This Program
                </button>
              </div>
            ))}
          </div>

          {/* Safety & Compliance Section */}
          <section
            className="serenity-section"
          >
            <div className="serenity-section-header">
              <h2 className="serenity-section-title">Safety & Compliance</h2>
            </div>
            <div className="serenity-grid serenity-grid-3">
              {safetyFeatures.map((feature, index) => (
                <div key={index} className="serenity-card serenity-feature-card">
                  <span className="serenity-feature-icon">{feature.icon}</span>
                  <h3 className="serenity-feature-title">{feature.title}</h3>
                  <p className="serenity-feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Progress Tracking Section */}
          <section
            className="serenity-section"
          >
            <div className="serenity-section-header">
              <h2 className="serenity-section-title">Progress Tracking & Reporting</h2>
            </div>
            <div className="serenity-grid serenity-grid-3">
              {progressFeatures.map((feature, index) => (
                <div key={index} className="serenity-card serenity-feature-card">
                  <span className="serenity-feature-icon">{feature.icon}</span>
                  <h3 className="serenity-feature-title">{feature.title}</h3>
                  <p className="serenity-feature-description">{feature.description}</p>
                  <span className="serenity-feature-frequency">{feature.frequency}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  function renderAssessment() {
    return (
      <div className="assessment-section">
        <div
          className="assessment-header"
        >
          <h2>Gentle Skills Discovery</h2>
          <p>Discover your child's current abilities in a calm, pressure-free environment and receive personalized recommendations</p>
        </div>

        {assessmentStep === 1 && (
          <div
            className="age-selection"
          >
            <h3>Step 1: Select Your Child's Age</h3>
            <div className="age-options">
              {Object.values(curriculumPrograms).map((program) => (
                <button
                  key={program.id}
                  className={`age-option ${selectedAge === program.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAge(program.id)}
                >
                  <span className="age-icon">{program.icon}</span>
                  <span className="age-name">{program.name}</span>
                </button>
              ))}
            </div>
            <button
              className="continue-btn"
              disabled={!selectedAge}
              onClick={() => setAssessmentStep(2)}
            >
              Continue to Skills Test →
            </button>
          </div>
        )}

        {assessmentStep === 2 && (
          <div className="professional-typing-test">
            <div className="typing-test-header">
              <h3>Professional Typing Assessment</h3>
              <p>Type the text below as accurately as possible. Your speed and accuracy will be measured in real-time.</p>
            </div>

            {/* Real-time Statistics */}
            <div className="typing-stats-bar">
              <div className="stat-item">
                <span className="stat-label">WPM</span>
                <span className="stat-value">{currentWPM}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">{currentAccuracy}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time</span>
                <span className="stat-value">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Progress</span>
                <span className="stat-value">{Math.round(progressPercentage)}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="typing-progress-bar">
              <div
                className="typing-progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Text Display with Character-by-Character Feedback */}
            <div className="typing-text-display">
              <div className="target-text">
                {(getSelectedProgram()?.testText || '').split('').map((char, index) => {
                  let className = 'char';
                  if (index < typingText.length) {
                    className += typingText[index] === char ? ' correct' : ' incorrect';
                  } else if (index === typingText.length) {
                    className += ' current';
                  }
                  return (
                    <span key={index} className={className}>
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Test Control Buttons */}
            {!testStarted && !testCompleted && (
              <div className="test-controls">
                <button
                  className="start-test-btn"
                  onClick={() => {
                    startTypingTest();
                    document.querySelector('.typing-input').focus();
                  }}
                >
                  🎯 Start Typing Assessment
                </button>
                <p className="test-instruction">Click the button above to begin your typing assessment</p>
              </div>
            )}

            {/* Typing Input Area */}
            <div className="typing-input-area">
              <textarea
                className="typing-input"
                placeholder={testStarted ? "Keep typing..." : "Click 'Start Typing Assessment' button to begin"}
                value={typingText}
                onChange={(e) => {
                  const newText = e.target.value;
                  setTypingText(newText);

                  // Update real-time metrics
                  if (testStarted && !testCompleted) {
                    const targetText = getSelectedProgram()?.testText || '';
                    const timeInSeconds = elapsedTime || 1;

                    setCurrentWPM(calculateWPM(newText, timeInSeconds));
                    setCurrentAccuracy(calculateAccuracy(newText, targetText));
                    setProgressPercentage(Math.min((newText.length / targetText.length) * 100, 100));
                    setCharacterFeedback(generateCharacterFeedback(newText, targetText));

                    // Auto-complete when text is fully typed
                    if (newText.length >= targetText.length) {
                      stopTypingTest();
                      setAssessmentStep(3);
                    }
                  }
                }}
                disabled={!testStarted || testCompleted}
                rows={4}
              />
            </div>

            {/* Test Controls */}
            <div className="typing-test-controls">
              {!testStarted && (
                <div className="test-instructions">
                  <p>💡 <strong>Instructions:</strong> Click in the text area above and start typing to begin your assessment.</p>
                </div>
              )}

              {testStarted && !testCompleted && (
                <button
                  className="complete-test-btn"
                  onClick={() => {
                    stopTypingTest();
                    setAssessmentStep(3);
                  }}
                >
                  Complete Test Early
                </button>
              )}
            </div>
          </div>
        )}

        {assessmentStep === 3 && (
          <div className="professional-results-summary">
            <div className="results-header">
              <h3>🎉 Assessment Complete!</h3>
              <p>Here's a comprehensive summary of your typing performance:</p>
            </div>

            {/* Performance Metrics */}
            <div className="performance-metrics">
              <div className="metric-card primary">
                <div className="metric-icon">⚡</div>
                <div className="metric-content">
                  <span className="metric-value">{currentWPM}</span>
                  <span className="metric-label">Words Per Minute</span>
                </div>
              </div>

              <div className="metric-card secondary">
                <div className="metric-icon">🎯</div>
                <div className="metric-content">
                  <span className="metric-value">{currentAccuracy}%</span>
                  <span className="metric-label">Accuracy</span>
                </div>
              </div>

              <div className="metric-card tertiary">
                <div className="metric-icon">⏱️</div>
                <div className="metric-content">
                  <span className="metric-value">{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
                  <span className="metric-label">Time Taken</span>
                </div>
              </div>

              <div className="metric-card quaternary">
                <div className="metric-icon">📊</div>
                <div className="metric-content">
                  <span className="metric-value">{Math.round(progressPercentage)}%</span>
                  <span className="metric-label">Completion</span>
                </div>
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="performance-analysis">
              <h4>Performance Analysis</h4>
              <div className="analysis-content">
                {currentWPM >= 40 && (
                  <div className="analysis-item excellent">
                    <span className="analysis-icon">🌟</span>
                    <span>Excellent typing speed! You're performing above average.</span>
                  </div>
                )}
                {currentWPM >= 25 && currentWPM < 40 && (
                  <div className="analysis-item good">
                    <span className="analysis-icon">👍</span>
                    <span>Good typing speed! With practice, you can reach expert level.</span>
                  </div>
                )}
                {currentWPM < 25 && (
                  <div className="analysis-item needs-improvement">
                    <span className="analysis-icon">📈</span>
                    <span>Great start! Regular practice will help improve your speed.</span>
                  </div>
                )}

                {currentAccuracy >= 95 && (
                  <div className="analysis-item excellent">
                    <span className="analysis-icon">🎯</span>
                    <span>Outstanding accuracy! You have excellent attention to detail.</span>
                  </div>
                )}
                {currentAccuracy >= 85 && currentAccuracy < 95 && (
                  <div className="analysis-item good">
                    <span className="analysis-icon">✅</span>
                    <span>Good accuracy! Focus on maintaining precision while building speed.</span>
                  </div>
                )}
                {currentAccuracy < 85 && (
                  <div className="analysis-item needs-improvement">
                    <span className="analysis-icon">🔍</span>
                    <span>Focus on accuracy first, then gradually increase your typing speed.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Program Recommendation */}
            <div className="program-recommendation-section">
              <h4>Recommended Program</h4>
              <div className="recommended-program-card">
                <div className="program-icon">{getSelectedProgram()?.icon}</div>
                <div className="program-details">
                  <h5>{getSelectedProgram()?.name}</h5>
                  <p>{getSelectedProgram()?.description}</p>
                  <div className="program-features">
                    <span className="feature">📚 {getSelectedProgram()?.duration}</span>
                    <span className="feature">🎯 {getSelectedProgram()?.focus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="results-actions">
              <button
                className="primary-action-btn"
                onClick={() => {
                  setSelectedProgram(getSelectedProgram());
                  handleViewChange('onboarding');
                }}
              >
                🚀 Enroll in Recommended Program
              </button>

              <div className="secondary-actions">
                <button
                  className="secondary-action-btn"
                  onClick={() => {
                    // Reset assessment
                    setAssessmentStep(1);
                    setTypingText('');
                    setTestStarted(false);
                    setTestCompleted(false);
                    setCurrentWPM(0);
                    setCurrentAccuracy(100);
                    setElapsedTime(0);
                    setProgressPercentage(0);
                    if (timerInterval) clearInterval(timerInterval);
                  }}
                >
                  🔄 Retake Assessment
                </button>

                <button
                  className="secondary-action-btn"
                  onClick={() => handleViewChange('curriculum')}
                >
                  📋 View All Programs
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderPricing() {
    return (
      <div className="pricing-section">
        <div
          className="pricing-header"
        >
          <h2>Peaceful Investment in Learning</h2>
          <p>Fair, transparent rates for serene, quality digital literacy education</p>
        </div>

        <div className="pricing-grid">
          {Object.values(pricingStructure).map((pricing, index) => (
            <div
              key={pricing.name}
              className="pricing-card"
            >
              <div className="pricing-icon">{pricing.icon}</div>
              <h3 className="pricing-name">{pricing.name}</h3>
              <div className="pricing-rate">{pricing.rate}</div>
              <p className="pricing-description">{pricing.description}</p>

              <div className="pricing-features">
                <h4>Features:</h4>
                <ul>
                  {pricing.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>

              <button
                className="select-pricing-btn"
                onClick={() => handleViewChange('onboarding')}
              >
                Choose This Option
              </button>
            </div>
          ))}
        </div>

        {/* Service Locations */}
        <section
          className="locations-section"
        >
          <h2>Service Locations</h2>
          <div className="locations-grid">
            {serviceLocations.map((location, index) => (
              <div key={index} className="location-card">
                <span className="location-icon">{location.icon}</span>
                <h3>{location.city}, {location.state}</h3>
                <p className="location-type">{location.type}</p>
                <ul className="location-services">
                  {location.services.map((service, i) => (
                    <li key={i}>{service}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  function renderOnboarding() {
    return (
      <div className="onboarding-section">
        <div
          className="onboarding-header"
        >
          <h2>Begin Your Child's Serene Learning Journey</h2>
          <p>Complete our peaceful 4-step enrollment process</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`progress-step ${onboardingStep >= step ? 'active' : ''} ${onboardingStep === step ? 'current' : ''}`}
              >
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Program'}
                  {step === 2 && 'Schedule'}
                  {step === 3 && 'Information'}
                  {step === 4 && 'Confirmation'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="onboarding-content">
          {onboardingStep === 1 && renderProgramSelection()}
          {onboardingStep === 2 && renderScheduleSelection()}
          {onboardingStep === 3 && renderParentInformation()}
          {onboardingStep === 4 && renderConfirmation()}
        </div>
      </div>
    );
  }

  // Step 1: Program Selection
  function renderProgramSelection() {
    return (
      <div
        className="step-content"
      >
        <h3>Step 1: Select Your Program</h3>
        <p>Choose the program that best fits your child's age and current skill level.</p>

        <div className="program-selection-grid">
          {Object.values(curriculumPrograms).map((program) => (
            <div
              key={program.id}
              className={`program-selection-card ${selectedProgram?.id === program.id ? 'selected' : ''}`}
              onClick={() => setSelectedProgram(program)}
            >
              <div className="program-icon">{program.icon}</div>
              <h4>{program.name}</h4>
              <h5 className="program-title">{program.title}</h5>
              <p className="program-starting-price">{program.startingPrice}</p>

              <div className="program-outcomes">
                <ul>
                  {program.outcomes.map((outcome, i) => (
                    <li key={i}>• {outcome}</li>
                  ))}
                </ul>
              </div>

              {program.ageNote && (
                <p className="program-age-note">👉 {program.ageNote}</p>
              )}

              <button
                className="trial-lesson-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  // Set trial lesson as selected pricing option
                  setSelectedPricingOption('trial');
                }}
              >
                Start with a Trial Lesson – $20
              </button>
            </div>
          ))}
        </div>

        {formErrors.program && <div className="error-message">{formErrors.program}</div>}

        {selectedProgram && (
          <div
            className="pricing-selection"
          >
            <h4>Choose Your Pricing Option:</h4>
            <div className="pricing-options-grid">
              {Object.entries(selectedProgram.pricing).map(([key, value]) => (
                <div
                  key={key}
                  className={`pricing-option ${selectedPricingOption === key ? 'selected' : ''}`}
                  onClick={() => setSelectedPricingOption(key)}
                >
                  <div className="pricing-type">
                    {key === 'trial' && '🎯 Trial Lesson'}
                    {key === 'private' && '👨‍🏫 Private Session'}
                    {key === 'group' && '👥 Group Session'}
                    {key === 'package' && '📦 Package Deal'}
                  </div>
                  <div className="pricing-rate">{value}</div>
                  <div className="pricing-description">
                    {key === 'trial' && 'Perfect for getting started'}
                    {key === 'private' && 'One-on-one attention'}
                    {key === 'group' && '2-4 students maximum'}
                    {key === 'package' && 'Best value for commitment'}
                  </div>
                </div>
              ))}
            </div>
            {formErrors.pricing && <div className="error-message">{formErrors.pricing}</div>}
          </div>
        )}

        <div className="step-navigation">
          <button
            className="next-btn"
            onClick={handleNextStep}
            disabled={!selectedProgram || !selectedPricingOption}
          >
            Continue to Schedule →
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Schedule Selection
  function renderScheduleSelection() {
    return (
      <div
        className="step-content"
      >
        <h3>Step 2: Schedule & Delivery</h3>
        <p>Choose how and when you'd like your child to attend sessions.</p>

        {/* Delivery Method Selection */}
        <div className="delivery-method-section">
          <h4>Delivery Method:</h4>
          <div className="delivery-options">
            <div
              className={`delivery-option ${deliveryMethod === 'in-person' ? 'selected' : ''}`}
              onClick={() => setDeliveryMethod('in-person')}
            >
              <div className="delivery-icon">🏢</div>
              <h5>In-Person Sessions</h5>
              <p>Best for young learners who benefit from hands-on support</p>
              <div className="delivery-benefits">
                <span>• Face-to-face instruction</span>
                <span>• Full computer lab access</span>
                <span>• Immediate feedback</span>
              </div>
            </div>
            <div
              className={`delivery-option ${deliveryMethod === 'online' ? 'selected' : ''}`}
              onClick={() => setDeliveryMethod('online')}
            >
              <div className="delivery-icon">💻</div>
              <h5>Online Sessions</h5>
              <p>Convenient from home; interactive Zoom with Typing.com integration</p>
              <div className="delivery-benefits">
                <span>• Learn from home comfort</span>
                <span>• Interactive Zoom sessions</span>
                <span>• Typing.com integration</span>
              </div>
            </div>
          </div>
          {formErrors.delivery && <div className="error-message">{formErrors.delivery}</div>}
        </div>

        {/* Location Selection (for in-person) */}
        {deliveryMethod === 'in-person' && (
          <div
            className="location-section"
          >
            <h4>Select Location:</h4>
            <div className="location-options">
              {locationOptions.map((location) => (
                <div
                  key={location.value}
                  className={`location-option ${selectedLocation === location.value ? 'selected' : ''}`}
                  onClick={() => setSelectedLocation(location.value)}
                >
                  <h5>{location.label}</h5>
                  <p>{location.description}</p>
                  <div className="location-note">{location.note}</div>
                </div>
              ))}
            </div>
            {formErrors.location && <div className="error-message">{formErrors.location}</div>}
          </div>
        )}

        {/* Trial Session Toggle */}
        <div className="trial-session-toggle">
          <label className="toggle-container">
            <input
              type="checkbox"
              checked={isTrialSession}
              onChange={(e) => {
                setIsTrialSession(e.target.checked);
                if (e.target.checked) {
                  setPreferredTimes([]); // Clear existing selections when switching to trial
                }
              }}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">🧪 Schedule a Trial Session</span>
          </label>
          <p className="toggle-description">
            {isTrialSession
              ? "Select from our designated trial session slots (Tuesday 10 AM or Friday 1 PM)"
              : "Select from all available time slots for regular sessions"
            }
          </p>
        </div>

        {/* Schedule Selection */}
        <div className="schedule-section">
          <h4>
            {isTrialSession
              ? "Available Trial Session Times:"
              : "Preferred Times (select all that work for you):"
            }
          </h4>

          {isTrialSession ? (
            /* Trial Session Slots */
            <div className="schedule-category">
              <h5>🧪 Designated Trial Slots</h5>
              <div className="time-options trial-slots">
                {scheduleOptions.trialSlots.map((option) => (
                  <div
                    key={option.value}
                    className={`time-option trial-option ${preferredTimes.includes(option.value) ? 'selected' : ''}`}
                    onClick={() => handleTimeSelection(option.value)}
                  >
                    <div className="trial-badge">TRIAL</div>
                    <div className="time-day">{option.day}</div>
                    <div className="time-slot">{option.time}</div>
                    <div className="time-duration">45-60 min</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Regular Session Slots */
            <>
              <div className="schedule-category">
                <h5>📅 Weekdays (Mon–Fri)</h5>
                <div className="weekday-schedule-grid">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                    <div key={day} className="day-column">
                      <h6>{day}</h6>
                      <div className="day-slots">
                        {scheduleOptions.weekdays
                          .filter(option => option.day === day)
                          .map((option) => (
                            <div
                              key={option.value}
                              className={`time-slot-card ${preferredTimes.includes(option.value) ? 'selected' : ''} ${option.isTrialSlot ? 'has-trial-badge' : ''}`}
                              onClick={() => handleTimeSelection(option.value)}
                            >
                              {option.isTrialSlot && <div className="trial-badge-small">TRIAL</div>}
                              <div className="slot-time">{option.time}</div>
                              <div className="slot-duration">{option.duration}</div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="schedule-category">
                <h5>🌅 Sunday (Virtual Only)</h5>
                <div className="sunday-note">
                  <p>🚫 <strong>No sessions on Saturdays</strong> in observance of the Sabbath.</p>
                </div>
                <div className="time-options sunday-slots">
                  {scheduleOptions.sunday.map((option) => (
                    <div
                      key={option.value}
                      className={`time-option sunday-option ${preferredTimes.includes(option.value) ? 'selected' : ''} ${deliveryMethod === 'in-person' ? 'disabled' : ''}`}
                      onClick={() => {
                        if (deliveryMethod === 'online') {
                          handleTimeSelection(option.value);
                        }
                      }}
                    >
                      <div className="virtual-badge">VIRTUAL ONLY</div>
                      <div className="time-day">{option.day}</div>
                      <div className="time-slot">{option.time}</div>
                      <div className="time-duration">{option.duration}</div>
                      {deliveryMethod === 'in-person' && (
                        <div className="disabled-overlay">
                          <span>Switch to Online for Sunday sessions</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {formErrors.schedule && <div className="error-message">{formErrors.schedule}</div>}
        </div>

        <div className="step-navigation">
          <button className="prev-btn" onClick={handlePrevStep}>
            ← Back to Program
          </button>
          <button
            className="next-btn"
            onClick={handleNextStep}
            disabled={!deliveryMethod || (deliveryMethod === 'in-person' && !selectedLocation) || preferredTimes.length === 0}
          >
            Continue to Information →
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Parent Information
  function renderParentInformation() {
    return (
      <div
        className="step-content"
      >
        <h3>Step 3: Parent & Child Information</h3>
        <p>Please provide your contact information and details about your child.</p>

        <div className="form-sections">
          {/* Parent Information */}
          <div className="form-section">
            <h4>Parent/Guardian Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="parentName">Full Name *</label>
                <input
                  type="text"
                  id="parentName"
                  value={parentData.parentName}
                  onChange={(e) => handleParentDataChange('parentName', e.target.value)}
                  className={formErrors.parentName ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {formErrors.parentName && <div className="field-error">{formErrors.parentName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={parentData.email}
                  onChange={(e) => handleParentDataChange('email', e.target.value)}
                  className={formErrors.email ? 'error' : ''}
                  placeholder="your.email@example.com"
                />
                {formErrors.email && <div className="field-error">{formErrors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  value={parentData.phone}
                  onChange={(e) => handleParentDataChange('phone', e.target.value)}
                  className={formErrors.phone ? 'error' : ''}
                  placeholder="(256) 123-4567"
                />
                {formErrors.phone && <div className="field-error">{formErrors.phone}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="preferredContact">Preferred Contact Method</label>
                <select
                  id="preferredContact"
                  value={parentData.preferredContact}
                  onChange={(e) => handleParentDataChange('preferredContact', e.target.value)}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="text">Text Message</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="emergencyContact">Emergency Contact Name</label>
                <input
                  type="text"
                  id="emergencyContact"
                  value={parentData.emergencyContact}
                  onChange={(e) => handleParentDataChange('emergencyContact', e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergencyPhone">Emergency Contact Phone</label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  value={parentData.emergencyPhone}
                  onChange={(e) => handleParentDataChange('emergencyPhone', e.target.value)}
                  placeholder="Emergency contact phone"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hearAboutUs">How did you hear about us?</label>
                <select
                  id="hearAboutUs"
                  value={parentData.hearAboutUs}
                  onChange={(e) => handleParentDataChange('hearAboutUs', e.target.value)}
                >
                  <option value="">Please select...</option>
                  <option value="google-search">Google Search</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="friend-referral">Friend/Family Referral</option>
                  <option value="school-recommendation">School Recommendation</option>
                  <option value="community-center">Community Center</option>
                  <option value="library">Library</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Child Information */}
          <div className="form-section">
            <h4>Child Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="childName">Child's Full Name *</label>
                <input
                  type="text"
                  id="childName"
                  value={parentData.childName}
                  onChange={(e) => handleParentDataChange('childName', e.target.value)}
                  className={formErrors.childName ? 'error' : ''}
                  placeholder="Enter child's full name"
                />
                {formErrors.childName && <div className="field-error">{formErrors.childName}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="childAge">Child's Age *</label>
                <select
                  id="childAge"
                  value={parentData.childAge}
                  onChange={(e) => {
                    handleParentDataChange('childAge', e.target.value);
                    // Auto-suggest program based on age
                    const suggestedProgram = getProgramByAge(e.target.value);
                    if (suggestedProgram && !selectedProgram) {
                      setSelectedProgram(suggestedProgram);
                    }
                  }}
                  className={formErrors.childAge ? 'error' : ''}
                >
                  <option value="">Select age</option>
                  {Array.from({ length: 16 }, (_, i) => i + 3).map(age => (
                    <option key={age} value={age}>{age} years old</option>
                  ))}
                </select>
                {formErrors.childAge && <div className="field-error">{formErrors.childAge}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="currentTypingLevel">Current Typing Level</label>
                <select
                  id="currentTypingLevel"
                  value={parentData.currentTypingLevel}
                  onChange={(e) => handleParentDataChange('currentTypingLevel', e.target.value)}
                >
                  <option value="beginner">Beginner: Doesn't know the keyboard yet</option>
                  <option value="intermediate">Intermediate: Can type slowly with some accuracy</option>
                  <option value="advanced">Advanced: Types fluently, wants to get faster</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="hearAboutUs">How did you hear about us?</label>
                <select
                  id="hearAboutUs"
                  value={parentData.hearAboutUs}
                  onChange={(e) => handleParentDataChange('hearAboutUs', e.target.value)}
                >
                  <option value="">Select an option</option>
                  <option value="google">Google Search</option>
                  <option value="facebook">Facebook</option>
                  <option value="friend">Friend/Family Referral</option>
                  <option value="school">School Recommendation</option>
                  <option value="community">Community Center</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="goals">Learning Goals for Your Child</label>
                <textarea
                  id="goals"
                  value={parentData.goals}
                  onChange={(e) => handleParentDataChange('goals', e.target.value)}
                  placeholder="What do you hope your child will achieve? (e.g., improve homework speed, prepare for school, build confidence)"
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="specialNeeds">Learning Preferences & Accommodations</label>
                <textarea
                  id="specialNeeds"
                  value={parentData.specialNeeds}
                  onChange={(e) => handleParentDataChange('specialNeeds', e.target.value)}
                  placeholder="Any learning preferences or accommodations we should know to best support your child? (Optional)"
                  rows="3"
                />
              </div>
            </div>

            <div className="privacy-notice">
              <p>🔒 Your information is private and only used for your child's learning experience.</p>
            </div>
          </div>
        </div>

        <div className="step-navigation">
          <button className="prev-btn" onClick={handlePrevStep}>
            ← Back to Schedule
          </button>
          <button
            className="next-btn"
            onClick={handleNextStep}
          >
            Continue to Confirmation →
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Confirmation
  function renderConfirmation() {
    if (!enrollmentSubmitted) {
      return (
        <div
          className="step-content"
        >
          <h3>Step 4: Review & Confirm</h3>
          <p>Please review your selections and submit your enrollment.</p>

          <div className="confirmation-summary">
            {/* Program Summary */}
            <div className="summary-section">
              <h4>📚 Selected Program</h4>
              <div className="summary-content">
                <div className="program-summary">
                  <span className="program-icon">{selectedProgram?.icon}</span>
                  <div>
                    <h5>{selectedProgram?.name}</h5>
                    <p>{selectedProgram?.focus}</p>
                    <p><strong>Duration:</strong> {selectedProgram?.duration}</p>
                  </div>
                </div>
                <div className="pricing-summary">
                  <h5>Pricing Option: {selectedPricingOption}</h5>
                  <div className="price-display">{getCurrentPricing()}</div>
                </div>
              </div>
            </div>

            {/* Schedule Summary */}
            <div className="summary-section">
              <h4>📅 Schedule & Delivery</h4>
              <div className="summary-content">
                <p><strong>Method:</strong> {deliveryMethod === 'in-person' ? 'In-Person' : 'Online'}</p>
                {deliveryMethod === 'in-person' && (
                  <p><strong>Location:</strong> {locationOptions.find(loc => loc.value === selectedLocation)?.label}</p>
                )}
                <p><strong>Preferred Times:</strong></p>
                <ul className="time-list">
                  {preferredTimes.map(time => {
                    const option = [...scheduleOptions.weekdays, ...scheduleOptions.sunday, ...scheduleOptions.trialSlots]
                      .find(opt => opt.value === time);
                    return <li key={time}>{option?.day} @ {option?.time}</li>;
                  })}
                </ul>
              </div>
            </div>

            {/* Contact Summary */}
            <div className="summary-section">
              <h4>👨‍👩‍👧‍👦 Contact Information</h4>
              <div className="summary-content">
                <p><strong>Parent:</strong> {parentData.parentName}</p>
                <p><strong>Child:</strong> {parentData.childName} ({parentData.childAge} years old)</p>
                <p><strong>Email:</strong> {parentData.email}</p>
                <p><strong>Phone:</strong> {parentData.phone}</p>
                <p><strong>Preferred Contact:</strong> {parentData.preferredContact}</p>
                {parentData.goals && <p><strong>Goals:</strong> {parentData.goals}</p>}
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <div className="important-note">
              <h4>🎯 What Happens Next?</h4>
              <ul>
                <li>We'll contact you within 24 hours to confirm your enrollment</li>
                <li>We'll set up your child's Typing.com account</li>
                <li>We'll schedule your first session based on your preferred times</li>
                <li>You'll receive detailed instructions before the first class</li>
              </ul>
            </div>

            <div className="step-navigation">
              <button className="prev-btn" onClick={handlePrevStep}>
                ← Back to Information
              </button>
              <button
                className="submit-btn"
                onClick={handleEnrollmentSubmit}
              >
                🎯 Submit Enrollment
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Success confirmation
    return (
      <div
        className="step-content success-confirmation"
      >
        <div className="success-icon">🌸</div>
        <h3>Welcome to Serenity's Keys!</h3>
        <p>Thank you for choosing the peaceful path to typing mastery!</p>

        <div className="success-details">
          <div className="next-steps">
            <h4>What Happens Next:</h4>
            <div className="step-list">
              <div className="next-step">
                <span className="step-icon">📞</span>
                <div>
                  <h5>We'll Contact You</h5>
                  <p>Within 24 hours to confirm your enrollment and answer any questions</p>
                </div>
              </div>
              <div className="next-step">
                <span className="step-icon">⌨️</span>
                <div>
                  <h5>Typing.com Account Setup</h5>
                  <p>We'll create your child's account and send login instructions</p>
                </div>
              </div>
              <div className="next-step">
                <span className="step-icon">📅</span>
                <div>
                  <h5>Schedule First Session</h5>
                  <p>Based on your preferred times and availability</p>
                </div>
              </div>
              <div className="next-step">
                <span className="step-icon">🎯</span>
                <div>
                  <h5>Begin Learning Journey</h5>
                  <p>Your child starts their path to digital literacy mastery!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-reminder">
            <h4>Questions? Contact Us:</h4>
            <div className="contact-methods">
              <a href="mailto:keyboard@djuvanemartin.com" className="contact-method">
                📧 keyboard@djuvanemartin.com
              </a>
              <a href="tel:+12566946682" className="contact-method">
                📞 (256) 694-6682
              </a>
            </div>
          </div>

          <div className="enrollment-summary">
            <h4>Your Enrollment Summary:</h4>
            <div className="summary-card">
              <p><strong>Program:</strong> {selectedProgram?.name}</p>
              <p><strong>Child:</strong> {parentData.childName}</p>
              <p><strong>Pricing:</strong> {getCurrentPricing()}</p>
              <p><strong>Method:</strong> {deliveryMethod === 'in-person' ? 'In-Person' : 'Online'}</p>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <button
            className="primary-btn"
            onClick={() => {
              // Reset form for new enrollment
              setOnboardingStep(1);
              setSelectedProgram(null);
              setSelectedPricingOption('trial');
              setPreferredTimes([]);
              setParentData({
                parentName: '',
                email: '',
                phone: '',
                childName: '',
                childAge: '',
                currentTypingLevel: 'beginner',
                specialNeeds: '',
                goals: '',
                preferredContact: 'email',
                emergencyContact: '',
                emergencyPhone: '',
                hearAboutUs: ''
              });
              setEnrollmentSubmitted(false);
              setFormErrors({});
            }}
          >
            Enroll Another Child
          </button>
          <button
            className="secondary-btn"
            onClick={() => handleViewChange('home')}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Contact form render function
  function renderContact() {
    return (
      <div className="serenity-section">
        <div className="serenity-container">
          <div
            className="serenity-section-header"
          >
            <h2 className="serenity-section-title">Contact Serenity's Keys</h2>
            <p className="serenity-section-subtitle">Have questions about our typing programs? We're here to help!</p>
          </div>

          <div className="serenity-contact-content">
            <div className="serenity-contact-info">
              <h3 className="serenity-contact-title">Get in Touch</h3>
              <div className="serenity-contact-items">
                <div className="serenity-contact-item">
                  <span className="serenity-contact-icon">📧</span>
                  <span className="serenity-contact-text">keyboard@djuvanemartin.com</span>
                </div>
                <div className="serenity-contact-item">
                  <span className="serenity-contact-icon">📱</span>
                  <span className="serenity-contact-text">(256) 694-6682</span>
                </div>
                <div className="serenity-contact-item">
                  <span className="serenity-contact-icon">📍</span>
                  <span className="serenity-contact-text">Serving Decatur, Madison & Huntsville, Alabama</span>
                </div>
                <div className="serenity-contact-item">
                  <span className="serenity-contact-icon">⏰</span>
                  <span className="serenity-contact-text">Response within 24 hours</span>
                </div>
              </div>
            </div>

            <form className="serenity-contact-form" onSubmit={handleContactFormSubmit}>
              {contactFormStatus.success && (
                <div className="serenity-form-success">
                  Message sent successfully! We'll get back to you within 24 hours.
                </div>
              )}
              {contactFormStatus.error && (
                <div className="serenity-form-error">Error: {contactFormStatus.error}</div>
              )}

              <div className="serenity-form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={contactFormData.name}
                  onChange={handleContactFormChange}
                  required
                  className="serenity-form-input"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={contactFormData.email}
                  onChange={handleContactFormChange}
                  required
                  className="serenity-form-input"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={contactFormData.subject}
                onChange={handleContactFormChange}
                required
                className="serenity-form-input"
              />
              <textarea
                name="message"
                placeholder="Tell us about your questions or how we can help..."
                rows="5"
                value={contactFormData.message}
                onChange={handleContactFormChange}
                required
                className="serenity-form-textarea"
              ></textarea>
              <button
                type="submit"
                className="serenity-btn-primary serenity-form-submit"
                disabled={contactFormStatus.submitting}
              >
                {contactFormStatus.submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default EducationApp;
