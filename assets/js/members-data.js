/* ============================================
   BTCH 15-B Profiling — Official Class Directory
   Source of truth: "BTCH 15-B Profiling.pdf" (Jazeera University)
   Transcribed verbatim from the printed class information sheet.
   Fields map to the PDF columns:
     - courses        → "THIS SEMESTER" (courses they feel good in)
     - learningStyle  → "OVERALL" learning style
     - programming    → "OVERALL" programming ability (self-reported %)
     - interests      → "INTRESTS" (languages & IT-related fields)
     - uniqueSkills   → "UNIQUE SKILLS"
   "N/A" cells are stored as empty arrays / empty strings so nothing is invented.
   To add or update a student, edit this single file.
   ============================================ */

const BTCH15_MEMBERS = [
  { id: 1, name: 'Aisha Abdirizak Ahmed', courses: ['MATH', 'JS', 'Management', 'DBMS'], learningStyle: 'All rounder', programming: '90%', interests: ['IoT', 'Robotics', 'Embedded Systems'], uniqueSkills: ['Resource & information gathering'] },
  { id: 2, name: 'Zamzam Abdiasis Mohamed', courses: [], learningStyle: 'Comprehension', programming: '80%', interests: ['Cybersecurity', 'Networking'], uniqueSkills: ['Farshaxan (Henna)'] },
  { id: 3, name: 'Miski Ali MOhamed', courses: [], learningStyle: 'Memorization', programming: '80%', interests: ['IT & Troubleshooting', 'Computer Repair'], uniqueSkills: ['Arabic language'] },
  { id: 4, name: 'Muna Abdikarim Mohamud', courses: [], learningStyle: 'Memorization', programming: '40%', interests: ['Software Development'], uniqueSkills: ['Arabic & English'] },
  { id: 5, name: 'Nastexa Bashiir Yuusuf', courses: [], learningStyle: 'Comprehension', programming: '30%', interests: ['Software Development'], uniqueSkills: ['Book Reading'] },
  { id: 6, name: 'Rawda Maxamed Xusein', courses: ['Discrete Math'], learningStyle: 'Comprehension', programming: '70%', interests: ['Cybersecurity', 'Software Development'], uniqueSkills: ['Farshaxan (Crochet & Tailoring)'] },
  { id: 7, name: 'Naima Abdirahman Ahmed', courses: [], learningStyle: 'Comprehension', programming: '75%', interests: ['AI', 'Software Development'], uniqueSkills: ['Farshaxan (Drawing)'] },
  { id: 8, name: 'Sumayo Bashiir Ali', courses: ['JS'], learningStyle: 'All rounder', programming: '75%', interests: ['AI', 'Cybersecurity'], uniqueSkills: ['Farshaxan (Fashion Design & Tailoring)'] },
  { id: 9, name: 'Sabirin Abdullahi Xusein', courses: ['Discrete Math', 'A+', 'Management', 'JS'], learningStyle: 'All rounder', programming: '50%', interests: ['Cybersecurity', 'Software Development', 'English'], uniqueSkills: ['Farshaxan (Make-up)'] },
  { id: 10, name: 'Sumayo Xusein Ali', courses: [], learningStyle: 'All rounder (50%)', programming: '35%', interests: ['Computer Software & Hardware', 'Graphic Design', 'Turkish'], uniqueSkills: [] },
  { id: 11, name: 'Asiya Salad Abdi', courses: ['Discrete Math', 'A+'], learningStyle: 'Memorization', programming: '35%', interests: ['Graphic Design', 'English'], uniqueSkills: ['Farshaxan (Make-up)'] },
  { id: 12, name: 'Sacdiya Abdi Mohamud', courses: ['Discrete Math'], learningStyle: 'All rounder', programming: '50%', interests: ['Cybersecurity', 'Mandrine & Dutch'], uniqueSkills: ['Farshaxan (Crochet & Henna)'] },
  { id: 13, name: 'Naima Mohudin Ali', courses: [], learningStyle: 'Memorization', programming: '50%', interests: ['Networking', 'English'], uniqueSkills: [] },
  { id: 14, name: 'Mandeeq Ibraahim Abdulle', courses: ['Multimedia'], learningStyle: 'Comprehension', programming: '95%', interests: ['Data Analyst', 'Digital Marketing', 'Software Development'], uniqueSkills: ['Farshaxan (Soaps)'] },
  { id: 15, name: 'Salmo Maxamud Dhuxulow', courses: [], learningStyle: 'All rounder', programming: '50%', interests: ['Cybersecurity', 'Turkish'], uniqueSkills: ['Farshaxan (Henna)'] },
  { id: 16, name: 'Sumayo Anwar Muumin', courses: [], learningStyle: 'Comprehension', programming: '50%', interests: ['Web Design', 'Turkish'], uniqueSkills: ['First-Aid', 'Cashier', 'Public Speaking'] },
  { id: 17, name: 'Nawaal Maxamed Ali', courses: [], learningStyle: 'Comprehension', programming: '80%', interests: ['Graphic Design', 'Cybersecurity', 'English'], uniqueSkills: [] },
  { id: 18, name: 'Meymun Mohamed Cusman', courses: ['Discrete Math', 'DBMS'], learningStyle: 'Comprehension', programming: '80%', interests: ['Networking', 'Cybersecurity', 'Software Development', 'English'], uniqueSkills: ['Farshaxan (Henna)'] },
  { id: 19, name: 'Salmo Abdimajid Abukar', courses: [], learningStyle: 'Comprehension', programming: '80%', interests: ['Software Development', 'English'], uniqueSkills: ['Farshaxan (Crochet & Cooking)'] },
  { id: 20, name: 'Zamzam Cisman Xirsi', courses: ['Multimedia'], learningStyle: 'Comprehension', programming: '80%', interests: ['Graphic Design', 'English'], uniqueSkills: ['Farshaxan (Henna)'] },
  { id: 21, name: 'Qamar Abdullahi Adam', courses: ['Multimedia', 'A+', 'Discrete Math'], learningStyle: 'Memorization', programming: '70%', interests: ['Networking', 'AI', 'English'], uniqueSkills: ['Graphic Design', 'Farshaxan (Henna)'] },
  { id: 22, name: 'A/qadir Mohamed', courses: ['Discrete Mathematics/DLD'], learningStyle: 'Memorization', programming: '80%', interests: ['Software'], uniqueSkills: [] },
  { id: 23, name: 'A/Qadar Faysal', courses: ['Multimedia', 'DLD'], learningStyle: '', programming: '', interests: [], uniqueSkills: [] },
  { id: 24, name: 'A/qani Ibraahim', courses: ['Discrete Mathematics'], learningStyle: 'Comprehension', programming: '80%', interests: [], uniqueSkills: ['Business'] },
  { id: 25, name: 'A/raxmaan A/rashiid', courses: ['Javascript', 'Hardware/s'], learningStyle: 'Memorization', programming: '80%', interests: ['A+'], uniqueSkills: [] },
  { id: 26, name: 'Abbas Hassan', courses: ['Javascript', 'H&S', 'Multimedia'], learningStyle: 'Comprehension', programming: '85%', interests: ['AI Engineer', 'Robotics', 'Computer'], uniqueSkills: ['Leading'] },
  { id: 27, name: 'Abdi nasir xirsi', courses: ['Javascript', 'H&S', 'Multimedia'], learningStyle: 'Comprehension', programming: '91%', interests: ['DataBase'], uniqueSkills: ['Business'] },
  { id: 28, name: 'Abdi Qani Awil', courses: ['H&S', 'Principle of Management', 'Multimedia'], learningStyle: 'Comprehension', programming: '85%', interests: ['A+'], uniqueSkills: ['Business'] },
  { id: 29, name: 'Abdinasir Hassan', courses: ['JS', 'DM', 'Principle of M'], learningStyle: '', programming: '', interests: [], uniqueSkills: [] },
  { id: 30, name: 'Abdulahi Nuur Hassan', courses: ['Principle of M', 'JS', 'DBMS'], learningStyle: '', programming: '', interests: [], uniqueSkills: [] },
  { id: 31, name: 'Abdullahi Abdi', courses: ['JS', 'Discrete Mathematics'], learningStyle: 'Memorization', programming: '85%', interests: ['Software Engineer'], uniqueSkills: [] },
  { id: 32, name: 'Abdullahi cumar', courses: ['JavaScript'], learningStyle: 'Comprehension', programming: '85%', interests: ['Multimedia'], uniqueSkills: ['Business'] },
  { id: 33, name: 'Abdullahi A/majid', courses: ['M.M', 'P of M', 'H&S'], learningStyle: 'Memorization', programming: '85%', interests: ['Multimedia'], uniqueSkills: ['Sports'] },
  { id: 34, name: 'Abudi', courses: ['DM', 'Multimedia', 'P OF M'], learningStyle: '', programming: '', interests: [], uniqueSkills: [] },
  { id: 35, name: 'Anas Abdirizak', courses: ['P OF M', 'DBMS', 'M.M'], learningStyle: '', programming: '', interests: [], uniqueSkills: [] },
  { id: 36, name: 'Garaad A/rashiid', courses: ['JS', 'DLD', 'DBMS'], learningStyle: 'Comprehension', programming: '80%', interests: ['Network', 'Editing'], uniqueSkills: ['Computer'] },
  { id: 37, name: 'Ibraahim A/rashid', courses: ['DM', 'M.M', 'DLD'], learningStyle: 'Comprehension', programming: '95%', interests: ['Networking'], uniqueSkills: [] },
  { id: 38, name: 'Ilyaas A/lahi maxamed', courses: ['P of M', 'DM', 'H&S'], learningStyle: 'Memorization', programming: '100%', interests: [], uniqueSkills: [] },
  { id: 39, name: 'Mohamed cirro', courses: ['Javascript', 'H&S'], learningStyle: 'Comprehension', programming: '99%', interests: ['DataBase'], uniqueSkills: ['Computer'] },
  { id: 40, name: 'A/qadir A/risaq Aden', courses: [], learningStyle: 'Comprehension', programming: '91%', interests: ['DataBase'], uniqueSkills: [] },
  { id: 41, name: 'Keyse Kaafi Axmed', courses: [], learningStyle: 'Comprehension', programming: '80%', interests: ['Network'], uniqueSkills: ['Computer'] },
  { id: 42, name: 'A/risaq maxamed', courses: [], learningStyle: 'Memorization', programming: '70%', interests: ['Network'], uniqueSkills: ['Mobile Repair'] },
  { id: 43, name: 'A/karim Axmed Maxamed', courses: [], learningStyle: 'Memorization', programming: '80%', interests: ['Software Developer'], uniqueSkills: ['Sports'] },
  { id: 44, name: 'Ibrahim A/asis Sidow', courses: [], learningStyle: 'Memorization', programming: '60%', interests: ['Data Science'], uniqueSkills: ['Driver'] },
  { id: 45, name: 'Abdullahi Jimcale Adan', courses: [], learningStyle: 'Comprehension', programming: '70%', interests: ['Programming'], uniqueSkills: [] },
  { id: 46, name: 'Zakariye Adan Maxamed', courses: [], learningStyle: 'Memorization', programming: '60%', interests: ['Data Base'], uniqueSkills: [] },
  { id: 47, name: 'Amir Aden Elmi', courses: [], learningStyle: 'Memorization', programming: '90%', interests: ['Programming'], uniqueSkills: ['Multimedia'] },
  { id: 48, name: 'Ali Omar Mohamed', courses: [], learningStyle: 'Memorization', programming: '70%', interests: ['Network'], uniqueSkills: ['Teacher'] },
  { id: 49, name: 'Ibrahim Osman A/lahi', courses: [], learningStyle: 'Memorization', programming: '80%', interests: ['Programming'], uniqueSkills: ['Teacher'] },
  { id: 50, name: 'A/lahi Yusuf Osman', courses: [], learningStyle: 'Memorization', programming: '85%', interests: ['Programming'], uniqueSkills: ['Teacher'] },
  { id: 51, name: 'Mohamed Idiris Bule', courses: [], learningStyle: 'Memorization', programming: '90%', interests: ['Programming'], uniqueSkills: ['Tailor'] },
  { id: 52, name: 'Mohamed A/raxman Dahir', courses: [], learningStyle: 'Comprehension', programming: '90%', interests: ['Networking'], uniqueSkills: ['Sales'] },
  { id: 53, name: 'A/nasir Maxamed Cisman', courses: [], learningStyle: 'Memorization', programming: '70%', interests: ['Networking'], uniqueSkills: ['Electronics'] },
  { id: 54, name: 'Abdullahi Hassan', courses: [], learningStyle: '', programming: '', interests: [], uniqueSkills: [] },
  { id: 55, name: 'Abdulahi Hassan Husein', courses: [], learningStyle: 'Comprehension', programming: '90%', interests: ['Software & Hardware'], uniqueSkills: ['DataBase'] },
  { id: 56, name: 'Hassan Mohamed Ali', courses: [], learningStyle: 'Memorization', programming: '56%', interests: ['DataBase'], uniqueSkills: [] },
  { id: 57, name: 'A/Qaadir Faysal', courses: [], learningStyle: 'Memorization', programming: '80%', interests: ['Software & Hardware'], uniqueSkills: [] },
  { id: 58, name: 'A/ Najib Adam Osman', courses: [], learningStyle: 'Memorization', programming: '50%', interests: ['SQL'], uniqueSkills: [] },
];

if (typeof window !== 'undefined') {
  window.BTCH15_MEMBERS = BTCH15_MEMBERS;
}

/* Distinct teacher/admin/staff that appear in the dataset are not part of
   the student directory. If the DB holds approved member profiles for any of
   the students above, they are merged by PublicPages.loadDirectoryMembers(). */