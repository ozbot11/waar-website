// WAAR roster. Photos live in /public/team/. Add/edit members here.

export interface Member {
  name: string;
  role: string;
  group: 'Leadership' | 'Advisors';
  photo: string;
  detail?: string; // shown for advisors (title / department)
}

export const team: Member[] = [
  { name: 'Francisco Flores', role: 'Team Lead', group: 'Leadership', photo: '/team/francisco.jpg' },
  { name: 'Nina Leuchtman', role: 'Administrative Lead', group: 'Leadership', photo: '/team/nina.jpg' },
  { name: 'Diego Heredia', role: 'Hardware Lead', group: 'Leadership', photo: '/team/diego.jpg' },
  { name: 'Kent Fukuda', role: 'Firmware & Avionics Lead', group: 'Leadership', photo: '/team/kent.jpg' },
  { name: 'Maximus Kolavennu', role: 'Autonomy & Controls Lead', group: 'Leadership', photo: '/team/max.jpg' },

  { name: 'Amir Taghavei', role: 'Advisor', group: 'Advisors', photo: '/team/amir.jpg', detail: 'Assistant Professor \u00b7 Aeronautics & Astronautics' },
  { name: 'Sanotosh Devasia', role: 'Advisor', group: 'Advisors', photo: '/team/santosh.jpg', detail: 'Professor \u00b7 Mechanical Engineering' },
];
