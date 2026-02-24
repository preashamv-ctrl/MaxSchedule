// 2026 Master Sports Calendar
// Fully Updated Version — formatted for script.js consumption

const initialData = [

  // ===== MARCH =====
  {
    id: "mar-6-8",
    title: "MOKAN / Sioux Center Spectacular / Nike Super Regionals",
    category: "Warren 7v7",
    start: "2026-03-06",
    end: "2026-03-08",
    location: "Kansas City, KS / Sioux Center, IA / Memphis, TN"
  },
  {
    id: "mar-6-8-tnt",
    title: "MOKAN / Sioux Center Spectacular / Nike Super Regionals",
    category: "TNT 7v7",
    start: "2026-03-06",
    end: "2026-03-08",
    location: "Kansas City, KS / Sioux Center, IA / Memphis, TN"
  },
  {
    id: "mar-6-8-kingdom",
    title: "Nike Super Regionals",
    category: "Kingdom Hoops",
    start: "2026-03-06",
    end: "2026-03-08",
    location: "Memphis, TN"
  },
  {
    id: "mar-14-15",
    title: "Wild Wild West",
    category: "TNT 7v7",
    start: "2026-03-14",
    end: "2026-03-15",
    location: "Council Bluffs, IA"
  },
  {
    id: "mar-21-22-warren",
    title: "Springfield",
    category: "Warren 7v7",
    start: "2026-03-21",
    end: "2026-03-22",
    location: "Springfield, MO"
  },
  {
    id: "mar-21-22-tnt",
    title: "Capital City Clash",
    category: "TNT 7v7",
    start: "2026-03-21",
    end: "2026-03-22",
    location: "Des Moines, IA"
  },
  {
    id: "mar-28-29-warren",
    title: "Omaha",
    category: "Warren 7v7",
    start: "2026-03-28",
    end: "2026-03-29",
    location: "Omaha, NE"
  },
  {
    id: "mar-28-29-tnt",
    title: "March Mayhem",
    category: "TNT 7v7",
    start: "2026-03-28",
    end: "2026-03-29",
    location: "TBD"
  },
  {
    id: "brazil",
    title: "Brazil International Tour",
    category: "Brazil International Tour",
    start: "2026-03-31",
    end: "2026-04-07",
    location: "Brazil"
  },

  // ===== APRIL =====
  {
    id: "apr-3-4",
    title: "Spring Tune Up",
    category: "Kingdom Hoops",
    start: "2026-04-03",
    end: "2026-04-04",
    location: "Des Moines, IA"
  },
  {
    id: "apr-11-12-tnt",
    title: "Siouxland Shootout",
    category: "TNT 7v7",
    start: "2026-04-11",
    end: "2026-04-12",
    location: "Sioux City, IA"
  },
  {
    id: "apr-11-12-ua",
    title: "Spring Meltdown",
    category: "UA Future Basketball",
    start: "2026-04-11",
    end: "2026-04-12",
    location: "TBD"
  },
  {
    id: "apr-11-12-kingdom",
    title: "Heartland Hoopfest",
    category: "Kingdom Hoops",
    start: "2026-04-11",
    end: "2026-04-12",
    location: "TBD"
  },
  {
    id: "apr-18-19-ua",
    title: "Midwest Regionals",
    category: "UA Future Basketball",
    start: "2026-04-18",
    end: "2026-04-19",
    location: "TBD"
  },
  {
    id: "apr-18-19-kingdom",
    title: "Nike Jr EYBL Session #1",
    category: "Kingdom Hoops",
    start: "2026-04-18",
    end: "2026-04-19",
    location: "TBD"
  },
  {
    id: "apr-25-26-tnt",
    title: "H Town Showdown",
    category: "TNT 7v7",
    start: "2026-04-25",
    end: "2026-04-26",
    location: "TBD"
  },
  {
    id: "apr-25-26-kingdom",
    title: "Never Walk on the Hardwood",
    category: "Kingdom Hoops",
    start: "2026-04-25",
    end: "2026-04-26",
    location: "TBD"
  },

  // ===== MAY =====
  {
    id: "may-2-3-tnt",
    title: "Back to Ballin",
    category: "TNT 7v7",
    start: "2026-05-02",
    end: "2026-05-03",
    location: "TBD"
  },
  {
    id: "may-2-3-ua",
    title: "UA Future",
    category: "UA Future Basketball",
    start: "2026-05-02",
    end: "2026-05-03",
    location: "TBD"
  },
  {
    id: "may-9-10-tnt",
    title: "Memorial Stadium",
    category: "TNT 7v7",
    start: "2026-05-09",
    end: "2026-05-10",
    location: "TBD"
  },
  {
    id: "may-9-10-kingdom",
    title: "Nike Jr EYBL Session #2",
    category: "Kingdom Hoops",
    start: "2026-05-09",
    end: "2026-05-10",
    location: "TBD"
  },
  {
    id: "may-23-25",
    title: "Midwest Memorial Classic",
    category: "Kingdom Hoops",
    start: "2026-05-23",
    end: "2026-05-25",
    location: "Des Moines, IA"
  },

  // ===== JUNE =====
  {
    id: "jun-6-7",
    title: "515 Frenzy",
    category: "Kingdom Hoops",
    start: "2026-06-06",
    end: "2026-06-07",
    location: "Des Moines, IA"
  },
  {
    id: "camp",
    title: "Colorado Football Camp",
    category: "Colorado Football Camp",
    start: "2026-06-09",
    end: "2026-06-10",
    location: "Boulder, CO"
  },
  {
    id: "jun-13-14",
    title: "Heat Up the Hardwood",
    category: "Kingdom Hoops",
    start: "2026-06-13",
    end: "2026-06-14",
    location: "TBD"
  },
  {
    id: "spain",
    title: "Euro World Championships",
    category: "Spain Euro Championships",
    start: "2026-06-17",
    end: "2026-06-22",
    location: "Spain"
  },
  {
    id: "jun-19-21",
    title: "UA Finals",
    category: "UA Future Basketball",
    start: "2026-06-19",
    end: "2026-06-21",
    location: "TBD"
  },
  {
    id: "jun-27-28",
    title: "Summer Showcase",
    category: "Kingdom Hoops",
    start: "2026-06-27",
    end: "2026-06-28",
    location: "TBD"
  },

  // ===== JULY =====
  {
    id: "jul-3-5",
    title: "River Cities",
    category: "UA Future Basketball",
    start: "2026-07-03",
    end: "2026-07-05",
    location: "TBD"
  },
  {
    id: "jul-9-11",
    title: "Hardwood Classic Session #1",
    category: "Kingdom Hoops",
    start: "2026-07-09",
    end: "2026-07-11",
    location: "TBD"
  },
  {
    id: "jul-17-19-ua",
    title: "July Jam",
    category: "UA Future Basketball",
    start: "2026-07-17",
    end: "2026-07-19",
    location: "TBD"
  },
  {
    id: "jul-17-19-tnt",
    title: "State Championships",
    category: "TNT 7v7",
    start: "2026-07-17",
    end: "2026-07-19",
    location: "TBD"
  },
  {
    id: "jul-25-26",
    title: "Gym Rats Summer Finale",
    category: "Kingdom Hoops",
    start: "2026-07-25",
    end: "2026-07-26",
    location: "TBD"
  },
  {
    id: "jul-30-aug-2-ua",
    title: "MAYB Nationals",
    category: "UA Future Basketball",
    start: "2026-07-30",
    end: "2026-08-02",
    location: "TBD"
  },
  {
    id: "jul-30-aug-2-kingdom",
    title: "MAYB Nationals",
    category: "Kingdom Hoops",
    start: "2026-07-30",
    end: "2026-08-02",
    location: "TBD"
  }
];