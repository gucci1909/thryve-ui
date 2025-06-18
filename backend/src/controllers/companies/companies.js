import { getDb } from '../../config/db.js';
import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import crypto from 'crypto';

const argv = yargs(hideBin(process.argv))
  .option('envFilePath', {
    alias: 'e',
    describe: 'Path to the .env file',
    type: 'string',
    demandOption: true,
  })
  .parse();

dotenv.config({ path: argv.envFilePath });

function generateInviteCode(companyName) {
  const hash = crypto.createHash('md5').update(companyName).digest('hex').toUpperCase();
  return `MD5-${hash.slice(0, 3)}-${hash.slice(-3)}`;
}

export const companiesController = async (req, res) => {
  try {
    const db = await getDb();
    const companiesCollection = db.collection('companies');

    const companies = [
      {
        COMPANY_NAME: 'Appsfactory',
        INVITE_CODE: generateInviteCode('Appsfactory'),
        ABOUT_TEXT: `Appsfactory, a leading German digital agency, is renowned for its strong corporate culture centered on innovation, collaboration, and purpose-driven work. Here's an in-depth look at their mission, values, leadership approach, and what sets them apart culturally.

Mission & Vision
Appsfactory's guiding principle, "We Impact Through Innovation," reflects their commitment to delivering transformative digital solutions. With over 750 digital products developed and active in more than 120 countries, their mission is to create scalable, user-centric applications that drive meaningful change.

Core Values
Appsfactory's culture is encapsulated in three key values:

#WeGetItDone: Emphasizes a results-oriented mindset, ensuring projects are completed efficiently and effectively.

#FueledByPassion: Highlights the team's enthusiasm and dedication to their work, fostering a vibrant and energetic work environment.

#BuiltForRelevance: Focuses on delivering solutions that are timely, pertinent, and aligned with client needs.

These values are not just slogans but are integrated into daily operations, guiding decision-making and team interactions.

People & Leadership
Appsfactory's leadership, including CEO Dr. Alexander Trommen, CTO Dr. Rolf Kluge, and COO Dr. Roman Belter, fosters a culture of empowerment and continuous improvement. They prioritize:

Distributed Leadership: Encouraging autonomy and decision-making at all levels.

Continuous Learning: Implementing regular retrospectives and feedback loops to enhance team performance.

Strategic Alignment: Utilizing Objectives and Key Results (OKRs) to ensure all teams are aligned with the company's goals.

This approach cultivates a proactive and engaged workforce, capable of adapting to the dynamic digital landscape.

Cultural Differentiators
What sets Appsfactory apart is their commitment to:

Interdisciplinary Collaboration: Bringing together diverse teams to foster innovation.

Client-Centric Solutions: Tailoring products to meet specific client needs, ensuring relevance and impact.

Global Perspective: Operating in multiple countries, they embrace cultural diversity and global best practices.

These elements contribute to a dynamic and inclusive culture that drives both employee satisfaction and client success.`
      },
      {
        COMPANY_NAME: 'Doyensys',
        INVITE_CODE: generateInviteCode('Doyensys'),
        ABOUT_TEXT: `Doyensys, a technology consulting firm specializing in Oracle and ServiceNow solutions, is distinguished by its robust corporate culture that emphasizes innovation, inclusivity, and employee development. Here's an in-depth look at their mission, values, leadership approach, and cultural differentiators.


Mission & Vision
Doyensys is committed to transforming technology into business possibilities. Their mission centers on delivering tailored software services and seamless implementations of major packaged applications to enhance business efficiency and growth. With a focus on innovation and strategic partnerships, they aim to empower businesses to innovate, transform, and succeed in today's competitive marketplace. 


Core Values
Doyensys' culture is built upon five foundational values, encapsulated in the acronym PCITI:

Passion: Driving enthusiasm and dedication in all endeavors.

Commitment: Ensuring unwavering dedication to goals, clients, and team members.

Innovation: Fostering creativity and ingenuity to stay ahead in a rapidly evolving industry.
Doyensys

Teamwork: Promoting collaboration and collective effort to achieve success.

Integrity: Upholding the highest ethical standards through honesty and transparency.

These values are not merely theoretical but are actively celebrated through initiatives like the PCITI Annual Awards, which recognize employees who exemplify these principles. 

People & Leadership
Under the leadership of Co-Founder and President Somu Chockalingam and President of North America Sankar Azhakesan, Doyensys fosters a culture of empowerment and continuous learning. The company invests significantly in employee development programs such as "Leaders for Leaders" and "LEAD," designed to enhance leadership skills and career growth. 

The leadership team prioritizes open communication and inclusivity, ensuring that every employee's voice is heard and valued. Regular town halls, mentorship programs, and one-on-one sessions are integral to their approach, fostering a supportive and dynamic workplace. 


Cultural Differentiators
Doyensys distinguishes itself through several cultural initiatives:

Inclusive Environment: The company emphasizes respect and appreciation for diverse perspectives, creating a workplace where every individual feels valued.

Employee Recognition: Beyond performance-based awards, Doyensys celebrates behaviors that contribute to success, such as collaboration and innovation, through specialized recognitions like the "Helping Hand" and "Rising Star" awards. 


Work-Life Balance: Flexible work arrangements and comprehensive wellness programs are in place to support employees' personal and professional well-being. 


Community Engagement: Events like "Doyensys Day Out" foster unity and camaraderie among team members, reinforcing the company's commitment to a positive and inclusive culture. 


These elements contribute to Doyensys being recognized as a Great Place to Work in India, reflecting their dedication to creating a high-trust, high-performance culture`
      },
    ];

    await companiesCollection.insertMany(companies);

    res.status(201).json({ message: 'Companies inserted successfully', companies });
  } catch (error) {
    console.error('Insert Error:', error);
    res.status(500).json({ error: 'Failed to insert companies' });
  }
};

export const companyVerifyKeyController = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const db = await getDb();
    const companiesCollection = db.collection('companies');

    const company = await companiesCollection.findOne({ INVITE_CODE: inviteCode });

    if (!company) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    res.status(200).json({
      success: true,
      company: {
        name: company.COMPANY_NAME,
        aboutText: company.ABOUT_TEXT,
        inviteCode: company.INVITE_CODE,
      },
    });
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ error: 'Failed to verify invite code' });
  }
};
