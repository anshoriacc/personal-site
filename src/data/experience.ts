export type Experience = {
  company: string
  position: string
  type?: string
  location?: string
  startDate: string
  endDate: string | 'Present'
  description?: string
  responsibilities?: Array<string>
  technologies?: Array<string>
  url?: string
}

export const experiences: Array<Experience> = [
  {
    company: 'Travelio',
    position: 'Software Engineer',
    url: 'https://www.linkedin.com/company/travelio-com',
    type: 'Fulltime',
    startDate: 'Dec 2025',
    endDate: 'Present',
    description:
      'Worked on Travelio, an online home rental operator web app.',
    technologies: ['Node.js'],
  },
  {
    company: 'Bithealth',
    position: 'Software Engineer',
    url: 'https://www.linkedin.com/company/bithealth',
    type: 'Fulltime',
    startDate: 'Mar 2024',
    endDate: 'Nov 2025',
    description:
      'Worked on Hospita, an hospital management web app.',
    responsibilities: [
      'Developed features for Hospita, an hospital management web app using react and node.',
      "Integrated BPJS Kesehatan's E-Klaim service into the app.",
      'Optimized performance both on client & server side: migrated data fetching pattern to tanstack/query, optimized query performance.',
      'Debugged & fixed production issues.',
    ],
    technologies: ['React', 'Typescript', 'Node.js'],
  },
  {
    company: 'Sentra Raya Solusi',
    position: 'Frontend Engineer',
    type: 'Freelance',
    startDate: 'Jul 2024',
    endDate: 'Jul 2025',
    description:
      'Worked on several projects including audit trail dashboard for insurance companies and Satu SDM.',
    responsibilities: [
      'Developed audit trail record dashboard for Tugu Insurance and BSI for compliance monitoring.',
      'Developed core features for Satu SDM.',
      'Deployed and debugged apps.',
    ],
    technologies: ['React', 'Next.js', 'Typescript'],
  },
  {
    company: 'Vorta Siber Indonesia',
    position: 'Software Engineer',
    url: 'https://www.linkedin.com/company/vorta-siber-indonesia',
    type: 'Fulltime',
    startDate: 'Jun 2022',
    endDate: 'Mar 2024',
    description:
      'Worked on several projects including web and mobile apps for clients.',
    responsibilities: [
      'Developed several web and mobile apps using react and react-native.',
      'Utilized face-recognition using 3rd party service into the apps.',
      'Deployed and debugged apps.',
    ],
    technologies: ['React', 'React Native', 'Typescript', 'PHP', 'Laravel'],
  },
]
