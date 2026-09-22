/* ============================================
   CS15 Hub - Data Layer (Public Pages Only)
   Note: the class directory lives in members-data.js
   (transcribed from the official BTCH 15-B Profiling sheet).
   ============================================ */

const DB = {
  currentUser: null,

  // Truthful, verifiable metrics for the "At a Glance" section.
  // 58 = members listed in the official BTCH 15-B Profiling document.
  // 7  = active courses in the current semester (cs15_hub DB).
  // Modules = distinct functional areas implemented in this platform.
  achievements: [
    { id: 1, icon: 'bi-people', value: '58', label: 'Batch 15-B Members Profiled', color: 'blue' },
    { id: 2, icon: 'bi-journal-code', value: '7', label: 'Active Semester Courses', color: 'green' },
    { id: 3, icon: 'bi-grid', value: '10+', label: 'Integrated Modules', color: 'purple' },
    { id: 4, icon: 'bi-mortarboard', value: '1', label: 'Connected Batch Community', color: 'yellow' },
  ],

  // Stories about specific people are not fabricated here. Any user-claimed
  // milestones belong in the member profile system, not in this static layer.
  timeline: [
    { year: '2025', title: 'CS Batch 15 Begins', description: 'Computer Science Batch 15 starts the 2025/2026 academic year at Jazeera University.' },
    { year: '2025', title: 'Class Profiling Completed', description: 'The BTCH 15-B Profiling document records 58 classmates, their learning styles, programming ability, interests, and unique skills.' },
    { year: '2026', title: 'CS15 Hub Platform', description: 'The class portal brings courses, projects, messaging, elections, and more into one shared hub built by the batch itself.' },
  ],

  gallery: [],
};
