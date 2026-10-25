export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionType = 'text' | 'image';

export type Question = {
  id: string;
  category: CategoryId;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  questionType?: QuestionType;
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageLicense?: string;
};

export type CategoryId =
  | 'technology'
  | 'medicine'
  | 'football'
  | 'music'
  | 'movies'
  | 'finance'
  | 'geography'
  | 'anime'
  | 'popculture'
  | 'visualiq';

export type Category = {
  id: CategoryId;
  name: string;
  icon: string;
  gradient: string;
  accent: string;
};

export const categories: Category[] = [
  { id: 'technology', name: 'Technology', icon: 'Cpu', gradient: 'from-blue-500 to-cyan-400', accent: 'text-cyan-400' },
  { id: 'medicine', name: 'Medicine', icon: 'Stethoscope', gradient: 'from-rose-500 to-red-400', accent: 'text-rose-400' },
  { id: 'football', name: 'Football', icon: 'CircleDot', gradient: 'from-green-500 to-emerald-400', accent: 'text-emerald-400' },
  { id: 'music', name: 'Music', icon: 'Music', gradient: 'from-purple-500 to-fuchsia-400', accent: 'text-fuchsia-400' },
  { id: 'movies', name: 'Movies', icon: 'Clapperboard', gradient: 'from-amber-500 to-orange-400', accent: 'text-amber-400' },
  { id: 'finance', name: 'Finance', icon: 'TrendingUp', gradient: 'from-teal-500 to-green-400', accent: 'text-teal-400' },
  { id: 'geography', name: 'Geography', icon: 'Globe2', gradient: 'from-sky-500 to-blue-400', accent: 'text-sky-400' },
  { id: 'anime', name: 'Anime', icon: 'Sparkles', gradient: 'from-pink-500 to-rose-400', accent: 'text-pink-400' },
  { id: 'popculture', name: 'Pop Culture', icon: 'Star', gradient: 'from-violet-500 to-indigo-400', accent: 'text-violet-400' },
  { id: 'visualiq', name: 'Visual IQ', icon: 'Eye', gradient: 'from-cyan-500 to-teal-400', accent: 'text-cyan-400' },
];

export const categoryById = (id: CategoryId): Category =>
  categories.find((c) => c.id === id)!;

