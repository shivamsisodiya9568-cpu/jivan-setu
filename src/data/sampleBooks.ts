export interface SampleBook {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  pagesCount: number;
  estimatedMinutes: number;
  description: string;
  chapters: {
    title: string;
    page: number;
    paragraphs: string[];
  }[];
}

export const SAMPLE_BOOKS: SampleBook[] = [
  {
    id: 'art-of-war',
    title: 'The Art of War',
    author: 'Sun Tzu (Translated by Lionel Giles)',
    coverColor: '#b91c1c',
    pagesCount: 14,
    estimatedMinutes: 28,
    description: 'An ancient Chinese military treatise dating from the Late Spring and Autumn Period, composed of 13 chapters devoted to strategic planning.',
    chapters: [
      {
        title: 'Chapter I: Laying Plans',
        page: 1,
        paragraphs: [
          'Sun Tzu said: The art of war is of vital importance to the State.',
          'It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.',
          'The moral law causes the people to be in complete accord with their ruler, so that they will follow him regardless of their lives, undismayed by any danger.',
          'Heaven signifies night and day, cold and heat, times and seasons. Earth comprises distances, great and small; danger and security; open ground and narrow passes; the chances of life and death.',
          'The Commander stands for the virtues of wisdom, sincerely, benevolence, courage and strictness.',
          'By method and discipline are to be understood the marshaling of the army in its proper subdivisions, the graduations of rank among the officers, the maintenance of roads by which supplies may reach the army, and the control of military expenditure.',
          'These five heads should be familiar to every general: he who knows them will be victorious; he who knows them not will fail.',
        ],
      },
      {
        title: 'Chapter II: Waging War',
        page: 2,
        paragraphs: [
          'Sun Tzu said: In the operations of war, where there are in the field a thousand swift chariots, as many heavy chariots, and a hundred thousand mail-clad soldiers, with provisions enough to carry them a thousand li, the expenditure at home and at the front will amount to the definite sum of a thousand ounces of silver per day.',
          'When you engage in actual fighting, if victory is long in coming, then men’s weapons will grow dull and their ardor will be damped. If you lay siege to a town, you will exhaust your strength.',
          'Again, if the campaign is protracted, the resources of the State will not be equal to the strain.',
          'Now, when your weapons are dulled, your ardor damped, your strength exhausted and your treasure spent, other chieftains will spring up to take advantage of your extremity. Then no man, however wise, will be able to avert the consequences that must ensue.',
          'Thus, though we have heard of stupid haste in war, cleverness has never been seen associated with long delays.',
        ],
      },
      {
        title: 'Chapter III: Attack by Stratagem',
        page: 3,
        paragraphs: [
          'Sun Tzu said: In the practical art of war, the best thing of all is to take the enemy’s country whole and intact; to shatter and destroy it is not so good.',
          'So, too, it is better to recapture an army entire than to destroy it, to capture a regiment, a detachment or a company entire than to destroy them.',
          'Hence to fight and conquer in all your battles is not supreme excellence; supreme excellence consists in breaking the enemy’s resistance without fighting.',
          'Thus the highest form of generalship is to balk the enemy’s plans; the next best is to prevent the junction of the enemy’s forces; the next in order is to attack the enemy’s army in the field; and the worst policy of all is to besiege walled cities.',
          'Therefore the skillful leader subdues the enemy’s troops without any fighting; he captures their cities without laying siege to them; he overthrows their kingdom without lengthy operations in the field.',
        ],
      },
    ],
  },
  {
    id: 'meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    coverColor: '#0f766e',
    pagesCount: 22,
    estimatedMinutes: 45,
    description: 'A series of personal writings by the Roman Emperor Marcus Aurelius, recording his private notes to himself and ideas on Stoic philosophy.',
    chapters: [
      {
        title: 'Book Two: On Daily Purpose & Perspective',
        page: 1,
        paragraphs: [
          'When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly.',
          'They are like this because they cannot distinguish good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own.',
          'None of them can hurt me. No one can implicate me in ugliness. Nor can I feel angry at my relative, or hate him.',
          'We were made to work together like feet, like hands, like the rows of the upper and lower teeth. To obstruct each other is unnatural. To feel anger at someone, to turn your back on him: these are obstructions.',
          'Whatever this is that I am, it is a little flesh and breath, and the ruling part. Despise the flesh: blood and bones and a network, a jumble of nerves, veins, and arteries. Consider the breath: wind, always changing, expelled and sucked back in again.',
          'Third comes the ruling part. Master it. Do not let it be dragged about by selfish impulses, or recoil at what happens to you in the present, or dread what is to come in the future.',
        ],
      },
      {
        title: 'Book Four: The Inner Citadel',
        page: 2,
        paragraphs: [
          'People look for retreats for themselves, in the country, by the coast, or in the hills. There is nowhere that a person can find a more peaceful and trouble-free retreat than in his own mind.',
          'So constantly give yourself this retreat, and renew yourself. Let your basic principles be brief and fundamental, the kind that will at once close off the world and send you back without irritation to the life to which you must return.',
          'Remember that everything you hear is an opinion, not a fact. Everything you see is a perspective, not the truth.',
          'If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.',
        ],
      },
    ],
  },
  {
    id: 'time-machine',
    title: 'The Time Machine',
    author: 'H. G. Wells',
    coverColor: '#4338ca',
    pagesCount: 18,
    estimatedMinutes: 36,
    description: 'A landmark science fiction novella credited with the popularization of the concept of time travel using a vehicle that allows an operator to travel purposefully.',
    chapters: [
      {
        title: 'Chapter I: The Scientific Dimension',
        page: 1,
        paragraphs: [
          'The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated.',
          'The fire burnt brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses.',
          'Our chairs, being his patents, embraced and caressed us rather than submitted to be sat upon, and there was that luxurious after-dinner atmosphere when thought roams gracefully free of the trammels of precision.',
          '“You must follow me carefully. I shall have to controvert one or two ideas that are almost universally accepted. The geometry, for instance, that they taught you at school is founded on a misconception.”',
          '“Is not that rather a large thing to expect us to begin upon?” said Filby, an argumentative person with red hair.',
          '“I do not mean to ask you to accept anything without reasonable ground for it. You will soon admit as much as I need from you. You know of course that a mathematical line, a line of thickness nil, has no real existence. They taught you that?”',
        ],
      },
    ],
  },
];
