const posts=[
{slug:'ada-title-ii-deadline-guide',title:'What is the April 24, 2026 ADA Title II Deadline? A Plain-English Guide'},
{slug:'robles-v-dominos',title:'Robles v. Domino's Pizza: What Every Website Owner Needs to Know'},
{slug:'wcag-21-vs-22',title:'WCAG 2.1 AA vs 2.2: What's the Difference and Which Do I Need?'},
{slug:'respond-to-demand-letter',title:'How to Respond to an ADA Demand Letter (Step-by-Step)'},
{slug:'complete-vpat-guide',title:'The Complete VPAT Guide: What It Is, Who Needs One, How to Get One'},
{slug:'lawsuit-statistics-trends',title:'ADA Web Accessibility Lawsuits: 2024-2025 Statistics and Trends'},
];
export default function Resources(){return <main className="container" style={{padding:'2rem 0'}}><h1>Resources</h1>{posts.map(p=><article key={p.slug} className="card"><a href={`/resources/${p.slug}`}>{p.title}</a></article>)}</main>}
