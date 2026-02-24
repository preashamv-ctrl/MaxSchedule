// 2026 Master Sports Calendar
// Fully Updated Version

export const programs = {
  warren: { id: "warren", name: "Warren 7v7", type: "football", color: "#c62828" },
  tnt: { id: "tnt", name: "TNT 7v7", type: "football", color: "#6a1b9a" },
  ua: { id: "ua", name: "UA Future Basketball", type: "basketball", color: "#f9a825" },
  kingdom: { id: "kingdom", name: "Kingdom Hoops", type: "basketball", color: "#2e7d32" },
  brazil: { id: "brazil", name: "Brazil International Tour", type: "international", color: "#00897b" },
  spain: { id: "spain", name: "Spain Euro Championships", type: "international", color: "#1565c0" },
  camp: { id: "camp", name: "Colorado Football Camp", type: "camp", color: "#ef6c00" }
};

export const events2026 = [

  // ===== MARCH =====
  {
    id: "mar-6-8",
    programs: ["warren", "tnt", "kingdom"],
    title: "MOKAN / Sioux Center Spectacular / Nike Super Regionals",
    start: "2026-03-06",
    end: "2026-03-08",
    conflict: "high"
  },
  {
    id: "mar-14-15",
    programs: ["tnt"],
    title: "Wild Wild West",
    location: "Council Bluffs, IA",
    start: "2026-03-14",
    end: "2026-03-15",
    conflict: "low"
  },
  {
    id: "mar-21-22",
    programs: ["warren", "tnt"],
    title: "Springfield / Capital City Clash",
    start: "2026-03-21",
    end: "2026-03-22",
    conflict: "medium"
  },
  {
    id: "mar-28-29",
    programs: ["warren", "tnt"],
    title: "Omaha / March Mayhem",
    start: "2026-03-28",
    end: "2026-03-29",
    conflict: "medium"
  },
  {
    id: "brazil",
    programs: ["brazil"],
    title: "Brazil International Tour",
    start: "2026-03-31",
    end: "2026-04-07",
    conflict: "blocks-all"
  },

  // ===== APRIL =====
  {
    id: "apr-3-4",
    programs: ["kingdom"],
    title: "Spring Tune Up",
    location: "Des Moines, IA",
    start: "2026-04-03",
    end: "2026-04-04"
  },
  {
    id: "apr-11-12",
    programs: ["tnt", "ua", "kingdom"],
    title: "Siouxland Shootout / Spring Meltdown / Heartland Hoopfest",
    start: "2026-04-11",
    end: "2026-04-12",
    conflict: "high"
  },
  {
    id: "apr-18-19",
    programs: ["ua", "kingdom"],
    title: "Midwest Regionals / Nike Jr EYBL Session #1",
    start: "2026-04-18",
    end: "2026-04-19",
    conflict: "medium"
  },
  {
    id: "apr-25-26",
    programs: ["tnt", "kingdom"],
    title: "H Town Showdown / Never Walk on the Hardwood",
    start: "2026-04-25",
    end: "2026-04-26",
    conflict: "medium"
  },

  // ===== MAY =====
  {
    id: "may-2-3",
    programs: ["tnt", "ua"],
    title: "Back to Ballin / UA Future",
    start: "2026-05-02",
    end: "2026-05-03",
    conflict: "medium"
  },
  {
    id: "may-9-10",
    programs: ["tnt", "kingdom"],
    title: "Memorial Stadium / Nike Jr EYBL Session #2",
    start: "2026-05-09",
    end: "2026-05-10",
    conflict: "high"
  },
  {
    id: "may-23-25",
    programs: ["kingdom"],
    title: "Midwest Memorial Classic",
    location: "Des Moines, IA",
    start: "2026-05-23",
    end: "2026-05-25"
  },

  // ===== JUNE =====
  {
    id: "jun-6-7",
    programs: ["kingdom"],
    title: "515 Frenzy",
    start: "2026-06-06",
    end: "2026-06-07"
  },
  {
    id: "camp",
    programs: ["camp"],
    title: "Colorado Football Camp",
    start: "2026-06-09",
    end: "2026-06-10"
  },
  {
    id: "jun-13-14",
    programs: ["kingdom"],
    title: "Heat Up the Hardwood",
    start: "2026-06-13",
    end: "2026-06-14"
  },
  {
    id: "spain",
    programs: ["spain"],
    title: "Euro World Championships",
    start: "2026-06-17",
    end: "2026-06-22",
    conflict: "blocks-all"
  },
  {
    id: "jun-19-21",
    programs: ["ua"],
    title: "UA Finals",
    start: "2026-06-19",
    end: "2026-06-21"
  },
  {
    id: "jun-27-28",
    programs: ["kingdom"],
    title: "Summer Showcase",
    start: "2026-06-27",
    end: "2026-06-28"
  },

  // ===== JULY =====
  {
    id: "jul-3-5",
    programs: ["ua"],
    title: "River Cities",
    start: "2026-07-03",
    end: "2026-07-05"
  },
  {
    id: "jul-9-11",
    programs: ["kingdom"],
    title: "Hardwood Classic Session #1",
    start: "2026-07-09",
    end: "2026-07-11"
  },
  {
    id: "jul-17-19",
    programs: ["ua", "tnt"],
    title: "July Jam / State Championships",
    start: "2026-07-17",
    end: "2026-07-19",
    conflict: "medium"
  },
  {
    id: "jul-25-26",
    programs: ["kingdom"],
    title: "Gym Rats Summer Finale",
    start: "2026-07-25",
    end: "2026-07-26"
  },
  {
    id: "jul-30-aug-2",
    programs: ["ua", "kingdom"],
    title: "MAYB Nationals",
    start: "2026-07-30",
    end: "2026-08-02",
    conflict: "shared"
  }
];