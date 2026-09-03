/* ==========================================================================
   Brock Contracts — PROJECT DATA
   --------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO ADD A NEW PROJECT.

   Everything else on the site reads from here:
     • the "Our Work" preview on the homepage
     • the full Projects page and its category filters
     • every individual project page

   ---------------------------------------------------------------------------
   HOW TO ADD A PROJECT
   ---------------------------------------------------------------------------
   1. Put the photos in  images/projects/<your-slug>/
        e.g. images/projects/muthill-road-extension/main.jpg
             images/projects/muthill-road-extension/01.jpg

   2. Copy the TEMPLATE block at the bottom of this file, paste it into the
      PROJECTS list below, and fill it in.

   3. Save, commit and push. Vercel redeploys automatically. There is no
      build step to run.

   The newest project should go at the TOP of the list — the site keeps
   whatever order you use here.

   ---------------------------------------------------------------------------
   FIELD REFERENCE
   ---------------------------------------------------------------------------
   REQUIRED
     slug         Web address for the project page. Lowercase, hyphens, no
                  spaces. Must be unique. Becomes:
                  /project.html?p=your-slug
     title        Project name, e.g. "Stone Cottage Renovation"
     location     e.g. "Comrie, Perthshire"
     category     Must match one of the CATEGORIES listed below, exactly.
     summary      1–2 sentences. Shown on the project card.

   OPTIONAL — leave out or set to "" if you do not have it yet
     completed    e.g. "March 2026" or "2025"
     featured     true  = show on the homepage preview (aim for 3–6 of these)
     description  Array of paragraphs for the project page body.
     details      Array of { label, value } rows shown in the side panel.
     mainImage    { src, alt } — the big hero photo on the project page and
                  the card image. If omitted, a placeholder graphic is used.
     gallery      Array of { src, alt, caption } — additional photos.
                  Add as many as you like; the grid handles any number.

   ALT TEXT: describe the photo in a few words. It is read aloud by screen
   readers and shown if an image ever fails to load. Worth doing properly.
   ========================================================================== */


/* Category filter buttons on the Projects page, in this order.
   Add or rename freely — a category only appears as a button if at least
   one project uses it. */
const CATEGORIES = [
  'New Builds',
  'Extensions',
  'Renovations',
  'Commercial',
  'Joinery',
  'Roofing',
  'General Building'
];


/* Used automatically wherever a photo has not been added yet. */
const PLACEHOLDER_IMAGE = 'images/placeholder.svg';


const PROJECTS = [

  /* ------------------------------------------------------------------
     REAL PROJECT — uses the photograph already on the site.
     ------------------------------------------------------------------ */
  {
    slug: 'new-build-perthshire',
    title: 'New Build Family Home',
    location: 'Perthshire',
    category: 'New Builds',
    featured: true,
    summary: 'A ground-up new build delivered in Perthshire, with Brock Contracts carrying out the joinery and building works through to completion.',

    mainImage: {
      src: 'brock-contracts-project-newbuild.jpg',
      alt: 'Completed new build house by Brock Contracts in Perthshire'
    },

    description: [
      'A full new build family home in Perthshire, taken from foundations through to finished joinery.',
      'Add more detail here about the scope of the work, the materials used, and anything that made the job particularly interesting — the challenges of the site, a bespoke staircase, the timber specification. A few honest sentences about how the job was run reads far better than marketing language.'
    ],

    /* Location, Category and Completed are shown automatically — you only
       need to list extra rows here. */
    details: [
      { label: 'Scope', value: 'New build — joinery and building works' }
    ],

    /* Extra photos of this project go here as you scan or take them. */
    gallery: []
  },


  /* ------------------------------------------------------------------
     EXAMPLE ENTRIES — these show the system working and are clearly
     labelled "Example" on the site so no visitor mistakes them for
     completed jobs.

     Delete each one as you replace it with a real project.
     ------------------------------------------------------------------ */
  {
    slug: 'example-rear-extension',
    title: 'Single Storey Rear Extension',
    location: 'Crieff, Perthshire',
    category: 'Extensions',
    featured: true,
    isExample: true,
    completed: '',
    summary: 'Example entry showing how an extension project will appear. Replace this with a real Brock Contracts project and photographs.',
    description: [
      'This is an example project entry. It exists so you can see how the Projects section looks and behaves before your own photographs are added.',
      'To replace it, open assets/js/projects-data.js, find this block, and swap in the real title, location, description and photos. Delete the isExample line once it holds real work.'
    ],
    details: [
      { label: 'Scope', value: 'Example — replace with real project scope' }
    ],
    gallery: []
  },

  {
    slug: 'example-cottage-renovation',
    title: 'Traditional Cottage Renovation',
    location: 'Comrie, Perthshire',
    category: 'Renovations',
    featured: true,
    isExample: true,
    summary: 'Example entry showing how a renovation project will appear, including a multi-photo gallery.',
    description: [
      'This is an example project entry, included to demonstrate the gallery layout with several photographs.',
      'Replace the text and images with a real renovation once you have the photographs together.'
    ],
    details: [
      { label: 'Scope', value: 'Example — replace with real project scope' }
    ],
    /* Empty entries here render as placeholder tiles, so you can see how a
       multi-photo gallery lays out before the real photos exist. */
    gallery: [
      { src: '', alt: 'Placeholder — add a project photograph here' },
      { src: '', alt: 'Placeholder — add a project photograph here' },
      { src: '', alt: 'Placeholder — add a project photograph here' }
    ]
  },

  {
    slug: 'example-bespoke-joinery',
    title: 'Bespoke Fitted Joinery',
    location: 'Strathearn, Perthshire',
    category: 'Joinery',
    isExample: true,
    summary: 'Example entry showing how a joinery project will appear on the site.',
    description: [
      'This is an example project entry. Replace it with a real joinery job — a staircase, fitted units, or bespoke doors.'
    ],
    gallery: []
  }

];


/* ==========================================================================
   TEMPLATE — copy everything between the lines, paste it into the list
   above, and fill it in.
   ==========================================================================

  {
    slug: 'muthill-road-extension',
    title: 'Two Storey Side Extension',
    location: 'Muthill, Perthshire',
    category: 'Extensions',
    featured: true,
    completed: 'June 2026',
    summary: 'A two storey side extension adding a kitchen and family room downstairs with two bedrooms above.',

    mainImage: {
      src: 'images/projects/muthill-road-extension/main.jpg',
      alt: 'Completed two storey side extension in Muthill'
    },

    description: [
      'First paragraph about the project.',
      'Second paragraph — the trickier parts of the job, the finish, the timescale.'
    ],

    details: [
      { label: 'Scope',      value: 'Extension, roofing, internal joinery' },
      { label: 'Duration',   value: '14 weeks' },
      { label: 'Completed',  value: 'June 2026' }
    ],

    gallery: [
      { src: 'images/projects/muthill-road-extension/01.jpg', alt: 'Steel frame installed', caption: 'Steels in and blockwork underway' },
      { src: 'images/projects/muthill-road-extension/02.jpg', alt: 'Finished kitchen',      caption: 'Finished kitchen and family room' }
    ]
  },

   ========================================================================== */
