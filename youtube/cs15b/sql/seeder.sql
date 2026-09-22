-- Batch15Tube Data Seeder
-- Run AFTER schema.sql

USE batch15tube;

-- Insert 59 Skills
INSERT INTO skills (name, slug, description, icon, color, is_featured, sort_order) VALUES
('Full Stack Development', 'full-stack-development', 'Complete web development from frontend to backend', 'layer-group', '#6C63FF', 1, 1),
('Frontend Development', 'frontend-development', 'HTML, CSS, JavaScript and modern frameworks', 'desktop', '#FF6584', 1, 2),
('Backend Development', 'backend-development', 'Server-side programming and APIs', 'server', '#10B981', 1, 3),
('PHP', 'php', 'Server-side scripting language for web development', 'code', '#787CB5', 1, 4),
('Laravel', 'laravel', 'Modern PHP framework for web artisans', 'code', '#FF2D20', 1, 5),
('React', 'react', 'JavaScript library for building user interfaces', 'code', '#61DAFB', 1, 6),
('Vue', 'vue', 'Progressive JavaScript framework', 'code', '#4FC08D', 1, 7),
('Angular', 'angular', 'Platform for building mobile and desktop web applications', 'code', '#DD0031', 1, 8),
('JavaScript', 'javascript', 'High-level programming language for web', 'code', '#F7DF1E', 1, 9),
('TypeScript', 'typescript', 'Typed superset of JavaScript', 'code', '#3178C6', 1, 10),
('Node.js', 'nodejs', 'JavaScript runtime built on Chrome V8 engine', 'code', '#339933', 0, 11),
('Express.js', 'expressjs', 'Fast, unopinionated, minimalist web framework for Node.js', 'code', '#000000', 0, 12),
('Python', 'python', 'High-level programming language', 'code', '#3776AB', 1, 13),
('Django', 'django', 'High-level Python web framework', 'code', '#092E20', 0, 14),
('Flask', 'flask', 'Lightweight WSGI web application framework', 'code', '#000000', 0, 15),
('Java', 'java', 'Object-oriented programming language', 'code', '#ED8B00', 1, 16),
('Spring Boot', 'spring-boot', 'Java-based framework for microservices', 'code', '#6DB33F', 0, 17),
('C', 'c', 'General-purpose programming language', 'code', '#A8B9CC', 0, 18),
('C++', 'cpp', 'General-purpose programming language with OOP', 'code', '#00599C', 0, 19),
('C#', 'csharp', 'Object-oriented programming language by Microsoft', 'code', '#239120', 0, 20),
('.NET', 'dotnet', 'Free, cross-platform developer platform', 'code', '#512BD4', 0, 21),
('Kotlin', 'kotlin', 'Cross-platform programming language', 'code', '#7F52FF', 0, 22),
('Swift', 'swift', 'Powerful programming language for iOS/macOS', 'code', '#FA7343', 0, 23),
('SQL', 'sql', 'Standard language for relational database management', 'database', '#E38C00', 1, 24),
('MySQL', 'mysql', 'Open-source relational database management system', 'database', '#4479A1', 1, 25),
('PostgreSQL', 'postgresql', 'Advanced open-source relational database', 'database', '#4169E1', 0, 26),
('Oracle', 'oracle', 'Multi-model database management system', 'database', '#F80000', 0, 27),
('MongoDB', 'mongodb', 'Source-available cross-platform document-oriented database', 'database', '#47A248', 1, 28),
('Firebase', 'firebase', 'Google-backed application development platform', 'database', '#FFCA28', 0, 29),
('API Development', 'api-development', 'Building and designing RESTful and GraphQL APIs', 'plug', '#6C63FF', 1, 30),
('REST API', 'rest-api', 'Architectural style for distributed systems', 'plug', '#25D366', 0, 31),
('GraphQL', 'graphql', 'Query language for APIs', 'code', '#E10098', 0, 32),
('Cybersecurity', 'cybersecurity', 'Protection of computer systems from theft and damage', 'shield', '#FF4757', 1, 33),
('Ethical Hacking', 'ethical-hacking', 'Authorized bypassing of system security', 'user-secret', '#2ED573', 0, 34),
('Networking', 'networking', 'Practice of linking computing devices together', 'network-wired', '#1E90FF', 0, 35),
('Linux', 'linux', 'Open-source Unix-like operating system', 'terminal', '#FCC624', 0, 36),
('DevOps', 'devops', 'Software development and IT operations practices', 'cogs', '#F05032', 1, 37),
('Docker', 'docker', 'Platform for developing, shipping, and running applications', 'cube', '#2496ED', 0, 38),
('Kubernetes', 'kubernetes', 'Container orchestration system', 'cube', '#326CE5', 0, 39),
('Cloud Computing', 'cloud-computing', 'On-demand availability of computer system resources', 'cloud', '#0066FF', 1, 40),
('AWS', 'aws', 'Amazon Web Services cloud platform', 'cloud', '#FF9900', 0, 41),
('Azure', 'azure', 'Microsoft cloud computing platform', 'cloud', '#0078D4', 0, 42),
('Google Cloud', 'google-cloud', 'Google Cloud Platform', 'cloud', '#4285F4', 0, 43),
('Data Science', 'data-science', 'Scientific methods and algorithms to extract insights', 'chart-bar', '#764ABC', 1, 44),
('Machine Learning', 'machine-learning', 'Field of AI that provides systems the ability to learn', 'robot', '#F7931E', 1, 45),
('Artificial Intelligence', 'artificial-intelligence', 'Intelligence demonstrated by machines', 'brain', '#00BCD4', 1, 46),
('Deep Learning', 'deep-learning', 'Subset of machine learning with neural networks', 'layer-group', '#E91E63', 0, 47),
('Prompt Engineering', 'prompt-engineering', 'Designing and optimizing prompts for AI models', 'comment', '#00BFA5', 0, 48),
('Mobile Development', 'mobile-development', 'Building applications for mobile devices', 'mobile-alt', '#FF6F00', 1, 49),
('Android Development', 'android-development', 'Building applications for Android', 'android', '#3DDC84', 0, 50),
('iOS Development', 'ios-development', 'Building applications for Apple iOS', 'apple', '#000000', 0, 51),
('UI/UX Design', 'ui-ux-design', 'User interface and user experience design', 'paint-brush', '#FF4081', 0, 52),
('Web Design', 'web-design', 'Design of websites and web applications', 'palette', '#2196F3', 0, 53),
('Graphic Design', 'graphic-design', 'Visual content creation', 'images', '#9C27B0', 0, 54),
('Computer Repair', 'computer-repair', 'Maintenance and repair of computer hardware', 'tools', '#607D8B', 0, 55),
('Hardware Maintenance', 'hardware-maintenance', 'Physical upkeep of computer hardware', 'microchip', '#795548', 0, 56),
('Software Engineering', 'software-engineering', 'Systematic approach to software development', 'file-code', '#FF9800', 1, 57),
('Operating Systems', 'operating-systems', 'System software that manages computer hardware', 'desktop', '#3F51B5', 0, 58),
('Git & GitHub', 'git-github', 'Version control system and collaborative platform', 'code-branch', '#F05032', 1, 59);

-- Insert Categories
INSERT INTO categories (name, slug, sort_order) VALUES
('Programming', 'programming', 1),
('Web Development', 'web-development', 2),
('Mobile Development', 'mobile-development', 3),
('Data Science', 'data-science', 4),
('Cybersecurity', 'cybersecurity', 5),
('Cloud Computing', 'cloud-computing', 6),
('DevOps', 'devops', 7),
('Database', 'database', 8),
('Design', 'design', 9),
('Hardware', 'hardware', 10);

-- Insert sub_skills for key skills
INSERT INTO sub_skills (skill_id, name, slug, sort_order) VALUES
-- Cybersecurity sub-skills
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Introduction', 'cybersec-intro', 1),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Networking Basics', 'cybersec-networking', 2),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Linux', 'cybersec-linux', 3),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Security Fundamentals', 'cybersec-fundamentals', 4),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Penetration Testing', 'cybersec-pentest', 5),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Kali Linux', 'cybersec-kali', 6),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Nmap', 'cybersec-nmap', 7),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Burp Suite', 'cybersec-burp', 8),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'OWASP', 'cybersec-owasp', 9),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Wireshark', 'cybersec-wireshark', 10),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Metasploit', 'cybersec-metasploit', 11),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Web Security', 'cybersec-web', 12),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Mobile Security', 'cybersec-mobile', 13),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Cloud Security', 'cybersec-cloud', 14),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Malware Analysis', 'cybersec-malware', 15),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Digital Forensics', 'cybersec-forensics', 16),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Final Projects', 'cybersec-projects', 17),
-- Python sub-skills
((SELECT id FROM skills WHERE slug = 'python'), 'Python Basics', 'python-basics', 1),
((SELECT id FROM skills WHERE slug = 'python'), 'Data Types & Variables', 'python-datatypes', 2),
((SELECT id FROM skills WHERE slug = 'python'), 'Control Flow', 'python-control-flow', 3),
((SELECT id FROM skills WHERE slug = 'python'), 'Functions & Modules', 'python-functions', 4),
((SELECT id FROM skills WHERE slug = 'python'), 'OOP in Python', 'python-oop', 5),
((SELECT id FROM skills WHERE slug = 'python'), 'File Handling', 'python-files', 6),
((SELECT id FROM skills WHERE slug = 'python'), 'Error Handling', 'python-errors', 7),
((SELECT id FROM skills WHERE slug = 'python'), 'Python Projects', 'python-projects', 8),
-- JavaScript sub-skills
((SELECT id FROM skills WHERE slug = 'javascript'), 'JS Fundamentals', 'js-fundamentals', 1),
((SELECT id FROM skills WHERE slug = 'javascript'), 'DOM Manipulation', 'js-dom', 2),
((SELECT id FROM skills WHERE slug = 'javascript'), 'ES6+ Features', 'js-es6', 3),
((SELECT id FROM skills WHERE slug = 'javascript'), 'Async JavaScript', 'js-async', 4),
((SELECT id FROM skills WHERE slug = 'javascript'), 'Error Handling', 'js-error-handling', 5),
((SELECT id FROM skills WHERE slug = 'javascript'), 'JS Projects', 'js-projects', 6),
-- Java sub-skills
((SELECT id FROM skills WHERE slug = 'java'), 'Java Basics', 'java-basics', 1),
((SELECT id FROM skills WHERE slug = 'java'), 'OOP Concepts', 'java-oop', 2),
((SELECT id FROM skills WHERE slug = 'java'), 'Collections Framework', 'java-collections', 3),
((SELECT id FROM skills WHERE slug = 'java'), 'Exception Handling', 'java-exceptions', 4),
((SELECT id FROM skills WHERE slug = 'java'), 'File I/O', 'java-fileio', 5),
((SELECT id FROM skills WHERE slug = 'java'), 'Java Projects', 'java-projects', 6),
-- Full Stack sub-skills
((SELECT id FROM skills WHERE slug = 'full-stack-development'), 'HTML & CSS', 'fs-html-css', 1),
((SELECT id FROM skills WHERE slug = 'full-stack-development'), 'JavaScript', 'fs-javascript', 2),
((SELECT id FROM skills WHERE slug = 'full-stack-development'), 'Frontend Frameworks', 'fs-frontend', 3),
((SELECT id FROM skills WHERE slug = 'full-stack-development'), 'Backend Development', 'fs-backend', 4),
((SELECT id FROM skills WHERE slug = 'full-stack-development'), 'Databases', 'fs-databases', 5),
((SELECT id FROM skills WHERE slug = 'full-stack-development'), 'Deployment', 'fs-deployment', 6),
-- React sub-skills
((SELECT id FROM skills WHERE slug = 'react'), 'React Basics', 'react-basics', 1),
((SELECT id FROM skills WHERE slug = 'react'), 'Components & Props', 'react-components', 2),
((SELECT id FROM skills WHERE slug = 'react'), 'State & Hooks', 'react-hooks', 3),
((SELECT id FROM skills WHERE slug = 'react'), 'React Router', 'react-router', 4),
((SELECT id FROM skills WHERE slug = 'react'), 'State Management', 'react-state-mgmt', 5),
((SELECT id FROM skills WHERE slug = 'react'), 'React Projects', 'react-projects', 6);

