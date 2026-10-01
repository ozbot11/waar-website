/** Leadership org chart and faculty advisors. Edit this file for the Team page. */

export type OrgPerson = {
  title: string;
  name: string;
  photo?: string;
  initials?: string;
  note?: string;
  areas?: string[];
};

export const technicalLead: OrgPerson = {
  title: 'Technical Lead',
  name: 'Francisco Flores',
  photo: '/team/francisco.jpg',
  areas: [
    'Sets technical direction for the team',
    'IARC mission architecture',
    'Coordinates subsystem leads',
  ],
};

export const deputies: OrgPerson[] = [
  {
    title: 'Business Lead',
    name: 'Nina Leuchtman',
    photo: '/team/nina.jpg',
    areas: [
      'New Member Onboarding',
      'Public Outreach',
      'Grant Writing and Sponsorships',
      'Budgeting',
      'Fee and Attendance Enforcement',
    ],
  },
  {
    title: 'Technical Assistant Lead',
    name: 'Erim Evren',
    photo: '/team/erim.jpg',
    initials: 'EE',
    areas: [
      'Supports the technical lead',
      'Cross-subsystem coordination',
    ],
  },
];

export const subsystemLeads: OrgPerson[] = [
  {
    title: 'Mechanical Lead',
    name: 'Diego Heredia',
    photo: '/team/diego.jpg',
    areas: [
      'Testbed Design',
      'Structures Design',
      'Propulsion Integration',
      'Hardware System Integration',
    ],
  },
  {
    title: 'Avionics Lead',
    name: 'Joshua',
    photo: '/team/joshua.png',
    areas: [
      'Flight Controller PCB Design',
      'Power Supply PCB Design',
      'ESC PCB Design',
      'Electrical Systems Integration',
    ],
  },
  {
    title: 'Firmware Lead',
    name: 'Kent Fukuda',
    photo: '/team/kent.jpg',
    areas: [
      'Peripheral Software Integration',
      'Flight Control Software Integration',
      'Ground Station',
      'Communication',
      'Parameter Tuning',
    ],
  },
  {
    title: 'Autonomy Lead',
    name: 'Siddharth',
    photo: '/team/siddharth.png',
    initials: 'SI',
    areas: [
      'Flight Trajectory Planning',
      'User Trajectory Planning',
      'Multi Agent Coordination',
      'Flight Computer Software Integration',
    ],
  },
  {
    title: 'Perception Lead',
    name: 'Sashmit',
    initials: 'SA',
    areas: [
      'Camera Integration',
      'Visual Detection Algorithms',
      'SLAM',
      'Mapping',
    ],
  },
];

export const advisors: OrgPerson[] = [
  {
    title: 'Advisor',
    name: 'Amir Taghavei',
    photo: '/team/amir.jpg',
    areas: ['Assistant Professor · Aeronautics & Astronautics'],
  },
  {
    title: 'Advisor',
    name: 'Sanotosh Devasia',
    photo: '/team/santosh.jpg',
    areas: ['Professor · Mechanical Engineering'],
  },
];