export const questions: Question[] = [
  // Technology
  { id: 'tech-1', category: 'technology', difficulty: 'easy', question: 'What does "CPU" stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Process Utility', 'Core Power Unit'], correctIndex: 0, explanation: 'CPU stands for Central Processing Unit, the brain of a computer.' },
  { id: 'tech-2', category: 'technology', difficulty: 'easy', question: 'Which company created the iPhone?', options: ['Google', 'Samsung', 'Apple', 'Microsoft'], correctIndex: 2, explanation: 'Apple introduced the first iPhone in 2007.' },
  { id: 'tech-3', category: 'technology', difficulty: 'medium', question: 'What does "RAM" stand for?', options: ['Read Access Memory', 'Random Access Memory', 'Rapid Access Module', 'Run Access Memory'], correctIndex: 1, explanation: 'RAM stands for Random Access Memory.' },
  { id: 'tech-4', category: 'technology', difficulty: 'medium', question: 'Which programming language is primarily used for web browsers?', options: ['Python', 'C++', 'JavaScript', 'Java'], correctIndex: 2, explanation: 'JavaScript is the standard scripting language for web browsers.' },
  { id: 'tech-5', category: 'technology', difficulty: 'hard', question: 'What does "SSD" use to store data?', options: ['Magnetic disks', 'Flash memory', 'Optical lasers', 'Magnetic tape'], correctIndex: 1, explanation: 'Solid State Drives use NAND flash memory with no moving parts.' },
  { id: 'tech-6', category: 'technology', difficulty: 'hard', question: 'Which protocol is used to secure web traffic?', options: ['FTP', 'HTTP', 'TLS', 'SMTP'], correctIndex: 2, explanation: 'Transport Layer Security (TLS) encrypts web traffic over HTTPS.' },
  { id: 'tech-7', category: 'technology', difficulty: 'easy', question: 'What is the binary value of decimal 10?', options: ['1010', '1100', '1001', '1110'], correctIndex: 0, explanation: 'Decimal 10 is 1010 in binary.' },
  { id: 'tech-8', category: 'technology', difficulty: 'medium', question: 'Who is the co-founder of Microsoft?', options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Larry Page'], correctIndex: 1, explanation: 'Bill Gates co-founded Microsoft with Paul Allen in 1975.' },

  // Medicine
  { id: 'med-1', category: 'medicine', difficulty: 'easy', question: 'How many chambers does the human heart have?', options: ['2', '3', '4', '5'], correctIndex: 2, explanation: 'The human heart has four chambers: two atria and two ventricles.' },
  { id: 'med-2', category: 'medicine', difficulty: 'easy', question: 'What is the largest organ in the human body?', options: ['Liver', 'Brain', 'Skin', 'Lungs'], correctIndex: 2, explanation: 'Skin is the largest organ of the human body.' },
  { id: 'med-3', category: 'medicine', difficulty: 'medium', question: 'What vitamin is produced when skin is exposed to sunlight?', options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'], correctIndex: 3, explanation: 'Sunlight triggers Vitamin D synthesis in the skin.' },
  { id: 'med-4', category: 'medicine', difficulty: 'medium', question: 'What is the normal resting heart rate range for adults (bpm)?', options: ['30-50', '60-100', '100-140', '140-180'], correctIndex: 1, explanation: 'A normal adult resting heart rate is 60-100 beats per minute.' },
  { id: 'med-5', category: 'medicine', difficulty: 'hard', question: 'Which blood type is the universal donor?', options: ['A+', 'B+', 'O-', 'AB+'], correctIndex: 2, explanation: 'O- blood has no A, B, or Rh antigens, making it the universal donor.' },
  { id: 'med-6', category: 'medicine', difficulty: 'hard', question: 'Which hormone regulates blood sugar levels?', options: ['Cortisol', 'Insulin', 'Adrenaline', 'Melatonin'], correctIndex: 1, explanation: 'Insulin, produced by the pancreas, regulates blood glucose.' },
  { id: 'med-7', category: 'medicine', difficulty: 'easy', question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '246'], correctIndex: 1, explanation: 'The adult human body has 206 bones.' },
  { id: 'med-8', category: 'medicine', difficulty: 'medium', question: 'What is the medical term for high blood pressure?', options: ['Hypotension', 'Hypertension', 'Hyperglycemia', 'Hypoxia'], correctIndex: 1, explanation: 'Hypertension is the medical term for high blood pressure.' },

  // Football
  { id: 'fb-1', category: 'football', difficulty: 'easy', question: 'How many players are on a football (soccer) team on the field?', options: ['9', '10', '11', '12'], correctIndex: 2, explanation: 'A football team has 11 players on the field.' },
  { id: 'fb-2', category: 'football', difficulty: 'easy', question: 'Which country won the 2022 FIFA World Cup?', options: ['Brazil', 'France', 'Argentina', 'Germany'], correctIndex: 2, explanation: 'Argentina won the 2022 FIFA World Cup in Qatar.' },
  { id: 'fb-3', category: 'football', difficulty: 'medium', question: 'Which club has won the most UEFA Champions League titles?', options: ['Barcelona', 'Real Madrid', 'Bayern Munich', 'Liverpool'], correctIndex: 1, explanation: 'Real Madrid has won the most Champions League titles.' },
  { id: 'fb-4', category: 'football', difficulty: 'medium', question: 'Who won the Ballon d\'Or in 2023?', options: ['Lionel Messi', 'Erling Haaland', 'Cristiano Ronaldo', 'Kylian Mbappé'], correctIndex: 0, explanation: 'Lionel Messi won his 8th Ballon d\'Or in 2023.' },
  { id: 'fb-5', category: 'football', difficulty: 'hard', question: 'In which year was the first FIFA World Cup held?', options: ['1924', '1930', '1934', '1938'], correctIndex: 1, explanation: 'The first FIFA World Cup was held in 1930 in Uruguay.' },
  { id: 'fb-6', category: 'football', difficulty: 'hard', question: 'Which country has won the most World Cup titles?', options: ['Germany', 'Italy', 'Brazil', 'Argentina'], correctIndex: 2, explanation: 'Brazil has won 5 World Cup titles, the most of any nation.' },
  { id: 'fb-7', category: 'football', difficulty: 'easy', question: 'How long is a standard football match (regular time)?', options: ['60 minutes', '90 minutes', '120 minutes', '45 minutes'], correctIndex: 1, explanation: 'A standard match is 90 minutes: two 45-minute halves.' },
  { id: 'fb-8', category: 'football', difficulty: 'medium', question: 'Which player is known as "The Phenomenon"?', options: ['Pelé', 'Ronaldo Nazário', 'Ronaldinho', 'Kaká'], correctIndex: 1, explanation: 'Ronaldo Nazário was nicknamed "O Fenômeno" (The Phenomenon).' },

  // Music
  { id: 'mus-1', category: 'music', difficulty: 'easy', question: 'How many strings does a standard guitar have?', options: ['4', '5', '6', '7'], correctIndex: 2, explanation: 'A standard guitar has 6 strings.' },
  { id: 'mus-2', category: 'music', difficulty: 'easy', question: 'Which artist is known as the "King of Pop"?', options: ['Elvis Presley', 'Michael Jackson', 'Prince', 'David Bowie'], correctIndex: 1, explanation: 'Michael Jackson is widely known as the King of Pop.' },
  { id: 'mus-3', category: 'music', difficulty: 'medium', question: 'How many keys are on a standard piano?', options: ['66', '76', '88', '98'], correctIndex: 2, explanation: 'A standard piano has 88 keys.' },
  { id: 'mus-4', category: 'music', difficulty: 'medium', question: 'Which band performed "Bohemian Rhapsody"?', options: ['The Beatles', 'Queen', 'Led Zeppelin', 'Pink Floyd'], correctIndex: 1, explanation: 'Queen released "Bohemian Rhapsody" in 1975.' },
  { id: 'mus-5', category: 'music', difficulty: 'hard', question: 'In which key is Mozart\'s "Symphony No. 40" written?', options: ['G minor', 'D major', 'C minor', 'F major'], correctIndex: 0, explanation: 'Mozart\'s Symphony No. 40 is in G minor (K. 550).' },
  { id: 'mus-6', category: 'music', difficulty: 'hard', question: 'Who composed "The Four Seasons"?', options: ['Bach', 'Vivaldi', 'Handel', 'Beethoven'], correctIndex: 1, explanation: 'Antonio Vivaldi composed "The Four Seasons".' },
  { id: 'mus-7', category: 'music', difficulty: 'easy', question: 'What does "forte" mean in music?', options: ['Soft', 'Loud', 'Fast', 'Slow'], correctIndex: 1, explanation: 'Forte (f) means loud in musical notation.' },
  { id: 'mus-8', category: 'music', difficulty: 'medium', question: 'Which artist released the album "Thriller"?', options: ['Prince', 'Michael Jackson', 'Madonna', 'Stevie Wonder'], correctIndex: 1, explanation: 'Michael Jackson\'s "Thriller" (1982) is the best-selling album ever.' },

  // Movies
  { id: 'mov-1', category: 'movies', difficulty: 'easy', question: 'Who directed the movie "Jaws"?', options: ['George Lucas', 'Steven Spielberg', 'Martin Scorsese', 'Francis Coppola'], correctIndex: 1, explanation: 'Steven Spielberg directed "Jaws" (1975).' },
  { id: 'mov-2', category: 'movies', difficulty: 'easy', question: 'Which movie features the character "Tony Stark"?', options: ['Batman', 'Iron Man', 'Superman', 'Aquaman'], correctIndex: 1, explanation: 'Tony Stark is the alter ego of Iron Man in the MCU.' },
  { id: 'mov-3', category: 'movies', difficulty: 'medium', question: 'Which film won the Best Picture Oscar in 2020?', options: ['1917', 'Joker', 'Parasite', 'Once Upon a Time in Hollywood'], correctIndex: 2, explanation: 'Parasite won Best Picture at the 92nd Academy Awards.' },
  { id: 'mov-4', category: 'movies', difficulty: 'medium', question: 'In "The Matrix", what color pill does Neo take?', options: ['Blue', 'Green', 'Red', 'Yellow'], correctIndex: 2, explanation: 'Neo takes the red pill to wake up from the Matrix.' },
  { id: 'mov-5', category: 'movies', difficulty: 'hard', question: 'Which director made "Pulp Fiction"?', options: ['Quentin Tarantino', 'Robert Rodriguez', 'David Lynch', 'Coen Brothers'], correctIndex: 0, explanation: 'Quentin Tarantino directed "Pulp Fiction" (1994).' },
  { id: 'mov-6', category: 'movies', difficulty: 'hard', question: 'Which is the highest-grossing film of all time (as of 2023)?', options: ['Titanic', 'Avatar', 'Avengers: Endgame', 'Star Wars: The Force Awakens'], correctIndex: 1, explanation: 'Avatar (2009) reclaimed the top spot after re-releases.' },
  { id: 'mov-7', category: 'movies', difficulty: 'easy', question: 'What is the name of the toy cowboy in "Toy Story"?', options: ['Buzz', 'Woody', 'Rex', 'Slinky'], correctIndex: 1, explanation: 'Sheriff Woody is the cowboy toy in Toy Story.' },
  { id: 'mov-8', category: 'movies', difficulty: 'medium', question: 'Who played the Joker in "The Dark Knight"?', options: ['Joaquin Phoenix', 'Jared Leto', 'Heath Ledger', 'Jack Nicholson'], correctIndex: 2, explanation: 'Heath Ledger won a posthumous Oscar for the role.' },

  // Finance
  { id: 'fin-1', category: 'finance', difficulty: 'easy', question: 'What does "GDP" stand for?', options: ['General Domestic Product', 'Gross Domestic Product', 'Global Domestic Product', 'Gross Direct Profit'], correctIndex: 1, explanation: 'GDP stands for Gross Domestic Product.' },
  { id: 'fin-2', category: 'finance', difficulty: 'easy', question: 'What is a "bull market"?', options: ['Falling prices', 'Rising prices', 'Flat prices', 'Volatile prices'], correctIndex: 1, explanation: 'A bull market is a period of rising asset prices.' },
  { id: 'fin-3', category: 'finance', difficulty: 'medium', question: 'What does "IPO" stand for?', options: ['Internal Profit Order', 'Initial Public Offering', 'International Purchase Order', 'Investment Portfolio Option'], correctIndex: 1, explanation: 'IPO stands for Initial Public Offering.' },
  { id: 'fin-4', category: 'finance', difficulty: 'medium', question: 'What is the "Rule of 72" used to estimate?', options: ['Tax rate', 'Investment doubling time', 'Inflation rate', 'Loan interest'], correctIndex: 1, explanation: 'The Rule of 72 estimates how long it takes an investment to double.' },
  { id: 'fin-5', category: 'finance', difficulty: 'hard', question: 'What is a "yield curve inversion" often considered a predictor of?', options: ['Economic boom', 'Recession', 'Inflation spike', 'Stock rally'], correctIndex: 1, explanation: 'An inverted yield curve is a classic recession predictor.' },
  { id: 'fin-6', category: 'finance', difficulty: 'hard', question: 'What does "EBITDA" stand for?', options: ['Earnings Before Interest, Taxes, Depreciation, Amortization', 'Equity Before Income, Tax, Debt, Assets', 'Earnings Before Inflation, Tax, Debt, Amortization', 'Equity Based Income, Tax, Depreciation, Assets'], correctIndex: 0, explanation: 'EBITDA measures a company\'s operating performance.' },
  { id: 'fin-7', category: 'finance', difficulty: 'easy', question: 'Which is a "safe-haven" asset?', options: ['Cryptocurrency', 'Gold', 'Penny stocks', 'Junk bonds'], correctIndex: 1, explanation: 'Gold is a traditional safe-haven asset in market turmoil.' },
  { id: 'fin-8', category: 'finance', difficulty: 'medium', question: 'What does "diversification" mean in investing?', options: ['Buying one stock', 'Spreading investments across assets', 'Selling all assets', 'Borrowing to invest'], correctIndex: 1, explanation: 'Diversification spreads risk across multiple assets.' },

  // Geography
  { id: 'geo-1', category: 'geography', difficulty: 'easy', question: 'What is the capital of Japan?', options: ['Osaka', 'Kyoto', 'Tokyo', 'Nagoya'], correctIndex: 2, explanation: 'Tokyo is the capital of Japan.' },
  { id: 'geo-2', category: 'geography', difficulty: 'easy', question: 'Which is the largest continent by area?', options: ['Africa', 'Asia', 'North America', 'Europe'], correctIndex: 1, explanation: 'Asia is the largest continent by area.' },
  { id: 'geo-3', category: 'geography', difficulty: 'medium', question: 'Which river is the longest in the world?', options: ['Amazon', 'Yangtze', 'Nile', 'Mississippi'], correctIndex: 2, explanation: 'The Nile is generally considered the longest river in the world.' },
  { id: 'geo-4', category: 'geography', difficulty: 'medium', question: 'Which country has the most time zones?', options: ['Russia', 'United States', 'China', 'France'], correctIndex: 3, explanation: 'France has 12 time zones due to its overseas territories.' },
  { id: 'geo-5', category: 'geography', difficulty: 'hard', question: 'What is the smallest country in the world by area?', options: ['Monaco', 'Vatican City', 'San Marino', 'Nauru'], correctIndex: 1, explanation: 'Vatican City is the smallest country at about 0.49 km².' },
  { id: 'geo-6', category: 'geography', difficulty: 'hard', question: 'Which desert is the largest in the world?', options: ['Sahara', 'Gobi', 'Antarctic Desert', 'Arabian Desert'], correctIndex: 2, explanation: 'The Antarctic Desert is the largest desert by area.' },
  { id: 'geo-7', category: 'geography', difficulty: 'easy', question: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3, explanation: 'The Pacific Ocean is the largest and deepest ocean.' },
  { id: 'geo-8', category: 'geography', difficulty: 'medium', question: 'Mount Everest is located on the border of Nepal and which country?', options: ['India', 'China', 'Bhutan', 'Pakistan'], correctIndex: 1, explanation: 'Mount Everest sits on the border of Nepal and China (Tibet).' },

  // Anime
  { id: 'ani-1', category: 'anime', difficulty: 'easy', question: 'Which anime features a ninja named Naruto?', options: ['Bleach', 'Naruto', 'One Piece', 'Dragon Ball'], correctIndex: 1, explanation: 'Naruto Uzumaki is the protagonist of "Naruto".' },
  { id: 'ani-2', category: 'anime', difficulty: 'easy', question: 'In "Dragon Ball Z", what is the name of Goku\'s signature attack?', options: ['Kamehameha', 'Rasengan', 'Bankai', 'Gum-Gum Pistol'], correctIndex: 0, explanation: 'Goku\'s signature move is the Kamehameha wave.' },
  { id: 'ani-3', category: 'anime', difficulty: 'medium', question: 'In "One Piece", what is Luffy\'s dream?', options: ['To be a Hokage', 'To become Pirate King', 'To be a Soul Reaper', 'To find the Dragon Balls'], correctIndex: 1, explanation: 'Luffy dreams of becoming the King of the Pirates.' },
  { id: 'ani-4', category: 'anime', difficulty: 'medium', question: 'Which anime features "Titans" attacking humanity inside walls?', options: ['Attack on Titan', 'Tokyo Ghoul', 'Demon Slayer', 'Death Note'], correctIndex: 0, explanation: 'Attack on Titan features humanity fighting Titans within walls.' },
  { id: 'ani-5', category: 'anime', difficulty: 'hard', question: 'In "Death Note", what is the name of the Shinigami who drops the notebook?', options: ['Ryuk', 'Rem', 'Sidoh', 'Gelus'], correctIndex: 0, explanation: 'Ryuk is the Shinigami who drops the Death Note.' },
  { id: 'ani-6', category: 'anime', difficulty: 'hard', question: 'In "Fullmetal Alchemist", what is the taboo practice they committed?', options: ['Human transmutation', 'Alchemy', 'Soul binding', 'Philosopher\'s stone creation'], correctIndex: 0, explanation: 'Edward and Alphonse committed human transmutation.' },
  { id: 'ani-7', category: 'anime', difficulty: 'easy', question: 'Which anime features "Spirits" and a dating sim premise?', options: ['Date A Live', 'Sword Art Online', 'Re:Zero', 'No Game No Life'], correctIndex: 0, explanation: 'Date A Live involves sealing Spirits through dates.' },
  { id: 'ani-8', category: 'anime', difficulty: 'medium', question: 'In "Demon Slayer", what breathing style does Tanjiro use?', options: ['Thunder Breathing', 'Water Breathing', 'Flame Breathing', 'Insect Breathing'], correctIndex: 1, explanation: 'Tanjiro uses Water Breathing, later Sun Breathing.' },

  // Pop Culture
  { id: 'pop-1', category: 'popculture', difficulty: 'easy', question: 'Which social media app uses a ghost as its mascot?', options: ['Instagram', 'Snapchat', 'TikTok', 'Twitter'], correctIndex: 1, explanation: 'Snapchat\'s mascot is a ghost named "Ghostface".' },
  { id: 'pop-2', category: 'popculture', difficulty: 'easy', question: 'What color is the "like" button on Instagram?', options: ['Blue', 'Red', 'Green', 'White'], correctIndex: 1, explanation: 'The Instagram "like" (heart) is red when active.' },
  { id: 'pop-3', category: 'popculture', difficulty: 'medium', question: 'Which streaming service produces "Stranger Things"?', options: ['Hulu', 'Disney+', 'Netflix', 'Amazon Prime'], correctIndex: 2, explanation: 'Netflix produces "Stranger Things".' },
  { id: 'pop-4', category: 'popculture', difficulty: 'medium', question: 'Which K-pop group sings "Dynamite"?', options: ['BLACKPINK', 'BTS', 'TWICE', 'EXO'], correctIndex: 1, explanation: 'BTS released "Dynamite" in 2020.' },
  { id: 'pop-5', category: 'popculture', difficulty: 'hard', question: 'Who was the first person to reach 100M followers on Instagram?', options: ['Cristiano Ronaldo', 'Selena Gomez', 'Kylie Jenner', 'Ariana Grande'], correctIndex: 1, explanation: 'Selena Gomez was the first to hit 100M Instagram followers.' },
  { id: 'pop-6', category: 'popculture', difficulty: 'hard', question: 'Which video game became a global hit in 2020 with "island life"?', options: ['Minecraft', 'Fortnite', 'Animal Crossing: New Horizons', 'Roblox'], correctIndex: 2, explanation: 'Animal Crossing: New Horizons launched in March 2020.' },
  { id: 'pop-7', category: 'popculture', difficulty: 'easy', question: 'What is the name of the baby in "The Mandalorian"?', options: ['Baby Yoda', 'Grogu', 'Mando', 'Yoda Jr.'], correctIndex: 1, explanation: 'The child\'s real name is Grogu.' },
  { id: 'pop-8', category: 'popculture', difficulty: 'medium', question: 'Which app popularized the "Renegade" dance in 2020?', options: ['Vine', 'TikTok', 'Instagram Reels', 'YouTube Shorts'], correctIndex: 1, explanation: 'The Renegade dance went viral on TikTok.' },

  // Visual IQ — image-based questions. Alt text is deliberately generic
  // so it does not reveal the answer before the player responds.
  { id: 'viq-1', category: 'visualiq', difficulty: 'easy', questionType: 'image', question: 'Which famous landmark is shown in this image?', options: ['Eiffel Tower', 'Big Ben', 'Brandenburg Gate', 'CN Tower'], correctIndex: 0, explanation: 'The Eiffel Tower, located in Paris, France, was completed in 1889 for the World\'s Fair.', imageUrl: 'https://images.pexels.com/photos/16496484/pexels-photo-16496484.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A tall iron lattice tower against a blue sky', imageCredit: 'Mehmet Turgut Kirkgoz / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-2', category: 'visualiq', difficulty: 'easy', questionType: 'image', question: 'Which world-famous landmark is pictured here?', options: ['Petra', 'Great Wall of China', 'Hadrian\'s Wall', 'Berlin Wall'], correctIndex: 1, explanation: 'The Great Wall of China stretches over 21,000 km across northern China.', imageUrl: 'https://images.pexels.com/photos/19031655/pexels-photo-19031655.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A long stone wall winding across green mountains', imageCredit: 'Van Anh Nguyen / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-3', category: 'visualiq', difficulty: 'easy', questionType: 'image', question: 'Which landmark is shown in this image?', options: ['Lotus Temple', 'Taj Mahal', 'Hagia Sophia', 'White House'], correctIndex: 1, explanation: 'The Taj Mahal in Agra, India, was built by Mughal emperor Shah Jahan in memory of his wife.', imageUrl: 'https://images.pexels.com/photos/11948442/pexels-photo-11948442.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A white marble domed building with reflecting pool', imageCredit: 'Abhinav Sharma / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-4', category: 'visualiq', difficulty: 'medium', questionType: 'image', question: 'Which ancient landmark is pictured?', options: ['Parthenon', 'Colosseum', 'Pantheon', 'Acropolis'], correctIndex: 1, explanation: 'The Colosseum in Rome, Italy, was completed in 80 AD and could hold up to 80,000 spectators.', imageUrl: 'https://images.pexels.com/photos/15562413/pexels-photo-15562413.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A large ancient amphitheater at sunset', imageCredit: 'Görkem Özdemir / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-5', category: 'visualiq', difficulty: 'medium', questionType: 'image', question: 'Which landmark is shown here?', options: ['Lincoln Memorial', 'Statue of Liberty', 'Christ the Redeemer', 'Merlion'], correctIndex: 1, explanation: 'The Statue of Liberty in New York Harbor was a gift from France, dedicated in 1886.', imageUrl: 'https://images.pexels.com/photos/28133996/pexels-photo-28133996.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A tall green statue on an island with a city skyline', imageCredit: 'kenneth Mayeden / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-6', category: 'visualiq', difficulty: 'medium', questionType: 'image', question: 'Which famous landmark is pictured?', options: ['Pyramids of Giza', 'Luxor Temple', 'Petra Treasury', 'Stonehenge'], correctIndex: 0, explanation: 'The Pyramids of Giza, near Cairo, Egypt, were built over 4,500 years ago as royal tombs.', imageUrl: 'https://images.pexels.com/photos/31133003/pexels-photo-31133003.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'Three large ancient pyramids under a blue sky', imageCredit: 'Michelle Chadwick / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-7', category: 'visualiq', difficulty: 'easy', questionType: 'image', question: 'Which animal is shown in this image?', options: ['Rhinoceros', 'Hippopotamus', 'African Elephant', 'Cape Buffalo'], correctIndex: 2, explanation: 'The African elephant is the largest living land animal and is native to the savannas of Africa.', imageUrl: 'https://images.pexels.com/photos/13129167/pexels-photo-13129167.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A large grey mammal with big ears and a trunk', imageCredit: 'G N / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-8', category: 'visualiq', difficulty: 'medium', questionType: 'image', question: 'Which bird is pictured here?', options: ['Flamingo', 'Peacock', 'Crane', 'Toucan'], correctIndex: 1, explanation: 'The peacock is known for its iridescent tail feathers, displayed as part of its courtship ritual.', imageUrl: 'https://images.pexels.com/photos/54108/peacock-bird-spring-animal-54108.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A bird displaying colorful blue and green feathers', imageCredit: 'Pixabay / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-9', category: 'visualiq', difficulty: 'hard', questionType: 'image', question: 'Which endangered animal is shown?', options: ['Giant Panda', 'Red Panda', 'Snow Leopard', 'Binturong'], correctIndex: 1, explanation: 'The red panda is native to the eastern Himalayas and southwestern China and is classified as endangered.', imageUrl: 'https://images.pexels.com/photos/30395789/pexels-photo-30395789.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A small reddish-brown mammal in bamboo foliage', imageCredit: 'Matej Bizjak / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-10', category: 'visualiq', difficulty: 'easy', questionType: 'image', question: 'Which famous building is shown here?', options: ['Sydney Opera House', 'Guggenheim Museum', 'Walt Disney Concert Hall', 'Louvre Pyramid'], correctIndex: 0, explanation: 'The Sydney Opera House in Australia, designed by Jørn Utzon, opened in 1973 and is a UNESCO World Heritage Site.', imageUrl: 'https://images.pexels.com/photos/33378301/pexels-photo-33378301.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A white multi-shell shaped building beside a harbor', imageCredit: 'Khoi Pham / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-11', category: 'visualiq', difficulty: 'medium', questionType: 'image', question: 'Which landmark is pictured here?', options: ['Angel of the North', 'Christ the Redeemer', 'Cristo Rey', 'Statue of Unity'], correctIndex: 1, explanation: 'Christ the Redeemer overlooks Rio de Janeiro, Brazil, from Corcovado Mountain. It was completed in 1931.', imageUrl: 'https://images.pexels.com/photos/40046985/pexels-photo-40046985.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A large statue with outstretched arms atop a mountain above a city', imageCredit: 'Anderson Alves / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-12', category: 'visualiq', difficulty: 'medium', questionType: 'image', question: 'Which skyscraper is shown in this image?', options: ['Shanghai Tower', 'Burj Khalifa', 'One World Trade Center', 'Taipei 101'], correctIndex: 1, explanation: 'The Burj Khalifa in Dubai, UAE, is the tallest building in the world at 828 meters (2,717 ft).', imageUrl: 'https://images.pexels.com/photos/5577693/pexels-photo-5577693.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A very tall illuminated tower in a city skyline at night', imageCredit: 'Maria Charizani / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-13', category: 'visualiq', difficulty: 'medium', questionType: 'image', question: 'What scientific structure is depicted here?', options: ['RNA strand', 'DNA double helix', 'Protein chain', 'Chromosome'], correctIndex: 1, explanation: 'DNA forms a double helix — two intertwined strands carrying genetic information, discovered by Watson and Crick in 1953.', imageUrl: 'https://images.pexels.com/photos/25626515/pexels-photo-25626515.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A colorful twisting molecular structure', imageCredit: 'Google DeepMind / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-14', category: 'visualiq', difficulty: 'easy', questionType: 'image', question: 'Which iconic mountain is shown here?', options: ['Mount Kilimanjaro', 'Mount Fuji', 'Mount Rainier', 'Mount St. Helens'], correctIndex: 1, explanation: 'Mount Fuji is Japan\'s highest mountain (3,776 m) and an active volcano last erupting in 1707.', imageUrl: 'https://images.pexels.com/photos/35100545/pexels-photo-35100545.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A symmetrical snow-capped mountain above a cityscape at dusk', imageCredit: '王 奕鈞 / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-15', category: 'visualiq', difficulty: 'hard', questionType: 'image', question: 'Which ancient Incan landmark is pictured?', options: ['Chichen Itza', 'Machu Picchu', 'Tikal', 'Easter Island Moai'], correctIndex: 1, explanation: 'Machu Picchu is a 15th-century Incan citadel in the Andes Mountains of Peru, rediscovered in 1911.', imageUrl: 'https://images.pexels.com/photos/37885473/pexels-photo-37885473.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'Stone ruins on a green mountain ridge among clouds', imageCredit: 'Laura Rudi / Pexels', imageLicense: 'Pexels License (free to use)' },
  { id: 'viq-16', category: 'visualiq', difficulty: 'medium', questionType: 'image', question: 'Which Nigerian landmark is shown here?', options: ['Aso Rock', 'Zuma Rock', 'Olumo Rock', 'Abumu Edge'], correctIndex: 1, explanation: 'Zuma Rock is a large monolith near Abuja, Nigeria. It appears on the 100 naira note and is sometimes called the "Gateway to Abuja."', imageUrl: 'https://images.pexels.com/photos/31487832/pexels-photo-31487832.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', imageAlt: 'A large grey rock formation beside a road', imageCredit: 'Fatima Yusuf / Pexels', imageLicense: 'Pexels License (free to use)' },
];

export function getQuestions(category: CategoryId | 'mixed', count: number, difficulty?: Difficulty): Question[] {
  let pool = questions.filter((q) => (category === 'mixed' ? true : q.category === category));
  if (difficulty) {
    const filtered = pool.filter((q) => q.difficulty === difficulty);
    if (filtered.length >= count) pool = filtered;
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function hasVisualQuestions(category: CategoryId | 'mixed'): boolean {
  return questions.some((q) => q.questionType === 'image' && (category === 'mixed' || q.category === category));
}