-- Insert real YouTube video courses for ALL 59 skills
INSERT INTO videos (skill_id, category_id, title, slug, description, youtube_id, embed_url, thumbnail, instructor, duration, is_featured, views, likes_count) VALUES

-- 1. Full Stack Development: freeCodeCamp 48h full stack course
((SELECT id FROM skills WHERE slug = 'full-stack-development'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Become a Fullstack Developer from Scratch', 'fullstack-scratch', 'Complete full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, Next.js, TypeScript, databases, and testing.', 'LzMnsfqjzkA', 'https://www.youtube.com/embed/LzMnsfqjzkA', 'https://img.youtube.com/vi/LzMnsfqjzkA/maxresdefault.jpg', 'freeCodeCamp', '47:29:20', 1, 5000, 450),

-- 2. Frontend Development: freeCodeCamp React course
((SELECT id FROM skills WHERE slug = 'frontend-development'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Learn React JS - Full Beginner Tutorial', 'react-full-beginners', 'Build modern frontend applications with React. Covers components, props, state, hooks, and 170+ interactive challenges.', 'x4rFhThSX04', 'https://www.youtube.com/embed/x4rFhThSX04', 'https://img.youtube.com/vi/x4rFhThSX04/maxresdefault.jpg', 'freeCodeCamp', '15:40:54', 1, 3500, 300),

-- 3. Backend Development: freeCodeCamp Node.js course
((SELECT id FROM skills WHERE slug = 'backend-development'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Node.js and Express.js Full Course', 'nodejs-express-full', 'Build server-side applications with Node.js and Express.js. Covers REST APIs, authentication, databases, and deployment.', 'Oe421EPjeBE', 'https://www.youtube.com/embed/Oe421EPjeBE', 'https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg', 'freeCodeCamp', '8:16:47', 1, 2800, 250),

-- 4. PHP: freeCodeCamp PHP course
((SELECT id FROM skills WHERE slug = 'php'), (SELECT id FROM categories WHERE slug = 'web-development'), 'PHP Programming Language Full Course', 'php-full-course', 'Learn PHP from scratch. Covers syntax, functions, OOP, MySQL integration, and web application development.', 'OK_JCtrrv-c', 'https://www.youtube.com/embed/OK_JCtrrv-c', 'https://img.youtube.com/vi/OK_JCtrrv-c/maxresdefault.jpg', 'freeCodeCamp', '4:36:39', 1, 4500, 350),

-- 5. Laravel: freeCodeCamp Laravel course
((SELECT id FROM skills WHERE slug = 'laravel'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Laravel PHP Framework Full Course', 'laravel-full-course', 'Learn Laravel from scratch. Covers routing, Eloquent ORM, Blade templating, authentication, and building real applications.', 'ImtZ5yENzgE', 'https://www.youtube.com/embed/ImtZ5yENzgE', 'https://img.youtube.com/vi/ImtZ5yENzgE/maxresdefault.jpg', 'freeCodeCamp', '4:25:05', 1, 3200, 280),

-- 6. React: freeCodeCamp full beginner tutorial
((SELECT id FROM skills WHERE slug = 'react'), (SELECT id FROM categories WHERE slug = 'web-development'), 'React JS Full Course for Beginners', 'react-full-course', 'Learn modern React basics. Over 170 interactive coding challenges and six projects.', 'x4rFhThSX04', 'https://www.youtube.com/embed/x4rFhThSX04', 'https://img.youtube.com/vi/x4rFhThSX04/maxresdefault.jpg', 'freeCodeCamp', '15:40:54', 1, 3800, 320),

-- 7. Vue: freeCodeCamp Vue.js course
((SELECT id FROM skills WHERE slug = 'vue'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Learn Vue.js Full Course for Beginners', 'vue-full-course', 'Learn Vue.js framework for building user interfaces and single-page applications.', '4deVCNJq3qc', 'https://www.youtube.com/embed/4deVCNJq3qc', 'https://img.youtube.com/vi/4deVCNJq3qc/maxresdefault.jpg', 'freeCodeCamp', '2:58:58', 1, 2200, 190),

-- 8. Angular: freeCodeCamp Angular course
((SELECT id FROM skills WHERE slug = 'angular'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Learn Angular Full Tutorial Course', 'angular-full-course', 'Complete Angular tutorial covering components, services, routing, HTTP client, and forms.', '2OHbjep_WjQ', 'https://www.youtube.com/embed/2OHbjep_WjQ', 'https://img.youtube.com/vi/2OHbjep_WjQ/maxresdefault.jpg', 'freeCodeCamp', '5:37:59', 1, 2500, 210),

-- 9. JavaScript: freeCodeCamp JavaScript course
((SELECT id FROM skills WHERE slug = 'javascript'), (SELECT id FROM categories WHERE slug = 'programming'), 'JavaScript Programming Full Course', 'javascript-full-programming', 'Master JavaScript from fundamentals to advanced. Covers ES6, DOM, async programming, and more.', 'jS4aFq5-91M', 'https://www.youtube.com/embed/jS4aFq5-91M', 'https://img.youtube.com/vi/jS4aFq5-91M/maxresdefault.jpg', 'freeCodeCamp', '7:54:33', 1, 5200, 410),

-- 10. TypeScript: freeCodeCamp TypeScript course
((SELECT id FROM skills WHERE slug = 'typescript'), (SELECT id FROM categories WHERE slug = 'programming'), 'Learn TypeScript Full Course for Beginners', 'typescript-full-course', 'Hands-on introduction to TypeScript. Learn how TypeScript makes your code less error-prone.', 'SpwzRDUQ1GI', 'https://www.youtube.com/embed/SpwzRDUQ1GI', 'https://img.youtube.com/vi/SpwzRDUQ1GI/maxresdefault.jpg', 'freeCodeCamp', '2:06:12', 1, 1800, 150),

-- 11. Node.js: freeCodeCamp Node.js course
((SELECT id FROM skills WHERE slug = 'nodejs'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Node.js and Express.js Full Course', 'nodejs-express-full-course', 'Learn Node.js runtime and Express.js framework. Build RESTful APIs and full backend applications.', 'Oe421EPjeBE', 'https://www.youtube.com/embed/Oe421EPjeBE', 'https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg', 'freeCodeCamp', '8:16:47', 1, 3000, 270),

-- 12. Express.js: same course as Node.js
((SELECT id FROM skills WHERE slug = 'expressjs'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Express.js with Node.js Full Course', 'expressjs-full-course', 'Build web applications and APIs using Express.js framework on top of Node.js.', 'Oe421EPjeBE', 'https://www.youtube.com/embed/Oe421EPjeBE', 'https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg', 'freeCodeCamp', '8:16:47', 0, 2000, 180),

-- 13. Python: freeCodeCamp Python for Beginners
((SELECT id FROM skills WHERE slug = 'python'), (SELECT id FROM categories WHERE slug = 'programming'), 'Python for Beginners Full Course', 'python-beginners', 'Learn Python programming from scratch with hands-on examples and projects.', 'rfscVS0vtbw', 'https://www.youtube.com/embed/rfscVS0vtbw', 'https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg', 'freeCodeCamp', '4:26:16', 1, 5500, 420),

-- 14. Django: freeCodeCamp Django course
((SELECT id FROM skills WHERE slug = 'django'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Python Backend Web Development with Django', 'django-full-course', 'Learn Django framework for building database-driven web applications with Python.', 'jBzwzrDvZ18', 'https://www.youtube.com/embed/jBzwzrDvZ18', 'https://img.youtube.com/vi/jBzwzrDvZ18/maxresdefault.jpg', 'freeCodeCamp', '10:11:51', 1, 3500, 310),

-- 15. Flask: freeCodeCamp Flask course
((SELECT id FROM skills WHERE slug = 'flask'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Web Development with Python Flask', 'flask-full-course', 'Develop dynamic database-driven web apps with Python, Flask, and MySQL.', 'yBDHkveJUf4', 'https://www.youtube.com/embed/yBDHkveJUf4', 'https://img.youtube.com/vi/yBDHkveJUf4/maxresdefault.jpg', 'freeCodeCamp', '4:38:03', 0, 1500, 130),

-- 16. Java: freeCodeCamp Java course
((SELECT id FROM skills WHERE slug = 'java'), (SELECT id FROM categories WHERE slug = 'programming'), 'Java Programming Full Course', 'java-full-course', 'Complete Java programming course covering fundamentals, OOP, data structures, and GUI development.', 'A74TOX80Dvk', 'https://www.youtube.com/embed/A74TOX80Dvk', 'https://img.youtube.com/vi/A74TOX80Dvk/maxresdefault.jpg', 'freeCodeCamp', '4:14:15', 1, 4800, 380),

-- 17. Spring Boot: freeCodeCamp Spring Boot course
((SELECT id FROM skills WHERE slug = 'spring-boot'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Building Web Applications with Spring Boot 3', 'spring-boot-full-course', 'Learn Spring Boot fundamentals by creating a REST API with database support and comprehensive tests.', '31KTdfRH6nY', 'https://www.youtube.com/embed/31KTdfRH6nY', 'https://img.youtube.com/vi/31KTdfRH6nY/maxresdefault.jpg', 'freeCodeCamp', '3:30:40', 0, 2800, 240),

-- 18. C: freeCodeCamp C course
((SELECT id FROM skills WHERE slug = 'c'), (SELECT id FROM categories WHERE slug = 'programming'), 'C Programming Tutorial for Beginners', 'c-full-course', 'Learn C programming language fundamentals. Covers pointers, memory management, and system programming.', 'KJgsSFOSQv0', 'https://www.youtube.com/embed/KJgsSFOSQv0', 'https://img.youtube.com/vi/KJgsSFOSQv0/maxresdefault.jpg', 'freeCodeCamp', '4:36:39', 0, 4200, 340),

-- 19. C++: freeCodeCamp C++ course
((SELECT id FROM skills WHERE slug = 'cpp'), (SELECT id FROM categories WHERE slug = 'programming'), 'C++ Programming Course Beginner to Advanced', 'cpp-full-course', 'Learn modern C++20 programming. Covers variables, OOP, STL, templates, and advanced features.', '8jLOx1hD3_o', 'https://www.youtube.com/embed/8jLOx1hD3_o', 'https://img.youtube.com/vi/8jLOx1hD3_o/maxresdefault.jpg', 'freeCodeCamp', '31:07:29', 1, 6800, 520),

-- 20. C#: freeCodeCamp C# course
((SELECT id FROM skills WHERE slug = 'csharp'), (SELECT id FROM categories WHERE slug = 'programming'), 'C# Tutorial Full Course for Beginners', 'csharp-full-course', 'Learn C# programming fundamentals including OOP, LINQ, and .NET framework integration.', 'GhQdlIFylQ8', 'https://www.youtube.com/embed/GhQdlIFylQ8', 'https://img.youtube.com/vi/GhQdlIFylQ8/maxresdefault.jpg', 'freeCodeCamp', '4:31:08', 1, 3800, 320),

-- 21. .NET: freeCodeCamp ASP.NET Core course
((SELECT id FROM skills WHERE slug = 'dotnet'), (SELECT id FROM categories WHERE slug = 'programming'), 'Learn ASP.NET Core MVC (.NET 6) Full Course', 'dotnet-full-course', 'Build CRUD applications with ASP.NET Core MVC. Learn .NET fundamentals and web development with C#.', 'hZ1DASYd9rk', 'https://www.youtube.com/embed/hZ1DASYd9rk', 'https://img.youtube.com/vi/hZ1DASYd9rk/maxresdefault.jpg', 'freeCodeCamp', '3:07:27', 0, 1800, 160),

-- 22. Kotlin: freeCodeCamp Kotlin course
((SELECT id FROM skills WHERE slug = 'kotlin'), (SELECT id FROM categories WHERE slug = 'programming'), 'Learn Kotlin Programming Full Course for Beginners', 'kotlin-full-course', 'Master Kotlin programming language for Android development. Covers syntax, OOP, functional programming.', 'EExSSotojVI', 'https://www.youtube.com/embed/EExSSotojVI', 'https://img.youtube.com/vi/EExSSotojVI/maxresdefault.jpg', 'freeCodeCamp', '13:18:55', 1, 2200, 190),

-- 23. Swift: freeCodeCamp Swift course
((SELECT id FROM skills WHERE slug = 'swift'), (SELECT id FROM categories WHERE slug = 'programming'), 'Swift Programming Tutorial Full Course for Beginners', 'swift-full-course', 'Learn Swift programming language for iOS and macOS app development from scratch.', '8Xg7E9shq0U', 'https://www.youtube.com/embed/8Xg7E9shq0U', 'https://img.youtube.com/vi/8Xg7E9shq0U/maxresdefault.jpg', 'freeCodeCamp', '3:45:00', 0, 1500, 130),

-- 24. SQL: freeCodeCamp SQL course
((SELECT id FROM skills WHERE slug = 'sql'), (SELECT id FROM categories WHERE slug = 'database'), 'SQL Complete Course for Beginners', 'sql-complete-course', 'Master SQL queries, JOINs, database design, and advanced database concepts.', 'HXV3zeQKqGY', 'https://www.youtube.com/embed/HXV3zeQKqGY', 'https://img.youtube.com/vi/HXV3zeQKqGY/maxresdefault.jpg', 'freeCodeCamp', '4:20:38', 1, 5500, 430),

-- 25. MySQL: freeCodeCamp MySQL course
((SELECT id FROM skills WHERE slug = 'mysql'), (SELECT id FROM categories WHERE slug = 'database'), 'MySQL Database Full Course for Beginners', 'mysql-full-course', 'Learn MySQL database management. Covers SQL basics, data modeling, indexes, locks, and query optimization.', 'ER8oKX5myE0', 'https://www.youtube.com/embed/ER8oKX5myE0', 'https://img.youtube.com/vi/ER8oKX5myE0/maxresdefault.jpg', 'freeCodeCamp', '1:59:31', 1, 3200, 280),

-- 26. PostgreSQL: freeCodeCamp PostgreSQL course
((SELECT id FROM skills WHERE slug = 'postgresql'), (SELECT id FROM categories WHERE slug = 'database'), 'Learn PostgreSQL Tutorial Full Course for Beginners', 'postgresql-full-course', 'Learn PostgreSQL from the ground up. Covers SQL, constraints, joins, foreign keys, and database design.', 'qw--VYLpxG4', 'https://www.youtube.com/embed/qw--VYLpxG4', 'https://img.youtube.com/vi/qw--VYLpxG4/maxresdefault.jpg', 'freeCodeCamp', '4:19:34', 1, 2800, 240),

-- 27. Oracle: use advanced SQL/database course
((SELECT id FROM skills WHERE slug = 'oracle'), (SELECT id FROM categories WHERE slug = 'database'), 'Relational Database Design Full Course', 'database-design-course', 'Learn relational database design including normalization, indexing, and query optimization for enterprise databases.', '26ls5lNiijk', 'https://www.youtube.com/embed/26ls5lNiijk', 'https://img.youtube.com/vi/26ls5lNiijk/maxresdefault.jpg', 'freeCodeCamp', '5:54:43', 0, 1200, 100),

-- 28. MongoDB: freeCodeCamp MongoDB course
((SELECT id FROM skills WHERE slug = 'mongodb'), (SELECT id FROM categories WHERE slug = 'database'), 'MongoDB Full Tutorial with Node.js Express Mongoose', 'mongodb-full-course', 'Implement MongoDB with Node.js and Express. Covers CRUD operations, Mongoose ODM, and REST APIs.', '4yqu8YF29cU', 'https://www.youtube.com/embed/4yqu8YF29cU', 'https://img.youtube.com/vi/4yqu8YF29cU/maxresdefault.jpg', 'freeCodeCamp', '1:15:17', 1, 2500, 200),

-- 29. Firebase: freeCodeCamp Firebase course
((SELECT id FROM skills WHERE slug = 'firebase'), (SELECT id FROM categories WHERE slug = 'database'), 'Full Stack React and Firebase Tutorial', 'firebase-full-course', 'Build a social media app with React, Firebase, Redux, Express, authentication, and cloud functions.', 'm_u6P5k0vP0', 'https://www.youtube.com/embed/m_u6P5k0vP0', 'https://img.youtube.com/vi/m_u6P5k0vP0/maxresdefault.jpg', 'freeCodeCamp', '12:05:30', 0, 2000, 180),

-- 30. API Development: freeCodeCamp Python API course
((SELECT id FROM skills WHERE slug = 'api-development'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Python API Development Full Course', 'python-api-development', 'Build professional REST APIs with Python. Covers FastAPI, SQLAlchemy, authentication, and deployment.', '0sOvCWFmrtA', 'https://www.youtube.com/embed/0sOvCWFmrtA', 'https://img.youtube.com/vi/0sOvCWFmrtA/maxresdefault.jpg', 'freeCodeCamp', '19:00:27', 1, 3500, 310),

-- 31. REST API: same as Node.js course
((SELECT id FROM skills WHERE slug = 'rest-api'), (SELECT id FROM categories WHERE slug = 'web-development'), 'REST API Design and Development Full Course', 'rest-api-full-course', 'Learn REST API architecture, design principles, and implementation with Node.js and Express.', 'Oe421EPjeBE', 'https://www.youtube.com/embed/Oe421EPjeBE', 'https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg', 'freeCodeCamp', '8:16:47', 0, 1800, 160),

-- 32. GraphQL: freeCodeCamp GraphQL course
((SELECT id FROM skills WHERE slug = 'graphql'), (SELECT id FROM categories WHERE slug = 'web-development'), 'GraphQL Full Course for Beginners', 'graphql-full-course', 'Learn GraphQL from novice to expert. Covers queries, mutations, schemas, resolvers, and Apollo integration.', 'ed8SzALbx1Q', 'https://www.youtube.com/embed/ed8SzALbx1Q', 'https://img.youtube.com/vi/ed8SzALbx1Q/maxresdefault.jpg', 'freeCodeCamp', '3:30:00', 0, 1500, 120),

-- 33. Cybersecurity: Harvard CS50 Cybersecurity
((SELECT id FROM skills WHERE slug = 'cybersecurity'), (SELECT id FROM categories WHERE slug = 'cybersecurity'), 'Harvard CS50 Introduction to Cybersecurity', 'harvard-cs50-cybersecurity', 'Full-length Harvard CS50 course on cybersecurity. Learn to secure accounts, data, systems, and software.', '9HOpanT0GRs', 'https://www.youtube.com/embed/9HOpanT0GRs', 'https://img.youtube.com/vi/9HOpanT0GRs/maxresdefault.jpg', 'Harvard CS50', '7:44:27', 1, 3500, 280),

-- 34. Ethical Hacking: freeCodeCamp course
((SELECT id FROM skills WHERE slug = 'ethical-hacking'), (SELECT id FROM categories WHERE slug = 'cybersecurity'), 'Hands-On Cybersecurity and Ethical Hacking Full Course', 'ethical-hacking-full', 'Master ethical hacking and penetration testing with Kali Linux. Covers Nmap, Wireshark, and vulnerability assessment.', 'ug8W0sFiVJo', 'https://www.youtube.com/embed/ug8W0sFiVJo', 'https://img.youtube.com/vi/ug8W0sFiVJo/maxresdefault.jpg', 'freeCodeCamp', '3:35:45', 0, 2200, 190),

-- 35. Networking: freeCodeCamp Networking course
((SELECT id FROM skills WHERE slug = 'networking'), (SELECT id FROM categories WHERE slug = 'cybersecurity'), 'Computer Networking Full Course', 'computer-networking-course', 'Full college-level networking course. Prepare to configure, manage, and troubleshoot networks.', 'qiQR5rTSshw', 'https://www.youtube.com/embed/qiQR5rTSshw', 'https://img.youtube.com/vi/qiQR5rTSshw/maxresdefault.jpg', 'freeCodeCamp', '9:24:48', 1, 3200, 270),

-- 36. Linux: freeCodeCamp Linux course
((SELECT id FROM skills WHERE slug = 'linux'), (SELECT id FROM categories WHERE slug = 'cybersecurity'), 'Linux Operating System Crash Course for Beginners', 'linux-full-course', 'Learn Linux OS fundamentals including terminal usage, file system, software management, and configuration.', 'ROjZy1WbCIA', 'https://www.youtube.com/embed/ROjZy1WbCIA', 'https://img.youtube.com/vi/ROjZy1WbCIA/maxresdefault.jpg', 'freeCodeCamp', '2:47:55', 0, 3500, 290),

-- 37. DevOps: freeCodeCamp Docker Kubernetes course
((SELECT id FROM skills WHERE slug = 'devops'), (SELECT id FROM categories WHERE slug = 'devops'), 'Docker Containers and Kubernetes Fundamentals', 'devops-full-course', 'Learn Docker and Kubernetes hands-on. Containerize apps, manage clusters, and deploy microservices.', 'kTp5xUtcalw', 'https://www.youtube.com/embed/kTp5xUtcalw', 'https://img.youtube.com/vi/kTp5xUtcalw/maxresdefault.jpg', 'freeCodeCamp', '5:56:36', 1, 2800, 250),

-- 38. Docker: freeCodeCamp Docker course
((SELECT id FROM skills WHERE slug = 'docker'), (SELECT id FROM categories WHERE slug = 'devops'), 'Docker Containers Fundamentals', 'docker-fundamentals', 'Learn Docker CLI, container images, Docker Compose, and containerization workflows.', 'kTp5xUtcalw', 'https://www.youtube.com/embed/kTp5xUtcalw', 'https://img.youtube.com/vi/kTp5xUtcalw/maxresdefault.jpg', 'freeCodeCamp', '5:56:36', 0, 2500, 220),

-- 39. Kubernetes: freeCodeCamp Kubernetes course
((SELECT id FROM skills WHERE slug = 'kubernetes'), (SELECT id FROM categories WHERE slug = 'devops'), 'Kubernetes Fundamentals with Docker', 'kubernetes-fundamentals', 'Learn Kubernetes architecture, pods, deployments, services, and cluster management.', 'kTp5xUtcalw', 'https://www.youtube.com/embed/kTp5xUtcalw', 'https://img.youtube.com/vi/kTp5xUtcalw/maxresdefault.jpg', 'freeCodeCamp', '5:56:36', 0, 2200, 190),

-- 40. Cloud Computing: freeCodeCamp AWS course
((SELECT id FROM skills WHERE slug = 'cloud-computing'), (SELECT id FROM categories WHERE slug = 'cloud-computing'), 'AWS Certified Cloud Practitioner Certification Course', 'cloud-computing-fundamentals', 'Master cloud computing concepts, AWS services, architecture, security, and billing.', 'NhDYbskXRgc', 'https://www.youtube.com/embed/NhDYbskXRgc', 'https://img.youtube.com/vi/NhDYbskXRgc/maxresdefault.jpg', 'freeCodeCamp', '14:17:52', 1, 3000, 260),

-- 41. AWS: freeCodeCamp AWS course
((SELECT id FROM skills WHERE slug = 'aws'), (SELECT id FROM categories WHERE slug = 'cloud-computing'), 'AWS Certified Cloud Practitioner CLF-C02', 'aws-certified-course', 'Prepare for AWS certification. Covers cloud concepts, core services, security, pricing, and architecture.', 'NhDYbskXRgc', 'https://www.youtube.com/embed/NhDYbskXRgc', 'https://img.youtube.com/vi/NhDYbskXRgc/maxresdefault.jpg', 'freeCodeCamp', '14:17:52', 1, 3200, 280),

-- 42. Azure: freeCodeCamp Azure course
((SELECT id FROM skills WHERE slug = 'azure'), (SELECT id FROM categories WHERE slug = 'cloud-computing'), 'Microsoft Azure Fundamentals Certification AZ-900', 'azure-fundamentals-course', 'Learn Microsoft Azure cloud platform. Covers core services, pricing, security, and compliance.', '5abffC-K40c', 'https://www.youtube.com/embed/5abffC-K40c', 'https://img.youtube.com/vi/5abffC-K40c/maxresdefault.jpg', 'freeCodeCamp', '8:21:49', 0, 2500, 210),

-- 43. Google Cloud: freeCodeCamp Google Cloud course
((SELECT id FROM skills WHERE slug = 'google-cloud'), (SELECT id FROM categories WHERE slug = 'cloud-computing'), 'Google Cloud Associate Cloud Engineer Course', 'google-cloud-course', 'Pass the Google Cloud ACE exam. Covers compute, storage, networking, and security in GCP.', 'jpno8FSqpc8', 'https://www.youtube.com/embed/jpno8FSqpc8', 'https://img.youtube.com/vi/jpno8FSqpc8/maxresdefault.jpg', 'freeCodeCamp', '20:02:40', 0, 2200, 190),

-- 44. Data Science: freeCodeCamp Data Science course
((SELECT id FROM skills WHERE slug = 'data-science'), (SELECT id FROM categories WHERE slug = 'data-science'), 'Learn Data Science Tutorial Full Course for Beginners', 'data-science-full-course', 'Introduction to data science covering principles, practices, tools, statistics, and machine learning.', 'ua-CiDNNj30', 'https://www.youtube.com/embed/ua-CiDNNj30', 'https://img.youtube.com/vi/ua-CiDNNj30/maxresdefault.jpg', 'freeCodeCamp', '5:52:08', 1, 4800, 380),

-- 45. Machine Learning: freeCodeCamp ML course
((SELECT id FROM skills WHERE slug = 'machine-learning'), (SELECT id FROM categories WHERE slug = 'data-science'), 'Machine Learning with Python and Scikit-Learn', 'machine-learning-full-course', 'Practical hands-on ML with Python. Covers regression, classification, decision trees, random forests, and deployment.', 'hDKCxebp88A', 'https://www.youtube.com/embed/hDKCxebp88A', 'https://img.youtube.com/vi/hDKCxebp88A/maxresdefault.jpg', 'freeCodeCamp', '18:00:34', 1, 5200, 400),

-- 46. Artificial Intelligence: freeCodeCamp AI course
((SELECT id FROM skills WHERE slug = 'artificial-intelligence'), (SELECT id FROM categories WHERE slug = 'data-science'), 'Machine Learning for Everybody Full Course', 'ai-full-course', 'Machine learning accessible to absolute beginners. Covers supervised and unsupervised learning with TensorFlow.', 'i_LwzRVP7bg', 'https://www.youtube.com/embed/i_LwzRVP7bg', 'https://img.youtube.com/vi/i_LwzRVP7bg/maxresdefault.jpg', 'freeCodeCamp', '3:53:53', 1, 3800, 320),

-- 47. Deep Learning: freeCodeCamp PyTorch course
((SELECT id FROM skills WHERE slug = 'deep-learning'), (SELECT id FROM categories WHERE slug = 'data-science'), 'PyTorch for Deep Learning and Machine Learning', 'deep-learning-full-course', 'Comprehensive deep learning course with PyTorch. Covers neural networks, CNNs, RNNs, and deployment.', 'V_xro1bcAuA', 'https://www.youtube.com/embed/V_xro1bcAuA', 'https://img.youtube.com/vi/V_xro1bcAuA/maxresdefault.jpg', 'freeCodeCamp', '25:37:25', 1, 4200, 350),

-- 48. Prompt Engineering: freeCodeCamp Prompt Engineering course
((SELECT id FROM skills WHERE slug = 'prompt-engineering'), (SELECT id FROM categories WHERE slug = 'data-science'), 'Prompt Engineering for Web Developers', 'prompt-engineering-course', 'Learn to engineer prompts for ChatGPT and LLMs. Covers context, specificity, optimization, and AI workflows.', 'ScKCy2udln8', 'https://www.youtube.com/embed/ScKCy2udln8', 'https://img.youtube.com/vi/ScKCy2udln8/maxresdefault.jpg', 'freeCodeCamp', '3:13:13', 0, 1800, 150),

-- 49. Mobile Development: freeCodeCamp Kotlin/Android course
((SELECT id FROM skills WHERE slug = 'mobile-development'), (SELECT id FROM categories WHERE slug = 'mobile-development'), 'Master Kotlin and Android Development', 'mobile-development-course', 'Master modern Android development with Kotlin. Build real-world applications from scratch.', 'EExSSotojVI', 'https://www.youtube.com/embed/EExSSotojVI', 'https://img.youtube.com/vi/EExSSotojVI/maxresdefault.jpg', 'freeCodeCamp', '13:18:55', 1, 2500, 210),

-- 50. Android Development: freeCodeCamp Kotlin course
((SELECT id FROM skills WHERE slug = 'android-development'), (SELECT id FROM categories WHERE slug = 'mobile-development'), 'Android Development with Kotlin Full Course', 'android-development-course', 'Learn Android app development using Kotlin programming language from beginner to advanced.', 'EExSSotojVI', 'https://www.youtube.com/embed/EExSSotojVI', 'https://img.youtube.com/vi/EExSSotojVI/maxresdefault.jpg', 'freeCodeCamp', '13:18:55', 0, 2800, 240),

-- 51. iOS Development: freeCodeCamp Swift course
((SELECT id FROM skills WHERE slug = 'ios-development'), (SELECT id FROM categories WHERE slug = 'mobile-development'), 'iOS Development with Swift Full Course', 'ios-development-course', 'Build iOS applications using Swift programming language. Covers UIKit, SwiftUI, and app deployment.', '8Xg7E9shq0U', 'https://www.youtube.com/embed/8Xg7E9shq0U', 'https://img.youtube.com/vi/8Xg7E9shq0U/maxresdefault.jpg', 'freeCodeCamp', '3:45:00', 0, 1800, 150),

-- 52. UI/UX Design: freeCodeCamp UI/UX course
((SELECT id FROM skills WHERE slug = 'ui-ux-design'), (SELECT id FROM categories WHERE slug = 'design'), 'UI UX Design Tutorial Wireframe Mockup and Design in Figma', 'ui-ux-design-course', 'Learn the complete UI/UX design process including wireframing, prototyping, and designing in Figma.', 'c9Wg6Cb_YlU', 'https://www.youtube.com/embed/c9Wg6Cb_YlU', 'https://img.youtube.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg', 'freeCodeCamp', '1:26:21', 0, 3200, 280),

-- 53. Web Design: freeCodeCamp HTML/CSS course
((SELECT id FROM skills WHERE slug = 'web-design'), (SELECT id FROM categories WHERE slug = 'design'), 'Learn HTML5 and CSS3 From Scratch Full Course', 'web-design-course', 'Master HTML5 and CSS3 for web design. Covers responsive layouts, animations, and modern design techniques.', 'mU6anWqZJcc', 'https://www.youtube.com/embed/mU6anWqZJcc', 'https://img.youtube.com/vi/mU6anWqZJcc/maxresdefault.jpg', 'freeCodeCamp', '11:30:52', 0, 4500, 360),

-- 54. Graphic Design: freeCodeCamp UI/UX design course
((SELECT id FROM skills WHERE slug = 'graphic-design'), (SELECT id FROM categories WHERE slug = 'design'), 'Figma Design Tutorial for Beginners', 'graphic-design-course', 'Learn graphic design principles and tools. Covers visual hierarchy, color theory, typography, and layout design.', 'c9Wg6Cb_YlU', 'https://www.youtube.com/embed/c9Wg6Cb_YlU', 'https://img.youtube.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg', 'freeCodeCamp', '1:26:21', 0, 2000, 170),

-- 55. Computer Repair: freeCodeCamp Computer Basics
((SELECT id FROM skills WHERE slug = 'computer-repair'), (SELECT id FROM categories WHERE slug = 'hardware'), 'Computer and Technology Basics Course for Absolute Beginners', 'computer-repair-course', 'Learn computer hardware, software, operating systems, and troubleshooting fundamentals.', 'y2kg3MOk1sY', 'https://www.youtube.com/embed/y2kg3MOk1sY', 'https://img.youtube.com/vi/y2kg3MOk1sY/maxresdefault.jpg', 'freeCodeCamp', '0:55:03', 0, 3500, 280),

-- 56. Hardware Maintenance: freeCodeCamp Computer Basics
((SELECT id FROM skills WHERE slug = 'hardware-maintenance'), (SELECT id FROM categories WHERE slug = 'hardware'), 'Computer Hardware Maintenance and Repair', 'hardware-maintenance-course', 'Learn computer hardware components, maintenance procedures, and troubleshooting techniques.', 'y2kg3MOk1sY', 'https://www.youtube.com/embed/y2kg3MOk1sY', 'https://img.youtube.com/vi/y2kg3MOk1sY/maxresdefault.jpg', 'freeCodeCamp', '0:55:03', 0, 1800, 150),

-- 57. Software Engineering: freeCodeCamp DSA course
((SELECT id FROM skills WHERE slug = 'software-engineering'), (SELECT id FROM categories WHERE slug = 'programming'), 'Data Structures and Algorithms Mega Course', 'software-engineering-course', 'Master technical interviews with data structures and algorithms. Covers 200+ interview problems.', 'xwI5OBEnsZU', 'https://www.youtube.com/embed/xwI5OBEnsZU', 'https://img.youtube.com/vi/xwI5OBEnsZU/maxresdefault.jpg', 'freeCodeCamp', '48:50:19', 1, 5000, 450),

-- 58. Operating Systems: freeCodeCamp OS course
((SELECT id FROM skills WHERE slug = 'operating-systems'), (SELECT id FROM categories WHERE slug = 'programming'), 'Operating Systems Course for Beginners', 'operating-systems-course', 'Comprehensive OS course covering process management, memory management, file systems, and concurrency.', 'yK1uBHPdp30', 'https://www.youtube.com/embed/yK1uBHPdp30', 'https://img.youtube.com/vi/yK1uBHPdp30/maxresdefault.jpg', 'freeCodeCamp', '24:51:56', 0, 2800, 250),

-- 59. Git & GitHub: freeCodeCamp Git course
((SELECT id FROM skills WHERE slug = 'git-github'), (SELECT id FROM categories WHERE slug = 'devops'), 'Learn Git Full Course for Beginners', 'git-github-course', 'Master version control with Git and GitHub. Covers branching, merging, rebasing, pull requests, and collaboration.', 'zTjRZNkhiEU', 'https://www.youtube.com/embed/zTjRZNkhiEU', 'https://img.youtube.com/vi/zTjRZNkhiEU/maxresdefault.jpg', 'freeCodeCamp', '3:43:34', 1, 4200, 350);

-- Insert additional videos (2-5 total per skill)
INSERT INTO videos (skill_id, category_id, title, slug, description, youtube_id, embed_url, thumbnail, instructor, duration, is_featured, views, likes_count) VALUES
-- Full Stack Development (extra)
((SELECT id FROM skills WHERE slug = 'full-stack-development'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Full Stack Web Development for Beginners', 'fullstack-beginners-2024', 'Build a complete web application from scratch using HTML, CSS, JavaScript, Node.js, and MongoDB.', 'nu_pCVPKzTk', 'https://www.youtube.com/embed/nu_pCVPKzTk', 'https://img.youtube.com/vi/nu_pCVPKzTk/maxresdefault.jpg', 'Traversy Media', '1:46:47', 0, 4200, 380),
((SELECT id FROM skills WHERE slug = 'full-stack-development'), (SELECT id FROM categories WHERE slug = 'web-development'), 'MERN Stack Tutorial for Beginners', 'mern-stack-tutorial', 'Build a full stack MERN application with MongoDB, Express, React, and Node.js.', '72bGKFuoWJ8', 'https://www.youtube.com/embed/72bGKFuoWJ8', 'https://img.youtube.com/vi/72bGKFuoWJ8/maxresdefault.jpg', 'Tech With Tim', '2:30:00', 0, 3100, 260),

-- Frontend Development (extra)
((SELECT id FROM skills WHERE slug = 'frontend-development'), (SELECT id FROM categories WHERE slug = 'web-development'), 'HTML and CSS Full Course for Beginners', 'html-css-full-course', 'Complete HTML and CSS tutorial for building modern responsive websites.', 'pQN-pknXnR4', 'https://www.youtube.com/embed/pQN-pknXnR4', 'https://img.youtube.com/vi/pQN-pknXnR4/maxresdefault.jpg', 'SuperSimpleDev', '2:37:00', 0, 6200, 500),
((SELECT id FROM skills WHERE slug = 'frontend-development'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Modern CSS Layouts You Should Know', 'modern-css-layouts', 'Learn CSS Grid, Flexbox, and modern layout techniques for responsive design.', 'rg7Fvvl3tbU', 'https://www.youtube.com/embed/rg7Fvvl3tbU', 'https://img.youtube.com/vi/rg7Fvvl3tbU/maxresdefault.jpg', 'Kevin Powell', '1:15:00', 0, 2800, 230),

-- Backend Development (extra)
((SELECT id FROM skills WHERE slug = 'backend-development'), (SELECT id FROM categories WHERE slug = 'web-development'), 'REST API Crash Course with Node Express and MongoDB', 'rest-api-crash-course', 'Learn to build REST APIs with Node.js, Express, and MongoDB in this hands-on crash course.', 'lsMQRKe5ekU', 'https://www.youtube.com/embed/lsMQRKe5ekU', 'https://img.youtube.com/vi/lsMQRKe5ekU/maxresdefault.jpg', 'Traversy Media', '1:42:30', 0, 3500, 290),

-- PHP (extra)
((SELECT id FROM skills WHERE slug = 'php'), (SELECT id FROM categories WHERE slug = 'web-development'), 'PHP Full Course for Beginners 2024', 'php-full-2024', 'Modern PHP tutorial covering PDO, MVC patterns, and building real projects.', '1h4Kx1mShs4', 'https://www.youtube.com/embed/1h4Kx1mShs4', 'https://img.youtube.com/vi/1h4Kx1mShs4/maxresdefault.jpg', 'Dave Gray', '4:32:00', 0, 3800, 310),

-- Laravel (extra)
((SELECT id FROM skills WHERE slug = 'laravel'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Laravel 11 Crash Course', 'laravel-11-crash', 'Build a complete application with Laravel 11, covering routing, views, models, and authentication.', 'tHHB5JzP-rg', 'https://www.youtube.com/embed/tHHB5JzP-rg', 'https://img.youtube.com/vi/tHHB5JzP-rg/maxresdefault.jpg', 'Laravel', '1:30:00', 0, 1800, 150),

-- React (extra)
((SELECT id FROM skills WHERE slug = 'react'), (SELECT id FROM categories WHERE slug = 'web-development'), 'React Tutorial for Beginners 2024', 'react-tutorial-2024', 'Complete React 18 tutorial covering hooks, context, routing, and building real projects.', 'LDB4uaJiA7E', 'https://www.youtube.com/embed/LDB4uaJiA7E', 'https://img.youtube.com/vi/LDB4uaJiA7E/maxresdefault.jpg', 'Programming with Mosh', '1:45:00', 0, 4500, 380),

-- Vue (extra)
((SELECT id FROM skills WHERE slug = 'vue'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Vue 3 Course for Beginners', 'vue3-beginners', 'Learn Vue.js 3 from scratch. Composition API, components, and building real apps.', 'FXpIoQ_rHfc', 'https://www.youtube.com/embed/FXpIoQ_rHfc', 'https://img.youtube.com/vi/FXpIoQ_rHfc/maxresdefault.jpg', 'freeCodeCamp', '2:40:00', 0, 1900, 160),

-- Angular (extra)
((SELECT id FROM skills WHERE slug = 'angular'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Angular Tutorial for Beginners 2024', 'angular-tutorial-2024', 'Learn Angular fundamentals and build a complete application from scratch.', '3dHNOWTI7H8', 'https://www.youtube.com/embed/3dHNOWTI7H8', 'https://img.youtube.com/vi/3dHNOWTI7H8/maxresdefault.jpg', 'Programming with Mosh', '2:10:00', 0, 2200, 180),

-- JavaScript (extra)
((SELECT id FROM skills WHERE slug = 'javascript'), (SELECT id FROM categories WHERE slug = 'programming'), 'JavaScript Concepts You Must Know', 'javascript-concepts', 'Understand closures, prototypal inheritance, event loop, and other core JS concepts.', 'RBS-GbS7FHs', 'https://www.youtube.com/embed/RBS-GbS7FHs', 'https://img.youtube.com/vi/RBS-GbS7FHs/maxresdefault.jpg', 'Web Dev Simplified', '1:15:00', 0, 3800, 320),
((SELECT id FROM skills WHERE slug = 'javascript'), (SELECT id FROM categories WHERE slug = 'programming'), 'Modern JavaScript Tutorial for Beginners', 'modern-js-tutorial', 'Learn modern ES6+ JavaScript features including arrow functions, destructuring, and modules.', 'hdI2bqCjbb0', 'https://www.youtube.com/embed/hdI2bqCjbb0', 'https://img.youtube.com/vi/hdI2bqCjbb0/maxresdefault.jpg', 'The Net Ninja', '3:45:00', 0, 4100, 340),

-- TypeScript (extra)
((SELECT id FROM skills WHERE slug = 'typescript'), (SELECT id FROM categories WHERE slug = 'programming'), 'TypeScript Crash Course for Beginners', 'typescript-crash-course', 'Learn TypeScript basics in one hour. Types, interfaces, classes, and generics.', 'gp5D00C2_jI', 'https://www.youtube.com/embed/gp5D00C2_jI', 'https://img.youtube.com/vi/gp5D00C2_jI/maxresdefault.jpg', 'Traversy Media', '1:02:00', 0, 2200, 180),

-- Node.js (extra)
((SELECT id FROM skills WHERE slug = 'nodejs'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Node.js Crash Course', 'nodejs-crash-course', 'Learn Node.js from scratch. Build REST APIs, work with databases, and deploy applications.', 'fBNz5xF-Kx4', 'https://www.youtube.com/embed/fBNz5xF-Kx4', 'https://img.youtube.com/vi/fBNz5xF-Kx4/maxresdefault.jpg', 'Traversy Media', '2:47:00', 0, 3200, 270),

-- Python (extra)
((SELECT id FROM skills WHERE slug = 'python'), (SELECT id FROM categories WHERE slug = 'programming'), 'Python Tutorial for Beginners Full Course', 'python-full-beginners', 'Learn Python step by step. Covers data types, functions, OOP, file handling, and projects.', '8DvywoWv6fI', 'https://www.youtube.com/embed/8DvywoWv6fI', 'https://img.youtube.com/vi/8DvywoWv6fI/maxresdefault.jpg', 'Programming with Mosh', '6:14:00', 0, 8200, 650),
((SELECT id FROM skills WHERE slug = 'python'), (SELECT id FROM categories WHERE slug = 'programming'), 'Python for Beginners with Projects', 'python-beginners-projects', 'Practical Python tutorial with real-world projects for absolute beginners.', 'kqtD5dpn9C8', 'https://www.youtube.com/embed/kqtD5dpn9C8', 'https://img.youtube.com/vi/kqtD5dpn9C8/maxresdefault.jpg', 'Tech With Tim', '4:26:00', 0, 5100, 420),

-- Django (extra)
((SELECT id FROM skills WHERE slug = 'django'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Django Crash Course for Beginners', 'django-crash-course', 'Build a complete Django application with authentication, database models, and deployment.', 'F5mRW0jo-U4', 'https://www.youtube.com/embed/F5mRW0jo-U4', 'https://img.youtube.com/vi/F5mRW0jo-U4/maxresdefault.jpg', 'Traversy Media', '2:30:00', 0, 2800, 230),

-- Flask (extra)
((SELECT id FROM skills WHERE slug = 'flask'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Flask Tutorial for Beginners', 'flask-tutorial-beginners', 'Learn Flask from scratch. Build web applications with Python.', 'Z1RJmh_OqeA', 'https://www.youtube.com/embed/Z1RJmh_OqeA', 'https://img.youtube.com/vi/Z1RJmh_OqeA/maxresdefault.jpg', 'Tech With Tim', '2:15:00', 0, 1600, 130),

-- Java (extra)
((SELECT id FROM skills WHERE slug = 'java'), (SELECT id FROM categories WHERE slug = 'programming'), 'Java Tutorial for Beginners 2024', 'java-tutorial-2024', 'Complete Java programming tutorial with hands-on examples and projects.', 'eIrMbAQSUh4', 'https://www.youtube.com/embed/eIrMbAQSUh4', 'https://img.youtube.com/vi/eIrMbAQSUh4/maxresdefault.jpg', 'Programming with Mosh', '2:54:00', 0, 4500, 370),
((SELECT id FROM skills WHERE slug = 'java'), (SELECT id FROM categories WHERE slug = 'programming'), 'Java Object Oriented Programming', 'java-oop-course', 'Learn Java OOP concepts: classes, objects, inheritance, polymorphism, and encapsulation.', 'pTB30a33K34', 'https://www.youtube.com/embed/pTB30a33K34', 'https://img.youtube.com/vi/pTB30a33K34/maxresdefault.jpg', 'freeCodeCamp', '3:45:00', 0, 3200, 260),

-- Spring Boot (extra)
((SELECT id FROM skills WHERE slug = 'spring-boot'), (SELECT id FROM categories WHERE slug = 'web-development'), 'Spring Boot Full Course 2024', 'spring-boot-full-2024', 'Complete Spring Boot tutorial covering REST APIs, JPA, security, and microservices.', '9SGDpanrc8U', 'https://www.youtube.com/embed/9SGDpanrc8U', 'https://img.youtube.com/vi/9SGDpanrc8U/maxresdefault.jpg', 'Amigoscode', '4:10:00', 0, 2600, 220),

-- C (extra)
((SELECT id FROM skills WHERE slug = 'c'), (SELECT id FROM categories WHERE slug = 'programming'), 'C Programming for Beginners Full Course', 'c-beginners-full', 'Learn C programming from absolute scratch with practical examples and exercises.', '87SH2Cn0s9A', 'https://www.youtube.com/embed/87SH2Cn0s9A', 'https://img.youtube.com/vi/87SH2Cn0s9A/maxresdefault.jpg', 'freeCodeCamp', '3:50:00', 0, 3800, 310),

-- C++ (extra)
((SELECT id FROM skills WHERE slug = 'cpp'), (SELECT id FROM categories WHERE slug = 'programming'), 'C++ Tutorial for Beginners Full Course', 'cpp-beginners-full', 'Complete C++ course covering basics, OOP, STL, and modern C++ features.', '87SH2Cn0s9A', 'https://www.youtube.com/embed/87SH2Cn0s9A', 'https://img.youtube.com/vi/87SH2Cn0s9A/maxresdefault.jpg', 'Programming with Mosh', '2:30:00', 0, 4500, 380),

-- C# (extra)
((SELECT id FROM skills WHERE slug = 'csharp'), (SELECT id FROM categories WHERE slug = 'programming'), 'C# Basics for Beginners', 'csharp-basics', 'Learn C# fundamentals including variables, loops, methods, and classes.', 'GhQdlIFylQ8', 'https://www.youtube.com/embed/GhQdlIFylQ8', 'https://img.youtube.com/vi/GhQdlIFylQ8/maxresdefault.jpg', 'freeCodeCamp', '3:30:00', 0, 3500, 290),

-- .NET (extra)
((SELECT id FROM skills WHERE slug = 'dotnet'), (SELECT id FROM categories WHERE slug = 'programming'), 'ASP.NET Core MVC Full Course', 'aspnet-core-mvc', 'Build modern web applications with ASP.NET Core MVC framework.', 'hZ1DASYd9rk', 'https://www.youtube.com/embed/hZ1DASYd9rk', 'https://img.youtube.com/vi/hZ1DASYd9rk/maxresdefault.jpg', 'freeCodeCamp', '3:07:00', 0, 1900, 160),

-- Kotlin (extra)
((SELECT id FROM skills WHERE slug = 'kotlin'), (SELECT id FROM categories WHERE slug = 'programming'), 'Kotlin for Beginners 2024', 'kotlin-beginners-2024', 'Learn Kotlin from scratch. Build Android apps and server-side applications.', 'EExSSotojVI', 'https://www.youtube.com/embed/EExSSotojVI', 'https://img.youtube.com/vi/EExSSotojVI/maxresdefault.jpg', 'freeCodeCamp', '5:20:00', 0, 2000, 170),

-- Swift (extra)
((SELECT id FROM skills WHERE slug = 'swift'), (SELECT id FROM categories WHERE slug = 'programming'), 'SwiftUI Tutorial for Beginners', 'swiftui-beginners', 'Learn SwiftUI to build beautiful iOS apps with Swift.', 'F2ojK0Jxv1s', 'https://www.youtube.com/embed/F2ojK0Jxv1s', 'https://img.youtube.com/vi/F2ojK0Jxv1s/maxresdefault.jpg', 'Sean Allen', '2:10:00', 0, 1800, 150),

-- SQL (extra)
((SELECT id FROM skills WHERE slug = 'sql'), (SELECT id FROM categories WHERE slug = 'database'), 'SQL Tutorial for Beginners Full Course', 'sql-tutorial-beginners', 'Master SQL from basics to advanced. JOINs, subqueries, window functions, and more.', '7S_tzqzAmEs', 'https://www.youtube.com/embed/7S_tzqzAmEs', 'https://img.youtube.com/vi/7S_tzqzAmEs/maxresdefault.jpg', 'Programming with Mosh', '2:56:00', 0, 4800, 390),

-- MySQL (extra)
((SELECT id FROM skills WHERE slug = 'mysql'), (SELECT id FROM categories WHERE slug = 'database'), 'MySQL Tutorial for Beginners Full Course', 'mysql-tutorial-beginners', 'Complete MySQL tutorial covering database design, queries, and administration.', '7S_tzqzAmEs', 'https://www.youtube.com/embed/7S_tzqzAmEs', 'https://img.youtube.com/vi/7S_tzqzAmEs/maxresdefault.jpg', 'Programming with Mosh', '1:59:00', 0, 3500, 290),

-- PostgreSQL (extra)
((SELECT id FROM skills WHERE slug = 'postgresql'), (SELECT id FROM categories WHERE slug = 'database'), 'PostgreSQL Tutorial for Beginners', 'postgresql-tutorial-beginners', 'Learn PostgreSQL from scratch. Database design, SQL queries, and administration.', 'qw--VYLpxG4', 'https://www.youtube.com/embed/qw--VYLpxG4', 'https://img.youtube.com/vi/qw--VYLpxG4/maxresdefault.jpg', 'freeCodeCamp', '3:30:00', 0, 2600, 220),

-- MongoDB (extra)
((SELECT id FROM skills WHERE slug = 'mongodb'), (SELECT id FROM categories WHERE slug = 'database'), 'MongoDB Full Course for Beginners', 'mongodb-beginners-full', 'Learn MongoDB from scratch. CRUD operations, aggregation, indexing, and data modeling.', 'of3uOGn2klQ', 'https://www.youtube.com/embed/of3uOGn2klQ', 'https://img.youtube.com/vi/of3uOGn2klQ/maxresdefault.jpg', 'freeCodeCamp', '2:50:00', 0, 2300, 190),

-- Firebase (extra)
((SELECT id FROM skills WHERE slug = 'firebase'), (SELECT id FROM categories WHERE slug = 'database'), 'Firebase Tutorial for Beginners', 'firebase-tutorial-beginners', 'Learn Firebase authentication, Firestore, cloud functions, and hosting.', '9zdvm9XlbCs', 'https://www.youtube.com/embed/9zdvm9XlbCs', 'https://img.youtube.com/vi/9zdvm9XlbCs/maxresdefault.jpg', 'Fireship', '1:20:00', 0, 2200, 180),

-- Cybersecurity (extra)
((SELECT id FROM skills WHERE slug = 'cybersecurity'), (SELECT id FROM categories WHERE slug = 'cybersecurity'), 'Cybersecurity Full Course for Beginners', 'cybersecurity-beginners-full', 'Complete cybersecurity course covering network security, cryptography, and ethical hacking.', 'inWWhb5jnEA', 'https://www.youtube.com/embed/inWWhb5jnEA', 'https://img.youtube.com/vi/inWWhb5jnEA/maxresdefault.jpg', 'freeCodeCamp', '5:25:00', 0, 3200, 270),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), (SELECT id FROM categories WHERE slug = 'cybersecurity'), 'Network Security Course for Beginners', 'network-security-beginners', 'Learn to protect networks from cyber threats. Firewalls, IDS/IPS, and security protocols.', 'qiQR5rTSshw', 'https://www.youtube.com/embed/qiQR5rTSshw', 'https://img.youtube.com/vi/qiQR5rTSshw/maxresdefault.jpg', 'freeCodeCamp', '4:30:00', 0, 2800, 230),

-- Ethical Hacking (extra)
((SELECT id FROM skills WHERE slug = 'ethical-hacking'), (SELECT id FROM categories WHERE slug = 'cybersecurity'), 'Ethical Hacking Full Course for Beginners', 'ethical-hacking-beginners', 'Learn ethical hacking from scratch. Reconnaissance, scanning, exploitation, and reporting.', 'fNz7B_i6yjM', 'https://www.youtube.com/embed/fNz7B_i6yjM', 'https://img.youtube.com/vi/fNz7B_i6yjM/maxresdefault.jpg', 'freeCodeCamp', '4:15:00', 0, 2800, 240),

-- Networking (extra)
((SELECT id FROM skills WHERE slug = 'networking'), (SELECT id FROM categories WHERE slug = 'cybersecurity'), 'Computer Networking Full Course', 'networking-full-course', 'Comprehensive networking course covering TCP/IP, DNS, routing, and network security.', 'qiQR5rTSshw', 'https://www.youtube.com/embed/qiQR5rTSshw', 'https://img.youtube.com/vi/qiQR5rTSshw/maxresdefault.jpg', 'freeCodeCamp', '9:24:00', 0, 3500, 290),

-- Linux (extra)
((SELECT id FROM skills WHERE slug = 'linux'), (SELECT id FROM categories WHERE slug = 'cybersecurity'), 'Linux Full Course for Beginners', 'linux-full-course-beginners', 'Complete Linux tutorial covering terminal commands, file system, and administration.', 'sWbUDq4S6Y8', 'https://www.youtube.com/embed/sWbUDq4S6Y8', 'https://img.youtube.com/vi/sWbUDq4S6Y8/maxresdefault.jpg', 'freeCodeCamp', '3:50:00', 0, 3800, 310),
((SELECT id FROM skills WHERE slug = 'linux'), (SELECT id FROM categories WHERE slug = 'cybersecurity'), 'Linux Command Line Tutorial for Beginners', 'linux-command-line', 'Master the Linux command line. Essential commands and shell scripting.', '3X-eBVVxBWA', 'https://www.youtube.com/embed/3X-eBVVxBWA', 'https://img.youtube.com/vi/3X-eBVVxBWA/maxresdefault.jpg', 'NetworkChuck', '2:10:00', 0, 2500, 210),

-- DevOps (extra)
((SELECT id FROM skills WHERE slug = 'devops'), (SELECT id FROM categories WHERE slug = 'devops'), 'DevOps Course for Beginners', 'devops-course-beginners', 'Learn DevOps fundamentals including CI/CD, containerization, and infrastructure as code.', 'j5ZJ3MJEQsI', 'https://www.youtube.com/embed/j5ZJ3MJEQsI', 'https://img.youtube.com/vi/j5ZJ3MJEQsI/maxresdefault.jpg', 'freeCodeCamp', '3:45:00', 0, 2600, 220),

-- Docker (extra)
((SELECT id FROM skills WHERE slug = 'docker'), (SELECT id FROM categories WHERE slug = 'devops'), 'Docker Tutorial for Beginners 2024', 'docker-tutorial-2024', 'Complete Docker tutorial from installation to advanced container management.', '3c-iBn73dDE', 'https://www.youtube.com/embed/3c-iBn73dDE', 'https://img.youtube.com/vi/3c-iBn73dDE/maxresdefault.jpg', 'TechWorld with Nana', '2:25:00', 0, 4200, 350),

-- Kubernetes (extra)
((SELECT id FROM skills WHERE slug = 'kubernetes'), (SELECT id FROM categories WHERE slug = 'devops'), 'Kubernetes Tutorial for Beginners', 'kubernetes-tutorial-beginners', 'Learn Kubernetes from scratch. Pods, services, deployments, and cluster management.', 'X48VuDVv0do', 'https://www.youtube.com/embed/X48VuDVv0do', 'https://img.youtube.com/vi/X48VuDVv0do/maxresdefault.jpg', 'TechWorld with Nana', '2:30:00', 0, 3500, 290),

-- Cloud Computing (extra)
((SELECT id FROM skills WHERE slug = 'cloud-computing'), (SELECT id FROM categories WHERE slug = 'cloud-computing'), 'Cloud Computing Tutorial for Beginners', 'cloud-computing-tutorial', 'Introduction to cloud computing concepts, models, and major providers.', 'p79g1CWvKkQ', 'https://www.youtube.com/embed/p79g1CWvKkQ', 'https://img.youtube.com/vi/p79g1CWvKkQ/maxresdefault.jpg', 'Simplilearn', '1:30:00', 0, 2800, 230),

-- AWS (extra)
((SELECT id FROM skills WHERE slug = 'aws'), (SELECT id FROM categories WHERE slug = 'cloud-computing'), 'AWS Certified Solutions Architect Course', 'aws-solutions-architect', 'Prepare for the AWS Solutions Architect certification exam with hands-on labs.', 'POTOKYDlhgA', 'https://www.youtube.com/embed/POTOKYDlhgA', 'https://img.youtube.com/vi/POTOKYDlhgA/maxresdefault.jpg', 'freeCodeCamp', '13:30:00', 0, 2800, 240),

-- Azure (extra)
((SELECT id FROM skills WHERE slug = 'azure'), (SELECT id FROM categories WHERE slug = 'cloud-computing'), 'Azure Fundamentals AZ-900 Full Course', 'azure-az900-full', 'Complete AZ-900 certification preparation course covering all cloud concepts.', '5abffC-K40c', 'https://www.youtube.com/embed/5abffC-K40c', 'https://img.youtube.com/vi/5abffC-K40c/maxresdefault.jpg', 'freeCodeCamp', '8:21:00', 0, 2500, 210),

-- Google Cloud (extra)
((SELECT id FROM skills WHERE slug = 'google-cloud'), (SELECT id FROM categories WHERE slug = 'cloud-computing'), 'Google Cloud Platform Full Course', 'gcp-full-course', 'Complete Google Cloud Platform tutorial covering compute, storage, networking, and security.', 'jpno8FSqpc8', 'https://www.youtube.com/embed/jpno8FSqpc8', 'https://img.youtube.com/vi/jpno8FSqpc8/maxresdefault.jpg', 'freeCodeCamp', '10:00:00', 0, 2000, 170),

-- Data Science (extra)
((SELECT id FROM skills WHERE slug = 'data-science'), (SELECT id FROM categories WHERE slug = 'data-science'), 'Data Science Tutorial for Beginners', 'data-science-tutorial', 'Introduction to data science with Python. Pandas, NumPy, Matplotlib, and Seaborn.', 'ua-CiDNNj30', 'https://www.youtube.com/embed/ua-CiDNNj30', 'https://img.youtube.com/vi/ua-CiDNNj30/maxresdefault.jpg', 'freeCodeCamp', '5:52:00', 0, 4800, 380),

-- Machine Learning (extra)
((SELECT id FROM skills WHERE slug = 'machine-learning'), (SELECT id FROM categories WHERE slug = 'data-science'), 'Machine Learning Full Course for Beginners', 'ml-full-beginners', 'Complete machine learning course with Python. Supervised, unsupervised, and deep learning.', 'i_LwzRVP7bg', 'https://www.youtube.com/embed/i_LwzRVP7bg', 'https://img.youtube.com/vi/i_LwzRVP7bg/maxresdefault.jpg', 'freeCodeCamp', '3:53:00', 0, 4200, 350),

-- AI (extra)
((SELECT id FROM skills WHERE slug = 'artificial-intelligence'), (SELECT id FROM categories WHERE slug = 'data-science'), 'Artificial Intelligence Full Course', 'ai-comprehensive-course', 'Comprehensive AI course covering search, planning, learning, and neural networks.', 'jV1TnsfxhBk', 'https://www.youtube.com/embed/jV1TnsfxhBk', 'https://img.youtube.com/vi/jV1TnsfxhBk/maxresdefault.jpg', 'freeCodeCamp', '4:30:00', 0, 3500, 290),

-- Deep Learning (extra)
((SELECT id FROM skills WHERE slug = 'deep-learning'), (SELECT id FROM categories WHERE slug = 'data-science'), 'Deep Learning Full Course for Beginners', 'deep-learning-beginners', 'Comprehensive deep learning course covering neural networks, CNNs, RNNs, and transformers.', 'aircAruvnKk', 'https://www.youtube.com/embed/aircAruvnKk', 'https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg', '3Blue1Brown', '3:30:00', 0, 5500, 450),

-- Prompt Engineering (extra)
((SELECT id FROM skills WHERE slug = 'prompt-engineering'), (SELECT id FROM categories WHERE slug = 'data-science'), 'Prompt Engineering Complete Guide', 'prompt-engineering-guide', 'Master prompt engineering for ChatGPT, Claude, and other AI models.', 'dOxktableTg', 'https://www.youtube.com/embed/dOxktableTg', 'https://img.youtube.com/vi/dOxktableTg/maxresdefault.jpg', 'Fireship', '0:58:00', 0, 2500, 210),

-- Mobile Development (extra)
((SELECT id FROM skills WHERE slug = 'mobile-development'), (SELECT id FROM categories WHERE slug = 'mobile-development'), 'Flutter Tutorial for Beginners', 'flutter-beginners', 'Build cross-platform mobile apps with Flutter and Dart from scratch.', 'xnLjRGzLLJI', 'https://www.youtube.com/embed/xnLjRGzLLJI', 'https://img.youtube.com/vi/xnLjRGzLLJI/maxresdefault.jpg', 'freeCodeCamp', '4:45:00', 0, 3200, 270),

-- Android Development (extra)
((SELECT id FROM skills WHERE slug = 'android-development'), (SELECT id FROM categories WHERE slug = 'mobile-development'), 'Android Development for Beginners 2024', 'android-dev-beginners-2024', 'Build Android apps with Kotlin and Jetpack Compose.', 'CqLTJJsYKFk', 'https://www.youtube.com/embed/CqLTJJsYKFk', 'https://img.youtube.com/vi/CqLTJJsYKFk/maxresdefault.jpg', 'Philipp Lackner', '3:20:00', 0, 2500, 210),

-- iOS Development (extra)
((SELECT id FROM skills WHERE slug = 'ios-development'), (SELECT id FROM categories WHERE slug = 'mobile-development'), 'iOS Development with Swift Full Course', 'ios-swift-full-course', 'Build iOS apps from scratch using Swift and SwiftUI.', '8Xg7E9shq0U', 'https://www.youtube.com/embed/8Xg7E9shq0U', 'https://img.youtube.com/vi/8Xg7E9shq0U/maxresdefault.jpg', 'freeCodeCamp', '3:45:00', 0, 1800, 150),

-- UI/UX Design (extra)
((SELECT id FROM skills WHERE slug = 'ui-ux-design'), (SELECT id FROM categories WHERE slug = 'design'), 'Figma UI Design Tutorial for Beginners', 'figma-ui-design', 'Learn to design beautiful user interfaces in Figma from scratch.', 'jwCmIBJ8Jtc', 'https://www.youtube.com/embed/jwCmIBJ8Jtc', 'https://img.youtube.com/vi/jwCmIBJ8Jtc/maxresdefault.jpg', 'DesignCourse', '1:30:00', 0, 3000, 260),

-- Web Design (extra)
((SELECT id FROM skills WHERE slug = 'web-design'), (SELECT id FROM categories WHERE slug = 'design'), 'Web Design for Beginners 2024', 'web-design-beginners-2024', 'Complete web design course covering HTML, CSS, responsive design, and modern aesthetics.', 'bMddmDQ3KMI', 'https://www.youtube.com/embed/bMddmDQ3KMI', 'https://img.youtube.com/vi/bMddmDQ3KMI/maxresdefault.jpg', 'SuperSimpleDev', '3:10:00', 0, 3500, 290),

-- Graphic Design (extra)
((SELECT id FROM skills WHERE slug = 'graphic-design'), (SELECT id FROM categories WHERE slug = 'design'), 'Graphic Design Course for Beginners', 'graphic-design-beginners', 'Learn graphic design principles, color theory, typography, and layout.', 'YqQx75OPRa0', 'https://www.youtube.com/embed/YqQx75OPRa0', 'https://img.youtube.com/vi/YqQx75OPRa0/maxresdefault.jpg', 'Envato Tuts+', '1:45:00', 0, 2200, 180),

-- Computer Repair (extra)
((SELECT id FROM skills WHERE slug = 'computer-repair'), (SELECT id FROM categories WHERE slug = 'hardware'), 'Computer Repair and Maintenance Full Course', 'computer-repair-maintenance', 'Learn to diagnose and fix common computer hardware and software issues.', 'RnG0D7pWzE8', 'https://www.youtube.com/embed/RnG0D7pWzE8', 'https://img.youtube.com/vi/RnG0D7pWzE8/maxresdefault.jpg', 'PowerCert', '2:10:00', 0, 2500, 200),

-- Software Engineering (extra)
((SELECT id FROM skills WHERE slug = 'software-engineering'), (SELECT id FROM categories WHERE slug = 'programming'), 'Software Engineering for Beginners', 'software-engineering-beginners', 'Introduction to software engineering principles, SDLC, design patterns, and testing.', 'O6KBl-YS6O0', 'https://www.youtube.com/embed/O6KBl-YS6O0', 'https://img.youtube.com/vi/O6KBl-YS6O0/maxresdefault.jpg', 'freeCodeCamp', '4:00:00', 0, 3200, 270),

-- Git & GitHub (extra)
((SELECT id FROM skills WHERE slug = 'git-github'), (SELECT id FROM categories WHERE slug = 'devops'), 'Git and GitHub Crash Course', 'git-github-crash', 'Quick introduction to Git version control and GitHub collaboration.', 'RGOj5yH7evk', 'https://www.youtube.com/embed/RGOj5yH7evk', 'https://img.youtube.com/vi/RGOj5yH7evk/maxresdefault.jpg', 'Traversy Media', '0:53:00', 0, 5500, 450),
((SELECT id FROM skills WHERE slug = 'git-github'), (SELECT id FROM categories WHERE slug = 'devops'), 'Git Tutorial for Beginners Master Version Control', 'git-tutorial-master', 'Comprehensive Git tutorial covering all essential commands and workflows.', 'HVsySz-hKr0', 'https://www.youtube.com/embed/HVsySz-hKr0', 'https://img.youtube.com/vi/HVsySz-hKr0/maxresdefault.jpg', 'freeCodeCamp', '2:15:00', 0, 3800, 310);

-- Create playlists for major skills
INSERT INTO playlists (skill_id, name, slug, sort_order) VALUES
((SELECT id FROM skills WHERE slug = 'full-stack-development'), 'Full Stack Web Development', 'fullstack-playlist', 1),
((SELECT id FROM skills WHERE slug = 'cybersecurity'), 'Cybersecurity Full Course', 'cybersecurity-full-course', 1),
((SELECT id FROM skills WHERE slug = 'python'), 'Python Programming Mastery', 'python-playlist', 1),
((SELECT id FROM skills WHERE slug = 'javascript'), 'JavaScript Complete Guide', 'javascript-playlist', 1),
((SELECT id FROM skills WHERE slug = 'react'), 'React JS Learning Path', 'react-playlist', 1),
((SELECT id FROM skills WHERE slug = 'machine-learning'), 'Machine Learning with Python', 'ml-playlist', 1),
((SELECT id FROM skills WHERE slug = 'java'), 'Java Programming', 'java-playlist', 1),
((SELECT id FROM skills WHERE slug = 'sql'), 'SQL and Database Design', 'sql-playlist', 1),
((SELECT id FROM skills WHERE slug = 'cloud-computing'), 'Cloud Computing and AWS', 'cloud-playlist', 1),
((SELECT id FROM skills WHERE slug = 'data-science'), 'Data Science Fundamentals', 'datascience-playlist', 1),
((SELECT id FROM skills WHERE slug = 'php'), 'PHP Web Development', 'php-playlist', 1),
((SELECT id FROM skills WHERE slug = 'networking'), 'Computer Networking', 'networking-playlist', 1);

-- Add videos to playlists
INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'fullstack-playlist';

INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'cybersecurity-full-course';

INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'python-playlist';

INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'javascript-playlist';

INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'react-playlist';

INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'ml-playlist';

INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'java-playlist';

INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'sql-playlist';

INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'cloud-playlist';

INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'datascience-playlist';

INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'php-playlist';

INSERT INTO playlist_videos (playlist_id, video_id, sort_order)
SELECT p.id, v.id, 1
FROM playlists p
JOIN videos v ON v.skill_id = p.skill_id
WHERE p.slug = 'networking-playlist';

-- Admin password is set in schema.sql and fixed by setup.php
