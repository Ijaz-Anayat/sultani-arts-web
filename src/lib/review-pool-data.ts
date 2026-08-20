import { ROMAN_URDU_BODIES } from "@/lib/review-pool-bodies-roman";

export type ReviewSeed = {
  name: string;
  location: string;
  rating: 3 | 4 | 5;
  body: string;
  daysAgo: number;
};

const NAMES = [
  "Ayesha Rahman", "Imran Qureshi", "Nadia Khalid", "Hassan Malik", "Sara Ahmed",
  "Omar Farooq", "Mehreen Ali", "Bilal Siddiqui", "Hina Shah", "Zain Abbas",
  "Fatima Noor", "Kamran Iqbal", "Rabia Hassan", "Tariq Mahmood", "Sana Javed",
  "Usman Raza", "Amina Tariq", "Faisal Khan", "Lubna Akhtar", "Hamza Sheikh",
  "Mariam Aziz", "Adnan Butt", "Zara Nadeem", "Shahid Anwar", "Iqra Yousaf",
  "Nabeel Hussain", "Samina Qadir", "Asad Mehmood", "Hira Saeed", "Waqas Nisar",
  "Bushra Jamil", "Rizwan Haider", "Maham Iftikhar", "Saadullah Khan", "Nida Parvez",
  "Junaid Aslam", "Kiran Bukhari", "Arif Zaman", "Saba Rehman", "Danish Gul",
  "Anila Majeed", "Haroon Sharif", "Yasmin Chaudhry", "Moiz Alam", "Shazia Pervez",
  "Farhan Saleem", "Tehmina Rauf", "Ibrahim Latif", "Gulrukh Awan", "Salman Zaheer",
  "Areeba Naseer", "Khurram Shahzad", "Mehwish Irfan", "Noman Qazi", "Sadia Munir",
  "Tahir Gill", "Huma Kazmi", "Waleed Anjum", "Rukhsana Baig", "Aliyan Dar",
  "Nashit Fatima", "Qasim Lodhi", "Saima Durrani", "Ehsan Warraich", "Aalia Buksh",
  "Rehan Siddique", "Zunaira Malik", "Shahbaz Cheema", "Komal Afzal", "Mubashir Rana",
  "Iffat Sohail", "Arslan Ghauri", "Nargis Taimoor", "Owais Jahangir", "Fariha Kamal",
  "Jamshed Mir", "Sundas Aftab", "Kashif Niazi", "Hafsa Qureshi", "Naveed Sattar",
  "Ambreen Zaidi", "Shahmir Khan", "Tooba Ijaz", "Asim Bhatti", "Shumaila Riaz",
  "Gohar Mustafa", "Laila Hashmi", "Umer Dastgir", "Noreen Sajjad", "Hamdullah Jan",
  "Aiman Farid", "Saqib Nadeem", "Rida Bukhari", "Tauseef Alam", "Mahnoor Gillani",
  "Irshad Qamar", "Beenish Anwar", "Fawad Tareen", "Shaista Niazi", "Muneeb Ashraf",
  "Kinza Haroon", "Jahangir Sethi", "Anum Rashid", "Shafqat Ellahi", "Hania Qadeer",
  "Rauf Ghaznavi", "Dua Fatima", "Nadeem Chauhan", "Sabeen Arshad", "Yousaf Minhas",
  "Afsheen Rauf", "Iftikhar Niazi", "Mahira Sohail", "Badar Munir", "Zaraib Awan",
  "Nimra Lodhi", "Sohail Qadri", "Hina Waqar", "Azhar Meenai", "Sumbul Raza",
  "Taha Bukhsh", "Ayesha Gill", "Murtaza Shah", "Fizza Haroon", "Noman Elahi",
  "Rabia Chishti", "Shaheryar Malik", "Hoorain Saeed", "Qaiser Niazi", "Mehak Tufail",
  "Asif Gondal", "Sanaullah Riaz", "Aiman Zahra", "Haris Qureshi", "Nida Buksh",
  "Zeeshan Warraich", "Hina Murtaza", "Arham Siddiqui", "Samreen Jaffri", "Faizan Qadir",
  "Maria Taimur", "Shahzad Butt", "Iqra Lodhi", "Nouman Hashmi", "Areesha Kamran",
  "Bilawal Rauf", "Hafsa Meenai", "Usama Cheema", "Zoya Nisar", "Kamran Tareen",
  "Sundus Elahi", "Adil Bukhari", "Mishal Qamar", "Rizwan Minhas", "Ayesha Durrani",
  "Hamza Ghauri", "Tehreem Anjum", "Shahid Lodhi", "Nimra Qazi", "Owais Hashmi",
  "Fatima Cheema", "Junaid Taimoor", "Hira Ghaznavi", "Saad Elahi", "Maham Qadri",
  "Imtiaz Rana", "Sana Warraich", "Haroon Minhas", "Aalia Niazi", "Danish Bukhsh",
  "Kiran Tareen", "Nabeel Hashmi", "Mehreen Qureshi", "Tariq Cheema", "Bushra Elahi",
  "Faisal Minhas", "Lubna Qazi", "Zain Taimur", "Iqra Hashmi", "Usman Qadri",
  "Nadia Warraich", "Hassan Elahi", "Sara Minhas", "Omar Qazi", "Hina Taimur",
  "Bilal Hashmi", "Mariam Qadri", "Adnan Elahi", "Zara Minhas", "Shahid Qazi",
  "Amina Taimur", "Kamran Hashmi", "Rabia Qadri", "Faisal Elahi", "Sana Minhas",
  "Hamza Qazi", "Fatima Taimur", "Imran Hashmi", "Nadia Qadri", "Hassan Elahi Khan",
];

const LOCATIONS = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Sialkot", "Gujranwala", "Quetta",
  "Dubai", "Abu Dhabi", "London", "Manchester", "Toronto",
  "Mississauga", "Houston", "Chicago", "Doha", "Riyadh",
];

const BODIES = ROMAN_URDU_BODIES;

function uniqueNames(): string[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const name of NAMES) {
    if (seen.has(name)) continue;
    seen.add(name);
    names.push(name);
  }
  return names;
}

export const REVIEW_POOL: ReviewSeed[] = (() => {
  const names = uniqueNames();
  if (names.length < 200 || BODIES.length < 200) {
    throw new Error("Review pool must contain 200 unique names and bodies");
  }

  return Array.from({ length: 200 }, (_, index) => ({
    name: names[index],
    location: LOCATIONS[index % LOCATIONS.length],
    rating: (index % 11 === 0 ? 3 : index % 3 === 0 ? 4 : 5) as 3 | 4 | 5,
    body: BODIES[index],
    daysAgo: 8 + ((index * 17) % 340),
  }));
})();
