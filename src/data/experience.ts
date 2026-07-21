export type ExperienceRole = {
  position: string
  type?: string
  location?: string
  startDate: string
  endDate: string | 'present'
  description?: string
  responsibilities?: Array<string>
  technologies?: Array<string>
}

export type Experience = {
  company: string
  url?: string
  roles: Array<ExperienceRole>
}

export const experiences: Array<Experience> = [
  {
    company: 'Sentra Raya Solusi',
    roles: [
      {
        position: 'Full Stack Developer',
        type: 'Full-time',
        startDate: 'May 2026',
        endDate: 'present',
        description: 'Working on several projects, including Integra Brimob.',
        responsibilities: [
          'Architecting the frontend foundation for Integra Brimob, establishing project structure, reusable UI components, and conventions for scalable feature development.',
        ],
        technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Nest.js'],
      },
      {
        position: 'Frontend Engineer',
        type: 'Freelance',
        startDate: 'Jul 2024',
        endDate: 'Apr 2026',
        description:
          'Contributed to client projects, including compliance audit-trail dashboards and Satu SDM.',
        responsibilities: [
          'Built compliance-focused audit-trail dashboards for Tugu Insurance and BSI.',
          'Delivered core features for Satu SDM.',
          'Deployed applications and resolved production issues.',
        ],
        technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Nest.js'],
      },
    ],
  },
  {
    company: 'Travelio',
    url: 'https://www.linkedin.com/company/travelio-com',
    roles: [
      {
        position: 'Software Engineer',
        type: 'Full-time',
        startDate: 'Dec 2025',
        endDate: 'Mar 2026',
        description:
          "Contributed to Travelio's online property rental and management platform.",
        responsibilities: [
          'Delivered features for Travelio Property Management.',
        ],
        technologies: ['Node.js', 'Express', 'React'],
      },
    ],
  },
  {
    company: 'Bithealth',
    url: 'https://www.linkedin.com/company/bithealth',
    roles: [
      {
        position: 'Software Engineer',
        type: 'Full-time',
        startDate: 'Mar 2024',
        endDate: 'Nov 2025',
        description: 'Contributed to Hospita, a hospital management platform.',
        responsibilities: [
          "Integrated BPJS Kesehatan's E-Klaim service into Hospita.",
          'Improved client and server performance by adopting TanStack Query and optimizing server-side queries.',
          'Investigated and resolved production issues.',
        ],
        technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Nest.js'],
      },
    ],
  },
  {
    company: 'Vorta Siber Indonesia',
    url: 'https://www.linkedin.com/company/vorta-siber-indonesia',
    roles: [
      {
        position: 'Software Engineer',
        type: 'Full-time',
        startDate: 'Jun 2022',
        endDate: 'Mar 2024',
        description:
          'Delivered web and mobile applications for multiple clients.',
        responsibilities: [
          'Built client web and mobile applications with React and React Native.',
          'Integrated third-party face-recognition services into client applications.',
          'Deployed applications and resolved production issues.',
        ],
        technologies: ['React', 'React Native', 'TypeScript', 'PHP', 'Laravel'],
      },
    ],
  },
]
