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
     video        { src, poster, ratio, label, caption } — one short clip,
                  shown under the gallery with the browser's own controls.
                  src must be an .mp4 (H.264 video, AAC audio) so it plays
                  everywhere. poster is the still shown before it starts.
                  ratio: '9x16' for a phone clip held upright.

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
  'Flooring',
  'General Building'
];


/* Used automatically wherever a photo has not been added yet. */
const PLACEHOLDER_IMAGE = 'images/placeholder.svg';


const PROJECTS = [

  /* ------------------------------------------------------------------
     GARAGE — new build, Perthshire. Currently on site.
     Photographs in images/projects/garage/. Add further ones to the
     gallery array below as the build progresses.
     ------------------------------------------------------------------ */
  {
    slug: 'garage',
    title: 'Garage Auchterarder',
    location: 'Perthshire',
    category: 'New Builds',
    /* Stays first in the list as the newest project, but off the homepage
       preview while it is unfinished. */
    featured: false,
    summary: 'A new garage under construction in Perthshire, now wrapped externally and lined out internally.',

    mainImage: {
      src: 'images/projects/garage/garage-02.jpg',
      alt: 'Interior of the new garage at Perthshire, showing the trussed roof over the sheathed timber frame'
    },

    description: [
      'A new garage under construction in Perthshire, progressing from the timber structural stage through to internal lining.',
      'The photographs show the work as it stands: the trussed roof erected over the timber frame, the walls sheathed and wrapped externally, insulation fitted to the walls and roof, and the interior now lined out in plasterboard. Further photographs will be added here as the build progresses.'
    ],

    details: [
      { label: 'Status', value: 'In progress' },
      { label: 'Stage',  value: 'Timber frame, roof structure, insulation and plasterboard lining' }
    ],

    /* Portrait photographs declare their ratio so they are framed upright and
       uncropped, rather than squeezed into a landscape tile. These two are
       3:4, straight off a phone. */
    gallery: [
      { src: 'images/projects/garage/garage-01.jpg', ratio: '3x4', alt: 'Roof trusses erected over the timber frame of the new garage, with the walls sheathed', caption: 'Roof trusses erected over the timber frame' },
      { src: 'images/projects/garage/garage-03.jpg', ratio: '3x4', alt: 'Insulation fitted between the studs and roof timbers of the garage, with plasterboard stacked on the floor', caption: 'Insulation to the walls and roof, ahead of lining out' },
      { src: 'images/projects/garage/garage-04.jpg', ratio: '4x3', alt: 'Interior of the garage at Auchterarder with the walls and ceiling lined out in plasterboard over the concrete floor', caption: 'Walls and ceiling lined out in plasterboard' },
      { src: 'images/projects/garage/garage-05.jpg', ratio: '4x3', alt: 'The garage at Auchterarder from outside, wrapped in breather membrane with the roof formed and the door opening framed', caption: 'Wrapped externally, with the roof formed' }
    ]
  },


  /* ------------------------------------------------------------------
     FLOORING, BRIDGE OF ALLAN — completed.
     Photographs and the video are in
     images/projects/flooring-bridge-of-allan/.
     ------------------------------------------------------------------ */
  {
    slug: 'flooring-bridge-of-allan',
    title: 'Flooring \u2013 Bridge of Allan',
    location: 'Bridge of Allan',
    category: 'Flooring',
    featured: true,
    summary: 'Engineered hardwood flooring fitted through the hallway, a bay windowed room and the kitchen of a house in Bridge of Allan.',

    mainImage: {
      src: 'images/projects/flooring-bridge-of-allan/flooring-04.jpg',
      alt: 'Engineered hardwood flooring laid in a bay windowed room in Bridge of Allan'
    },

    description: [
      'Engineered hardwood flooring fitted through the hallway, a bay windowed room and the kitchen of a house in Bridge of Allan.',
      'The photographs run in order: the rooms boarded out with the flooring stacked ready to go down, then the same spaces once the boards were laid. The short video runs across the finished floor.'
    ],

    details: [
      { label: 'Scope',  value: 'Engineered hardwood flooring' },
      { label: 'Status', value: 'Completed' }
    ],

    /* All five photographs are 3:4 straight off a phone, so they declare
       that ratio and are framed upright rather than cropped to landscape. */
    gallery: [
      { src: 'images/projects/flooring-bridge-of-allan/flooring-01.jpg', ratio: '3x4', alt: 'Bay windowed room in Bridge of Allan with the floor boarded out and boxes of engineered hardwood flooring stacked against the wall', caption: 'Boarded out, with the flooring stacked ready' },
      { src: 'images/projects/flooring-bridge-of-allan/flooring-02.jpg', ratio: '3x4', alt: 'Hallway in Bridge of Allan boarded out ready for flooring, looking through towards the stairs', caption: 'The hallway before the boards went down' },
      { src: 'images/projects/flooring-bridge-of-allan/flooring-03.jpg', ratio: '3x4', alt: 'The same hallway with the engineered hardwood boards laid, running through to the room beyond', caption: 'The hallway with the boards laid' },
      { src: 'images/projects/flooring-bridge-of-allan/flooring-05.jpg', ratio: '3x4', alt: 'Kitchen in Bridge of Allan with engineered hardwood flooring laid up to the white units and the glazed doors', caption: 'Through to the kitchen' }
    ],

    /* Optional. A single short clip, shown under the gallery with the
       browser's own controls. Portrait, so it declares a 9:16 ratio. */
    video: {
      src: 'images/projects/flooring-bridge-of-allan/flooring-video.mp4',
      poster: 'images/projects/flooring-bridge-of-allan/flooring-video-poster.jpg',
      ratio: '9x16',
      label: 'Flooring project\u00a0\u2013 Bridge of Allan',
      caption: 'A short clip across the finished floor.'
    }
  },


  /* ------------------------------------------------------------------
     SIERRAS — new build, Perthshire.
     Photographs live in images/projects/sierras/
     ------------------------------------------------------------------ */
  {
    slug: 'sierras',
    title: 'Renovation Auchterarder',
    location: 'Perthshire',
    category: 'New Builds',
    featured: true,
    summary: 'A family home in Auchterarder, finished throughout with bespoke joinery, a handmade kitchen and fitted utility, boot room and bathrooms.',

    /* The strongest single image — used for the project card and the large
       image at the top of the project page. */
    mainImage: {
      src: 'images/projects/sierras/kitchen-01.jpg',
      alt: 'Open plan kitchen at Auchterarder with a large island, breakfast bar seating and pendant lighting'
    },

    description: [
      'A family home in Auchterarder, Perthshire, completed by Brock Contracts and finished throughout with fitted joinery.',
      'The open plan kitchen is built around a large island with breakfast bar seating and quartz worktops, opening onto a living space with a media wall and inset fire. Crittall-style glazed doors run between the hall and living areas to keep light moving through the middle of the house.',
      'The entrance hall carries bespoke painted joinery — full height storage, a fitted boot room bench and hanging — with a separate utility fitted to match the kitchen, and tiled bathrooms with wall hung vanity units.'
    ],

    details: [
      { label: 'Scope', value: 'New build — joinery, kitchen, utility, bathrooms and internal finishing' }
    ],

    /* Ordered as a walk through the house: entrance, hall, living, kitchen,
       utility, bathrooms. */
    gallery: [
      { src: 'images/projects/sierras/hallway-02.jpg', alt: 'Entrance hall at Auchterarder with a dark composite front door and fitted sage green storage', caption: 'Entrance hall with fitted storage' },
      { src: 'images/projects/sierras/hallway-01.jpg', alt: 'Boot room at Auchterarder with a fitted bench, coat hooks and panelled joinery in sage green', caption: 'Bespoke boot room joinery' },
      { src: 'images/projects/sierras/lounge-01.jpg', alt: 'Living room at Auchterarder with a media wall, inset fire and Crittall-style glazed doors', caption: 'Living room media wall and inset fire' },
      { src: 'images/projects/sierras/lounge-02.jpg', alt: 'Second view of the living space at Auchterarder looking back towards the glazed internal doors', caption: 'Living space and internal glazing' },
      { src: 'images/projects/sierras/kitchen-02.jpg', alt: 'Kitchen at Auchterarder seen from the sink run, showing the island and shaker wall units', caption: 'Kitchen island and shaker units' },
      { src: 'images/projects/sierras/utility-01.jpg', alt: 'Utility room at Auchterarder with fitted units, Belfast sink and a ceiling airer', caption: 'Fitted utility room' },
      { src: 'images/projects/sierras/bathroom-01.jpg', alt: 'Bathroom at Auchterarder with a wall hung green vanity, countertop basin and round mirror', caption: 'Bathroom with wall hung vanity' },
      { src: 'images/projects/sierras/bathroom-02.jpg', alt: 'Shower room at Auchterarder with a walk in shower, navy vanity unit and heated towel rail', caption: 'Shower room' }
    ]
  },


  /* ------------------------------------------------------------------
     REAL PROJECT — uses the photograph already on the site.
     ------------------------------------------------------------------ */
  {
    slug: 'new-build-perthshire',
    title: 'New Build Dunkeld',
    location: 'Perthshire',
    category: 'New Builds',
    featured: true,
    summary: 'A ground-up new build delivered in Perthshire, with Brock Contracts carrying out the joinery and building works through to completion.',

    mainImage: {
      src: 'brock-contracts-project-newbuild.jpg',
      alt: 'Completed new build house by Brock Contracts in Perthshire'
    },

    /* Only one paragraph so far. Add more as real detail becomes available —
       scope, materials, timescale, anything notable about the site. */
    description: [
      'A full new build family home in Perthshire, taken from foundations through to finished joinery.'
    ],

    /* Location, Category and Completed are shown automatically — you only
       need to list extra rows here. */
    details: [
      { label: 'Scope', value: 'New build — joinery and building works' }
    ],

    /* Extra photos of this project go here as you scan or take them. */
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
